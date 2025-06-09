// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/amino/encoding.ts

import { toBase64 } from "@cosmjs/encoding";

import { pubkeyType } from "./pubkey";
import type { EthSecp256k1Pubkey } from "./pubkey";

export function encodeEthSecp256k1Pubkey(
  pubkey: Uint8Array,
): EthSecp256k1Pubkey {
  if (pubkey.length !== 33 || (pubkey[0] !== 0x02 && pubkey[0] !== 0x03)) {
    throw new Error(
      "Public key must be compressed secp256k1, i.e. 33 bytes starting with 0x02 or 0x03",
    );
  }
  return {
    type: pubkeyType.ethsecp256k1,
    value: toBase64(pubkey),
  };
}
