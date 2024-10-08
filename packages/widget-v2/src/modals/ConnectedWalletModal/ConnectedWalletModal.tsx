import { GhostButton } from "@/components/Button";
import { Row } from "@/components/Layout";
import { createModal, ModalProps, useModal } from "@/components/Modal";
import {
  ModalHeader,
  StyledModalContainer,
  StyledModalInnerContainer,
} from "@/components/ModalHeader";
import { ModalRowItem } from "@/components/ModalRowItem";
import { TextButton } from "@/components/Typography";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { useWalletList } from "@/hooks/useWalletList";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue } from "jotai";
import { WalletSelectorModal } from "../WalletSelectorModal/WalletSelectorModal";
import { getTruncatedAddress } from "@/utils/crypto";
import { useGetAccount } from "@/hooks/useGetAccount";
import { copyToClipboard } from "@/utils/misc";
import { RightArrowIcon } from "@/icons/ArrowIcon";
import { useMemo } from "react";
import { useTheme } from "styled-components";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export const ConnectedWalletModal = createModal((_modalProps: ModalProps) => {
  const modal = useModal();
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { chainImage, chainName } = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });

  return (
    <StyledModalContainer gap={15}>
      <ModalHeader
        title="Wallets"
        onClickBackButton={modal.remove}
        rightContent={() => {
          return sourceAsset?.chainID ? (
            <img src={chainImage} height={36} width={36} title={chainName} />
          ) : null;
        }}
      />
      <StyledModalInnerContainer height={(ITEM_HEIGHT + ITEM_GAP) * 3}>
        <ConnectEco key="cosmos" chainID="cosmoshub-4" chainType="cosmos" />
        <ConnectEco key="evm" chainID="1" chainType="evm" />
        <ConnectEco key="svm" chainID="solana" chainType="svm" />
      </StyledModalInnerContainer>
    </StyledModalContainer>
  );
});

const ConnectEco = ({
  chainType,
  chainID,
}: {
  chainType: "cosmos" | "svm" | "evm";
  chainID: string;
}) => {
  const theme = useTheme();
  const getAccount = useGetAccount();
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { chain } = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });
  const account = useMemo(() => {
    return getAccount(
      chainType === "cosmos" && chain?.chainType === "cosmos"
        ? sourceAsset?.chainID
        : chainID
    );
  }, [chain?.chainType, chainID, chainType, getAccount, sourceAsset?.chainID]);

  const truncatedAddress = getTruncatedAddress(account?.address);
  const wallets = useWalletList({ chainType });
  const connectedWallet = wallets.find(
    (wallet) => wallet.walletName === account?.wallet.name
  );
  const selectWalletmodal = useModal(WalletSelectorModal);

  return (
    <ModalRowItem
      style={{ marginTop: ITEM_GAP }}
      onClick={() => {
        selectWalletmodal.show({
          chainType,
          connectEco: true,
        });
      }}
      leftContent={
        account ? (
          <Row align="center" gap={10}>
            {
              <img
                height={35}
                width={35}
                style={{ objectFit: "cover" }}
                src={account?.wallet.logo}
                alt={`${account?.wallet.prettyName} logo`}
                title={account?.wallet.prettyName}
              />
            }

            <TextButton
              title={account?.address}
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(account?.address);
              }}
            >
              {truncatedAddress}
            </TextButton>
          </Row>
        ) : (
          <TextButton>
            Connect to{" "}
            {chainType === "cosmos"
              ? "Cosmos"
              : chainType === "evm"
                ? "Ethereum"
                : "Solana"}
          </TextButton>
        )
      }
      rightContent={
        account ? (
          <GhostButton
            onClick={(e) => {
              e.stopPropagation();
              connectedWallet?.disconnect();
            }}
          >
            Disconnect
          </GhostButton>
        ) : (
          <RightArrowIcon
            color={theme?.primary?.background.normal}
            backgroundColor={theme.primary.text.normal}
          />
        )
      }
    />
  );
};
