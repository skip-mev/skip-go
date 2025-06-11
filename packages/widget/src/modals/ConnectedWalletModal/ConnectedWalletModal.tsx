import { createModal, ModalProps } from "@/components/Modal";
import { ModalHeader } from "@/components/ModalHeader";
import { StyledModalContainer } from "@/components/Modal";
import { StyledModalInnerContainer } from "@/components/Modal";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { track } from "@amplitude/analytics-browser";
import { EcosystemConnectors } from "@/modals/ConnectedWalletModal/EcosystemConnectors";

const ITEM_HEIGHT = 60;
const ITEM_GAP = 5;

export type ConnectedWalletModalProps = ModalProps;

export const ConnectedWalletModal = createModal(() => {
  return (
    <StyledModalContainer gap={15}>
      <ModalHeader
        title="Wallets"
        onClickBackButton={() => {
          track("connect eco modal: header back button - clicked");
          NiceModal.remove(Modals.ConnectedWalletModal);
        }}
      />
      <StyledModalInnerContainer height={(ITEM_HEIGHT + ITEM_GAP) * 3}>
        <EcosystemConnectors connectedWalletModal />
      </StyledModalInnerContainer>
    </StyledModalContainer>
  );
});
