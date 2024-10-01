import { useCallback, useMemo, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { AssetChainInput } from "@/components/AssetChainInput";
import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import {
  skipAssetsAtom,
  skipRouteAtom,
} from "@/state/skipClient";
import {
  sourceAssetAtom,
  destinationAssetAtom,
  swapDirectionAtom,
  sourceAssetAmountAtom,
  destinationAssetAmountAtom,
  isWaitingForNewRouteAtom,
} from "@/state/swapPage";
import {
  setSwapExecutionStateAtom,
  chainAddressesAtom,
} from "@/state/swapExecutionPage";
import { TokenAndChainSelectorModal } from "@/modals/TokenAndChainSelectorModal/TokenAndChainSelectorModal";
import { SwapDetailModal } from "./SwapDetailModal";
import { SwapPageFooter } from "./SwapPageFooter";
import { SwapPageBridge } from "./SwapPageBridge";
import { SwapPageHeader } from "./SwapPageHeader";
import { useModal } from "@/components/Modal";
import { WalletSelectorModal } from "@/modals/WalletSelectorModal/WalletSelectorModal";
import { currentPageAtom, Routes } from "@/state/router";
import { useInsufficientSourceBalance } from "./useSetMaxAmount";
import { TransactionHistoryModal } from "@/modals/TransactionHistoryModal/TransactionHistoryModal";
import { errorAtom, ErrorType } from "@/state/errorPage";
import { ConnectedWalletContent } from "./ConnectedWalletContent";
import { useFetchSourceBalance } from "@/hooks/useFetchSourceBalance";
import { skipSourceBalanceAtom } from "@/state/balances";
import { useFetchAllBalances } from "@/hooks/useFetchAllBalances";

export const SwapPage = () => {
  const [container, setContainer] = useState<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);
  const setDestinationAssetAmount = useSetAtom(destinationAssetAmountAtom);
  const [isWaitingForNewRoute] = useAtom(isWaitingForNewRouteAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);
  const [swapDirection] = useAtom(swapDirectionAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const {
    data: route,
    isError: isRouteError,
    error: routeError,
  } = useAtomValue(skipRouteAtom);
  const swapDetailsModal = useModal(SwapDetailModal);
  const tokenAndChainSelectorModal = useModal(TokenAndChainSelectorModal);
  const selectWalletmodal = useModal(WalletSelectorModal);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const historyModal = useModal(TransactionHistoryModal);
  const insufficientBalance = useInsufficientSourceBalance();
  const setSwapExecutionState = useSetAtom(setSwapExecutionStateAtom);
  const setError = useSetAtom(errorAtom);
  const { isLoading: isLoadingBalances } = useAtomValue(skipSourceBalanceAtom);

  const setChainAddresses = useSetAtom(chainAddressesAtom);
  useFetchAllBalances();
  const sourceAccount = useFetchSourceBalance();

  const getClientAsset = useCallback(
    (denom?: string, chainId?: string) => {
      if (!denom || !chainId) return;
      if (!assets) return;
      return assets.find((a) => a.denom === denom && a.chainID === chainId);
    },
    [assets]
  );

  const handleChangeSourceAsset = useCallback(() => {
    tokenAndChainSelectorModal.show({
      onSelect: (asset) => {
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorModal.hide();
      },
    });
  }, [setSourceAsset, tokenAndChainSelectorModal]);

  const handleChangeSourceChain = useCallback(() => {
    tokenAndChainSelectorModal.show({
      onSelect: (asset) => {
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorModal.hide();
      },
      selectedAsset: getClientAsset(sourceAsset?.denom, sourceAsset?.chainID),
      networkSelection: true,
    });
  }, [
    getClientAsset,
    setSourceAsset,
    sourceAsset?.chainID,
    sourceAsset?.denom,
    tokenAndChainSelectorModal,
  ]);

  const handleChangeDestinationAsset = useCallback(() => {
    tokenAndChainSelectorModal.show({
      onSelect: (asset) => {
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorModal.hide();
      },
    });
  }, [setDestinationAsset, tokenAndChainSelectorModal]);

  const handleChangeDestinationChain = useCallback(() => {
    tokenAndChainSelectorModal.show({
      onSelect: (asset) => {
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorModal.hide();
      },
      selectedAsset: getClientAsset(
        destinationAsset?.denom,
        destinationAsset?.chainID
      ),
      networkSelection: true,
    });
  }, [
    destinationAsset?.chainID,
    destinationAsset?.denom,
    getClientAsset,
    setDestinationAsset,
    tokenAndChainSelectorModal,
  ]);

  const swapButton = useMemo(() => {
    if (isWaitingForNewRoute) {
      return <MainButton label="Finding Best Route..." loading />;
    }

    if (isRouteError) {
      return <MainButton label={routeError.message} disabled />;
    }
    if (!sourceAccount?.address) {
      return (
        <MainButton
          disabled={!sourceAsset?.chainID}
          label="Connect Wallet"
          icon={ICONS.plus}
          onClick={() => {
            selectWalletmodal.show({
              chainId: sourceAsset?.chainID,
            });
          }}
        />
      );
    }
    if (isLoadingBalances) {
      return <MainButton label="Fetching balances" loading icon={ICONS.swap} />;
    }
    if (insufficientBalance) {
      return (
        <MainButton label="Insufficient balance" disabled icon={ICONS.swap} />
      );
    }
    return (
      <MainButton
        label="Swap"
        icon={ICONS.swap}
        disabled={!route}
        onClick={() => {
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
          setSwapExecutionState();
        }}
      />
    );
  }, [
    isWaitingForNewRoute,
    isRouteError,
    sourceAccount?.address,
    isLoadingBalances,
    insufficientBalance,
    route,
    routeError?.message,
    sourceAsset?.chainID,
    selectWalletmodal,
    setChainAddresses,
    setCurrentPage,
    setSwapExecutionState,
    setError,
  ]);

  const priceChangePercentage = useMemo(() => {
    if (!route?.usdAmountIn || !route?.usdAmountOut || isWaitingForNewRoute) {
      return;
    }

    const difference = Number(route.usdAmountOut) - Number(route.usdAmountIn);
    const average =
      (Number(route.usdAmountIn) + Number(route.usdAmountOut)) / 2;
    const percentageDifference = (difference / average) * 100;

    return parseFloat(percentageDifference.toFixed(2));
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
          leftButton={{
            label: "History",
            icon: ICONS.history,
            onClick: () => historyModal.show(),
          }}
          rightContent={<ConnectedWalletContent />}
        />
        <Column align="center">
          <AssetChainInput
            selectedAsset={sourceAsset}
            handleChangeAsset={handleChangeSourceAsset}
            handleChangeChain={handleChangeSourceChain}
            isWaitingToUpdateInputValue={
              swapDirection === "swap-out" && isWaitingForNewRoute
            }
            value={sourceAsset?.amount}
            usdValue={route?.usdAmountIn}
            onChangeValue={setSourceAssetAmount}
          />
          <SwapPageBridge />
          <AssetChainInput
            selectedAsset={destinationAsset}
            handleChangeAsset={handleChangeDestinationAsset}
            handleChangeChain={handleChangeDestinationChain}
            isWaitingToUpdateInputValue={
              swapDirection === "swap-in" && isWaitingForNewRoute
            }
            usdValue={route?.usdAmountOut}
            value={destinationAsset?.amount}
            priceChangePercentage={priceChangePercentage}
            badPriceWarning={route?.warning?.type === "BAD_PRICE_WARNING"}
            onChangeValue={setDestinationAssetAmount}
          />
        </Column>
        {swapButton}
        <SwapPageFooter
          showRouteInfo
          disabled={isRouteError || isWaitingForNewRoute}
          showEstimatedTime
          onClick={() =>
            swapDetailsModal.show({
              drawer: true,
              container,
              onOpenChange: (open: boolean) =>
                open ? setDrawerOpen(true) : setDrawerOpen(false),
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
