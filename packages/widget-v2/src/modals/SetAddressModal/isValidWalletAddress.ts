import { fromBech32 } from "@cosmjs/encoding";
import { isAddress } from "viem";
import { PublicKey } from "@solana/web3.js";

type chainType = "cosmos" | "evm" | "svm" | string;

type isValidWalletAddressProps = {
  address: string;
  chainType: chainType;
  bech32Prefix: string;
}

export const isValidWalletAddress = ({
  address,
  chainType,
  bech32Prefix,
}: isValidWalletAddressProps) => {
  switch (chainType) {
    case "cosmos":
      try {
        const { prefix } = fromBech32(address);
        return bech32Prefix === prefix;
      } catch (_error) {
        return false;
      }
    case "evm":
      try {
        return isAddress(address);
      } catch (_error) {
        return false;
      }
    case "svm":
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
