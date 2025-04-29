import { isAddress } from "viem";
import { PublicKey } from "@solana/web3.js";
import { bech32m, bech32 } from "@/utils/bech32";
import { ChainType } from "@skip-go/client";

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
  if (chainId?.includes("penumbra")) {
    try {
      return bech32Prefix === bech32m.decode(address, 143)?.prefix;
    } catch {
      // The temporary solution to route around Noble address breakage.
      // This can be entirely removed once `noble-1` upgrades.
      return ["penumbracompat1", "tpenumbra"].includes(bech32.decode(address).prefix);
    }
  }
  switch (chainType) {
    case ChainType.Cosmos:
      try {
        const { prefix } = bech32.decode(address);
        return bech32Prefix === prefix;
      } catch (_error) {
        return false;
      }
    case ChainType.Evm:
      try {
        return isAddress(address);
      } catch (_error) {
        return false;
      }
    case ChainType.Svm:
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
