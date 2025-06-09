import { api } from "../utils/generateApi";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";

export const submit = api({
  methodName: "submit",
  method: "post",
  path: "v2/tx/submit",
});

export type SubmitRequest = ApiRequest<"submit">;
export type SubmitResponse = ApiResponse<"submit">;
