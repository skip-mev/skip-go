import { api } from "./generateApi";

export const messages = api({
  methodName: "getMsgsV2",
  method: "post",
  path: "/v2/fungible/msgs",
});
