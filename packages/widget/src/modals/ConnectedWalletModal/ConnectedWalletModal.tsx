import { createModal, ModalProps } from "@/components/Modal";
import {
  ModalHeader,
  StyledModalContainer,
  StyledModalInnerContainer,
} from "@/components/ModalHeader";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue } from "jotai";
import { onlyTestnetsAtom } from "@/state/skipClient";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { ChainType } from "@skip-go/client";
import { track } from "@amplitude/analytics-browser";
import { ConnectEco } from "@/components/ConnectEcoRow";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export type ConnectedWalletModalProps = ModalProps;

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
