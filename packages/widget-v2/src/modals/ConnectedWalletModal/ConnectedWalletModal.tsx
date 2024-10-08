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
import { copyToClipboard } from "@/utils/misc";
import { useGetAccount } from "@/hooks/useGetAccount";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export const ConnectedWalletModal = createModal(
  (_modalProps: ModalProps) => {
    const modal = useModal();
    const sourceAsset = useAtomValue(sourceAssetAtom);
    const { chainImage, chainName } = useGetAssetDetails({
      assetDenom: sourceAsset?.denom,
      chainId: sourceAsset?.chainID,
    });
    const getAccount = useGetAccount();
    const sourceAccount = getAccount(sourceAsset?.chainID);
    const truncatedAddress = getTruncatedAddress(sourceAccount?.address);
    const wallets = useWalletList(sourceAsset?.chainID);
    const connectedWallet = wallets.find((wallet) => wallet.walletName === sourceAccount?.wallet.name);
    const selectWalletmodal = useModal(WalletSelectorModal);

    return (
      <StyledModalContainer gap={15}>
        <ModalHeader
          title="Connected Wallet"
          onClickBackButton={modal.remove}
          rightContent={() => {
            return (
              <img src={chainImage} height={36} width={36} title={chainName} />
            );
          }}
        />
        <StyledModalInnerContainer height={(ITEM_HEIGHT + ITEM_GAP) * 1}>
          <ModalRowItem
            style={{ marginTop: ITEM_GAP }}
            onClick={() => {
              selectWalletmodal.show({
                chainId: sourceAsset?.chainID,
              });
            }}
            leftContent={
              <Row align="center" gap={10}>
                {
                  <img
                    height={35}
                    width={35}
                    style={{ objectFit: "cover" }}
                    src={sourceAccount?.wallet.logo}
                    alt={`${sourceAccount?.wallet.prettyName} logo`}
                    title={sourceAccount?.wallet.prettyName}
                  />
                }

                <TextButton
                  title={sourceAccount?.address}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(sourceAccount?.address);
                  }}
                >
                  {truncatedAddress}
                </TextButton>
              </Row>
            }
            rightContent={
              <GhostButton
                onClick={(e) => {
                  e.stopPropagation();
                  connectedWallet?.disconnect();
                  modal.remove();
                }}
              >
                Disconnect
              </GhostButton>
            }
          />
        </StyledModalInnerContainer>
      </StyledModalContainer>
    );
  });
