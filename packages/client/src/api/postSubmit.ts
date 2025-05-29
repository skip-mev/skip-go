import { api } from "../utils/generateApi";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";

export const submit = api({
  methodName: "submit",
  method: "post",
  path: "/v2/tx/submit",
});

export type MessagesRequest = ApiRequest<"submit">;
export type MessagesResponse = ApiResponse<"submit">;