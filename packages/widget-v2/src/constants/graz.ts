import { chains as _mainnetChains, assets as _mainnetAssets } from "chain-registry/mainnet"
import { chains as _testnetChains, assets as _testnetAssets } from "chain-registry/testnet"
import { chainRegistryChainToKeplr } from "@chain-registry/keplr";
import { ChainInfo } from "@keplr-wallet/types";



export const mainnetChains = _mainnetChains.map((chain) => {
  try {
    return chainRegistryChainToKeplr(chain, _mainnetAssets)
  } catch (_error) {
    return false
  }
}).filter(Boolean) as ChainInfo[]

export const testnetChains = _testnetChains.map((chain) => {
  try {
    return chainRegistryChainToKeplr(chain, _testnetAssets)
  } catch (_error) {
    return false
  }
}).filter(Boolean) as ChainInfo[]
