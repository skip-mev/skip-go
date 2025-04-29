import { ClientState } from "../state";
import { api } from "../utils/generateApi";

export const chains = api({
  methodName: "getChains",
  path: "/v2/info/chains",
  transformResponse: (response) => response.chains,
  onSuccess: (response, options) => {
    if (options?.includeEvm && options?.includeSvm) {
      ClientState.skipChains = response;
    }
  },
});
