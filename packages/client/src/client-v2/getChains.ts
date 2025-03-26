import { Api } from "../types/types";
import { Camel } from "./convert";
import { createRequest } from "./fetch-request-client";

type GetChains = NonNullable<
  Camel<Parameters<InstanceType<typeof Api>["getChains"]>[0]>
>;

type GetChainsReturnValue = Awaited<
  ReturnType<InstanceType<typeof Api>["getChains"]>
>["data"];

export const getChains = (options: GetChains = {}) => {
  const { request, cancel } = createRequest<GetChains, GetChainsReturnValue>(
    "/v2/info/chains",
    options,
    (res) => {
      console.log("Received chains:", res);
    },
  );

  return { request, cancel };
};
