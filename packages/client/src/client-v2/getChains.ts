import { Api } from "../types/types";
import { Camel, toCamel, toSnake } from "./convert";
import { ClientState } from "./state";

type GetChains = Camel<Parameters<InstanceType<typeof Api>["getChains"]>[0]>;

type GetChainsReturnValue = Awaited<
  ReturnType<InstanceType<typeof Api>["getChains"]>
>["data"];

export const getChains = (options: GetChains = {}) => {
  const controller = new AbortController();

  const request = async () => {
    try {
      const response =
        await ClientState.requestClient.get<GetChainsReturnValue>(
          "/v2/info/chains",
          toSnake(options),
          controller.signal,
        );

      return toCamel(response);
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
    cancel: (reason: string) => controller.abort(reason),
  };
};
