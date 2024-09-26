import { createModal, ModalProps, useModal } from "@/components/Modal";
import { RenderWalletList } from "@/components/RenderWalletList";
import { useWalletList } from "@/hooks/useWalletList";

export type WalletSelectorModalProps = ModalProps & {
  chainId?: string;
};

export const WalletSelectorModal = createModal(
  (modalProps: WalletSelectorModalProps) => {
    const { chainId } = modalProps;
    const modal = useModal();
    const walletList = useWalletList(chainId);

    return (
      <RenderWalletList
        title="Connect wallet"
        walletList={walletList}
        onClickBackButton={() => modal.remove()}
      />
    );
  }
);
