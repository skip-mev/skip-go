// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/proto-signing/signer.ts

import { OfflineAminoSigner } from "@cosmjs/amino";
import { Algo as CosmAlgo, DirectSignResponse } from "@cosmjs/proto-signing";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

export type Algo = "eth_secp256k1" | "ethsecp256k1" | CosmAlgo;

export interface AccountData {
  /** A printable address (typically bech32 encoded) */
  readonly address: string;
  readonly algo: Algo;
  readonly pubkey: Uint8Array;
}

export interface OfflineDirectSigner {
  readonly getAccounts: () => Promise<readonly AccountData[]>;
  readonly signDirect: (
    signerAddress: string,
    signDoc: SignDoc,
  ) => Promise<DirectSignResponse>;
}

export type OfflineSigner = OfflineAminoSigner | OfflineDirectSigner;

export function isOfflineDirectSigner(
  signer: OfflineSigner,
): signer is OfflineDirectSigner {
  return (signer as OfflineDirectSigner).signDirect !== undefined;
}
