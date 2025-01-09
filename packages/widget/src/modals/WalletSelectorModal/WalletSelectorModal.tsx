import { createModal, ModalProps } from "@/components/Modal";
import { RenderWalletList } from "@/components/RenderWalletList";
import { useWalletList } from "@/hooks/useWalletList";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "../registerModals";
import { ChainType } from "@skip-go/client";

export type WalletSelectorModalProps = ModalProps & {
  chainId?: string;
  chainType?: ChainType;
  connectEco?: boolean;
};

export const WalletSelectorModal = createModal((modalProps: WalletSelectorModalProps) => {
  const { chainId, chainType, connectEco } = modalProps;
  const walletList = useWalletList({ chainID: chainId, chainType });

  const handleOnClickBackButton = () => {
    NiceModal.remove(Modals.WalletSelectorModal);
    if (connectEco) {
      NiceModal.show(Modals.ConnectedWalletModal);
    }
  };

  return (
    <RenderWalletList
      title="Connect wallet"
      walletList={walletList}
      onClickBackButton={handleOnClickBackButton}
      isConnectEco={connectEco}
    />
  );
});
