import NiceModal from "@ebay/nice-modal-react";
import { WalletSelectorModal } from "./WalletSelectorModal/WalletSelectorModal";
import { ConnectedWalletModal } from "./ConnectedWalletModal/ConnectedWalletModal";
import { SwapSettingsDrawer } from "./SwapSettingsDrawer/SwapSettingsDrawer";
import { AssetAndChainSelectorModal } from "./AssetAndChainSelectorModal/AssetAndChainSelectorModal";
import { SetAddressModal } from "./SetAddressModal/SetAddressModal";

export const registerModals = () => {
  NiceModal.register(Modals.AssetAndChainSelectorModal, AssetAndChainSelectorModal);
  NiceModal.register(Modals.ConnectedWalletModal, ConnectedWalletModal);
  NiceModal.register(Modals.SetAddressModal, SetAddressModal);
  NiceModal.register(Modals.SwapSettingsDrawer, SwapSettingsDrawer);
  NiceModal.register(Modals.WalletSelectorModal, WalletSelectorModal);
};

export enum Modals {
  AssetAndChainSelectorModal = "AssetAndChainSelectorModal",
  ConnectedWalletModal = "ConnectedWalletModal",
  SetAddressModal = "SetAddressModal",
  SwapSettingsDrawer = "SwapSettingsDrawer",
  WalletSelectorModal = "WalletSelectorModal",
}
