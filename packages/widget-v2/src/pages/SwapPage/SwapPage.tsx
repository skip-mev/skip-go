import { useCallback, useMemo, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { AssetChainInput } from "@/components/AssetChainInput";
import { Column, Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import {
  skipAssetsAtom,
  getChainsContainingAsset,
  skipChainsAtom,
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
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { TokenAndChainSelectorModal } from "@/modals/TokenAndChainSelectorModal/TokenAndChainSelectorModal";
import { SwapDetailModal } from "./SwapDetailModal";
import { SwapPageFooter } from "./SwapPageFooter";
import { SwapPageBridge } from "./SwapPageBridge";
import { SwapPageHeader } from "./SwapPageHeader";
import { useModal } from "@/components/Modal";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { WalletSelectorModal } from "@/modals/WalletSelectorModal/WalletSelectorModal";
import { useAccount } from "@/hooks/useAccount";
import { currentPageAtom, Routes } from "@/state/router";
import { GhostButton, GhostButtonProps } from "@/components/Button";
import { ConnectedWalletModal } from "@/modals/ConnectedWalletModal/ConnectedWalletModal";
import styled, { css } from "styled-components";

export const SwapPage = () => {
  const [container, setContainer] = useState<HTMLDivElement>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);
  const setDestinationAssetAmount = useSetAtom(destinationAssetAmountAtom);
  const [isWaitingForNewRoute] = useAtom(isWaitingForNewRouteAtom);
  const [destinationAsset, setDestinationAsset] = useAtom(destinationAssetAtom);
  const [swapDirection] = useAtom(swapDirectionAtom);
  const setSwapDirection = useSetAtom(swapDirectionAtom);
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom);
  const {
    data: route,
    isError: isRouteError,
    error: routeError,
  } = useAtomValue(skipRouteAtom);
  const swapDetailsModal = useModal(SwapDetailModal);
  const tokenAndChainSelectorModal = useModal(TokenAndChainSelectorModal);
  const selectWalletmodal = useModal(WalletSelectorModal);
  const setSwapExecutionState = useSetAtom(swapExecutionStateAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const connectedWalletModal = useModal(ConnectedWalletModal);

  const sourceAccount = useAccount(sourceAsset?.chainID);
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
    if (!chainsContainingSourceAsset) return;

    return tokenAndChainSelectorModal.show({
      onSelect: (asset) => {
        setSourceAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorModal.hide();
      },
      chainsContainingAsset: chainsContainingSourceAsset,
      asset: sourceAsset,
    });
  }, [
    chainsContainingSourceAsset,
    setSourceAsset,
    sourceAsset,
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
    if (!chainsContainingDestinationAsset) return;

    return tokenAndChainSelectorModal.show({
      onSelect: (asset) => {
        setDestinationAsset((old) => ({
          ...old,
          ...asset,
        }));
        tokenAndChainSelectorModal.hide();
      },
      chainsContainingAsset: chainsContainingDestinationAsset,
      asset: destinationAsset,
    });
  }, [
    chainsContainingDestinationAsset,
    destinationAsset,
    setDestinationAsset,
    tokenAndChainSelectorModal,
  ]);

  const swapButton = useMemo(() => {
    if (isWaitingForNewRoute) {
      return <MainButton label="Finding Best Route..." loading={true} />;
    }

    if (isRouteError) {
      return <MainButton label={routeError.message} disabled={true} />;
    }

    if (sourceAccount?.address) {
      return (
        <MainButton
          label="Swap"
          icon={ICONS.swap}
          disabled={!route}
          onClick={() => {
            setCurrentPage(Routes.SwapExecutionPage);
            setSwapExecutionState({ userAddresses: [], route });
          }}
        />
      );
    }

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
  }, [
    isWaitingForNewRoute,
    isRouteError,
    sourceAccount?.address,
    sourceAsset?.chainID,
    routeError?.message,
    route,
    setCurrentPage,
    setSwapExecutionState,
    selectWalletmodal,
  ]);

  const priceChangePercentage = useMemo(() => {
    if (
      !sourceDetails.usdAmount ||
      !destinationDetails.usdAmount ||
      isWaitingForNewRoute
    )
      return;
    const difference = destinationDetails.usdAmount - sourceDetails.usdAmount;
    const average =
      (sourceDetails.usdAmount + destinationDetails.usdAmount) / 2;
    const percentageDifference = (difference / average) * 100;

    return parseFloat(percentageDifference.toFixed(2));
  }, [
    destinationDetails.usdAmount,
    isWaitingForNewRoute,
    sourceDetails.usdAmount,
  ]);

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
          rightContent={
            sourceAccount && (
              <Row gap={6} style={{
                paddingRight: 13
              }}>
                <TransparentButton onClick={() => {
                  connectedWalletModal.show();
                }} style={{
                  padding: "8px 13px",
                  alignItems: "center",
                  gap: 8
                }}>
                  {sourceAccount && <img style={{ objectFit: "cover" }} src={sourceAccount?.wallet.logo} height={16} width={16} />}
                  125 ATOM
                </TransparentButton>
                <TransparentButton onClick={() => {
                  connectedWalletModal.show();
                }} style={{
                  padding: "8px 13px",
                  alignItems: "center",
                }}>
                  Max
                </TransparentButton>
              </Row>
            )
          }
        />
        <Column align="center">
          <AssetChainInput
            selectedAssetDenom={sourceAsset?.denom}
            handleChangeAsset={handleChangeSourceAsset}
            handleChangeChain={handleChangeSourceChain}
            isWaitingToUpdateInputValue={
              swapDirection === "swap-out" && isWaitingForNewRoute
            }
            value={sourceAsset?.amount}
            onChangeValue={(newValue) => {
              setSourceAssetAmount(newValue);
              setSwapDirection("swap-in");
            }}
          />
          <SwapPageBridge />
          <AssetChainInput
            selectedAssetDenom={destinationAsset?.denom}
            handleChangeAsset={handleChangeDestinationAsset}
            handleChangeChain={handleChangeDestinationChain}
            isWaitingToUpdateInputValue={
              swapDirection === "swap-in" && isWaitingForNewRoute
            }
            value={destinationAsset?.amount}
            priceChangePercentage={priceChangePercentage}
            onChangeValue={(newValue) => {
              setDestinationAssetAmount(newValue);
              setSwapDirection("swap-out");
            }}
          />
        </Column>
        {swapButton}
        <SwapPageFooter
          showRouteInfo
          onClick={() =>
            swapDetailsModal.show({
              drawer: true,
              container,
              onOpenChange: (open: boolean) =>
                open ? setDrawerOpen(true) : setDrawerOpen(false),
            })
          }
        />
      </Column >
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

const TransparentButton = styled(GhostButton).attrs({
  as: "button",
}) <GhostButtonProps>`
  ${({ theme, onClick, secondary, disabled }) =>
    onClick &&
    !disabled &&
    css`
      background-color: ${secondary
        ? theme.secondary.background.normal
        : theme.primary.ghostButtonHover};
      cursor: pointer;
    `};
  padding: 10px 13px;
  border-radius: 90px;
`;
