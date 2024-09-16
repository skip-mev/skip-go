import { createModal, ModalProps, useModal } from "@/components/Modal";
import { RenderWalletList } from "@/components/RenderWalletList";
import { useWalletList } from "@/hooks/useWalletList";

export type WalletSelectorModalProps = ModalProps & {
  chainID?: string;
};

export const WalletSelectorModal = createModal(
  (modalProps: WalletSelectorModalProps) => {
    const { chainID } = modalProps;
    const modal = useModal();
    const walletList = useWalletList(chainID);

    return (
      <RenderWalletList
        title="Connect wallet"
        walletList={walletList}
        onClickBackButton={() => modal.remove()}
      />
    );
  }
);
