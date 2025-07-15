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
import { Tooltip } from "@/components/Tooltip";
import { CopyIcon } from "@/icons/CopyIcon";
import { useCopyAddress } from "@/hooks/useCopyAddress";
import { track } from "@amplitude/analytics-browser";
import { useAccount as useCosmosAccount } from "graz";
import { usePrimaryChainIdForChainType } from "@/hooks/usePrimaryChainIdForChainType";
import { ChainType } from "@skip-go/client";
import { useCroppedImage } from "@/hooks/useCroppedImage";
import { SkeletonElement } from "@/components/Skeleton";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;
const STANDARD_ICON_SIZE = 35;

export const ConnectEcoRow = ({
  chainType,
  onClick,
  connectedWalletModal = false,
}: {
  chainType: ChainType;
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

  const primarychainIdForChainType = usePrimaryChainIdForChainType();

  const defaultchainId = primarychainIdForChainType[chainType];

  const accountchainId = useMemo(() => {
    if (chainType !== ChainType.Cosmos) {
      return defaultchainId;
    }

    if (sourceAsset?.chainId && cosmosAccounts?.[sourceAsset.chainId]) {
      return sourceAsset?.chainId;
    }

    if (cosmosAccounts?.[defaultchainId]) {
      return defaultchainId;
    }

    if (cosmosAccounts && Object.keys(cosmosAccounts)[0]) {
      return Object.keys(cosmosAccounts)[0];
    }
  }, [chainType, cosmosAccounts, defaultchainId, sourceAsset?.chainId]);

  const chainIdForWalletSelector = useMemo(() => {
    if (!sourceAsset?.chainId || !chains) return undefined;

    const sourceChainInfo = chains.find((c) => c.chainId === sourceAsset.chainId);
    if (sourceChainInfo?.chainType === chainType) {
      return sourceAsset.chainId;
    }
    return defaultchainId;
  }, [sourceAsset?.chainId, chains, chainType, defaultchainId]);

  const account = useMemo(() => {
    return getAccount(accountchainId, true);
  }, [accountchainId, getAccount]);

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

  const walletImage = useCroppedImage(account?.wallet.logo);

  return (
    <ModalRowItem
      as="div"
      style={{ marginTop: ITEM_GAP, minHeight: `${ITEM_HEIGHT}px` }}
      onClick={handleConnectClick}
      leftContent={
        account ? (
          <Row align="center" gap={10}>
            {walletImage ? (
              <img
                height={STANDARD_ICON_SIZE}
                width={STANDARD_ICON_SIZE}
                style={{ objectFit: "cover" }}
                src={walletImage}
                alt={`${account?.wallet.prettyName} logo`}
                title={account?.wallet.prettyName}
              />
            ) : (
              <SkeletonElement height={STANDARD_ICON_SIZE} width={STANDARD_ICON_SIZE} />
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

              <ChainIndicator chainId={accountchainId} />
            </Row>
          </Row>
        ) : (
          <TextButton>
            Connect to{" "}
            {chainType === ChainType.Cosmos
              ? "Cosmos"
              : chainType === ChainType.Evm
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

export const ChainIndicator = ({ chainId }: { chainId?: string }) => {
  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chain = chains?.find((chain) => chain.chainId === chainId);
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
