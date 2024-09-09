import { createModal, ModalProps, useModal } from "@/components/Modal";
import { RenderWalletList, Wallet } from "@/components/RenderWalletList";
import { useCreateCosmosWallets } from "@/hooks/useCreateCosmosWallets";

export type WalletSelectorModalProps = ModalProps & {
  chainID?: string;
  onSelect: (wallet: Wallet) => void;
};

export const WALLET_LIST = [
  {
    name: "Keplr",
    imageUrl:
      "https://cdn.prod.website-files.com/63eb7ddf41cf5b1c8fdfbc74/63eb7ddf41cf5bddb7dfbcc9_Keplr_256.png",
    address: "cosmos17...zha0v",
  },
  {
    name: "Phantom",
    imageUrl: "https://phantom.app/favicon/favicon-32x32.png",
    address: "0x30f5d...D0B95",
  },
  {
    name: "MetaMask",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png",
    address: "0x30f5d...D0BFF",
  },
];

export const WalletSelectorModal = createModal(
  (modalProps: WalletSelectorModalProps) => {
    const { onSelect, chainID } = modalProps;
    const modal = useModal();
    const { createCosmosWallets } = useCreateCosmosWallets()
    const cosmosWallets = chainID ? createCosmosWallets(chainID) : [];
    return (
      <RenderWalletList
        title="Connect wallet"
        walletList={cosmosWallets}
        onSelect={onSelect}
        onClickBackButton={() => modal.remove()}
      />
    );
  }
);
