import { ClientState } from "../state/clientState";
import { api } from "../utils/generateApi";

export const chains = api({
  methodName: "chains",
  path: "/v2/info/chains",
  transformResponse: (response) => response.chains,
  onSuccess: (response, options) => {
    if (options?.includeEvm && options?.includeSvm) {
      ClientState.skipChains = response;
    }
  },
});
