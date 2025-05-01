import { assetsAllowDuplicates } from "../api/getAssets";
import { ClientState } from "../state";

export const getMainnetAndTestnetAssets = async (chainId?: string) => {
  const [assetsMainnet, assetsTestnet] = await Promise.all([
    assetsAllowDuplicates({
      chainIds: chainId ? [chainId] : undefined,
    }),
    assetsAllowDuplicates({
      chainIds: chainId ? [chainId] : undefined,
      onlyTestnets: true,
    }),
  ]);

  const mainnet = assetsMainnet;
  const testnet = assetsTestnet;

  const merged = {
    ...mainnet,
    ...testnet,
  };

  ClientState.skipAssets = merged;

  return merged;
};
