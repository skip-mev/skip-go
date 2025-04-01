import { createModal, ModalProps } from "@/components/Modal";
import {
  ModalHeader,
  StyledModalContainer,
  StyledModalInnerContainer,
} from "@/components/ModalHeader";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { sourceAssetAtom } from "@/state/swapPage";
import { useAtomValue } from "jotai";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { track } from "@amplitude/analytics-browser";
import { ConnectEco } from "@/components/ConnectEcoRow";
import { usePrimaryChainIdForChainType } from "@/hooks/usePrimaryChainIdForChainType";
import { ChainType } from "@skip-go/client";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export type ConnectedWalletModalProps = ModalProps;

export const ConnectedWalletModal = createModal(() => {
  const sourceAsset = useAtomValue(sourceAssetAtom);
  const { chainImage, chainName } = useGetAssetDetails({
    assetDenom: sourceAsset?.denom,
    chainId: sourceAsset?.chainID,
  });

  const primaryChainIdForChainType = usePrimaryChainIdForChainType();

  return (
    <StyledModalContainer gap={15}>
      <ModalHeader
        title="Wallets"
        onClickBackButton={() => {
          track("connect eco modal: header back button - clicked");
          NiceModal.remove(Modals.ConnectedWalletModal);
        }}
        rightContent={
          sourceAsset?.chainID ? (
            <img src={chainImage} height={36} width={36} title={chainName} />
          ) : null
        }
      />
      <StyledModalInnerContainer height={(ITEM_HEIGHT + ITEM_GAP) * 3}>
        <ConnectEco
          key={ChainType.Cosmos}
          chainID={primaryChainIdForChainType[ChainType.Cosmos]}
          chainType={ChainType.Cosmos}
          connectedWalletModal
        />
        <ConnectEco
          key={ChainType.EVM}
          chainID={primaryChainIdForChainType[ChainType.EVM]}
          chainType={ChainType.EVM}
          connectedWalletModal
        />
        <ConnectEco
          key={ChainType.SVM}
          chainID={primaryChainIdForChainType[ChainType.SVM]}
          chainType={ChainType.SVM}
          connectedWalletModal
        />
      </StyledModalInnerContainer>
    </StyledModalContainer>
  );
});
