import { startTransition, useCallback, useMemo } from "react";
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
  isInvertingSwapAtom,
  preloadSigningStargateClientEffect,
} from "@/state/swapPage";
import {
  setSwapExecutionStateAtom,
  chainAddressesAtom,
  feeRouteChainAddressesAtom,
} from "@/state/swapExecutionPage";
import { SwapPageBridge } from "./SwapPageBridge";
import { currentPageAtom, Routes } from "@/state/router";
import { useInsufficientSourceBalance, useMaxAmountTokenMinusFees } from "./useSetMaxAmount";
import { errorWarningAtom, ErrorWarningType } from "@/state/errorWarning";
import { skipAllBalancesAtom } from "@/state/balances";
import { useFetchAllBalances } from "@/hooks/useFetchAllBalances";
import { SwapPageAssetChainInput } from "./SwapPageAssetChainInput";
import { useGetAccount } from "@/hooks/useGetAccount";
import { calculatePercentageChange } from "@/utils/number";
import { getFeeList, getTotalFees } from "@/utils/fees";
import { useCleanupDebouncedAtoms } from "./useCleanupDebouncedAtoms";
import { useUpdateAmountWhenRouteChanges } from "./useUpdateAmountWhenRouteChanges";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { useIsGoFast, useIsSwapOperation } from "@/hooks/useIsGoFast";
import { useShowCosmosLedgerWarning } from "@/hooks/useShowCosmosLedgerWarning";
import { useSettingsDrawer } from "@/hooks/useSettingsDrawer";
import { setUserId, track } from "@amplitude/analytics-browser";
import { useSwitchEvmChain } from "@/hooks/useSwitchEvmChain";
import { useGetBalance } from "@/hooks/useGetBalance";
import { SwapPageHeader } from "./SwapPageHeader";
import { useConnectToMissingCosmosChain } from "./useConnectToMissingCosmosChain";
import { callbacksAtom } from "@/state/callbacks";
import { SmallText } from "@/components/Typography";

export const SwapPage = () => {
  const { SettingsFooter, drawerOpen } = useSettingsDrawer();
  useAtom(onRouteUpdatedEffect);
  useAtom(preloadSigningStargateClientEffect);
  const { isAskingToApproveConnection } = useConnectToMissingCosmosChain();

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
  const setError = useSetAtom(errorWarningAtom);
  const { isFetching, isPending } = useAtomValue(skipAllBalancesAtom);
  const isLoadingBalances = isFetching && isPending;
  const { data: route, isError: isRouteError, error: routeError } = useAtomValue(skipRouteAtom);
  const showCosmosLedgerWarning = useShowCosmosLedgerWarning();
  const showGoFastWarning = useAtomValue(goFastWarningAtom);
  const isGoFast = useIsGoFast(route);
  const routePreference = useAtomValue(routePreferenceAtom);
  const slippage = useAtomValue(slippageAtom);
  const maxAmountMinusFees = useMaxAmountTokenMinusFees();
  const getBalance = useGetBalance();
  const callbacks = useAtomValue(callbacksAtom);

  const setChainAddresses = useSetAtom(chainAddressesAtom);
  const setFeeRouteChainAddresses = useSetAtom(feeRouteChainAddressesAtom);

  useFetchAllBalances();
  useCleanupDebouncedAtoms();
  useUpdateAmountWhenRouteChanges();
  const switchEvmchainId = useSwitchEvmChain();
  const getAccount = useGetAccount();
  const sourceAccount = getAccount(sourceAsset?.chainId);
  const isSwapOperation = useIsSwapOperation(route);

  const getClientAsset = useCallback(
    (denom?: string, chainId?: string) => {
      if (!denom || !chainId) return;
      if (!assets) return;
      return assets.find(
        (a) => a.denom?.toLowerCase() === denom.toLowerCase() && a.chainId === chainId,
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

        callbacks?.onSourceAssetUpdated?.({ chainId: asset?.chainId, denom: asset?.denom });

        switchEvmchainId(asset?.chainId);
        setSourceAssetAmount("");
        setDestinationAssetAmount("");
        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
    });
  }, [
    callbacks,
    setDestinationAssetAmount,
    setSourceAsset,
    setSourceAssetAmount,
    switchEvmchainId,
  ]);

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

        callbacks?.onSourceAssetUpdated?.({ chainId: asset?.chainId, denom: asset?.denom });

        switchEvmchainId(asset?.chainId);
        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
      selectedAsset: getClientAsset(sourceAsset?.denom, sourceAsset?.chainId),
      selectChain: true,
    });
  }, [
    callbacks,
    getClientAsset,
    setSourceAsset,
    sourceAsset?.chainId,
    sourceAsset?.denom,
    switchEvmchainId,
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

        callbacks?.onDestinationAssetUpdated?.({ chainId: asset?.chainId, denom: asset?.denom });

        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
    });
  }, [callbacks, setDestinationAsset]);

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

        callbacks?.onDestinationAssetUpdated?.({ chainId: asset?.chainId, denom: asset?.denom });

        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
      selectedAsset: getClientAsset(destinationAsset?.denom, destinationAsset?.chainId),
      selectChain: true,
    });
  }, [
    callbacks,
    destinationAsset?.chainId,
    destinationAsset?.denom,
    getClientAsset,
    setDestinationAsset,
  ]);

  const priceChangePercentage = useMemo(() => {
    if (!route?.usdAmountIn || !route?.usdAmountOut || isWaitingForNewRoute) {
      return;
    }

    return calculatePercentageChange(route.usdAmountIn, route.usdAmountOut);
  }, [isWaitingForNewRoute, route?.usdAmountIn, route?.usdAmountOut]);

  const fees = useMemo(() => (route ? getFeeList(route) : []), [route]);
  const feeLabel = useMemo(() => {
    const formattedUsdAmount = getTotalFees(fees)?.formattedUsdAmount;

    if (formattedUsdAmount) {
      return (
        <>
          <SmallText color="inherit">{formattedUsdAmount} in fees</SmallText>
        </>
      );
    }

    return (
      <>
        <SmallText color="inherit">no fees</SmallText>
      </>
    );
  }, [fees]);

  const feeWarning = useMemo(() => {
    if (!route?.usdAmountIn || !route?.usdAmountOut) return false;
    return parseFloat(route.usdAmountOut) < parseFloat(route.usdAmountIn) * 0.9;
  }, [route?.usdAmountIn, route?.usdAmountOut]);

  const swapButton = useMemo(() => {
    const computeFontSize = (label: string) => (label.length > 36 ? 18 : 24);

    if (isAskingToApproveConnection) {
      return <MainButton label="Approving connection..." loading />;
    }

    if (!sourceAccount?.address && !isInvertingSwap) {
      return (
        <MainButton
          label="Connect Wallet"
          icon={ICONS.plus}
          onClick={() => {
            track("swap page: connect wallet button - clicked");
            if (sourceAsset?.chainId) {
              NiceModal.show(Modals.WalletSelectorModal, {
                chainId: sourceAsset?.chainId,
              });
            } else {
              NiceModal.show(Modals.ConnectedWalletModal);
            }
          }}
        />
      );
    }

    if (!sourceAsset?.chainId) {
      return <MainButton label="Please select a source asset" icon={ICONS.swap} disabled />;
    }

    if (!destinationAsset?.chainId) {
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

      const label = errMsg || "No routes found";
      return <MainButton label={label} disabled fontSize={computeFontSize(label)} />;
    }

    if (isLoadingBalances) {
      const label = "Fetching balances";
      return (
        <MainButton label={label} loading icon={ICONS.swap} fontSize={computeFontSize(label)} />
      );
    }

    if (insufficientBalance) {
      const sourceAssetBalance = getBalance(
        sourceAsset?.chainId,
        sourceAsset?.denom,
      )?.formattedAmount;
      const insufficientBalanceForGas = Number(sourceAssetBalance) > Number(maxAmountMinusFees);
      const label = insufficientBalanceForGas
        ? "Insufficient balance for gas"
        : "Insufficient balance";

      return (
        <MainButton label={label} disabled icon={ICONS.swap} fontSize={computeFontSize(label)} />
      );
    }

    const onClick = () => {
      track("swap page: continue button - clicked", {
        route,
        type: isSwapOperation ? "swap" : "send",
        routePreference,
        slippage,
      });

      const navigateToSwapExecutionPage = () => {
        startTransition(() => {
          setError(undefined);
          setChainAddresses({});
          setFeeRouteChainAddresses({});
          setSwapExecutionState();
          setCurrentPage(Routes.SwapExecutionPage);
        });
      };
      setUserId(sourceAccount?.address);
      if (showCosmosLedgerWarning) {
        track("warning page: cosmos ledger", { route });
        setError({
          errorWarningType: ErrorWarningType.CosmosLedgerWarning,
          onClickBack: () => {
            setError(undefined);
          },
        });
        return;
      }
      if (route?.warning?.type === "BAD_PRICE_WARNING") {
        track("warning page: bad price", { route });
        setError({
          errorWarningType: ErrorWarningType.BadPriceWarning,
          onClickContinue: () => {
            navigateToSwapExecutionPage();
          },
          onClickBack: () => {
            setError(undefined);
          },
          route: { ...route },
        });
        return;
      }

      if (route?.warning?.type === "LOW_INFO_WARNING") {
        track("warning page: low info", { route });
        setError({
          errorWarningType: ErrorWarningType.LowInfoWarning,
          onClickContinue: () => {
            navigateToSwapExecutionPage();
          },
          onClickBack: () => {
            setError(undefined);
          },
          route: { ...route },
        });
        return;
      }

      if (showGoFastWarning && isGoFast) {
        track("warning page: go fast", { route });
        setError({
          errorWarningType: ErrorWarningType.GoFastWarning,
          onClickContinue: () => {
            navigateToSwapExecutionPage();
          },
          onClickBack: () => {
            setCurrentPage(Routes.SwapPage);
            setError(undefined);
          },
        });
        return;
      }
      navigateToSwapExecutionPage();
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
    isAskingToApproveConnection,
    sourceAccount?.address,
    isInvertingSwap,
    sourceAsset?.chainId,
    sourceAsset?.amount,
    sourceAsset?.denom,
    destinationAsset?.chainId,
    destinationAsset?.amount,
    isWaitingForNewRoute,
    isRouteError,
    isLoadingBalances,
    insufficientBalance,
    isSwapOperation,
    route,
    routeError?.message,
    getBalance,
    maxAmountMinusFees,
    routePreference,
    slippage,
    showCosmosLedgerWarning,
    showGoFastWarning,
    isGoFast,
    setChainAddresses,
    setFeeRouteChainAddresses,
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
      <SwapPageHeader />
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
          feeLabel={feeLabel}
          feeWarning={feeWarning}
          onChangeValue={(v) => {
            track("swap page: destination asset amount input - changed", { amount: v });
            setDestinationAssetAmount(v);
          }}
          disabled={destinationAsset?.locked}
        />
      </Column>
      {swapButton}
      <SettingsFooter />
    </Column>
  );
};
