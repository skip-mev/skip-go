import { createModal, ModalProps } from "@/components/Modal";
import { RenderWalletList } from "@/components/RenderWalletList";
import { useWalletList } from "@/hooks/useWalletList";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";

export type WalletSelectorModalProps = ModalProps & {
  chainId?: string;
  chainType?: "cosmos" | "evm" | "svm";
  connectEco?: boolean;
};

export const WalletSelectorModal = createModal(
  (modalProps: WalletSelectorModalProps) => {
    const { chainId, chainType, connectEco } = modalProps;
    const walletList = useWalletList({ chainID: chainId, chainType });

    return (
      <RenderWalletList
        title="Connect wallet"
        walletList={walletList}
        onClickBackButton={() => NiceModal.remove(Modals.WalletSelectorModal)}
        isConnectEco={connectEco}
      />
    );
  }
);
