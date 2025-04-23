import { ClientState } from "../state";
import { api } from "../utils/generateApi";

export const balances = api({
  methodName: "getBalances",
  path: "/v2/info/balances",
  onSuccess: (response, options) => {
    if (!options) {
      ClientState.skipBalances = response;
    }
  },
});
