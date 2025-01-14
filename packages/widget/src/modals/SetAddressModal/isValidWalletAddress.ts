import { fromBech32 } from "@cosmjs/encoding";
import { isAddress } from "viem";
import { PublicKey } from "@solana/web3.js";
import { ChainType } from "@skip-go/client";

type isValidWalletAddressProps = {
  address: string;
  chainType: ChainType | string;
  bech32Prefix: string;
};

export const isValidWalletAddress = ({
  address,
  chainType,
  bech32Prefix,
}: isValidWalletAddressProps) => {
  switch (chainType) {
    case ChainType.Cosmos:
      try {
        const { prefix } = fromBech32(address);
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
