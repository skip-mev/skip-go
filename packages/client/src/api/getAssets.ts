import type { Asset } from "../types/swaggerTypes";
import { ClientState } from "../state/clientState";
import { api } from "../utils/generateApi";

export const assets = api({
  methodName: "getAssets",
  path: "/v2/fungible/assets",
  transformResponse: (response) => {
    return transformAssetsMap(response.chainToAssetsMap);
  },
  onSuccess: (response, options) => {
    if (options?.includeEvmAssets && options?.includeSvmAssets && options?.includeCw20Assets) {
      ClientState.skipAssets = response as Record<string, Asset[]>;
    }
  },
});

export const transformAssetsMap = (
  input?: Record<string, { assets?: Asset[] }>,
): Record<string, Asset[]> =>
  Object.entries(input ?? {}).reduce(
    (acc, [chainId, { assets }]) => {
      acc[chainId] = (assets ?? []).map((asset) => asset);
      return acc;
    },
    {} as Record<string, Asset[]>,
  );
