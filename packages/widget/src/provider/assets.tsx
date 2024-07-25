import { Asset, FeeAsset } from '@skip-go/core';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useAssets as useSkipAssets } from '../hooks/use-assets';
import { useChains } from '../hooks/use-chains';
import { useSwapWidgetUIStore } from '../store/swap-widget';

interface AssetsContext {
  assets: Record<string, Asset[]>;
  assetsByChainID: (chainID?: string, filterDenoms?: string[]) => Asset[];
  getAsset(denom: string, chainID: string): Asset | undefined;
  getFeeAsset(chainID: string): Promise<Asset | undefined>;
  getNativeAssets(): Asset[];
  isReady: boolean;
}

export const AssetsContext = createContext<AssetsContext>({
  assets: {},
  assetsByChainID: () => [],
  getAsset: () => undefined,
  getFeeAsset: async () => undefined,
  getNativeAssets: () => [],
  isReady: false,
});

export const AssetsProvider = ({ children }: { children: ReactNode }) => {
  const { data: chains } = useChains();
  const { data: assets = {} } = useSkipAssets({
    onlyTestnets: useSwapWidgetUIStore.getState().onlyTestnet,
  });

  const assetsByChainID: AssetsContext['assetsByChainID'] = useCallback(
    (chainID?: string, filterDenoms?: string[]) => {
      const chainAssets = chainID ? assets[chainID] || [] : [];
      if (filterDenoms && filterDenoms.length > 0) {
        return chainAssets.filter((asset) =>
          filterDenoms.includes(asset.denom)
        );
      }
      return /* console.log(chainAssets), */ chainAssets;
    },
    [assets]
  );

  const getAsset = useCallback(
    (denom: string, chainID: string) => {
      const asset = assets[chainID]?.find((asset) => asset.denom === denom);
      return asset;
    },
    [assets]
  );

  const getFeeAsset = useCallback(
    async (chainID: string) => {
      const chain = (chains ?? []).find((chain) => chain.chainID === chainID);
      if (!chain) return;
      const feeAsset = (() => {
        if (chainID === 'carbon-1') {
          return chain.feeAssets.find((v) => v.denom == 'swth');
        }
        return chain.feeAssets?.[0];
      })();
      if (!feeAsset) return;

      const asset = getAsset(feeAsset.denom, chainID);
      if (!asset) return;

      return asset;
    },
    [chains, getAsset]
  );

  const getNativeAssets = useCallback(() => {
    const nativeAssets: Asset[] = [];

    for (const chainAssetList of Object.values(assets)) {
      for (const asset of chainAssetList) {
        if (asset.chainID === asset.originChainID) {
          nativeAssets.push(asset);
        }
      }
    }

    return nativeAssets;
  }, [assets]);

  const isReady = useMemo(() => Object.keys(assets).length > 0, [assets]);

  // useEffect(() => {
  //   if (!isReady || !chains || !assets) return;
  //   const load = (src: string) => {
  //     const img = new Image();
  //     img.src = src;
  //     img.onload = () => img.remove();
  //   };
  //   chains.forEach(({ chainID, logoURI }) => {
  //     logoURI && load(logoURI);
  //     (assets[chainID] || []).forEach(({ logoURI }) => {
  //       logoURI && load(logoURI);
  //     });
  //   });
  // }, [assets, chains, isReady]);

  return (
    <AssetsContext.Provider
      value={{
        assets,
        assetsByChainID,
        getAsset,
        getFeeAsset,
        getNativeAssets,
        isReady,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export function useAssets() {
  return useContext(AssetsContext);
}

const feeAssetCache: Record<string, Asset> = {};
