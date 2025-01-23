import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { ClientAsset, skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { routeConfigAtom, skipRouteAtom } from "@/state/route";
import {
  sourceAssetAtom,
  destinationAssetAtom,
  swapDirectionAtom,
  sourceAssetAmountAtom,
  destinationAssetAmountAtom,
  isWaitingForNewRouteAtom,
} from "@/state/swapPage";
import { setSwapExecutionStateAtom, chainAddressesAtom } from "@/state/swapExecutionPage";
import { SwapPageFooter } from "./SwapPageFooter";
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
import { useIsSwapOperation } from "@/hooks/useIsGoFast";
import { useShowCosmosLedgerWarning } from "@/hooks/useShowCosmosLedgerWarning";
import { setUser } from "@sentry/react";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { useMobileRouteConfig } from "@/hooks/useMobileRouteConfig";

export const SwapPage = () => {
  const [container, setContainer] = useState<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
  const { isLoading: isLoadingBalances } = useAtomValue(skipAllBalancesAtom);
  const { data: route, isError: isRouteError, error: routeError } = useAtomValue(skipRouteAtom);
  const showCosmosLedgerWarning = useShowCosmosLedgerWarning();

  const setChainAddresses = useSetAtom(chainAddressesAtom);
  useFetchAllBalances();
  useCleanupDebouncedAtoms();
  useUpdateAmountWhenRouteChanges();
  useMobileRouteConfig();
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
    NiceModal.show(Modals.AssetAndChainSelectorModal, {
      context: "source",
      onSelect: (asset: ClientAsset | null) => {
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
    NiceModal.show(Modals.AssetAndChainSelectorModal, {
      context: "source",
      onSelect: (asset: ClientAsset | null) => {
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
    NiceModal.show(Modals.AssetAndChainSelectorModal, {
      context: "destination",
      onSelect: (asset: ClientAsset | null) => {
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        NiceModal.hide(Modals.AssetAndChainSelectorModal);
      },
    });
  }, [setDestinationAsset]);

  const handleChangeDestinationChain = useCallback(() => {
    NiceModal.show(Modals.AssetAndChainSelectorModal, {
      context: "destination",
      onSelect: (asset: ClientAsset | null) => {
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

  const swapButton = useMemo(() => {
    if (!sourceAccount?.address) {
      return (
        <MainButton
          label="Connect Wallet"
          icon={ICONS.plus}
          onClick={() => {
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

    if (!sourceAsset?.chainID) {
      return <MainButton label="Please select a source asset" icon={ICONS.swap} disabled />;
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
      return <MainButton label={routeError?.message ?? "No routes found"} disabled />;
    }
    if (isLoadingBalances) {
      return <MainButton label="Fetching balances" loading icon={ICONS.swap} />;
    }
    if (insufficientBalance) {
      return <MainButton label="Insufficient balance" disabled icon={ICONS.swap} />;
    }
    return (
      <MainButton
        label={isSwapOperation ? "Swap" : "Send"}
        icon={ICONS.swap}
        disabled={!route}
        onClick={() => {
          if (showCosmosLedgerWarning) {
            setError({
              errorType: ErrorType.CosmosLedgerWarning,
              onClickBack: () => {
                setError(undefined);
              },
            });
            return;
          }
          if (route?.warning?.type === "BAD_PRICE_WARNING") {
            setError({
              errorType: ErrorType.TradeWarning,
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
          setChainAddresses({});
          setCurrentPage(Routes.SwapExecutionPage);
          setUser({ username: sourceAccount?.address });
          setSwapExecutionState();
        }}
      />
    );
  }, [
    sourceAsset?.chainID,
    isSwapOperation,
    sourceAsset?.amount,
    destinationAsset?.chainID,
    destinationAsset?.amount,
    isWaitingForNewRoute,
    sourceAccount?.address,
    isRouteError,
    isLoadingBalances,
    insufficientBalance,
    route,
    routeError?.message,
    showCosmosLedgerWarning,
    setChainAddresses,
    setCurrentPage,
    setSwapExecutionState,
    setError,
  ]);

  const priceChangePercentage = useMemo(() => {
    if (!route?.usdAmountIn || !route?.usdAmountOut || isWaitingForNewRoute) {
      return;
    }

    return calculatePercentageChange(route.usdAmountIn, route.usdAmountOut);
  }, [isWaitingForNewRoute, route?.usdAmountIn, route?.usdAmountOut]);

  return (
    <>
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
                  onClick: () => setCurrentPage(Routes.TransactionHistoryPage),
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
            onChangeValue={setSourceAssetAmount}
            context="source"
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
            onChangeValue={setDestinationAssetAmount}
            context="destination"
          />
        </Column>
        {swapButton}
        <SwapPageFooter
          showRouteInfo
          disabled={isRouteError || isWaitingForNewRoute}
          showEstimatedTime
          onClick={() =>
            NiceModal.show(Modals.SwapSettingsDrawer, {
              drawer: true,
              container,
              onOpenChange: (open: boolean) => (open ? setDrawerOpen(true) : setDrawerOpen(false)),
            })
          }
        />
      </Column>
      <div
        id="swap-flow-settings-container"
        ref={(element) => {
          if (element && container === undefined) {
            setContainer(element);
          }
        }}
      ></div>
    </>
  );
};
