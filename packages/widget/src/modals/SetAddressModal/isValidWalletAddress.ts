import { fromBech32 } from "@cosmjs/encoding";
import { isAddress } from "viem";
import { PublicKey } from "@solana/web3.js";
import { Chain, ChainType } from "@skip-go/client";
import { bech32m } from "bech32";

type isValidWalletAddressProps = {
  chain: Chain;
  address: string;
};

export const isValidWalletAddress = ({ chain, address }: isValidWalletAddressProps) => {
  switch (chain.chainType) {
    case ChainType.Cosmos:
      try {
        if (chain.chainID.includes("penumbra")) {
          try {
            return chain.bech32Prefix === bech32m.decode(address, 143)?.prefix;
          } catch {
            // The temporary solution to route around Noble address breakage.
            // This can be entirely removed once `noble-1` upgrades.
            return ["penumbracompat1", "tpenumbra"].includes(fromBech32(address).prefix);
          }
        }
        return chain.bech32Prefix === fromBech32(address).prefix;
      } catch {
        return false;
      }
    case ChainType.EVM:
      try {
        return isAddress(address);
      } catch (_error) {
        return false;
      }
    case ChainType.SVM:
      try {
        const publicKey = new PublicKey(address);
        return PublicKey.isOnCurve(publicKey);
      } catch (_error) {
        return false;
      }
    default:
      return false;
  }
};
