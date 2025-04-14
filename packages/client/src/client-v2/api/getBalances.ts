import { api } from "./generateApi";

export const {
  request: getBalances,
  requestWithCancel: getBalancesWithCancel,
} = api("getBalances", "/v2/info/balances");
