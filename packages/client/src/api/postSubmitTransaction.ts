import { api } from "../utils/generateApi";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";

export const submitTransaction = api({
  methodName: "submit",
  method: "post",
  path: "v2/tx/submit",
});

export type SubmitTransactionRequest = ApiRequest<"submit">;
export type SubmitTransactionResponse = ApiResponse<"submit">;