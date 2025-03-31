import { Button, GhostButton } from "@/components/Button";
import { Row } from "@/components/Layout";
import { createModal, ModalProps } from "@/components/Modal";
import {
  ModalHeader,
  StyledModalContainer,
  StyledModalInnerContainer,
} from "@/components/ModalHeader";
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
import { onlyTestnetsAtom, skipChainsAtom } from "@/state/skipClient";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { XIcon } from "@/icons/XIcon";
import { ChainType } from "@skip-go/client";
import { Tooltip } from "@/components/Tooltip";
import { CopyIcon } from "@/icons/CopyIcon";
import { useCopyAddress } from "@/hooks/useCopyAddress";
import { track } from "@amplitude/analytics-browser";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export type ConnectedWalletModalProps = ModalProps;

// Removed unused modalProps parameter
export const ConnectedWalletModal = createModal(() => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const onlyTestnets = useAtomValue(onlyTestnetsAtom);
  const { chainImage, chainName } = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });

  return (
    <StyledModalContainer gap={15}>
      <ModalHeader
        title="Wallets"
        onClickBackButton={() => {
          track("connect eco modal: header back button - clicked");
          NiceModal.remove(Modals.ConnectedWalletModal);
        }}
        rightContent={() => {
          return sourceAsset?.chainID ? (
            <img src={chainImage} height={36} width={36} title={chainName} />
          ) : null;
        }}
      />
      <StyledModalInnerContainer height={(ITEM_HEIGHT + ITEM_GAP) * 3}>
        <ConnectEco
          key={ChainType.Cosmos}
          chainID={onlyTestnets ? "provider" : "cosmoshub-4"}
          chainType={ChainType.Cosmos}
        />
        <ConnectEco
          key={ChainType.EVM}
          chainID={onlyTestnets ? "11155111" : "1"}
          chainType={ChainType.EVM}
        />
        <ConnectEco
          key={ChainType.SVM}
          chainID={onlyTestnets ? "solana-devnet" : "solana"}
          chainType={ChainType.SVM}
        />
      </StyledModalInnerContainer>
    </StyledModalContainer>
  );
});

const ConnectEco = ({ 
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
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { chain } = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });
  const { data: chains } = useAtomValue(skipChainsAtom);

  const chainIdForWallet = useMemo(() => {
    if (!sourceAsset?.chainID || !chains) return undefined;

    const chainInfo = chains.find((c) => c.chainID === sourceAsset.chainID);
    if (chainInfo?.chainType === chainType) {
      return sourceAsset.chainID;
    }
    return undefined;
  }, [sourceAsset?.chainID, chains, chainType]);

  const account = useMemo(() => {
    const _chainID = chainType === chain?.chainType ? sourceAsset?.chainID : chainID;
    return getAccount(_chainID, true);
  }, [chain?.chainType, chainID, chainType, getAccount, sourceAsset?.chainID]);

  const truncatedAddress = getTruncatedAddress(account?.address, isMobileScreenSize);
  const wallets = useWalletList({ chainType });
  const connectedWallet = wallets.find((wallet) => wallet.walletName === account?.wallet.name);

  const renderDisconnectButton = useMemo(() => {
    if (isMobileScreenSize) {
      return (
        <Button
          align="center"
          justify="center"
          style={{ width: 35, height: 35 }}
          onClick={(e) => {
            e.stopPropagation();
            track("connect eco modal: disconnect button - clicked", {
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
          track("connect eco modal: disconnect button - clicked", {
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
    account?.wallet.name,
    chainType,
    connectedWallet,
    isMobileScreenSize,
    theme?.primary?.text?.ultraLowContrast,
  ]);

  return (
    <ModalRowItem
      style={{ marginTop: ITEM_GAP }}
      onClick={() => {
        track("connect eco modal: eco button - clicked", {
          chainType,
        });
        NiceModal.remove(Modals.ConnectedWalletModal);
        NiceModal.show(Modals.WalletSelectorModal, {
          chainType,
          connectEco: true,
          chainId: chainIdForWallet
        });
      }}
      leftContent={
        account ? (
          <Row align="center" gap={10}>
            {account?.wallet.logo && (
              <img
                height={35}
                width={35}
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
        ) : (
          <RightArrowIcon color={theme.primary.text.normal} />
        )
      }
    />
  );
};

const EvmChainIndicator = ({ chainId }: { chainId?: string }) => {
  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chain = chains?.find((chain) => chain.chainID === chainId);
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
