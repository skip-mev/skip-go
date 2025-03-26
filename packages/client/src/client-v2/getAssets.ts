import { Api } from "../types/types";
import { Camel, toSnake } from "./convert";

type GetAssets = Camel<Parameters<InstanceType<typeof Api>["getAssets"]>[0]>;

export const getAssets = async (options: GetAssets) => {
  if (!options) return;

  const api = new Api();
  const snakeCaseOptions = toSnake(options);
  const response = await api.getAssets(snakeCaseOptions);

  return response;
};
