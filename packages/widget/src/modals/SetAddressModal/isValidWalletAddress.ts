import { fromBech32 } from "@cosmjs/encoding";
import { isAddress } from "viem";
import { PublicKey } from "@solana/web3.js";
import { ChainType } from "@skip-go/client";
import { bech32m } from "bech32";

type isValidWalletAddressProps = {
  address: string;
  chainType: ChainType | string;
  bech32Prefix: string;
  chainId?: string;
};

export const isValidWalletAddress = ({
  address,
  chainType,
  bech32Prefix,
  chainId,
}: isValidWalletAddressProps) => {
  console.log("address", address);
  console.log("chainType", chainType);
  console.log("bech32Prefix", bech32Prefix);
  console.log("chainId", chainId);
  if (chainId?.includes("penumbra")) {
    try {
      return bech32Prefix === bech32m.decode(address, 143)?.prefix;
    } catch {
      // The temporary solution to route around Noble address breakage.
      // This can be entirely removed once `noble-1` upgrades.
      return ["penumbracompat1", "tpenumbra"].includes(fromBech32(address).prefix);
    }
  }
  switch (chainType) {
    case ChainType.Cosmos:
      try {
        const { prefix } = fromBech32(address);
        console.log("prefix", prefix);
        return bech32Prefix === prefix;
      } catch (_error) {
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
