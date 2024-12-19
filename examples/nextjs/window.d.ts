import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  interface Window extends KeplrWindow {
    ethereum: import("@metamask/providers").MetaMaskInpageProvider;
  }
}
