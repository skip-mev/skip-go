import { pollingApi } from "../utils/generateApi";
import type { ApiResponse } from "../utils/generateApi";

export const transactionStatus = (options?: { isCancelled?: () => boolean }) => pollingApi({
  methodName: "status",
  path: "v2/tx/status",
  method: "get",
  throwOnError: true,
  isCancelled: options?.isCancelled,
});

export type TxStatusResponse = ApiResponse<"status">;
