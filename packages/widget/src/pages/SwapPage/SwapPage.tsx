import { useCallback, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { ClientAsset, skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { skipRouteAtom } from "@/state/route";
import {
  sourceAssetAtom,
  destinationAssetAtom,
  swapDirectionAtom,
  sourceAssetAmountAtom,
  destinationAssetAmountAtom,
  isWaitingForNewRouteAtom,
  goFastWarningAtom,
  onRouteUpdatedEffect,
  routePreferenceAtom,
  slippageAtom,
  onSourceAssetUpdatedEffect,
} from "@/state/swapPage";
import { setSwapExecutionStateAtom, chainAddressesAtom } from "@/state/swapExecutionPage";
import { SwapPageBridge } from "./SwapPageBridge";
import { SwapPageHeader } from "./SwapPageHeader";
import { currentPageAtom, Routes } from "@/state/router";
import { useInsufficientSourceBalance } from "./useSetMaxAmount";
import { errorAtom, ErrorType } from "@/state/errorPage";
import { ConnectedWalletContent } from "./ConnectedWalletContent";
import { skipAllBalancesAtom } from "@/state/balances";
import { useFetchAllBalances } from "@/hooks/useFetchAllBalances";
import { SwapPageAssetChainInput } from "./SwapPageAssetChainInput";
import { useGetAccount } from "@/hooks/useGetAccount";
import { useAccount } from "wagmi";
import { calculatePercentageChange } from "@/utils/number";
import { transactionHistoryAtom } from "@/state/history";
import { useCleanupDebouncedAtoms } from "./useCleanupDebouncedAtoms";
import { useUpdateAmountWhenRouteChanges } from "./useUpdateAmountWhenRouteChanges";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { useIsGoFast, useIsSwapOperation } from "@/hooks/useIsGoFast";
import { useShowCosmosLedgerWarning } from "@/hooks/useShowCosmosLedgerWarning";
import { setUser } from "@sentry/react";
import { useSettingsDrawer } from "@/hooks/useSettingsDrawer";
import { setUserId, track } from "@amplitude/analytics-browser";

export const SwapPage = () => {
  const { SettingsFooter, drawerOpen } = useSettingsDrawer();
  useAtom(onRouteUpdatedEffect);
  useAtom(onSourceAssetUpdatedEffect);

  const { data: chains } = useAtomValue(skipChainsAtom);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);
  const setDestinationAssetAmount = useSetAtom(destinationAssetAmountAtom);
  const [isWaitingForNewRoute] = useAtom(isWaitingForNewRouteAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);
  const [swapDirection] = useAtom(swapDirectionAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const insufficientBalance = useInsufficientSourceBalance();
  const setSwapExecutionState = useSetAtom(setSwapExecutionStateAtom);
  const setError = useSetAtom(errorAtom);
  const { isFetching, isPending } = useAtomValue(skipAllBalancesAtom);
  const isLoadingBalances = isFetching && isPending;
  const { data: route, isError: isRouteError, error: routeError } = useAtomValue(skipRouteAtom);
  const showCosmosLedgerWarning = useShowCosmosLedgerWarning();
  const showGoFastWarning = useAtomValue(goFastWarningAtom);
  const isGoFast = useIsGoFast(route);
  const routePreference = useAtomValue(routePreferenceAtom);
  const slippage = useAtomValue(slippageAtom);

  const setChainAddresses = useSetAtom(chainAddressesAtom);
  useFetchAllBalances();
  useCleanupDebouncedAtoms();
  useUpdateAmountWhenRouteChanges();
  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainID);
  const txHistory = useAtomValue(transactionHistoryAtom);
  const isSwapOperation = useIsSwapOperation(route);

  const { chainId: evmChainId, connector } = useAccount();
  const evmAddress = useMemo(() => {
    return evmChainId ? getAccount(String(evmChainId))?.address : undefined;
  }, [evmChainId, getAccount]);

  const getClientAsset = useCallback(
    (denom?: string, chainId?: string) => {
      if (!denom || !chainId) return;
      if (!assets) return;
      return assets.find(
        (a) => a.denom.toLowerCase() === denom.toLowerCase() && a.chainID === chainId,
      );
    },
    [assets],
  );

  const handleChangeSourceAsset = useCallback(() => {
    track("swap page: source asset button - clicked");
    NiceModal.show(Modals.AssetAndChainSelectorModal, {
      context: "source",
      onSelect: (asset: ClientAsset | null) => {
        track("swap page: source asset selected", { asset });
        // if evm chain is selected and the user is connected to an evm chain, switch the chain
        const isEvm = chains?.find((c) => c.chainID === asset?.chainID)?.chainType === "evm";
        if (isEvm && evmAddress && asset && asset.chainID !== String(evmChainId) && connector) {
          connector.switchChain?.({
            chainId: Number(asset.chainID),
          });
        }
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        setSourceAssetAmount("");
        setDestinationAssetAmount("");
        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
    });
  }, [
    chains,
    connector,
    evmAddress,
    evmChainId,
    setDestinationAssetAmount,
    setSourceAsset,
    setSourceAssetAmount,
  ]);

  const handleChangeSourceChain = useCallback(() => {
    track("swap page: source chain button - clicked");
    NiceModal.show(Modals.AssetAndChainSelectorModal, {
      context: "source",
      onSelect: (asset: ClientAsset | null) => {
        track("swap page: source chain selected", { asset });
        // if evm chain is selected and the user is connected to an evm chain, switch the chain
        const isEvm = chains?.find((c) => c.chainID === asset?.chainID)?.chainType === "evm";
        if (isEvm && evmAddress && asset && asset.chainID !== String(evmChainId) && connector) {
          connector.switchChain?.({
            chainId: Number(asset.chainID),
          });
        }
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
      selectedAsset: getClientAsset(sourceAsset?.denom, sourceAsset?.chainID),
      selectChain: true,
    });
  }, [
    chains,
    connector,
    evmAddress,
    evmChainId,
    getClientAsset,
    setSourceAsset,
    sourceAsset?.chainID,
    sourceAsset?.denom,
  ]);

  const handleChangeDestinationAsset = useCallback(() => {
    track("swap page: destination asset button - clicked");
    NiceModal.show(Modals.AssetAndChainSelectorModal, {
      context: "destination",
      onSelect: (asset: ClientAsset | null) => {
        track("swap page: destination asset selected", { asset });
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
    });
  }, [setDestinationAsset]);

  const handleChangeDestinationChain = useCallback(() => {
    track("swap page: destination chain button - clicked");
    NiceModal.show(Modals.AssetAndChainSelectorModal, {
      context: "destination",
      onSelect: (asset: ClientAsset | null) => {
        track("swap page: destination chain selected", { asset });
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
      selectedAsset: getClientAsset(destinationAsset?.denom, destinationAsset?.chainID),
      selectChain: true,
    });
  }, [destinationAsset?.chainID, destinationAsset?.denom, getClientAsset, setDestinationAsset]);

  const priceChangePercentage = useMemo(() => {
    if (!route?.usdAmountIn || !route?.usdAmountOut || isWaitingForNewRoute) {
      return;
    }

    return calculatePercentageChange(route.usdAmountIn, route.usdAmountOut);
  }, [isWaitingForNewRoute, route?.usdAmountIn, route?.usdAmountOut]);

  const swapButton = useMemo(() => {
    if (!sourceAsset?.chainID) {
      return <MainButton label="Please select a source asset" icon={ICONS.swap} disabled />;
    }

    if (!sourceAccount?.address) {
      return (
        <MainButton
          label="Connect Wallet"
          icon={ICONS.plus}
          onClick={() => {
            track("swap page: connect wallet button - clicked");
            if (!sourceAsset?.chainID) {
              NiceModal.show(Modals.ConnectedWalletModal);
            } else {
              NiceModal.show(Modals.WalletSelectorModal, {
                chainId: sourceAsset?.chainID,
              });
            }
          }}
        />
      );
    }

    if (!destinationAsset?.chainID) {
      return <MainButton label="Please select a destination asset" icon={ICONS.swap} disabled />;
    }

    if (!sourceAsset?.amount && !destinationAsset?.amount) {
      return <MainButton label="Please enter a valid amount" icon={ICONS.swap} disabled />;
    }

    if (isWaitingForNewRoute) {
      return <MainButton label="Finding best route" loading />;
    }

    if (isRouteError) {
      // special case for multi-tx routes on mobile
      const errMsg = routeError?.message.startsWith("no single-tx routes found")
        ? "Multiple signature routes are currently only supported on the Skip:Go desktop app"
        : routeError?.message;
      return (
        <MainButton label={errMsg ?? "No routes found"} disabled fontSize={errMsg ? 18 : 24} />
      );
    }
    if (isLoadingBalances) {
      return <MainButton label="Fetching balances" loading icon={ICONS.swap} />;
    }
    if (insufficientBalance) {
      return <MainButton label="Insufficient balance" disabled icon={ICONS.swap} />;
    }

    const onClick = () => {
      track("swap page: continue button - clicked", {
        route,
        type: isSwapOperation ? "swap" : "send",
        routePreference,
        slippage,
      });
      setUserId(sourceAccount?.address);
      if (showCosmosLedgerWarning) {
        track("error page: cosmos ledger warning", { route });
        setError({
          errorType: ErrorType.CosmosLedgerWarning,
          onClickBack: () => {
            setError(undefined);
          },
        });
        return;
      }
      if (route?.warning?.type === "BAD_PRICE_WARNING" && Number(priceChangePercentage ?? 0) < 0) {
        track("error page: bad price warning", { route });
        setError({
          errorType: ErrorType.BadPriceWarning,
          onClickContinue: () => {
            setError(undefined);
            setChainAddresses({});
            setCurrentPage(Routes.SwapExecutionPage);
            setSwapExecutionState();
          },
          onClickBack: () => {
            setError(undefined);
          },
          route: { ...route },
        });
        return;
      }

      if (route?.warning?.type === "LOW_INFO_WARNING") {
        track("error page: low info warning", { route });
        setError({
          errorType: ErrorType.LowInfoWarning,
          onClickContinue: () => {
            setError(undefined);
            setChainAddresses({});
            setCurrentPage(Routes.SwapExecutionPage);
            setSwapExecutionState();
          },
          onClickBack: () => {
            setError(undefined);
          },
          route: { ...route },
        });
        return;
      }

      if (showGoFastWarning && isGoFast) {
        track("error page: go fast warning", { route });
        setError({
          errorType: ErrorType.GoFastWarning,
          onClickContinue: () => {
            setError(undefined);
            setChainAddresses({});
            setCurrentPage(Routes.SwapExecutionPage);
            setSwapExecutionState();
          },
          onClickBack: () => {
            setCurrentPage(Routes.SwapPage);
            setError(undefined);
          },
        });
        return;
      }
      setChainAddresses({});
      setCurrentPage(Routes.SwapExecutionPage);
      setUser({ username: sourceAccount?.address });
      setSwapExecutionState();
    };

    return (
      <MainButton
        label={isSwapOperation ? "Swap" : "Send"}
        icon={ICONS.swap}
        disabled={!route}
        onClick={onClick}
      />
    );
  }, [
    sourceAsset?.chainID,
    sourceAsset?.amount,
    sourceAccount?.address,
    destinationAsset?.chainID,
    destinationAsset?.amount,
    isWaitingForNewRoute,
    isRouteError,
    isLoadingBalances,
    insufficientBalance,
    isSwapOperation,
    route,
    routeError?.message,
    routePreference,
    slippage,
    showCosmosLedgerWarning,
    priceChangePercentage,
    showGoFastWarning,
    isGoFast,
    setChainAddresses,
    setCurrentPage,
    setSwapExecutionState,
    setError,
  ]);

  return (
    <Column
      gap={5}
      style={{
        opacity: drawerOpen ? 0.3 : 1,
      }}
    >
      <SwapPageHeader
        leftButton={
          txHistory.length === 0
            ? undefined
            : {
                label: "History",
                icon: ICONS.history,
                onClick: () => {
                  track("swap page: history button - clicked");
                  setCurrentPage(Routes.TransactionHistoryPage);
                },
              }
        }
        rightContent={sourceAccount ? <ConnectedWalletContent /> : null}
      />
      <Column align="center">
        <SwapPageAssetChainInput
          selectedAsset={sourceAsset}
          handleChangeAsset={handleChangeSourceAsset}
          handleChangeChain={handleChangeSourceChain}
          isWaitingToUpdateInputValue={swapDirection === "swap-out" && isWaitingForNewRoute}
          value={sourceAsset?.amount}
          usdValue={route?.usdAmountIn}
          onChangeValue={(v) => {
            track("swap page: source asset amount input - changed", { amount: v });
            setSourceAssetAmount(v);
          }}
          context="source"
          disabled={sourceAsset?.locked}
        />
        <SwapPageBridge />
        <SwapPageAssetChainInput
          selectedAsset={destinationAsset}
          handleChangeAsset={handleChangeDestinationAsset}
          handleChangeChain={handleChangeDestinationChain}
          isWaitingToUpdateInputValue={swapDirection === "swap-in" && isWaitingForNewRoute}
          usdValue={route?.usdAmountOut}
          value={destinationAsset?.amount}
          priceChangePercentage={Number(priceChangePercentage)}
          badPriceWarning={route?.warning?.type === "BAD_PRICE_WARNING"}
          onChangeValue={(v) => {
            track("swap page: destination asset amount input - changed", { amount: v });
            setDestinationAssetAmount(v);
          }}
          context="destination"
          disabled={destinationAsset?.locked}
        />
      </Column>
      {swapButton}
      <SettingsFooter />
    </Column>
  );
};
