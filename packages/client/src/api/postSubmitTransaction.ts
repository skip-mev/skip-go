import { api } from "../utils/generateApi";

export const submitTransaction = api({
  methodName: "submit",
  method: "post",
  path: "v2/tx/submit",
});
