import { api } from "../utils/generateApi";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";

export const messages = api({
  methodName: "msgs",
  method: "post",
  path: "/v2/fungible/msgs",
});

export type MessagesRequest = ApiRequest<"msgs">;
export type MessagesResponse = ApiResponse<"msgs">;
