import { ClientState } from "../state";
import { api } from "./generateApi";

export const { request: getChains, requestWithCancel: getChainsWithCancel } =
  api({
    methodName: "getChains",
    path: "/v2/info/chains",
    onSuccess: (res, options) => {
      if (options?.includeEvm && options?.includeSvm) {
        ClientState.skipChains = res.chains;
      }
    },
  });
