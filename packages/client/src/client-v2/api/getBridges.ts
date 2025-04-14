import { api } from "./generateApi";

export const { request: getBridges, requestWithCancel: getBridgesWithCancel } =
  api({
    methodName: "getBridges",
    path: "/v2/info/bridges",
  });
