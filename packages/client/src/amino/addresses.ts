// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/amino/addresses.ts

import {
  pubkeyToRawAddress as cosmPubkeyToRawAddress,
} from "@cosmjs/amino";
import type { Pubkey } from "@cosmjs/amino";
import { keccak256 } from "@cosmjs/crypto";
import { fromBase64, toBech32 } from "@cosmjs/encoding";

import { isEthSecp256k1Pubkey } from "./pubkey";

export function rawEthSecp256k1PubkeyToRawAddress(
  pubkeyData: Uint8Array,
): Uint8Array {
  if (pubkeyData.length !== 65) {
    throw new Error(
      `Invalid ETHSecp256k1 pubkey length (compressed): ${pubkeyData.length}`,
    );
  }
  return keccak256(pubkeyData.slice(1)).slice(-20);
}

export function pubkeyToRawAddress(pubkey: Pubkey): Uint8Array {
  if (isEthSecp256k1Pubkey(pubkey)) {
    const pubkeyData = fromBase64(pubkey.value);
    return rawEthSecp256k1PubkeyToRawAddress(pubkeyData);
  } else {
    return cosmPubkeyToRawAddress(pubkey);
  }
}

export function pubkeyToAddress(pubkey: Pubkey, prefix: string): string {
  return toBech32(prefix, pubkeyToRawAddress(pubkey));
}
