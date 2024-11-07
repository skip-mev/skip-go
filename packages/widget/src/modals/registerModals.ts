import NiceModal from "@ebay/nice-modal-react";
import { WalletSelectorModal } from "./WalletSelectorModal/WalletSelectorModal";
import { ConnectedWalletModal } from "./ConnectedWalletModal/ConnectedWalletModal";
import { SwapSettingsDrawer } from "./SwapSettingsDrawer/SwapSettingsDrawer";
import { AssetAndChainSelectorModal } from "./AssetAndChainSelectorModal/AssetAndChainSelectorModal";

export const registerModals = () => {
  NiceModal.register(Modals.SwapSettingsDrawer, SwapSettingsDrawer);
  NiceModal.register(Modals.WalletSelectorModal, WalletSelectorModal);
  NiceModal.register(Modals.ConnectedWalletModal, ConnectedWalletModal);
  NiceModal.register(Modals.AssetAndChainSelectorModal, AssetAndChainSelectorModal);
};

export enum Modals {
  WalletSelectorModal = "WalletSelectorModal",
  ConnectedWalletModal = "ConnectedWalletModal",
  SetAddressModal = "SetAddressModal",
  AssetAndChainSelectorModal = "AssetAndChainSelectorModal",
  SwapSettingsDrawer = "SwapSettingsDrawer",
}