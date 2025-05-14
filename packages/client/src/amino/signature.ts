// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/amino/signature.ts

import {
  decodeSignature as cosmDecodeSignature,
} from "@cosmjs/amino";
import type { StdSignature } from "@cosmjs/amino";
import { fromBase64, toBase64 } from "@cosmjs/encoding";

import { encodeEthSecp256k1Pubkey } from "./encoding";
import { pubkeyType } from "./pubkey";

/**
 * Takes a binary pubkey and signature to create a signature object
 *
 * @param pubkey a compressed eth_secp256k1 public key
 * @param signature a 64 byte fixed length representation of eth_secp256k1 signature components r and s
 */
export function encodeEthSecp256k1Signature(
  pubkey: Uint8Array,
  signature: Uint8Array,
): StdSignature {
  if (signature.length !== 64) {
    throw new Error(
      "Signature must be 64 bytes long. Merlion uses a 2x32 byte fixed length encoding for the eth_secp256k1 signature integers r and s.",
    );
  }

  return {
    pub_key: encodeEthSecp256k1Pubkey(pubkey),
    signature: toBase64(signature),
  };
}

export function decodeSignature(signature: StdSignature): {
  readonly pubkey: Uint8Array;
  readonly signature: Uint8Array;
} {
  switch (signature.pub_key.type) {
    // Note: please don't add cases here without writing additional unit tests
    case pubkeyType.ethsecp256k1:
      return {
        pubkey: fromBase64(signature.pub_key.value),
        signature: fromBase64(signature.signature),
      };
    default:
      return cosmDecodeSignature(signature);
  }
}
