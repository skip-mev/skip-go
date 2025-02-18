import { useCallback, useMemo } from "react";
import { styled, useTheme } from "styled-components";
import { Row, Column } from "@/components/Layout";
import { ModalRowItem } from "./ModalRowItem";
import { VirtualList } from "./VirtualList";
import { SmallText, Text } from "@/components/Typography";
import { MinimalWallet } from "@/state/wallets";
import { StyledAnimatedBorder } from "@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow";
import { useMutation } from "@tanstack/react-query";
import { ModalHeader, StyledModalContainer, StyledModalInnerContainer } from "./ModalHeader";
import { useSetAtom } from "jotai";
import { clearAssetInputAmountsAtom } from "@/state/swapPage";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { ChainType } from "@skip-go/client";

export type RenderWalletListProps = {
  title: string;
  walletList: (MinimalWallet | ManualWalletEntry)[];
  onClickBackButton: () => void;
  onSelectWallet?: (wallet: MinimalWallet) => void;
  isUpdatingChainAddress?: boolean;
  chainId?: string;
  chainType?: ChainType;
  isConnectEco?: boolean;
  chainAddressIndex?: number;
};

export type ManualWalletEntry = {
  walletName: string;
  onSelect: () => void;
  rightContent?: () => React.ReactNode;
};

export const isManualWalletEntry = (
  wallet: ManualWalletEntry | MinimalWallet,
): wallet is ManualWalletEntry => {
  return (wallet as ManualWalletEntry).onSelect !== undefined;
};

export const isMinimalWallet = (
  wallet: ManualWalletEntry | MinimalWallet,
): wallet is MinimalWallet => {
  return (wallet as MinimalWallet).connect !== undefined;
};

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export const RenderWalletList = ({
  title,
  walletList,
  onClickBackButton,
  onSelectWallet,
  chainId,
  isConnectEco,
}: RenderWalletListProps) => {
  const theme = useTheme();

  const displayWallets = useMemo(() => {
    const filteredWallets = walletList.filter(
      (wallet) => isManualWalletEntry(wallet) || wallet?.isAvailable !== false,
    );

    return filteredWallets.length === 1 ? walletList : filteredWallets;
  }, [walletList]);

  const clearAssetInputAmounts = useSetAtom(clearAssetInputAmountsAtom);

  const connectMutation = useMutation({
    mutationKey: ["connectWallet"],
    mutationFn: async (wallet: MinimalWallet) => {
      if (isConnectEco) {
        clearAssetInputAmounts();
        return await wallet.connect();
      }
      return await wallet.connect(chainId);
    },
    onSuccess: () => {
      if (isConnectEco) {
        clearAssetInputAmounts();
      }
      NiceModal.remove(Modals.SetAddressModal);
      NiceModal.remove(Modals.WalletSelectorModal);
    },
  });

  const renderItem = useCallback(
    (wallet: ManualWalletEntry | MinimalWallet) => {
      const name = isMinimalWallet(wallet)
        ? (wallet.walletPrettyName ?? wallet.walletName)
        : wallet.walletName;

      const imageUrl = isMinimalWallet(wallet) ? wallet?.walletInfo?.logo : undefined;
      const rightContent = isManualWalletEntry(wallet) ? wallet?.rightContent : undefined;
      const isAvailable = isMinimalWallet(wallet) ? wallet?.isAvailable : undefined;

      const renderedRightContent = rightContent?.() ?? <></>;

      const imageElement = imageUrl ? (
        <img
          height={35}
          width={35}
          style={{ objectFit: "cover" }}
          src={imageUrl}
          alt={`${name}-logo`}
        />
      ) : null;

      const onClickConnectWallet = () => {
        if (!isMinimalWallet(wallet)) {
          wallet.onSelect();
        } else if (onSelectWallet) {
          onSelectWallet(wallet);
          NiceModal.remove(Modals.SetAddressModal);
          NiceModal.remove(Modals.WalletSelectorModal);
          return;
        } else {
          connectMutation.mutate(wallet);
        }
      };

      const leftContent = (
        <Row style={{ width: "100%" }} align="center" justify="space-between">
          <Row align="center" gap={10}>
            {imageElement}
            <Text>{name}</Text>
          </Row>
          {isAvailable !== undefined && (
            <SmallText>{isAvailable ? "Installed" : "Not Installed"}</SmallText>
          )}
        </Row>
      );

      return (
        <ModalRowItem
          key={name}
          onClick={onClickConnectWallet}
          style={{ marginTop: ITEM_GAP }}
          leftContent={leftContent}
          rightContent={renderedRightContent}
        />
      );
    },
    [connectMutation, onSelectWallet],
  );

  const height = useMemo(() => {
    return Math.min(530, displayWallets.length * (ITEM_HEIGHT + ITEM_GAP));
  }, [displayWallets.length]);

  const renderWalletListOrWalletConnectionStatus = useMemo(() => {
    if (connectMutation.isError || connectMutation.isPending) {
      const titleText = connectMutation.isError ? "Failed to connect" : "Connecting to";
      return (
        <StyledModalInnerContainer>
          <StyledLoadingContainer>
            <StyledAnimatedBorder
              width={80}
              height={80}
              backgroundColor={theme.primary.text.normal}
              status={connectMutation.isError ? "failed" : "pending"}
              borderSize={8}
            >
              <img
                style={{ objectFit: "cover" }}
                src={connectMutation.variables?.walletInfo.logo}
                alt={`${connectMutation.variables?.walletPrettyName} logo`}
              />
            </StyledAnimatedBorder>
            <Text color={theme.primary.text.lowContrast} textAlign="center">
              {titleText} {connectMutation.variables?.walletPrettyName}
            </Text>
            {connectMutation.error && (
              <Text textAlign="center" fontSize={14} color={theme.primary.text.lowContrast}>
                {connectMutation.error.message}
              </Text>
            )}
          </StyledLoadingContainer>
        </StyledModalInnerContainer>
      );
    }

    return (
      <VirtualList
        height={height}
        listItems={displayWallets}
        itemHeight={ITEM_HEIGHT + ITEM_GAP}
        renderItem={renderItem}
        itemKey={(item) => item.walletName}
        empty={{
          header: "No wallets available",
        }}
      />
    );
  }, [
    connectMutation.error,
    connectMutation.isError,
    connectMutation.isPending,
    connectMutation.variables?.walletInfo.logo,
    connectMutation.variables?.walletPrettyName,
    height,
    renderItem,
    theme.primary.text.lowContrast,
    theme.primary.text.normal,
    displayWallets,
  ]);

  return (
    <StyledModalContainer gap={15}>
      <ModalHeader
        title={title}
        onClickBackButton={
          connectMutation.isPending || connectMutation.isError
            ? connectMutation.reset
            : onClickBackButton
        }
      />
      {renderWalletListOrWalletConnectionStatus}
    </StyledModalContainer>
  );
};

const StyledLoadingContainer = styled(Column)`
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-bottom: 10px;
  padding: 20px;
`;
