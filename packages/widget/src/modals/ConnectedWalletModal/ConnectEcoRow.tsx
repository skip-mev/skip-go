import { Button, GhostButton } from "@/components/Button";
import { Row } from "@/components/Layout";
import { ModalRowItem } from "@/components/ModalRowItem";
import { Text, TextButton } from "@/components/Typography";
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
import { useAccount as useCosmosAccount } from "graz";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;
const STANDARD_ICON_SIZE = 35;

export const ConnectEco = ({
  chainType,
  chainId,
  onClick,
  connectedWalletModal = false,
}: {
  chainType: ChainType;
  chainId: string; // This is the representative chain ID for the ecosystem
  onClick?: () => void;
  connectedWalletModal?: boolean;
}) => {
  const { copyAddress, isShowingCopyAddressFeedback } = useCopyAddress();

  const { data: cosmosAccounts } = useCosmosAccount({
    multiChain: true,
  });

  const theme = useTheme();
  const getAccount = useGetAccount();
  const isMobileScreenSize = useIsMobileScreenSize();
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { data: chains } = useAtomValue(skipChainsAtom);

  const accountChainId = useMemo(() => {
    if (chainType !== ChainType.Cosmos) {
      return chainId;
    }

    if (sourceAsset?.chainID && cosmosAccounts?.[sourceAsset.chainID]) {
      return sourceAsset?.chainID;
    }

    if (cosmosAccounts?.[chainId]) {
      return chainId;
    }

    if (cosmosAccounts && Object.keys(cosmosAccounts)[0]) {
      return Object.keys(cosmosAccounts)[0];
    }
  }, [chainId, chainType, cosmosAccounts, sourceAsset?.chainID]);

  const chainIdForWalletSelector = useMemo(() => {
    if (!sourceAsset?.chainID || !chains) return undefined;

    const sourceChainInfo = chains.find((c) => c.chainID === sourceAsset.chainID);
    if (sourceChainInfo?.chainType === chainType) {
      return sourceAsset.chainID;
    }
    return chainId;
  }, [sourceAsset?.chainID, chains, chainType, chainId]);

  const account = useMemo(() => {
    return getAccount(accountChainId, true);
  }, [accountChainId, getAccount]);

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
            track("connect eco row: disconnect button - clicked", {
              chainType,
              wallet: account?.wallet.name,
            });
            connectedWallet?.disconnect();
            NiceModal.remove(Modals.ConnectedWalletModal);
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
          track("connect eco row: disconnect button - clicked", {
            chainType,
            wallet: account?.wallet.name,
          });
          connectedWallet?.disconnect();
          NiceModal.remove(Modals.ConnectedWalletModal);
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
    track("connect eco row: connect button - clicked", {
      chainType,
    });

    NiceModal.remove(Modals.ConnectedWalletModal);
    NiceModal.show(Modals.WalletSelectorModal, {
      chainType,
      fromConnectedWalletModal: connectedWalletModal,
      chainId: chainIdForWalletSelector,
    });

    onClick?.();
  };

  return (
    <ModalRowItem
      style={{ marginTop: ITEM_GAP, minHeight: `${ITEM_HEIGHT}px` }}
      onClick={handleConnectClick}
      leftContent={
        account ? (
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
        ) : !account ? (
          <RightArrowIcon color={theme.primary.text.normal} />
        ) : null
      }
    />
  );
};

export const EvmChainIndicator = ({ chainId }: { chainId?: string }) => {
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

export const StyledCopyIconButton = styled(Row)`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  &:hover {
    background-color: ${({ theme }) => theme.primary.background.normal};
  }
`;
