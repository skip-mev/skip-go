import { assets } from "../api/getAssets";
import { ClientState } from "../state";
import { Asset } from "../types/swaggerTypes";

export const getMainnetAndTestnetAssets = async (chainId?: string) => {
  const [assetsMainnet, assetsTestnet] = await Promise.all([
    assets.request({
      chainIds: chainId ? [chainId] : undefined,
    }),
    assets.request({
      chainIds: chainId ? [chainId] : undefined,
      onlyTestnets: true,
    }),
  ]);

  const mainnet = transformAssetsMap(assetsMainnet);
  const testnet = transformAssetsMap(assetsTestnet);

  const merged = {
    ...mainnet,
    ...testnet,
  };

  ClientState.skipAssets = merged;

  return merged;
};

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
