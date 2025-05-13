import { ClientState } from "../state/clientState";
import { api, ApiRequest, ApiResponse } from "../utils/generateApi";

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

export type BalanceRequest = ApiRequest<"getBalances">;
export type BalanceResponse = ApiResponse<"getBalances">;
