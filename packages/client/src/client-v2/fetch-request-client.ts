type RequestClientOptions = {
  baseURL: string;
  apiKey?: string;
};

export const createRequestClient = ({
  baseURL,
  apiKey,
}: RequestClientOptions) => {
  let currentController: AbortController | null = null;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(apiKey ? { Authorization: apiKey } : {}),
  };

  const cancel = () => {
    if (currentController) {
      currentController.abort();
      currentController = null;
    }
  };

  const createController = () => {
    cancel(); // Cancel any ongoing request
    currentController = new AbortController();
    return currentController.signal;
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
      signal: createController(),
    });

    return handleResponse(response);
  };

  const post = async <ResponseType = unknown, Body = unknown>(
    path: string,
    data: Body = {} as Body,
  ): Promise<ResponseType> => {
    const response = await fetch(new URL(path, baseURL).toString(), {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(data),
      signal: createController(),
    });

    return handleResponse(response);
  };

  return { get, post, cancel };
};
