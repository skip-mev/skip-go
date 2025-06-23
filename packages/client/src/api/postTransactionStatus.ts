import { pollingApi } from "../utils/generateApi";
import type { ApiResponse } from "../utils/generateApi";

export const transactionStatus = pollingApi({
  methodName: "status",
  path: "v2/tx/status",
  method: "get",
  throwOnError: true,
});

export type TxStatusResponse = ApiResponse<"status">;
