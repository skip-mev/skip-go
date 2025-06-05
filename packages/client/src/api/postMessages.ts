import { api } from "../utils/generateApi";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";
import { filterMessagesRequest } from "../utils/filterMessagesRequest";
import type { SkipApiOptions } from "src/state/apiState";

export const messages = async (request: MessagesRequest) => {
  return api({
    methodName: "msgs",
    method: "post",
    path: "v2/fungible/msgs",
  })(filterMessagesRequest(request));
};

export type MessagesRequest = ApiRequest<"msgs"> &
SkipApiOptions & {
  abortDuplicateRequests?: boolean;
};

export type MessagesResponse = ApiResponse<"msgs">;
