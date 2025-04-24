import { pollingApi } from "../utils/generateApi";

export const trackTransaction = pollingApi({
  methodName: "trackTransactionV2",
  path: "/v2/tx/track",
  method: "post",
  backoffMultiplier: 2.5,
});
