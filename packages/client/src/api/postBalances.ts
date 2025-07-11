import { ClientState } from "../state/clientState";
import { api } from "../utils/generateApi";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";

export const balances = api({
  methodName: "balances",
  method: "post",
  path: "v2/info/balances",
  onSuccess: (response, options) => {
    if (!options) {
      ClientState.skipBalances = response;
    }
  },
});

export type BalanceRequest = ApiRequest<"balances">;
export type BalanceResponse = ApiResponse<"balances">;
