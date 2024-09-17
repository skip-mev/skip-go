import { createModal, ModalProps, useModal } from "@/components/Modal";
import { RenderWalletList } from "@/components/RenderWalletList";
import { useWalletList } from "@/hooks/useWalletList";

export type WalletSelectorModalProps = ModalProps & {
  chainId?: string;
  onWalletConnected?: () => void;
};

export const WalletSelectorModal = createModal(
  (modalProps: WalletSelectorModalProps) => {
    const { chainId, onWalletConnected } = modalProps;
    const modal = useModal();
    const walletList = useWalletList(chainId);

    return (
      <RenderWalletList
        title="Connect wallet"
        walletList={walletList}
        onWalletConnected={onWalletConnected}
        onClickBackButton={() => modal.remove()}
      />
    );
  }
);
