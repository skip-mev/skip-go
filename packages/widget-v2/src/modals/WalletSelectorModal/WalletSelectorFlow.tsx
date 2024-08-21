import { createModal, ModalProps, useModal } from '@/components/Modal';
import { RenderWalletList, Wallet } from '@/components/RenderWalletList';

export type WalletSelectorModalProps = ModalProps & {
  onSelect: (wallet: Wallet) => void;
};

export const WALLET_LIST: Wallet[] = [
  {
    name: 'Keplr',
    imageUrl:
      'https://cdn.prod.website-files.com/63eb7ddf41cf5b1c8fdfbc74/63eb7ddf41cf5bddb7dfbcc9_Keplr_256.png',
    address: 'cosmos17...zha0v',
  },
  {
    name: 'Phantom',
    imageUrl: 'https://phantom.app/favicon/favicon-32x32.png',
    address: '0x30f5d...D0B95',
  },
  {
    name: 'MetaMask',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png',
    address: '0x30f5d...D0BFF',
  },
];

export const WalletSelectorModal = createModal(
  (modalProps: WalletSelectorModalProps) => {
    const { onSelect } = modalProps;
    const modal = useModal();

    return (
      <RenderWalletList
        title="Connect wallet"
        walletList={WALLET_LIST}
        onSelect={onSelect}
        onClickBackButton={() => modal.remove()}
      />
    );
  }
);
