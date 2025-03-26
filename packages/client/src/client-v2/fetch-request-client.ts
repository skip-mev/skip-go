import { toCamel, toSnake } from "./convert";
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

type OnSuccessCallback<Result> = (result: Result) => void;

export function createRequest<
  Params extends object = object,
  Result extends object = object,
>(path: string, options?: Params, onSuccess?: OnSuccessCallback<Result>) {
  const controller = new AbortController();

  const request = async (): Promise<Result> => {
    try {
      const response = await ClientState.requestClient.get<Result>(
        path,
        options ? toSnake(options) : undefined,
        controller.signal,
      );

      const camelCased = toCamel(response) as Result;

      if (onSuccess) {
        onSuccess(camelCased);
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
