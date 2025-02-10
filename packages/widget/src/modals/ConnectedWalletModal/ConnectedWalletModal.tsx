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
import { copyToClipboard } from "@/utils/misc";
import { RightArrowIcon } from "@/icons/ArrowIcon";
import { useMemo } from "react";
import { useTheme } from "styled-components";
import { skipChainsAtom } from "@/state/skipClient";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { useIsMobileScreenSize } from "@/hooks/useIsMobileScreenSize";
import { XIcon } from "@/icons/XIcon";
import { ChainType } from "@skip-go/client";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export const ConnectedWalletModal = createModal((_modalProps: ModalProps) => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { chainImage, chainName } = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });

  return (
    <StyledModalContainer gap={15}>
      <ModalHeader
        title="Wallets"
        onClickBackButton={() => NiceModal.remove(Modals.ConnectedWalletModal)}
        rightContent={() => {
          return sourceAsset?.chainID ? (
            <img src={chainImage} height={36} width={36} title={chainName} />
          ) : null;
        }}
      />
      <StyledModalInnerContainer height={(ITEM_HEIGHT + ITEM_GAP) * 3}>
        <ConnectEco key={ChainType.Cosmos} chainID="cosmoshub-4" chainType={ChainType.Cosmos} />
        <ConnectEco key={ChainType.EVM} chainID="1" chainType={ChainType.EVM} />
        <ConnectEco key={ChainType.SVM} chainID="solana" chainType={ChainType.SVM} />
      </StyledModalInnerContainer>
    </StyledModalContainer>
  );
});

const ConnectEco = ({ chainType, chainID }: { chainType: ChainType; chainID: string }) => {
  const theme = useTheme();
  const getAccount = useGetAccount();
  const isMobileScreenSize = useIsMobileScreenSize();
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { chain } = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });

  const account = useMemo(() => {
    const _chainID = chainType === chain?.chainType ? sourceAsset?.chainID : chainID;
    return getAccount(_chainID);
  }, [chain?.chainType, chainID, chainType, getAccount, sourceAsset?.chainID]);

  const truncatedAddress = getTruncatedAddress(account?.address, isMobileScreenSize);
  const wallets = useWalletList({ chainType, chainID });
  const connectedWallet = wallets.find((wallet) => wallet.walletName === account?.walletName);

  const renderDisconnectButton = useMemo(() => {
    if (isMobileScreenSize) {
      return (
        <Button
          align="center"
          justify="center"
          style={{ width: 35, height: 35 }}
          onClick={(e) => {
            e.stopPropagation();
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
          connectedWallet?.disconnect();
          NiceModal.remove(Modals.ConnectedWalletModal);
        }}
      >
        Disconnect
      </GhostButton>
    );
  }, [connectedWallet, isMobileScreenSize, theme?.primary?.text?.ultraLowContrast]);

  return (
    <ModalRowItem
      style={{ marginTop: ITEM_GAP }}
      onClick={() => {
        NiceModal.remove(Modals.ConnectedWalletModal);
        NiceModal.show(Modals.WalletSelectorModal, {
          chainType,
          connectEco: true,
        });
      }}
      leftContent={
        account ? (
          <Row align="center" gap={10}>
            {account?.walletInfo?.logo && (
              <img
                height={35}
                width={35}
                style={{ objectFit: "cover" }}
                src={account?.walletInfo?.logo}
                alt={`${account?.walletPrettyName} logo`}
                title={account?.walletPrettyName}
              />
            )}
            <Row align="baseline" gap={8}>
              <TextButton
                fontSize={isMobileScreenSize ? 13 : undefined}
                title={account?.address}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(account?.address);
                }}
              >
                {truncatedAddress}
              </TextButton>
              {chainType === "evm" && <EvmChainIndicator chainId={account?.chainId} />}
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
        account && account.walletName !== "injected" ? (
          renderDisconnectButton
        ) : (
          <RightArrowIcon color={theme.primary.text.normal} />
        )
      }
    />
  );
};

const EvmChainIndicator = ({ chainId }: { chainId?: string | number }) => {
  const theme = useTheme();
  const { data: chains } = useAtomValue(skipChainsAtom);
  const chain = chains?.find((chain) => chain.chainID === chainId);
  return (
    <Text fontSize={12} color={theme.primary.text.lowContrast}>
      {chain?.prettyName}
    </Text>
  );
};
