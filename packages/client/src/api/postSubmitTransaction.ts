import { api } from "../utils/generateApi";

export const submitTransaction = api({
  methodName: "submitTransactionV2",
  method: "post",
  path: "/v2/tx/submit",
});
