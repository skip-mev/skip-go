import { toCamel, toSnake } from "./convert";
import type { Camel } from "./convert";

import { Api } from "../types/swaggerTypes";
import { wait } from "./timer";
import { ApiState } from "../state/apiState";
import type { SkipApiOptions } from "../state/apiState";

type RequestClientOptions = {
  baseUrl: string;
  apiKey?: string;
};

export const createRequestClient = ({ baseUrl, apiKey }: RequestClientOptions) => {
  const defaultHeaders: HeadersInit = {
    "content-type": "application/json",
    ...(apiKey ? { authorization: apiKey } : {}),
  };

  const handleResponse = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const body = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        typeof body === "object" && body?.message ? body.message : response.statusText;
      throw new Error(message);
    }

    return body;
  };

  const get = async <ResponseType = unknown, RequestParams = unknown>(
    path?: string,
    params?: RequestParams,
    signal?: AbortSignal,
  ): Promise<ResponseType> => {
    if (path?.startsWith('/')) {
      console.warn('paths that start with / are treated as absolute paths, please remove the leading / if this path is intended to be a relative path');
    }
    
    const url = new URL(path ?? "", baseUrl);

    if (params && typeof params === "object") {
      Object.entries(params as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: defaultHeaders,
      signal,
    });

    return handleResponse(response);
  };

  const post = async <ResponseType = unknown, Body = unknown>(
    path: string,
    data: Body = {} as Body,
    signal?: AbortSignal,
  ): Promise<ResponseType> => {
    if (path?.startsWith('/')) {
      console.warn('paths that start with / are treated as absolute paths, please remove the leading / if this path is intended to be a relative path');
    }

    const response = await fetch(new URL(path, baseUrl).toString(), {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(data),
      signal,
    });

    return handleResponse(response);
  };

  return { get, post };
};

export type createRequestType<Request, Response, TransformedResponse = Response> = {
  path: string;
  method: "get" | "post";
  onSuccess?: (response: TransformedResponse, options?: Request) => void;
  transformResponse?: (response: Response) => TransformedResponse;
};

export function createRequest<Request, Response, TransformedResponse>({
  path,
  method = "get",
  onSuccess,
  transformResponse,
}: createRequestType<Request, Response, TransformedResponse>) {
  let controller: AbortController | null = null;

  type RequestType = Request &
    SkipApiOptions & {
      abortDuplicateRequests?: boolean;
    };

  const request = async (options?: RequestType): Promise<TransformedResponse | undefined> => {
    const { apiKey, apiUrl, abortDuplicateRequests, ...requestParams } = options ?? {};
    let fetchClient = ApiState.client;
    if (apiUrl || apiKey) {
      fetchClient = createRequestClient({
        baseUrl: apiUrl || "https://api.skip.build",
        apiKey: apiKey,
      });
    } else {
      await ApiState.clientInitialized;
    }

    if (abortDuplicateRequests && controller && !controller?.signal?.aborted) {
      controller?.abort();
    }

    controller = new AbortController();

    try {
      const response = await fetchClient[method](
        path,
        requestParams ? toSnake(requestParams) : undefined,
        controller.signal,
      );

      const camelCased = toCamel(response ?? {}) as Response;

      const finalResponse = transformResponse
        ? transformResponse(camelCased)
        : (camelCased as unknown as TransformedResponse);

      onSuccess?.(finalResponse, requestParams as Request);

      return finalResponse;
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Request was cancelled");
      } else {
        console.error("Error:", error);
        throw error;
      }
    }
  };

  return request;
}

// ✅ Get instance type of the API class
type ApiInstance = InstanceType<typeof Api>;

/* --------------------------------------------------
 🧠 1. Extract method keys from the instance
-------------------------------------------------- */

// Function-only keys
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// Keys of methods that return { data: ... }
type ValidApiMethodKeys = {
  [K in FunctionKeys<ApiInstance>]: Awaited<ReturnType<ApiInstance[K]>> extends { data: unknown }
    ? K
    : never;
}[FunctionKeys<ApiInstance>];

/* --------------------------------------------------
 🧠 2. Extract param and data return types
-------------------------------------------------- */

// Params: take first argument, convert to camelCase, make it non-null
export type ApiRequest<K extends ValidApiMethodKeys> = NonNullable<
  Camel<Parameters<ApiInstance[K]>[0]>
>;

export type ApiResponse<K extends ValidApiMethodKeys> = Camel<
  Awaited<ReturnType<ApiInstance[K]>> extends { data: infer D }
    ? D extends object
      ? D
      : never
    : never
>;

/* --------------------------------------------------
 ⚙️ 3. Factory to generate API functions
-------------------------------------------------- */

export type ApiProps<K extends ValidApiMethodKeys, TransformedResponse = ApiResponse<K>> = {
  methodName: K;
  path: string;
  onSuccess?: (response: TransformedResponse, options?: ApiRequest<K>) => void;
  method?: "get" | "post";
  transformResponse?: (response: ApiResponse<K>) => TransformedResponse;
};

export function api<K extends ValidApiMethodKeys, TransformedResponse = ApiResponse<K>>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  methodName,
  path,
  onSuccess,
  method = "get",
  transformResponse,
}: ApiProps<K, TransformedResponse>) {
  type Request = ApiRequest<K>;
  type Response = ApiResponse<K>;

  return createRequest<Request, Response, TransformedResponse>({
    path,
    method,
    onSuccess,
    transformResponse,
  });
}

type PollingApiProps<K extends ValidApiMethodKeys> = Omit<ApiProps<K>, "options"> & {
  isSuccess?: (result: ApiResponse<K>) => boolean;
  /**
   * Maximum number of retries
   * @default 5
   */
  maxRetries?: number;
  /**
   * Retry interval in milliseconds
   * @default 1000
   */
  retryInterval?: number;
  /**
   * Backoff multiplier for retries
   *
   * example: `retryInterval` is set to 1000, backoffMultiplier is set to 2
   *
   * 1st retry: 1000ms
   *
   * 2nd retry: 2000ms
   *
   * 3rd retry: 4000ms
   *
   * 4th retry: 8000ms
   *
   * 5th retry: 16000ms
   *
   * @default 2
   */
  backoffMultiplier?: number;
  onError?: (error: unknown, attempt: number) => void;
  onSuccess?: (result: ApiResponse<K>, attempt: number) => void;
};

export function pollingApi<K extends ValidApiMethodKeys>({
  methodName,
  path,
  method = "get",
  onSuccess,
  onError,
  isSuccess = () => true,
  maxRetries = 5,
  retryInterval = 1000,
  backoffMultiplier = 2,
}: PollingApiProps<K>) {
  type Request = ApiRequest<K>;
  type Response = ApiResponse<K>;

  type RequestType = Request &
    SkipApiOptions & {
      abortDuplicateRequests?: boolean;
    };

  const request = async (requestParams?: RequestType): Promise<Response> => {
    let attempt = 0;
    let lastError: unknown;

    while (attempt < maxRetries) {
      try {
        const result = await api<K>({ methodName, path, method })(requestParams);
        if (result && isSuccess(result)) {
          onSuccess?.(result, attempt);
          return result;
        }
      } catch (err) {
        lastError = err;
        onError?.(err, attempt);
      }

      const delay = retryInterval * Math.pow(backoffMultiplier, attempt);
      await wait(delay);
      attempt++;
    }

    throw lastError ?? new Error("pollingApi: max retries exceeded");
  };

  return (params?: RequestType): Promise<Response> => request(params);
}
