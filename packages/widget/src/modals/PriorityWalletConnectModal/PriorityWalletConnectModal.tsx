import { Button, GhostButton } from "@/components/Button";
import { Column, Row } from "@/components/Layout";
import { createModal, ModalProps } from "@/components/Modal";
import {
  ModalHeader,
  StyledModalContainer,
  StyledModalInnerContainer,
} from "@/components/ModalHeader";
import { ModalRowItem } from "@/components/ModalRowItem";
import { SmallText, Text, TextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { useWalletList } from "@/hooks/useWalletList";
import { MinimalWallet } from "@/state/wallets";
import { ClientAsset, onlyTestnetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useAtomValue } from "jotai"; 
import { getTruncatedAddress } from "@/utils/crypto";
import { useGetAccount } from "@/hooks/useGetAccount";
import { RightArrowIcon } from "@/icons/ArrowIcon";
import { useCallback, useMemo } from "react";
import styled, { useTheme } from "styled-components";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { XIcon } from "@/icons/XIcon";
import { ChainType } from "@skip-go/client";
import { Tooltip } from "@/components/Tooltip";
import { CopyIcon } from "@/icons/CopyIcon";
import { useCopyAddress } from "@/hooks/useCopyAddress";
import { track } from "@amplitude/analytics-browser";
import { useMutation } from "@tanstack/react-query";
import { StyledAnimatedBorder } from "@/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow";
import { isManualWalletEntry, isMinimalWallet, ManualWalletEntry } from "@/components/RenderWalletList";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;
const STANDARD_ICON_SIZE = 35;

// Reusable component to show connected status or generic connect button for OTHER ecosystems
const ConnectEcoRow = ({
  chainType,
  chainID,
}: {
  chainType: ChainType;
  chainID: string;
}) => {
  const { copyAddress, isShowingCopyAddressFeedback } = useCopyAddress();
  const theme = useTheme();
  const getAccount = useGetAccount();
  const isMobileScreenSize = useIsMobileScreenSize();

  const account = useMemo(() => {
    return getAccount(chainID, true);
  }, [chainID, getAccount]);

  const truncatedAddress = getTruncatedAddress(account?.address, isMobileScreenSize);
  const wallets = useWalletList({ chainType });
  const connectedWallet = wallets.find((wallet) => wallet.walletName === account?.wallet.name);

  const renderDisconnectButton = useMemo(() => {
    if (!account || !connectedWallet) return null;
    if (isMobileScreenSize) {
      return (
        <Button
          align="center"
          justify="center"
          style={{ width: 35, height: 35 }}
          onClick={(e) => {
            e.stopPropagation();
            track("priority connect modal: disconnect other eco button - clicked", {
              chainType,
              wallet: account?.wallet.name,
            });
            connectedWallet?.disconnect();
            NiceModal.remove(Modals.PriorityWalletConnectModal);
          }}
        >
          <XIcon height="22" width="22" color={theme?.primary?.text?.ultraLowContrast} />
        </Button>
      );
    }
    return (
      <GhostButton
        align="center"
        justify="center"
        onClick={(e) => {
          e.stopPropagation();
          track("priority connect modal: disconnect other eco button - clicked", {
            chainType,
            wallet: account?.wallet.name,
          });
          connectedWallet?.disconnect();
          NiceModal.remove(Modals.PriorityWalletConnectModal);
        }}
      >
        Disconnect
      </GhostButton>
    );
  }, [
    account,
    chainType,
    connectedWallet,
    isMobileScreenSize,
    theme?.primary?.text?.ultraLowContrast,
  ]);

  const handleConnectClick = () => {
    track("priority connect modal: connect other eco button - clicked", {
      chainType,
    });
    NiceModal.remove(Modals.PriorityWalletConnectModal);
    NiceModal.show(Modals.WalletSelectorModal, {
      chainType,
      connectEco: true,
    });
  };

  if (account) {
    return (
      <ModalRowItem
        style={{ marginTop: ITEM_GAP, minHeight: `${ITEM_HEIGHT}px` }}
        leftContent={
          <Row align="center" gap={10}>
            {account?.wallet.logo && (
              <img
                height={STANDARD_ICON_SIZE}
                width={STANDARD_ICON_SIZE}
                style={{ objectFit: "cover" }}
                src={account?.wallet.logo}
                alt={`${account?.wallet.prettyName} logo`}
                title={account?.wallet.prettyName}
              />
            )}
            <Row align="baseline" gap={8}>
              <Tooltip content={account?.address}>
                <Text>{truncatedAddress}</Text>
              </Tooltip>
              <Tooltip
                content={isShowingCopyAddressFeedback ? "Address copied!" : "Copy to clipboard"}
              >
                <StyledCopyIconButton
                  align="center"
                  justify="center"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyAddress(account?.address);
                  }}
                >
                  <CopyIcon width="10" height="10" color={theme.primary.text.lowContrast} />
                </StyledCopyIconButton>
              </Tooltip>
              {chainType === "evm" && (
                <EvmChainIndicator chainId={account?.currentConnectedEVMChainId} />
              )}
            </Row>
          </Row>
        }
        rightContent={account.wallet.name !== "injected" ? renderDisconnectButton : null}
      />
    );
  }

  return (
    <ModalRowItem
      style={{ marginTop: ITEM_GAP, minHeight: `${ITEM_HEIGHT}px` }}
      onClick={handleConnectClick}
      leftContent={
        <TextButton>
          Connect to{" "}
          {chainType === ChainType.Cosmos
            ? "Cosmos"
            : chainType === ChainType.EVM
              ? "Ethereum" // Changed from EVM Wallet
              : "Solana"}
        </TextButton>
      }
      rightContent={<RightArrowIcon color={theme.primary.text.normal} />}
    />
  );
};

const EvmChainIndicator = ({ chainId }: { chainId?: string }) => {
  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chain = chains?.find((chain) => chain.chainID === chainId);
  if (!chain) return null;
  return (
    <Text fontSize={12} color={theme.primary.text.lowContrast}>
      {chain?.prettyName}
    </Text>
  );
};

const StyledCopyIconButton = styled(Row)`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  &:hover {
    background-color: ${({ theme }) => theme.primary.background.normal};
  }
`;

export interface PriorityWalletConnectModalProps extends ModalProps {
  sourceAsset: ClientAsset | null;
}


export const PriorityWalletConnectModal = createModal(
  ({ sourceAsset }: PriorityWalletConnectModalProps) => {
    const theme = useTheme();
    const { data: chains } = useAtomValue(skipChainsAtom);
    const onlyTestnets = useAtomValue(onlyTestnetsAtom);

    const { chainImage, chainName } = useGetAssetDetails({
      assetDenom: sourceAsset?.denom,
      chainId: sourceAsset?.chainID,
    });

    const requiredChainType = useMemo(() => {
      if (!sourceAsset?.chainID || !chains) return undefined;
      return chains.find((c) => c.chainID === sourceAsset.chainID)?.chainType;
    }, [chains, sourceAsset?.chainID]);

    const requiredWalletList = useWalletList({ chainType: requiredChainType });

    const displayWallets = useMemo((): (MinimalWallet | ManualWalletEntry)[] => {
      return requiredWalletList.filter(
        (wallet) => isManualWalletEntry(wallet) || wallet?.isAvailable !== false,
      );
    }, [requiredWalletList]);

    const connectMutation = useMutation({
      mutationKey: ["connectPriorityWallet"],
      mutationFn: async (wallet: MinimalWallet) => {
        return await wallet.connect(sourceAsset?.chainID);
      },
      onSuccess: () => {
        NiceModal.remove(Modals.PriorityWalletConnectModal);
      },
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
            height={STANDARD_ICON_SIZE} // Use standard size
            width={STANDARD_ICON_SIZE}
            style={{ objectFit: "cover" }}
            src={imageUrl}
            alt={`${name}-logo`}
          />
        ) : null;

        const onClickConnectWallet = () => {
          if (isMinimalWallet(wallet)) { 
            connectMutation.mutate(wallet);
          }
        };

        const leftContent = (
          <Row style={{ width: "100%" }} align="center" justify="space-between">
            <Row align="center" gap={10}> {/* Standard gap */}
              {imageElement}
              <Text>{name}</Text> {/* Standard text */}
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
      [connectMutation],
    );

    // Logic to render the list or loading/error state
    const renderRequiredWalletListOrStatus = useMemo(() => {
      // Loading / Error State
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
        );
      }

      // Render List directly using standard item renderer (no wrapping Column)
      if (displayWallets.length > 0) {
        return (
          <>
            {/* Pass index to renderListItem */}
            {displayWallets.map((wallet, index) => renderListItem(wallet, index))}
          </>
        );
      } else {
        return <Text style={{ padding: '20px 0', textAlign: 'center' }}>No wallets available</Text>;
      }
    }, [
      connectMutation,
      displayWallets,
      renderListItem,
      theme.primary.text.lowContrast, // Needed for loading state
      theme.primary.text.normal,   // Needed for loading state
    ]);


    // --- Logic for other ecosystems ---
    const representativeChainIDs = useMemo(() => ({
      [ChainType.Cosmos]: onlyTestnets ? "provider" : "cosmoshub-4",
      [ChainType.EVM]: onlyTestnets ? "11155111" : "1",
      [ChainType.SVM]: onlyTestnets ? "solana-devnet" : "solana",
    }), [onlyTestnets]);

    const allEcosystems: ChainType[] = [ChainType.Cosmos, ChainType.EVM, ChainType.SVM];
    const otherEcosystems = allEcosystems.filter((eco) => eco !== requiredChainType);

    const handleClose = () => {
      if (connectMutation.isPending || connectMutation.isError) {
        connectMutation.reset();
      }
      NiceModal.remove(Modals.PriorityWalletConnectModal);
    };

    return (
      <StyledModalContainer gap={15}>
        <ModalHeader
          title={`Connect ${
            requiredChainType === ChainType.Cosmos
              ? "Cosmos"
              : requiredChainType === ChainType.EVM
                ? "Ethereum"
                : "Solana"
          } Wallet`}
          onClickBackButton={handleClose}
          rightContent={() => {
            return sourceAsset?.chainID ? (
              <img src={chainImage} height={36} width={36} title={chainName} />
            ) : null;
          }}
        />
        <StyledModalInnerContainer>
          {requiredChainType && renderRequiredWalletListOrStatus}

          {otherEcosystems.length > 0 && <StyledDivider />}

          {otherEcosystems.map((ecoType) => (
            <ConnectEcoRow
              key={ecoType}
              chainType={ecoType}
              chainID={representativeChainIDs[ecoType]}
            />
          ))}
        </StyledModalInnerContainer>
      </StyledModalContainer>
    );
  },
);

const StyledDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.primary.text.ultraLowContrast};
  margin: 10px 0;
`;

const StyledLoadingContainer = styled(Column)`
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-bottom: 10px;
  padding: 20px;
`;
