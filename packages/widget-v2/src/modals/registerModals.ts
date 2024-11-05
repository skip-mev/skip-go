import NiceModal from "@ebay/nice-modal-react";
import { WalletSelectorModal } from "./WalletSelectorModal/WalletSelectorModal";
import { ConnectedWalletModal } from "./ConnectedWalletModal/ConnectedWalletModal";

export const registerModals = () => {
  NiceModal.register(Modals.WalletSelectorModal, WalletSelectorModal);
  NiceModal.register(Modals.ConnectedWalletModal, ConnectedWalletModal);
};

export enum Modals {
  WalletSelectorModal = "WalletSelectorModal",
  ConnectedWalletModal = "ConnectedWalletModal",
  SetAddressModal = "SetAddressModal",
  AssetAndChainSelectorModal = "AssetAndChainSelectorModal",
  SwapSettingsModal = "SwapSettingsModal",
}