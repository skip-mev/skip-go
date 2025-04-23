import { Api } from "src/types/swaggerTypes";
import { Camel, toCamel, toSnake } from "./convert";
import { ClientState } from "./state";

type RequestClientOptions = {
  baseURL: string;
  apiKey?: string;
};

export const createRequestClient = ({
  baseURL,
  apiKey,
}: RequestClientOptions) => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(apiKey ? { Authorization: apiKey } : {}),
  };

  const handleResponse = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const body = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const message =
        typeof body === "object" && body?.message
          ? body.message
          : response.statusText;
      throw new Error(message);
    }

    return body;
  };

  const get = async <ResponseType = unknown, RequestParams = unknown>(
    path: string,
    params?: RequestParams,
    signal?: AbortSignal,
  ): Promise<ResponseType> => {
    const url = new URL(path, baseURL);

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
    const response = await fetch(new URL(path, baseURL).toString(), {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(data),
      signal,
    });

    return handleResponse(response);
  };

  return { get, post };
};

export type OnSuccessCallback<Result, Params> = (
  result: Result,
  options: Params,
) => void;

export type createRequestType<Result, Params> = {
  path: string;
  method: "get" | "post";
  options?: Params;
  onSuccess?: OnSuccessCallback<Result, Params>;
};

export function createRequest<
  Params extends object = object,
  Result extends object = object,
>({
  path,
  method = "get",
  options,
  onSuccess,
}: createRequestType<Result, Params>) {
  const controller = new AbortController();

  const request = async (): Promise<Result> => {
    try {
      const response = await ClientState.requestClient[method]<Result>(
        path,
        options ? toSnake(options) : undefined,
        controller.signal,
      );

      const camelCased = toCamel(response) as Result;

      if (onSuccess) {
        onSuccess(camelCased, options as Params);
      }

      return camelCased;
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        console.log("Request was cancelled");
      } else {
        console.error("Error:", error);
      }
      throw error;
    }
  };

  return {
    request,
    cancel: (reason?: string) => controller.abort(reason),
  };
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
  [K in FunctionKeys<ApiInstance>]: Awaited<
    ReturnType<ApiInstance[K]>
  > extends { data: unknown }
    ? K
    : never;
}[FunctionKeys<ApiInstance>];

/* --------------------------------------------------
 🧠 2. Extract param and data return types
-------------------------------------------------- */

// Params: take first argument, convert to camelCase, make it non-null
type MethodParams<K extends ValidApiMethodKeys> = NonNullable<
  Camel<Parameters<ApiInstance[K]>[0]>
>;

type MethodReturn<K extends ValidApiMethodKeys> = Camel<
  Awaited<ReturnType<ApiInstance[K]>> extends { data: infer D }
    ? D extends object
      ? D
      : never
    : never
>;

/* --------------------------------------------------
 ⚙️ 3. Factory to generate API functions
-------------------------------------------------- */

export type ApiProps<K extends ValidApiMethodKeys> = {
  methodName: K;
  path: string;
  onSuccess?: OnSuccessCallback<MethodReturn<K>, MethodParams<K>>;
  method?: "get" | "post";
};

export function api<K extends ValidApiMethodKeys>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  methodName,
  path,
  onSuccess,
  method = "get",
}: ApiProps<K>) {
  type Params = MethodParams<K>;
  type Response = MethodReturn<K>;

  if (!ClientState.requestClient) {
    ClientState.requestClient = createRequestClient({
      baseURL: "https://api.skip.build",
    });
  }

  const requestWithCancel = (options?: Params) => {
    return createRequest<Params, Response>({
      path,
      method,
      options,
      onSuccess,
    });
  };

  return requestWithCancel;
}
