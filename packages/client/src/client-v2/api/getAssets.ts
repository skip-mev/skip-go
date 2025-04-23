import { Asset } from "../types/swaggerTypes";
import { ClientState } from "../state";
import { api } from "../utils/generateApi";

export const assets = api({
  methodName: "getAssets",
  path: "/v2/fungible/assets",
  onSuccess: (res, options) => {
    if (
      options.includeEvmAssets &&
      options.includeSvmAssets &&
      options.includeCw20Assets
    ) {
      ClientState.skipAssets = res.chainToAssetsMap as Record<string, Asset[]>;
    }
  },
});
