import { Asset } from "../types/swaggerTypes";
import { ClientState } from "../state";
import { api } from "../utils/generateApi";

export const assets = api({
  methodName: "getAssets",
  path: "/v2/fungible/assets",
  transformResponse: (response) => {
    return response.chainToAssetsMap;
  },
  onSuccess: (response, options) => {
    if (options?.includeEvmAssets && options?.includeSvmAssets && options?.includeCw20Assets) {
      ClientState.skipAssets = response as Record<string, Asset[]>;
    }
  },
});
