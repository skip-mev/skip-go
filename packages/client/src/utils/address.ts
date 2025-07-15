import { PublicKey } from "@solana/web3.js";
import { ClientState } from "../state/clientState";
import { ChainType } from "../types/swaggerTypes";
import { bech32m, bech32 } from "bech32";
import { isAddress } from "viem";
import type {
  UserAddress,
} from "src/types/client-types";

export const validateUserAddresses = async (userAddresses: UserAddress[]) => {
  const chains = await ClientState.getSkipChains();
  const validations = userAddresses.map((userAddress) => {
    const chain = chains.find((chain) => chain.chainId === userAddress.chainId);

    switch (chain?.chainType) {
      case ChainType.Cosmos:
        try {
          if (chain.chainId?.includes("penumbra")) {
            try {
              return (
                chain.bech32Prefix ===
                bech32m.decode(userAddress.address, 143)?.prefix
              );
            } catch {
              // The temporary solution to route around Noble address breakage.
              // This can be entirely removed once `noble-1` upgrades.
              return ["penumbracompat1", "tpenumbra"].includes(
                bech32.decode(userAddress.address, 1023).prefix
              );
            }
          }
          return (
            chain.bech32Prefix ===
            bech32.decode(userAddress.address, 1023).prefix
          );
        } catch {
          return false;
        }

      case ChainType.Evm:
        try {
          return isAddress(userAddress.address);
        } catch (_error) {
          return false;
        }
      case ChainType.Svm:
        try {
          const publicKey = new PublicKey(userAddress.address);
          return PublicKey.isOnCurve(publicKey);
        } catch (_error) {
          return false;
        }
      default:
        return false;
    }
  });

  return validations.every((validation) => validation);
};
