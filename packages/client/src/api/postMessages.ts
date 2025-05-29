import { api } from "../utils/generateApi";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";
import { filterMessagesRequest } from "../utils/getMessagesRequestFromRoute";

export const messages = async (request: MessagesRequest) => {
  return api({
    methodName: "msgs",
    method: "post",
    path: "/v2/fungible/msgs",
  })(filterMessagesRequest(request));
};

export type MessagesRequest = ApiRequest<"msgs">;
export type MessagesResponse = ApiResponse<"msgs">;
