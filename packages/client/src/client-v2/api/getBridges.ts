import { api } from "./generateApi";

export const { request: getBridges, requestWithCancel: getBridgesWithCancel } =
  api("getBridges", "/v2/info/bridges");
