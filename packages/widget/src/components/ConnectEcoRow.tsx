import { Button, GhostButton } from "@/components/Button";
import { Row } from "@/components/Layout";
import { ModalRowItem } from "@/components/ModalRowItem";
import { Text, TextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { useWalletList } from "@/hooks/useWalletList";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue } from "jotai";
import { getTruncatedAddress } from "@/utils/crypto";
import { useGetAccount } from "@/hooks/useGetAccount";
import { RightArrowIcon } from "@/icons/ArrowIcon";
import { useMemo } from "react";
import styled, { useTheme } from "styled-components";
import { skipChainsAtom } from "@/state/skipClient";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { XIcon } from "@/icons/XIcon";
import { ChainType } from "@skip-go/client";
import { Tooltip } from "@/components/Tooltip";
import { CopyIcon } from "@/icons/CopyIcon";
import { useCopyAddress } from "@/hooks/useCopyAddress";
import { track } from "@amplitude/analytics-browser";

const ITEM_HEIGHT = 60; // Consider making these constants shared if used elsewhere
const ITEM_GAP = 5;
const STANDARD_ICON_SIZE = 35;

export const ConnectEco = ({
  chainType,
  chainID,
}: {
  chainType: ChainType;
  chainID: string; // This is the representative chain ID for the ecosystem
}) => {
  const { copyAddress, isShowingCopyAddressFeedback } = useCopyAddress();

  const theme = useTheme();
  const getAccount = useGetAccount();
  const isMobileScreenSize = useIsMobileScreenSize();
  const sourceAsset = useAtomValue(sourceAssetAtom);
  // Removed unused 'chain' destructuring from useGetAssetDetails
  useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });
  const { data: chains } = useAtomValue(skipChainsAtom);

  // Determine if the source asset's chain matches this ecosystem type
  // If so, use the source asset's chain ID for wallet selection modal
  const chainIdForWalletSelector = useMemo(() => {
    if (!sourceAsset?.chainID || !chains) return undefined;

    const sourceChainInfo = chains.find((c) => c.chainID === sourceAsset.chainID);
    if (sourceChainInfo?.chainType === chainType) {
      return sourceAsset.chainID;
    }
    return undefined; // Use default behavior (just chainType) if no match
  }, [sourceAsset?.chainID, chains, chainType]);

  // Get account info using the representative chainID for display
  const account = useMemo(() => {
    return getAccount(chainID, true);
  }, [chainID, getAccount]);

  const truncatedAddress = getTruncatedAddress(account?.address, isMobileScreenSize);
  const wallets = useWalletList({ chainType });
  const connectedWallet = wallets.find((wallet) => wallet.walletName === account?.wallet.name);

  const renderDisconnectButton = useMemo(() => {
    if (!account || !connectedWallet) return null; // Added check for connectedWallet

    if (isMobileScreenSize) {
      return (
        <Button
          align="center"
          justify="center"
          style={{ width: 35, height: 35 }}
          onClick={(e) => {
            e.stopPropagation();
            track("connect eco row: disconnect button - clicked", { // Generic tracking
              chainType,
              wallet: account?.wallet.name,
            });
            connectedWallet?.disconnect();
            // Don't remove modal here, let the parent modal handle it
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
          track("connect eco row: disconnect button - clicked", { // Generic tracking
            chainType,
            wallet: account?.wallet.name,
          });
          connectedWallet?.disconnect();
          // Don't remove modal here
        }}
      >
        Disconnect
      </GhostButton>
    );
  }, [
    account, // Updated dependency
    chainType,
    connectedWallet,
    isMobileScreenSize,
    theme?.primary?.text?.ultraLowContrast,
  ]);

  const handleConnectClick = () => {
    track("connect eco row: connect button - clicked", { // Generic tracking
      chainType,
    });
    // Always show WalletSelectorModal when clicking connect
    NiceModal.show(Modals.WalletSelectorModal, {
      chainType,
      connectEco: true, // Indicate it came from this flow
      chainId: chainIdForWalletSelector, // Pass specific chain if source matches eco
    });
  };

  return (
    <ModalRowItem
      style={{ marginTop: ITEM_GAP, minHeight: `${ITEM_HEIGHT}px` }} // Added minHeight
      onClick={handleConnectClick} // Connect action on the whole row if not connected
      leftContent={
        account ? (
          <Row align="center" gap={10}>
            {account?.wallet.logo && (
              <img
                height={STANDARD_ICON_SIZE} // Use constant
                width={STANDARD_ICON_SIZE} // Use constant
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
                    e.stopPropagation(); // Prevent row click
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
        ) : (
          <TextButton>
            Connect to{" "}
            {chainType === ChainType.Cosmos
              ? "Cosmos"
              : chainType === ChainType.EVM
                ? "Ethereum"
                : "Solana"}
          </TextButton>
        )
      }
      rightContent={
        account && account.wallet.name !== "injected" ? (
          renderDisconnectButton
        ) : !account ? ( // Only show arrow if not connected
          <RightArrowIcon color={theme.primary.text.normal} />
        ) : null // Hide arrow for injected wallets
      }
    />
  );
};

export const EvmChainIndicator = ({ chainId }: { chainId?: string }) => {
  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chain = chains?.find((chain) => chain.chainID === chainId);
  if (!chain) return null; // Return null if chain not found
  return (
    <Text fontSize={12} color={theme.primary.text.lowContrast}>
      {chain?.prettyName}
    </Text>
  );
};

export const StyledCopyIconButton = styled(Row)`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  &:hover {
    background-color: ${({ theme }) => theme.primary.background.normal};
  }
`;
