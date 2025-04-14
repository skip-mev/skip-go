import { ClientState } from "../state";
import { api } from "./generateApi";

export const { request: getChains, requestWithCancel: getChainsWithCancel } =
  api("getChains", "/v2/info/chains", (res, options) => {
    if (options?.includeEvm && options?.includeSvm) {
      ClientState.skipChains = res.chains;
    }
  });
