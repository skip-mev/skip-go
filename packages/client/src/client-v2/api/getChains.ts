import { ClientState } from "../state";
import { api } from "../utils/generateApi";

export const chains = api({
  methodName: "getChains",
  path: "/v2/info/chains",
  onSuccess: (res, options) => {
    if (options?.includeEvm && options?.includeSvm) {
      ClientState.skipChains = res.chains;
    }
  },
});
