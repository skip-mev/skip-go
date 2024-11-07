import { createModal, ModalProps, useModal } from "@/components/Modal";
import { RenderWalletList } from "@/components/RenderWalletList";
import { useWalletList } from "@/hooks/useWalletList";

export type WalletSelectorModalProps = ModalProps & {
  chainId?: string;
  chainType?: "cosmos" | "evm" | "svm";
  connectEco?: boolean;
};

export const WalletSelectorModal = createModal(
  (modalProps: WalletSelectorModalProps) => {
    const { chainId, chainType, connectEco } = modalProps;
    const modal = useModal();
    const walletList = useWalletList({ chainID: chainId, chainType });

    return (
      <RenderWalletList
        title="Connect wallet"
        walletList={walletList}
        onClickBackButton={() => modal.remove()}
        isConnectEco={connectEco}
      />
    );
  }
);
