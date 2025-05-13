import { api, ApiRequest, ApiResponse } from "../utils/generateApi";

export const messages = api({
  methodName: "getMsgsV2",
  method: "post",
  path: "/v2/fungible/msgs",
});

export type MessagesRequest = ApiRequest<"getMsgsV2">;
export type MessagesResponse = ApiResponse<"getMsgsV2">;
