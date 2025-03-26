import { Api, Asset } from "../types/types";
import { Camel, toCamel, toSnake } from "./convert";
import { ClientState } from "./state";

type GetAssets = Camel<Parameters<InstanceType<typeof Api>["getAssets"]>[0]>;

type GetAssetsReturn = Awaited<
  ReturnType<InstanceType<typeof Api>["getAssets"]>
>;

export const getAssets = (options: GetAssets = {}) => {
  const controller = new AbortController();
  const snakeCaseOptions = toSnake(options);

  const request = async () => {
    try {
      const response = await ClientState.requestClient.get<GetAssetsReturn>(
        "/v2/fungible/assets",
        snakeCaseOptions,
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
    cancel: () => controller.abort(),
  };
};
