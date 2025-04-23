import { api } from "./generateApi";

export const bridges = api({
  methodName: "getBridges",
  path: "/v2/info/bridges",
});
