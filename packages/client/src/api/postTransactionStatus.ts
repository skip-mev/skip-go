import { ApiResponse, pollingApi } from "../utils/generateApi";

export const transactionStatus = pollingApi({
  methodName: "getTransactionStatusV2",
  path: "/v2/tx/status",
  method: "get",
});

export type TxStatusResponse = ApiResponse<"getTransactionStatusV2">;
