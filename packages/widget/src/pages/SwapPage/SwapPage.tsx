import { useCallback, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { ClientAsset, skipAssetsAtom } from "@/state/skipClient";
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
  isInvertingSwapAtom,
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
import { useSwitchEvmChain } from "@/hooks/useSwitchEvmChain";
import { StyledAnimatedBorder } from "../SwapExecutionPage/SwapExecutionPageRouteDetailedRow";

export const SwapPage = () => {
  const { SettingsFooter, drawerOpen } = useSettingsDrawer();

  useAtom(onRouteUpdatedEffect);
  useAtom(onSourceAssetUpdatedEffect);

  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);
  const setDestinationAssetAmount = useSetAtom(destinationAssetAmountAtom);
  const [isWaitingForNewRoute] = useAtom(isWaitingForNewRouteAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);
  const [swapDirection] = useAtom(swapDirectionAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const isInvertingSwap = useAtomValue(isInvertingSwapAtom);
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
  const switchEvmChainId = useSwitchEvmChain();
  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainID);
  const txHistory = useAtomValue(transactionHistoryAtom);
  const isSwapOperation = useIsSwapOperation(route);

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
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        switchEvmChainId(asset?.chainID);
        setSourceAssetAmount("");
        setDestinationAssetAmount("");
        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
    });
  }, [setDestinationAssetAmount, setSourceAsset, setSourceAssetAmount, switchEvmChainId]);

  const handleChangeSourceChain = useCallback(() => {
    track("swap page: source chain button - clicked");
    NiceModal.show(Modals.AssetAndChainSelectorModal, {
      context: "source",
      onSelect: (asset: ClientAsset | null) => {
        track("swap page: source chain selected", { asset });
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        switchEvmChainId(asset?.chainID);
        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
      selectedAsset: getClientAsset(sourceAsset?.denom, sourceAsset?.chainID),
      selectChain: true,
    });
  }, [getClientAsset, setSourceAsset, sourceAsset?.chainID, sourceAsset?.denom, switchEvmChainId]);

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
    if (!sourceAccount?.address && !isInvertingSwap) {
      return (
        <MainButton
          label="Connect Wallet"
          icon={ICONS.plus}
          onClick={() => {
            track("swap page: connect wallet button - clicked");
            if (sourceAsset?.chainID) {
              NiceModal.show(Modals.WalletSelectorModal, {
                chainId: sourceAsset?.chainID,
              });
            } else {
              NiceModal.show(Modals.ConnectedWalletModal);
            }
          }}
        />
      );
    }

    if (!sourceAsset?.chainID) {
      return <MainButton label="Please select a source asset" icon={ICONS.swap} disabled />;
    }

    if (!destinationAsset?.chainID) {
      return <MainButton label="Please select a destination asset" icon={ICONS.swap} disabled />;
    }

    const amountsUndefined = !sourceAsset?.amount && !destinationAsset?.amount;
    const amountsAreZero = sourceAsset?.amount === "0" || destinationAsset?.amount === "0";

    if (amountsUndefined || amountsAreZero) {
      return <MainButton label="Please enter a valid amount" icon={ICONS.swap} disabled />;
    }

    if (isWaitingForNewRoute) {
      return <MainButton label="Finding best route" loading />;
    }

    if (isRouteError) {
      const message = routeError?.message ?? "";
      const errMsg = message.startsWith("no single-tx routes found")
        ? "Multiple signature routes are currently only supported on the Skip:Go desktop app"
        : message;

      const fontSize = errMsg.length > 36 ? 18 : 24;
      return <MainButton label={errMsg || "No routes found"} disabled fontSize={fontSize} />;
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
      if (route?.warning?.type === "BAD_PRICE_WARNING") {
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
    isInvertingSwap,
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
    showGoFastWarning,
    isGoFast,
    setChainAddresses,
    setCurrentPage,
    setSwapExecutionState,
    setError,
  ]);

  const historyPageButton = useMemo(() => {
    if (txHistory.length === 0) return;

    const getIcon = () => {
      if (!txHistory[txHistory.length - 1]?.isSettled) {
        return (
          <StyledAnimatedBorder
            width={6}
            height={6}
            borderSize={4}
            status="pending"
            style={{
              maskImage: "radial-gradient(circle, transparent 55%, black 0%)",
            }}
          />
        );
      }
      return ICONS.history;
    };

    return {
      label: "History",
      icon: getIcon(),
      onClick: () => {
        track("swap page: history button - clicked");
        setCurrentPage(Routes.TransactionHistoryPage);
      },
    };
  }, [setCurrentPage, txHistory]);

  return (
    <Column
      gap={5}
      style={{
        opacity: drawerOpen ? 0.3 : 1,
      }}
    >
      <SwapPageHeader
        leftButton={historyPageButton}
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
