import { ClientState } from "../state";
import { api } from "../utils/generateApi";

export const balances = api({
  methodName: "getBalances",
  method: "post",
  path: "/v2/info/balances",
  onSuccess: (response, options) => {
    if (!options) {
      ClientState.skipBalances = response;
    }
  },
});
