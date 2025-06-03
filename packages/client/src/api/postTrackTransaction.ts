import { pollingApi } from "../utils/generateApi";
import type {
  ApiRequest,
  PollingProps,
} from "../utils/generateApi";

export type TrackTxRequest = ApiRequest<"status"> & TrackTxPollingProps;
export type TrackTxPollingProps = Omit<PollingProps<"status">, "isSuccess" | "onError" | "onSuccess">;

export const trackTransaction = ({
  maxRetries,
  retryInterval,
  backoffMultiplier = 2.5,
  ...trackTxRequest
}: TrackTxRequest) => {
  return pollingApi({
    methodName: "track",
    path: "/v2/tx/track",
    method: "post",
    maxRetries,
    retryInterval,
    backoffMultiplier,
  })(trackTxRequest);
};
