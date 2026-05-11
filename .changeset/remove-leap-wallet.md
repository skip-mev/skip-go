---
"@skip-go/widget": minor
---

Remove Leap wallet support from the widget following Leap's service shutdown. This removes the Cosmos browser extension (`WalletType.LEAP`), mobile WalletConnect entry (`WalletType.WC_LEAP_MOBILE`), and MetaMask Snap variant (`WalletType.METAMASK_SNAP_LEAP`) from the wallet selector, along with the Sei EVM multi-chain label branch for Leap.
