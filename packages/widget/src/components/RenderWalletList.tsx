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

export type RenderWalletListProps = {
  title: string;
  walletList: (MinimalWallet | ManualWalletEntry)[];
  onClickBackButton: () => void;
  onSelectWallet?: (wallet: MinimalWallet) => void;
  chainId?: string; 
  isConnectEco?: boolean; 
 
  connectFn?: (wallet: MinimalWallet) => Promise<void> | void; 
  connectionState?: {
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    variables?: { walletPrettyName?: string; walletInfo?: { logo?: string } };
  };
  headerRightContent?: () => React.ReactNode;
  onItemClick?: (wallet: MinimalWallet | ManualWalletEntry) => void;
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
  connectFn,
  connectionState,
  headerRightContent,
  onItemClick,
}: RenderWalletListProps) => {
  const theme = useTheme();

  const displayWallets = useMemo(() => {
    const filteredWallets = walletList.filter(
      (wallet) => isManualWalletEntry(wallet) || wallet?.isAvailable !== false,
    );

    return filteredWallets.length === 1 ? walletList : filteredWallets;
  }, [walletList]);

  const clearAssetInputAmounts = useSetAtom(clearAssetInputAmountsAtom);

  // Internal mutation only used if connectFn is NOT provided
  const connectMutation = useMutation({
    mutationKey: ["connectWallet"],
    mutationFn: async (wallet: MinimalWallet) => {
      // If a specific chainId is provided, connect to that chain
      // This is used when connecting from a specific chain context
      if (chainId) {
        return await wallet.connect(chainId);
      }
      // Otherwise, connect without specifying a chain
      // This will use the wallet's default behavior
      return await wallet.connect();
    },
    onSuccess: () => {
      if (isConnectEco) {
        clearAssetInputAmounts();
      }
      NiceModal.remove(Modals.SetAddressModal);
      NiceModal.remove(Modals.WalletSelectorModal);
    },
  });

  const currentConnectionState = useMemo(() => {
    return connectionState ?? {
      isPending: connectMutation.isPending,
      isError: connectMutation.isError,
      error: connectMutation.error,
      variables: connectMutation.variables,
    };
  }, [connectionState, connectMutation.isPending, connectMutation.isError, connectMutation.error, connectMutation.variables]);

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
        // Call external click handler if provided
        onItemClick?.(wallet);

        if (!isMinimalWallet(wallet)) {
          wallet.onSelect();
        } else if (connectFn) {
          // Use external connect function if provided
          connectFn(wallet);
        } else if (onSelectWallet) {
          // Fallback to onSelectWallet if provided (for specific selection use cases)
          onSelectWallet(wallet);
          NiceModal.remove(Modals.SetAddressModal);
          NiceModal.remove(Modals.WalletSelectorModal);
        } else {
          // Fallback to internal mutation if no external connectFn or onSelectWallet provided
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
    [connectMutation, onSelectWallet, connectFn, onItemClick],
  );

  const height = useMemo(() => {
    return Math.min(530, displayWallets.length * (ITEM_HEIGHT + ITEM_GAP));
  }, [displayWallets.length]);

  const renderWalletListOrWalletConnectionStatus = useMemo(() => {
    // Use currentConnectionState here
    if (currentConnectionState.isError || currentConnectionState.isPending) {
      const titleText = currentConnectionState.isError ? "Failed to connect" : "Connecting to";
      return (
        <StyledModalInnerContainer>
          <StyledLoadingContainer>
            <StyledAnimatedBorder
              width={80}
              height={80}
              backgroundColor={theme.primary.text.normal}
              status={currentConnectionState.isError ? "failed" : "pending"}
              borderSize={8}
            >
              {/* Use currentConnectionState.variables */}
              {currentConnectionState.variables?.walletInfo?.logo && (
                 <img
                   style={{ objectFit: "cover" }}
                   src={currentConnectionState.variables.walletInfo.logo}
                   alt={`${currentConnectionState.variables?.walletPrettyName} logo`}
                 />
              )}
            </StyledAnimatedBorder>
            {/* Use currentConnectionState.variables */}
            <Text color={theme.primary.text.lowContrast} textAlign="center">
              {titleText} {currentConnectionState.variables?.walletPrettyName}
            </Text>
            {/* Use currentConnectionState.error */}
            {currentConnectionState.error && (
              <Text textAlign="center" fontSize={14} color={theme.primary.text.lowContrast}>
                {currentConnectionState.error.message}
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
    currentConnectionState.error,
    currentConnectionState.isError,
    currentConnectionState.isPending,
    currentConnectionState.variables?.walletInfo?.logo,
    currentConnectionState.variables?.walletPrettyName,
    height,
    renderItem,
    theme.primary.text.lowContrast,
    theme.primary.text.normal,
    displayWallets,
  ]);

  const handleBackButton = useCallback(() => {
    if (connectionState) {
      // If external state is provided, the parent should handle reset if needed. Just call back.
      onClickBackButton();
    } else {
      // If internal state is used, check if we need to reset the internal mutation
      if (connectMutation.isPending || connectMutation.isError) {
        connectMutation.reset();
      } else {
        onClickBackButton();
      }
    }
  }, [connectionState, onClickBackButton, connectMutation]);


  return (
    <StyledModalContainer gap={15}>
      <ModalHeader
        title={title}
        onClickBackButton={handleBackButton}
        rightContent={headerRightContent} 
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
