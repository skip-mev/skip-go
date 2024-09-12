import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { AssetChainInput } from "@/components/AssetChainInput";
import { Column } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText } from "@/components/Typography";
import { ICONS } from "@/icons";
import {
  skipAssetsAtom,
  getChainsContainingAsset,
  skipChainsAtom,
  skipRouteAtom,
  isWaitingForNewRouteRequestAtom,
} from "@/state/skipClient";
import {
  sourceAssetAtom,
  destinationAssetAtom,
  swapDirectionAtom,
} from "@/state/swapPage";
import { TokenAndChainSelectorModal } from "@/modals/TokenAndChainSelectorModal/TokenAndChainSelectorModal";
import { SwapPageSettings } from "./SwapPageSettings";
import { SwapPageFooter } from "./SwapPageFooter";
import { SwapPageBridge } from "./SwapPageBridge";
import { SwapPageHeader } from "./SwapPageHeader";
import { useModal } from "@/components/Modal";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";

const sourceAssetBalance = 125;

export const SwapPage = () => {
  const [container, setContainer] = useState<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);
  const setSwapDirection = useSetAtom(swapDirectionAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom);
  const { isLoading: isRouteLoading, isError: isRouteError, error: routeError, dataUpdatedAt } = useAtomValue(skipRouteAtom);
  const swapFlowSettings = useModal(SwapPageSettings);
  const tokenAndChainSelectorFlow = useModal(TokenAndChainSelectorModal);
  const [isWaitingForNewRouteRequest, setIsWaitingForNewRouteRequest] = useAtom(isWaitingForNewRouteRequestAtom);

  // useEffect(() => {
  //   if (dataUpdatedAt) {
  //     console.log(dataUpdatedAt);
  //     setIsWaitingForNewRouteRequest(false);
  //   }
  // }, [dataUpdatedAt, setIsWaitingForNewRouteRequest]);

  const sourceDetails = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    amount: sourceAsset?.amount,
  });

  const destinationDetails = useGetAssetDetails({
    assetDenom: destinationAsset?.denom,
    amount: destinationAsset?.amount,
  });

  const chainsContainingSourceAsset = useMemo(() => {
    if (!chains || !assets || !sourceAsset?.symbol) return;
    const result = getChainsContainingAsset(
      sourceAsset?.symbol,
      assets,
      chains
    );
    return result;
  }, [assets, sourceAsset?.symbol, chains]);

  const chainsContainingDestinationAsset = useMemo(() => {
    if (!chains || !assets || !destinationAsset?.symbol) return;
    const result = getChainsContainingAsset(
      destinationAsset?.symbol,
      assets,
      chains
    );
    return result;
  }, [assets, destinationAsset?.symbol, chains]);

  const handleChangeSourceAsset = useCallback(() => {
    tokenAndChainSelectorFlow.show({
      onSelect: (asset) => {
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorFlow.hide();
      },
    });
  }, [setSourceAsset, tokenAndChainSelectorFlow]);

  const handleChangeSourceChain = useCallback(() => {
    if (!chainsContainingSourceAsset) return;

    return tokenAndChainSelectorFlow.show({
      onSelect: (asset) => {
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorFlow.hide();
      },
      chainsContainingAsset: chainsContainingSourceAsset,
      asset: sourceAsset,
    });
  }, [
    chainsContainingSourceAsset,
    setSourceAsset,
    sourceAsset,
    tokenAndChainSelectorFlow,
  ]);

  const handleChangeDestinationAsset = useCallback(() => {
    tokenAndChainSelectorFlow.show({
      onSelect: (asset) => {
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorFlow.hide();
      },
    });
  }, [setDestinationAsset, tokenAndChainSelectorFlow]);

  const handleChangeDestinationChain = useCallback(() => {
    if (!chainsContainingDestinationAsset) return;

    return tokenAndChainSelectorFlow.show({
      onSelect: (asset) => {
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorFlow.hide();
      },
      chainsContainingAsset: chainsContainingDestinationAsset,
      asset: destinationAsset,
    });
  }, [
    chainsContainingDestinationAsset,
    destinationAsset,
    setDestinationAsset,
    tokenAndChainSelectorFlow,
  ]);

  const swapButton = useMemo(() => {
    if (isRouteLoading) {
      return <MainButton label="Finding Best Route..." loading={true} />;
    }

    if (isRouteError) {
      return <MainButton label={routeError.message} disabled={true} />;
    }

    return <MainButton label="Connect Wallet" icon={ICONS.plus} />;
  }, [isRouteLoading, isRouteError, routeError]);

  const priceChangePercentage = useMemo(() => {
    if (!sourceDetails.usdAmount || !destinationDetails.usdAmount) return;
    const difference = destinationDetails.usdAmount - sourceDetails.usdAmount;
    const average = (sourceDetails.usdAmount + destinationDetails.usdAmount) / 2;
    const percentageDifference = (difference / average) * 100;

    return parseFloat(percentageDifference.toFixed(2));
  }, [destinationDetails, sourceDetails]);

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
          }}
          rightButton={{
            label: "Max",
          }}
          rightContent={
            sourceAssetBalance ? (
              <SmallText> Balance: {sourceAssetBalance} </SmallText>
            ) : undefined
          }
        />
        <Column align="center">
          <AssetChainInput
            selectedAssetDenom={sourceAsset?.denom}
            handleChangeAsset={handleChangeSourceAsset}
            handleChangeChain={handleChangeSourceChain}
            value={sourceAsset?.amount}
            onChangeValue={(newValue) => {
              setSourceAsset((old) => ({ ...old, amount: newValue }));
              setSwapDirection("swap-in");
            }}
          />
          <SwapPageBridge />
          <AssetChainInput
            selectedAssetDenom={destinationAsset?.denom}
            handleChangeAsset={handleChangeDestinationAsset}
            handleChangeChain={handleChangeDestinationChain}
            value={destinationAsset?.amount}
            priceChangePercentage={priceChangePercentage}
            onChangeValue={(newValue) => {
              setDestinationAsset((old) => ({ ...old, amount: newValue }));
              setSwapDirection("swap-out");
            }}
          />
        </Column>
        {swapButton}
        <SwapPageFooter
          showRouteInfo
          onClick={() =>
            swapFlowSettings.show({
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
        ref={(element) => element && setContainer(element)}
      ></div>
    </>
  );
};
