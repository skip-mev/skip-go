import { api } from "./generateApi";

export const balances = api({
  methodName: "getBalances",
  path: "/v2/info/balances",
});
