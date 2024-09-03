import { chains as _mainnetChains, assets as _mainnetAssets } from "chain-registry/mainnet"
import { chains as _testnetChains, assets as _testnetAssets } from "chain-registry/testnet"
import { chainRegistryChainToKeplr } from "@chain-registry/keplr";



export const mainnetChains = _mainnetChains.map((chain) => {
  return chainRegistryChainToKeplr(chain, _mainnetAssets)
})

export const testnetChains = _testnetChains.map((chain) => {
  return chainRegistryChainToKeplr(chain, _testnetAssets)
})
