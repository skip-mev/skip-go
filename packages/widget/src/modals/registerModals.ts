import NiceModal from "@ebay/nice-modal-react";
import { WalletSelectorModal } from "./WalletSelectorModal/WalletSelectorModal";
import { ConnectedWalletModal } from "./ConnectedWalletModal/ConnectedWalletModal";
import { SwapSettingsDrawer } from "./SwapSettingsDrawer/SwapSettingsDrawer";

export const registerModals = () => {
  NiceModal.register(Modals.WalletSelectorModal, WalletSelectorModal);
  NiceModal.register(Modals.ConnectedWalletModal, ConnectedWalletModal);
  NiceModal.register(Modals.SwapSettingsDrawer, SwapSettingsDrawer);
};

export enum Modals {
  WalletSelectorModal = "WalletSelectorModal",
  ConnectedWalletModal = "ConnectedWalletModal",
  SetAddressModal = "SetAddressModal",
  AssetAndChainSelectorModal = "AssetAndChainSelectorModal",
  SwapSettingsDrawer = "SwapSettingsDrawer",
}