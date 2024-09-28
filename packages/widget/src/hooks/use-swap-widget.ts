import { useManager as useCosmosManager } from '@cosmos-kit/react';
import { Asset, BridgeType } from '@skip-go/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { BigNumber } from 'bignumber.js';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { formatUnits } from 'viem';
import {
  useAccount as useWagmiAccount,
  useDisconnect as useWagmiDisconnect,
  useSwitchChain as useWagmiSwitchNetwork,
} from 'wagmi';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { useAssets } from '../provider/assets';
import { useAnyDisclosureOpen } from '../store/disclosures';
import { trackWallet } from '../store/track-wallet';
import { useAccount } from './use-account';
import { Chain, useChains } from './use-chains';
import { useBalancesByChain } from './use-balances-by-chain';
import { useRoute } from './use-route';
import { useSkipClient } from './use-skip-client';
import { getAmountWei, parseAmountWei } from '../utils/number';
import { gracefullyConnect } from '../utils/wallet';
import { useSwapWidgetUIStore } from '../store/swap-widget';
import { chainIdToName } from '../chains';
import { COSMOS_GAS_AMOUNT, ETH_GAS_FEE } from '../constants/defaults';
import { convertHumanReadableAmountToCryptoAmount, convertTokenAmountToHumanReadableAmount } from '../utils/crypto';

const PRICE_IMPACT_THRESHOLD = 0.1;

export interface DefaultRouteConfig {
  amountIn?: number;
  amountOut?: number;
  srcChainID?: string;
  srcAssetDenom?: string;
  destChainID?: string;
  destAssetDenom?: string;
}

export function useSwapWidget(persistSwapWidgetState = true) {
  /**
   * intentional manual hydration to prevent ssr mismatch
   * @see {useSwapWidgetStore}
   */
  useEffect(() => {
    if (persistSwapWidgetState) {
      useSwapWidgetStore.persist.rehydrate();
    }
  }, []);

  /////////////////////////////////////////////////////////////////////////////

  // #region -- core states

  const { routeConfig, defaultRoute } = useSwapWidgetUIStore();
  const skipClient = useSkipClient();

  const filter = useSwapWidgetUIStore((state) => state.filter);
  const sourceChainIDs = filter?.source
    ? Object.keys(filter.source)
    : undefined;
  const destinationChainIDs = filter?.destination
    ? Object.keys(filter.destination)
    : undefined;

  const {
    assetsByChainID,
    isReady: isAssetsReady,
    getAsset,
  } = useAssets();
  const { data: chains } = useChains();

  const { getWalletRepo } = useCosmosManager();
  const { connector, chain: evmChain } = useWagmiAccount();
  const { switchChainAsync: switchNetworkAsync } = useWagmiSwitchNetwork({
    mutation: {
      onError: (error) => {
        toast.error(`Network switch error: ${error.message}`);
      },
    },
  });
  const { disconnect } = useWagmiDisconnect();
  const { wallets } = useWallet();

  const [userTouchedDstAsset, setUserTouchedDstAsset] = useState(false);

  const {
    amountIn,
    amountOut,
    bridges,
    destinationAsset: dstAsset,
    destinationChain: dstChain,
    direction,
    sourceAsset: srcAsset,
    sourceChain: srcChain,
  } = useSwapWidgetStore();

  const srcAccount = useAccount(srcChain?.chainID);

  const amountInWei = useMemo(() => {
    return getAmountWei(amountIn, srcAsset?.decimals);
  }, [amountIn, srcAsset?.decimals]);

  const amountOutWei = useMemo(() => {
    return getAmountWei(amountOut, dstAsset?.decimals);
  }, [amountOut, dstAsset?.decimals]);

  const isAnyDisclosureOpen = useAnyDisclosureOpen();

  const shouldRouteLoad = useMemo(() => {
    const wei = parseFloat(
      direction === 'swap-in' ? amountInWei : amountOutWei
    );
    const isValidWei = !isNaN(wei);
    return !isAnyDisclosureOpen && isValidWei;
  }, [amountInWei, amountOutWei, direction, isAnyDisclosureOpen]);

  const {
    data: route,
    error: routeError,
    isError: routeIsError,
    isFetching: routeIsFetching,
  } = useRoute({
    direction: direction,
    amount: direction === 'swap-in' ? amountInWei : amountOutWei,
    sourceAsset: srcAsset?.denom,
    sourceAssetChainID: srcAsset?.chainID,
    destinationAsset: dstAsset?.denom,
    destinationAssetChainID: dstAsset?.chainID,
    ...routeConfig,
    enabled: shouldRouteLoad,
  });

  const srcAssets = useMemo(() => {
    return assetsByChainID(srcChain?.chainID);

    // reason: only update when `srcChain?.chainID` changes
  }, [srcChain?.chainID, assetsByChainID]);

  const { data: balances } = useBalancesByChain({
    address: srcAccount?.address,
    chain: srcChain,
    assets: srcAssets,
    enabled: !isAnyDisclosureOpen,
  });

  // #endregion

  /////////////////////////////////////////////////////////////////////////////

  // #region -- variables

  const feeAsset = chains?.find(c => c.chainID === srcChain?.chainID)?.feeAssets?.[0];
  const sourceChainType = srcChain?.chainType;

  const gasFeeTokenAmount = useMemo(() => {
    if (!srcAsset) return 0;

    switch (sourceChainType) {
      case 'evm':
        const isFeeAsset = srcAsset.denom.includes('-native') && srcAsset.originChainID === srcChain?.chainID;
        return isFeeAsset ? Number(convertHumanReadableAmountToCryptoAmount(ETH_GAS_FEE, srcAsset.decimals)) : 0;
      case 'cosmos':
        if (!feeAsset || !feeAsset.gasPrice?.average || feeAsset.denom !== srcAsset.denom) return 0;
        return Number(feeAsset.gasPrice.average) * COSMOS_GAS_AMOUNT;
      case 'svm':
        return 0
      default:
        return 0;
    }
  }, [srcAsset, feeAsset, sourceChainType, srcChain?.chainID]);

  const maxTokenAmountMinusFees = useMemo(() => {
    if (!balances || !srcAsset) return;
    const maxTokenAmount = balances[srcAsset.denom]
    if (gasFeeTokenAmount && maxTokenAmount) {
      const maxTokenAmountMinusGasFees = BigNumber(maxTokenAmount).minus(gasFeeTokenAmount).toString();
      const maxAmountMinusGasFees = convertTokenAmountToHumanReadableAmount(maxTokenAmountMinusGasFees, srcAsset.decimals);
      return maxAmountMinusGasFees;
    }
    return maxTokenAmount && convertTokenAmountToHumanReadableAmount(String(maxTokenAmount), srcAsset.decimals);
  }, [balances, srcAsset, gasFeeTokenAmount]);

  const errorMessage = useMemo(() => {
    if (!routeError) return '';
    if (routeError instanceof Error) {
      return getRouteErrorMessage(routeError);
    }
    return String(routeError);
  }, [routeError]);

  const isAmountError = useMemo(() => {
    if (!amountIn || !balances || !srcAsset) {
      return false;
    }

    const parsedAmount = BigNumber(amountIn || '0');
    const parsedBalance = BigNumber(balances[srcAsset.denom] ?? '0').shiftedBy(
      -(srcAsset.decimals ?? 6)
    );

    if (parsedAmount.isGreaterThan(parsedBalance)) {
      return `Insufficient balance.`;
    }

    if (!maxTokenAmountMinusFees) return false

    const parsedMaxAmountMinusFees = BigNumber(maxTokenAmountMinusFees);
    if (parsedAmount.isGreaterThan(parsedMaxAmountMinusFees)) {
      return `Insufficient balance after estimated fees.`;
    }

    return false;
  }, [
    amountIn,
    balances,
    getAsset,
    srcAsset,
    srcChain?.chainID,
  ]);

  const swapPriceImpactPercent = useMemo(() => {
    if (!route?.swapPriceImpactPercent) return undefined;
    return parseFloat(route.swapPriceImpactPercent) / 100;
  }, [route]);

  const priceImpactThresholdReached = useMemo(() => {
    if (!swapPriceImpactPercent) return false;
    return swapPriceImpactPercent > PRICE_IMPACT_THRESHOLD;
  }, [swapPriceImpactPercent]);

  const txsRequired = useMemo(() => {
    return route?.txsRequired ?? 0;
  }, [route?.txsRequired]);

  const usdDiffPercent = useMemo(() => {
    if (!route) {
      return undefined;
    }
    if (
      !route.usdAmountIn ||
      !route.usdAmountOut ||
      Number(route.usdAmountIn) === 0 ||
      Number(route.usdAmountOut) === 0
    ) {
      return undefined;
    }

    const usdAmountIn = parseFloat(route.usdAmountIn);
    const usdAmountOut = parseFloat(route.usdAmountOut);

    return (usdAmountOut - usdAmountIn) / usdAmountIn;
  }, [route]);

  const [routeWarningTitle, routeWarningMessage] = useMemo(() => {
    if (!route?.warning) {
      return [undefined, undefined];
    }

    if (Number(route.usdAmountIn) === 0 || Number(route.usdAmountOut) === 0) {
      return [undefined, undefined];
    }

    if (route.warning.type === 'BAD_PRICE_WARNING') {
      return ['Bad Price Warning', route.warning.message];
    }

    return [undefined, undefined];
  }, [route]);

  // #endregion

  /////////////////////////////////////////////////////////////////////////////

  // #region -- chain and asset handlers

  const onBridgeChange = useCallback((bridges: BridgeType[]) => {
    useSwapWidgetStore.setState({ bridges });
  }, []);

  /**
   * Handle source chain change and update source asset with these cases:
   * - select fee denom asset if exists
   * - if not, select first available asset
   */
  const onSourceChainChange = useCallback(
    async (chain: Chain, injectAsset?: Asset) => {
      let asset;
      if (!asset) {
        const assets = assetsByChainID(
          chain.chainID,
          filter?.source?.[chain.chainID]
        );
        if (chain.chainType === "cosmos") {
          const feeAsset = chains?.find(c => c.chainID === chain.chainID)?.feeAssets?.[0];
          asset = assets.find((x) => x.denom === feeAsset?.denom);
          if (!asset) {
            asset = assets.find((x) => x.recommendedSymbol?.toLowerCase() === 'usdc');
          }
        }
        if (chain.chainType === 'evm') {
          asset = assets.find(
            (x) =>
              x.denom.endsWith('-native') ||
              x.name?.toLowerCase() === chain.chainName.toLowerCase() ||
              x.recommendedSymbol?.toLowerCase() === 'usdc'
          );
        }
        if (chain.chainType === 'svm') {
          asset = assets.find(
            (x) =>
              // default to usdc
              x.denom.toLowerCase() ===
              'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'.toLowerCase()
          );
        }
        asset ??= assets[0];
      }

      useSwapWidgetStore.setState({
        sourceChain: chain,
        sourceAsset: injectAsset ? injectAsset : asset,
      });
    },
    [assetsByChainID]
  );

  /**
   * Handle source asset change
   */
  const onSourceAssetChange = useCallback((asset: Asset) => {
    useSwapWidgetStore.setState({
      sourceAsset: asset,
    });
  }, []);

  /**
   * Handle source amount change
   */
  const onSourceAmountChange = useCallback((amount: string) => {
    useSwapWidgetStore.setState({ amountIn: amount, direction: 'swap-in' });
  }, []);

  /**
   * Handle destination chain change and update destination asset with these cases:
   * - if destination asset is user selected, find equivalent asset on new chain
   * - if not, select fee denom asset if exists
   * - if not, select first available asset
   */
  const onDestinationChainChange = useCallback(
    async (chain: Chain, injectAsset?: Asset) => {
      const { destinationAsset: currentDstAsset } =
        useSwapWidgetStore.getState();
      const assets = assetsByChainID(
        chain.chainID,
        filter?.destination?.[chain.chainID]
      );

      let asset;
      if (!asset) {
        const assets = assetsByChainID(
          chain.chainID,
          filter?.destination?.[chain.chainID]
        );
        if (chain.chainType === "cosmos") {
          const feeAsset = chains?.find(c => c.chainID === chain.chainID)?.feeAssets?.[0];
          asset = assets.find((x) => x.denom === feeAsset?.denom);
          if (!asset) {
            asset = assets.find((x) => x.recommendedSymbol?.toLowerCase() === 'usdc');
          }
        }
        if (chain.chainType === 'evm') {
          asset = assets.find(
            (x) =>
              x.denom.endsWith('-native') ||
              x.name?.toLowerCase() === chain.chainName.toLowerCase() ||
              x.recommendedSymbol?.toLowerCase() === 'usdc'
          );
        }
        if (chain.chainType === 'svm') {
          asset = assets.find(
            (x) =>
              // default to usdc
              x.denom.toLowerCase() ===
              'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'.toLowerCase()
          );
        }
        asset ??= assets[0];
      }
      if (currentDstAsset && userTouchedDstAsset) {
        const equivalentAsset = findEquivalentAsset(currentDstAsset, assets);

        if (equivalentAsset) {
          asset = equivalentAsset;
        }
      }

      useSwapWidgetStore.setState({
        destinationChain: chain,
        destinationAsset: injectAsset ? injectAsset : asset,
      });
    },

    [assetsByChainID, userTouchedDstAsset]
  );

  /**
   * Handle destination asset change with and update destination chain with these cases:
   * - if destination chain is undefined, select chain based off asset
   * - if destination chain is defined, only update destination asset
   */
  const onDestinationAssetChange = useCallback(
    (asset: Asset) => {
      // If destination asset is defined, but no destination chain, select chain based off asset.
      let { destinationChain: currentDstChain } = useSwapWidgetStore.getState();

      currentDstChain ??= (chains ?? []).find(({ chainID }) => {
        return chainID === asset.chainID;
      });

      // If destination asset is user selected, set flag to true.
      setUserTouchedDstAsset(true);

      useSwapWidgetStore.setState({
        destinationChain: currentDstChain,
        destinationAsset: asset,
      });
    },
    [chains]
  );

  /**
   * Handle destination amount change
   */
  const onDestinationAmountChange = useCallback((amount: string) => {
    useSwapWidgetStore.setState({ amountOut: amount, direction: 'swap-out' });
  }, []);

  /**
   * Handle invert source and destination values
   */
  const onInvertDirection = useCallback(async () => {
    const { destinationChain } = useSwapWidgetStore.getState();
    if (!destinationChain) return;

    useSwapWidgetStore.setState((prev) => ({
      sourceChain: prev.destinationChain,
      sourceAsset: prev.destinationAsset,
      destinationChain: prev.sourceChain,
      destinationAsset: prev.sourceAsset,
      amountIn: prev.amountOut,
      amountOut: prev.amountIn,
      direction: prev.direction === 'swap-in' ? 'swap-out' : 'swap-in',
    }));
  }, []);

  /**
   * Handle maxing amount in
   */
  const onSourceAmountMax = useCallback(
    <T extends HTMLElement>(event: MouseEvent<T>) => {
      if (!balances || !srcChain || !srcAsset) return false;

      const decimals = srcAsset.decimals ?? 6;
      const balance = balances[srcAsset.denom];

      /**
       * if no balance, set amount in to zero
       * (would be impossible since max button is disabled if no balance)
       */
      if (!balance) {
        useSwapWidgetStore.setState({
          amountIn: '0',
          direction: 'swap-in',
        });
        return;
      }
      /**
       * compensate gas fees if source asset is same as fee asset
       */
      if (maxTokenAmountMinusFees) {
        useSwapWidgetStore.setState({
          amountIn: Number(maxTokenAmountMinusFees) > 0 ? maxTokenAmountMinusFees : "0",
          direction: 'swap-in',
        });
        return;
      }

      // otherwise, max balance
      const newAmountIn = formatUnits(BigInt(balance), decimals);
      useSwapWidgetStore.setState({
        amountIn: newAmountIn,
        direction: 'swap-in',
      });
    },
    [balances, srcAsset, srcChain]
  );

  /**
   * Handle clearing amount values when all transactions are complete
   */
  const onAllTransactionComplete = useCallback(() => {
    useSwapWidgetStore.setState({
      amountIn: '',
      amountOut: '',
      direction: 'swap-in',
    });
  }, []);

  // #endregion

  /////////////////////////////////////////////////////////////////////////////

  // #region -- side effects


  /**
   * sync either amount in or out depending on {@link direction}
   */
  useEffect(() => {
    if (!route) return;

    const isSwapIn = direction === 'swap-in';

    const newAmount = isSwapIn ? route.amountOut : route.amountIn;

    const formattedNewAmount = isSwapIn
      ? parseAmountWei(newAmount, dstAsset?.decimals)
      : parseAmountWei(newAmount, srcAsset?.decimals);

    useSwapWidgetStore.setState(
      isSwapIn
        ? { amountOut: formattedNewAmount }
        : { amountIn: formattedNewAmount }
    );
  }, [route, direction, srcAsset?.decimals, dstAsset?.decimals]);

  /**
   * if amount in is empty or zero, reset amount out
   */
  useEffect(() => {
    return useSwapWidgetStore.subscribe(
      (state) => state.amountIn,
      (current, prev) => {
        if ((!current || current == '0') && prev) {
          useSwapWidgetStore.setState({ amountOut: '' });
        }
      }
    );
  }, []);

  /**
   * if amount out is empty or zero, reset amount in
   */
  useEffect(() => {
    return useSwapWidgetStore.subscribe(
      (state) => state.amountOut,
      (current, prev) => {
        if ((!current || current == '0') && prev) {
          useSwapWidgetStore.setState({ amountIn: '' });
        }
      }
    );
  }, []);

  /**
   * sync source chain wallet connections
   * @see {srcChain}
   */
  useEffect(() => {
    return useSwapWidgetStore.subscribe(
      (state) => state.sourceChain,
      async (srcChain) => {
        const { cosmos, svm } = trackWallet.get();

        if (
          srcChain &&
          srcChain.chainType === 'cosmos' &&
          !srcChain.chainID.includes('penumbra')
        ) {
          const { wallets } = getWalletRepo(chainIdToName(srcChain.chainID));
          let wallet: (typeof wallets)[number] | undefined;

          if (cosmos?.chainType === 'cosmos') {
            wallet = wallets.find((w) => {
              return w.walletName === cosmos.walletName;
            });
          } else {
            wallet = wallets.find((w) => {
              return w.isWalletConnected && !w.isWalletDisconnected;
            });
          }
          if (wallet) {
            try {
              await gracefullyConnect(wallet);
              trackWallet.track(
                'cosmos',
                wallet.walletName,
                srcChain.chainType
              );
            } catch (error) {
              console.error(error);
            }
          } else {
            trackWallet.untrack('cosmos');
          }
        }
        if (srcChain && srcChain.chainType === 'evm') {
          if (evmChain && connector) {
            try {
              if (switchNetworkAsync && evmChain.id !== +srcChain.chainID) {
                await switchNetworkAsync({ chainId: +srcChain.chainID });
              }
              trackWallet.track('evm', connector.id, srcChain.chainType);
            } catch (error) {
              console.error(error);
              trackWallet.untrack('evm');
              disconnect();
            }
          } else {
            trackWallet.untrack('evm');
            disconnect();
          }
        }
        if (srcChain && srcChain.chainType === 'svm') {
          let wallet: (typeof wallets)[number] | undefined;
          if (svm?.chainType === 'svm') {
            wallet = wallets.find((w) => w.adapter.name === svm?.walletName);
          } else {
            wallet = wallets.find((w) => w.adapter.connected);
          }

          if (wallet) {
            wallet.adapter.connect();
            trackWallet.track('svm', wallet.adapter.name, srcChain.chainType);
          } else {
            trackWallet.untrack('svm');
          }
        }
      },
      {
        equalityFn: shallow,
        fireImmediately: true,
      }
    );
  }, [
    connector,
    disconnect,
    evmChain,
    getWalletRepo,
    switchNetworkAsync,
    wallets,
  ]);

  // #endregion

  // #region -- Default Route

  const shareable = useMemo(() => {
    const params = new URLSearchParams();
    if (srcChain) {
      params.set('src_chain', srcChain.chainID.toLowerCase());
    }
    if (srcAsset) {
      params.set('src_asset', srcAsset.denom.toLowerCase());
    }
    if (dstChain) {
      params.set('dest_chain', dstChain.chainID.toLowerCase());
    }
    if (dstAsset) {
      params.set('dest_asset', dstAsset.denom.toLowerCase());
    }
    if (amountIn) {
      params.set('amount_in', amountIn);
    }
    if (amountOut) {
      params.set('amount_out', amountOut);
    }
    return {
      link: `https://go.skip.build?${params}`,
    };
  }, [srcChain, srcAsset, dstChain, dstAsset, amountIn, amountOut]);

  const defaultSourceChain = defaultRoute?.srcChainID;
  const defaultSourceAsset = defaultRoute?.srcAssetDenom;
  const defaultDestinationChain = defaultRoute?.destChainID;
  const defaultDestinationAsset = defaultRoute?.destAssetDenom;
  const defaultAmountIn = defaultRoute?.amountIn;
  const defaultAmountOut = defaultRoute?.amountOut;

  useEffect(() => {
    if (!chains || !isAssetsReady || srcChain) return;
    if (defaultSourceChain) {
      const filteredChains = sourceChainIDs
        ? chains.filter((c) => sourceChainIDs?.includes(c.chainID))
        : chains;
      const findChain = filteredChains.find(
        (x) => x.chainID.toLowerCase() === defaultSourceChain.toLowerCase()
      );
      if (findChain) {
        if (defaultSourceAsset) {
          const assets = assetsByChainID(
            findChain.chainID,
            filter?.source?.[findChain.chainID]
          );
          const findAsset = assets.find(
            (x) => x.denom.toLowerCase() === defaultSourceAsset.toLowerCase()
          );
          if (findAsset) {
            onSourceChainChange(findChain, findAsset);
            useSwapWidgetUIStore.setState({
              defaultRoute: undefined,
            });
            return;
          }
        }
        onSourceChainChange(findChain);
        useSwapWidgetUIStore.setState({
          defaultRoute: undefined,
        });
      }
    }
  }, [srcChain, chains, isAssetsReady, defaultSourceChain, defaultSourceAsset]);

  useEffect(() => {
    if (!chains || !isAssetsReady || dstChain) return;
    if (defaultDestinationChain) {
      const filteredChains = destinationChainIDs
        ? chains.filter((c) => destinationChainIDs?.includes(c.chainID))
        : chains;
      const findChain = filteredChains.find(
        (x) => x.chainID.toLowerCase() === defaultDestinationChain.toLowerCase()
      );
      if (findChain) {
        if (defaultDestinationAsset) {
          const assets = assetsByChainID(
            findChain.chainID,
            filter?.destination?.[findChain.chainID]
          );
          const findAsset = assets.find(
            (x) =>
              x.denom.toLowerCase() === defaultDestinationAsset.toLowerCase()
          );
          if (findAsset) {
            onDestinationChainChange(findChain, findAsset);
            useSwapWidgetUIStore.setState({
              defaultRoute: undefined,
            });
            return;
          }
        }
        onDestinationChainChange(findChain);
        useSwapWidgetUIStore.setState({
          defaultRoute: undefined,
        });
      }
    }
  }, [
    dstChain,
    chains,
    isAssetsReady,
    defaultDestinationAsset,
    defaultDestinationChain,
  ]);

  useEffect(() => {
    if (defaultAmountIn) {
      onSourceAmountChange(String(defaultAmountIn));
      useSwapWidgetUIStore.setState({
        defaultRoute: undefined,
      });
      return;
    }
    if (defaultAmountOut) {
      onDestinationAmountChange(String(defaultAmountOut));
      useSwapWidgetUIStore.setState({
        defaultRoute: undefined,
      });
    }
  }, [defaultAmountIn, defaultAmountOut]);

  // #endregion
  /////////////////////////////////////////////////////////////////////////////

  return {
    amountIn,
    amountOut,
    bridges,
    destinationAsset: dstAsset,
    destinationChain: dstChain,
    direction,
    isAmountError,
    noRouteFound: routeIsError,
    numberOfTransactions: txsRequired ?? 0,
    onAllTransactionComplete,
    onBridgeChange,
    onDestinationAmountChange,
    onDestinationAssetChange,
    onDestinationChainChange,
    onInvertDirection,
    onSourceAmountChange,
    onSourceAmountMax,
    onSourceAssetChange,
    onSourceChainChange,
    priceImpactThresholdReached,
    route,
    routeError: errorMessage,
    routeLoading: routeIsFetching,
    routeWarningMessage,
    routeWarningTitle,
    sourceAsset: srcAsset,
    sourceChain: srcChain,
    swapPriceImpactPercent,
    usdDiffPercent,
    shareable,
  };
}

///////////////////////////////////////////////////////////////////////////////

// TODO: move to src/context/
// TODO: include all memoize values
export interface SwapWidgetStore {
  amountIn: string;
  amountOut: string;
  sourceChain?: Chain;
  sourceAsset?: Asset;
  destinationChain?: Chain;
  destinationAsset?: Asset;
  direction: 'swap-in' | 'swap-out';
  bridges: BridgeType[];
}

export const defaultValues: SwapWidgetStore = {
  amountIn: '',
  amountOut: '',
  direction: 'swap-in',
  bridges: [],
};

// TODO: move to src/context/
// TODO: include all memoize values
export const useSwapWidgetStore = create(
  subscribeWithSelector(
    persist(() => defaultValues, {
      name: 'SwapWidgetState',
      version: 2,
      storage: createJSONStorage(() => window.sessionStorage),
      skipHydration: true,
    })
  )
);

///////////////////////////////////////////////////////////////////////////////

function findEquivalentAsset(asset: Asset, assets: Asset[]) {
  return assets.find((a) => {
    const isSameOriginChain = a.originChainID === asset.originChainID;
    const isSameOriginDenom = a.originDenom === asset.originDenom;
    return isSameOriginChain && isSameOriginDenom;
  });
}

function getRouteErrorMessage({ message }: { message: string }) {
  if (message.includes('no swap route found after axelar fee of')) {
    return 'Amount is too low to cover Axelar fees';
  }
  if (
    message.includes(
      'evm native destination tokens are currently not supported'
    )
  ) {
    return 'EVM native destination tokens are currently not supported';
  }
  return message;
}
