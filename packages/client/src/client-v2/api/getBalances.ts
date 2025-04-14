import { api } from "./generateApi";

export const {
  request: getBalances,
  requestWithCancel: getBalancesWithCancel,
} = api({
  methodName: "getBalances",
  path: "/v2/info/balances",
});
