import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal, ModalProps } from '../../components/Modal';
import { RenderWalletList } from '../../components/RenderWalletList';

export type WalletSelectorFlowProps = ModalProps & {
  onSelect: (wallet: Wallet) => void;
};

type Wallet = {
  name: string;
  imageUrl?: string;
  rightContent?: () => React.ReactNode;
};

export const WALLET_LIST: Wallet[] = [
  {
    name: 'Keplr',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png',
  },
  {
    name: 'Phantom',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png',
  },
  {
    name: 'MetaMask',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png',
  },
];

export const WalletSelectorFlow = NiceModal.create(
  (modalProps: WalletSelectorFlowProps) => {
    const { onSelect } = modalProps;
    const modal = useModal();

    return (
      <Modal {...modalProps}>
        <RenderWalletList
          title="Connect wallet"
          walletList={WALLET_LIST}
          onSelect={onSelect}
          onClickBackButton={() => modal.remove()}
        />
      </Modal>
    );
  }
);
