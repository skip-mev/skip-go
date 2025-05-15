// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/proto-signing/signer.ts

import type { Algo as CosmAlgo } from "@cosmjs/proto-signing";

export type Algo = "eth_secp256k1" | "ethsecp256k1" | CosmAlgo;

export interface AccountData {
  /** A printable address (typically bech32 encoded) */
  readonly address: string;
  readonly algo: Algo;
  readonly pubkey: Uint8Array;
}
