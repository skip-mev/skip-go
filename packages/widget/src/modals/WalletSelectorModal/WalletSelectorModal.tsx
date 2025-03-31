import { Column, Row } from "@/components/Layout";
import { createModal, ModalProps } from "@/components/Modal";
import {
  ModalHeader,
  StyledModalContainer,
  StyledModalInnerContainer,
} from "@/components/ModalHeader";
import { ModalRowItem } from "@/components/ModalRowItem";
import { SmallText, Text } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { useWalletList } from "@/hooks/useWalletList";
import { MinimalWallet } from "@/state/wallets";
import { ClientAsset, onlyTestnetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import styled, { useTheme } from "styled-components";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { ChainType } from "@skip-go/client";
import { track } from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import { StyledAnimatedBorder } from "@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow";
import { ConnectEco } from "@/components/ConnectEcoRow"; // Import shared component
import {
  isManualWalletEntry,
  isMinimalWallet,
  ManualWalletEntry,
  RenderWalletList,
} from "@/components/RenderWalletList";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;
const STANDARD_ICON_SIZE = 35;

// Removed ConnectEcoRow, EvmChainIndicator, StyledCopyIconButton definitions

const StyledDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.primary.text.ultraLowContrast};
  margin: 10px 0;
`;

// Copied from PriorityWalletConnectModal
const StyledLoadingContainer = styled(Column)`
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-bottom: 10px;
  padding: 20px;
`;

export type WalletSelectorModalProps = ModalProps & {
  chainId?: string;
  chainType?: ChainType;
  connectEco?: boolean;
  // New props for priority view
  sourceAsset?: ClientAsset | null;
  showPriorityView?: boolean;
};

export const WalletSelectorModal = createModal((modalProps: WalletSelectorModalProps) => {
  const { chainId, chainType, connectEco, sourceAsset, showPriorityView } = modalProps;

  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);
  const onlyTestnets = useAtomValue(onlyTestnetsAtom);

  // --- Logic specific to Priority View ---
  const { chainImage, chainName } = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });

  const requiredChainType = useMemo(() => {
    if (!showPriorityView || !sourceAsset?.chainID || !chains) return undefined;
    return chains.find((c) => c.chainID === sourceAsset.chainID)?.chainType;
  }, [chains, sourceAsset?.chainID, showPriorityView]);

  // Use requiredChainType for priority view, otherwise use props
  const targetChainType = showPriorityView ? requiredChainType : chainType;
  const targetChainId = showPriorityView ? sourceAsset?.chainID : chainId;

  const walletList = useWalletList({ chainID: targetChainId, chainType: targetChainType });

  const displayWallets = useMemo((): (MinimalWallet | ManualWalletEntry)[] => {
    // Filter only needed for priority view's specific list
    if (!showPriorityView) return walletList;
    return walletList.filter(
      (wallet) => isManualWalletEntry(wallet) || wallet?.isAvailable !== false,
    );
  }, [walletList, showPriorityView]);

  const connectMutation = useMutation({
    mutationKey: ["connectPriorityWallet"],
    mutationFn: async (wallet: MinimalWallet) => {
      // Connect to the specific source asset chain if in priority view
      return await wallet.connect(showPriorityView ? sourceAsset?.chainID : targetChainId);
    },
    onSuccess: () => {
      NiceModal.remove(Modals.WalletSelectorModal); // Remove self
    },
    // onError handled in render logic
  });

  const renderListItem = useCallback(
    (wallet: ManualWalletEntry | MinimalWallet, index: number) => {
      const name = isMinimalWallet(wallet)
        ? (wallet.walletPrettyName ?? wallet.walletName)
        : wallet.walletName;

      const imageUrl = isMinimalWallet(wallet) ? wallet?.walletInfo?.logo : undefined;
      const rightContent = isManualWalletEntry(wallet) ? wallet?.rightContent : undefined;
      const isAvailable = isMinimalWallet(wallet) ? wallet?.isAvailable : undefined;

      const renderedRightContent = rightContent?.() ?? <></>;

      const imageElement = imageUrl ? (
        <img
          height={STANDARD_ICON_SIZE}
          width={STANDARD_ICON_SIZE}
          style={{ objectFit: "cover" }}
          src={imageUrl}
          alt={`${name}-logo`}
        />
      ) : null;

      const onClickConnectWallet = () => {
        if (isMinimalWallet(wallet)) {
          track("wallet selector modal: connect required wallet - clicked", { // Updated tracking
            wallet: name,
            chainType: requiredChainType,
          }); // Updated tracking
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
          key={index}
          onClick={onClickConnectWallet}
          style={{ marginTop: ITEM_GAP, minHeight: `${ITEM_HEIGHT}px` }}
          leftContent={leftContent}
          rightContent={renderedRightContent}
        />
      );
    },
    [connectMutation, requiredChainType],
  );

  const renderRequiredWalletListOrStatus = useMemo(() => {
    // Loading / Error State for priority connect
    if (connectMutation.isError || connectMutation.isPending) {
      const titleText = connectMutation.isError ? "Failed to connect" : "Connecting to";
      return (
        <StyledLoadingContainer>
          <StyledAnimatedBorder
            width={80}
            height={80}
            backgroundColor={theme.primary.text.normal}
            status={connectMutation.isError ? "failed" : "pending"}
            borderSize={8}
          >
            {connectMutation.variables?.walletInfo.logo && (
              <img
                style={{ objectFit: "cover" }}
                src={connectMutation.variables.walletInfo.logo}
                alt={`${connectMutation.variables?.walletPrettyName} logo`}
              />
            )}
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
      );
    }

    // Render List for priority view
    if (displayWallets.length > 0) {
      return <>{displayWallets.map((wallet, index) => renderListItem(wallet, index))}</>;
    } else {
      return <Text style={{ padding: '20px 0', textAlign: 'center' }}>No wallets available</Text>;
    }
  }, [
    connectMutation,
    displayWallets,
    renderListItem,
    theme.primary.text.lowContrast,
    theme.primary.text.normal,
  ]);

  const representativeChainIDs = useMemo(() => ({
    [ChainType.Cosmos]: onlyTestnets ? "provider" : "cosmoshub-4",
    [ChainType.EVM]: onlyTestnets ? "11155111" : "1",
    [ChainType.SVM]: onlyTestnets ? "solana-devnet" : "solana",
  }), [onlyTestnets]);

  const allEcosystems: ChainType[] = [ChainType.Cosmos, ChainType.EVM, ChainType.SVM];
  const otherEcosystems = allEcosystems.filter((eco) => eco !== requiredChainType);
  // --- End Priority View specific logic ---

  const handleOnClickBackButton = () => {
    // Reset mutation if it was active
    if (connectMutation.isPending || connectMutation.isError) {
      connectMutation.reset();
      return; // Stay in modal if mutation was active, just reset state
    }

    NiceModal.remove(Modals.WalletSelectorModal);
    // Navigate back only if it was opened via connectEco flow, not priority flow
    if (connectEco && !showPriorityView) {
      NiceModal.show(Modals.ConnectedWalletModal);
    }
  };

  // --- Render Logic ---
  if (showPriorityView) {
    // Render Priority View
    const priorityTitle = `Connect ${
      requiredChainType === ChainType.Cosmos
        ? "Cosmos"
        : requiredChainType === ChainType.EVM
          ? "Ethereum"
          : requiredChainType === ChainType.SVM
            ? "Solana"
            : "" // Fallback
    } Wallet`;

    return (
      <StyledModalContainer gap={15}>
        <ModalHeader
          title={priorityTitle}
          onClickBackButton={handleOnClickBackButton}
          rightContent={() => {
            return sourceAsset?.chainID ? (
              <img src={chainImage} height={36} width={36} title={chainName} />
            ) : null;
          }}
        />
        <StyledModalInnerContainer>
          {requiredChainType && renderRequiredWalletListOrStatus}

          {otherEcosystems.length > 0 && <StyledDivider />}

          {/* Use the imported ConnectEco component */}
          {otherEcosystems.map((ecoType) => (
            <ConnectEco
              key={ecoType}
              chainType={ecoType}
              chainID={representativeChainIDs[ecoType]}
            />
          ))}
        </StyledModalInnerContainer>
      </StyledModalContainer>
    );
  } else {
    // Render Standard View using RenderWalletList
    return (
      <RenderWalletList
        title="Connect wallet"
        walletList={walletList}
        onClickBackButton={handleOnClickBackButton}
        isConnectEco={connectEco}
        chainId={chainId}
        // Pass connect function if needed by RenderWalletList,
        // otherwise RenderWalletList handles its own connection
      />
    );
  }
});
