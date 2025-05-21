import { api } from "../utils/generateApi";

export const messagesDirect = api({
  methodName: "msgsDirect",
  method: "post",
  path: "/v2/fungible/msgs_direct",
});
