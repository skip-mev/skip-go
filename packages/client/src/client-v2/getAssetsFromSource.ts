import { Api } from "../types/types";
import { Camel } from "./convert";
import { createRequest } from "./fetch-request-client";

type GetAssets = NonNullable<
  Camel<Parameters<InstanceType<typeof Api>["getAssets"]>[0]>
>;

type GetAssetsReturn = Awaited<
  ReturnType<InstanceType<typeof Api>["getAssets"]>
>["data"];

export const getAssets = (options: GetAssets = {}) => {
  const { request, cancel } = createRequest<GetAssets, GetAssetsReturn>(
    "/v2/fungible/assets",
    options,
    (res) => {
      console.log("Received assets:", res);
    },
  );

  return { request, cancel };
};
