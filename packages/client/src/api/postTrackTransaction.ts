import { pollingApi } from "../utils/generateApi";

export const trackTransaction = pollingApi({
  methodName: "track",
  path: "v2/tx/track",
  method: "post",
  backoffMultiplier: 2.5,
});
