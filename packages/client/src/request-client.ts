import axios from "axios";
import { AxiosError, AxiosInstance } from "axios";

// Request clients wraps the axios client and handles error responses
export class RequestClient {
  private httpClient: AxiosInstance;

  constructor({ baseURL, apiKey }: { baseURL: string; apiKey?: string }) {
    this.httpClient = axios.create({
      baseURL,
      headers: apiKey
        ? {
            authorization: apiKey,
          }
        : undefined,
    });
  }

  async get<ResponseType = unknown, RequestParams = unknown>(
    path: string,
    params?: RequestParams,
  ): Promise<ResponseType> {
    try {
      const response = await this.httpClient.get<ResponseType>(path, {
        params,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  }

  async post<ResponseType = unknown, Body = unknown>(
    path: string,
    data: Body = {} as Body,
  ): Promise<ResponseType> {
    try {
      const response = await this.httpClient.post<ResponseType>(path, data);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw error;
    }
  }
}
