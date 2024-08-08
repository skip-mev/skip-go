// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/proto-signing/pubkey.ts

import {
  MultisigThresholdPubkey,
  Pubkey,
  SinglePubkey,
  encodeSecp256k1Pubkey,
} from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { encodePubkey as cosmEncodePubkey } from "@cosmjs/proto-signing";
import { LegacyAminoPubKey } from "cosmjs-types/cosmos/crypto/multisig/keys";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import { Any } from "cosmjs-types/google/protobuf/any";
import { encodeEthSecp256k1Pubkey } from "../amino/encoding";
import { isEthSecp256k1Pubkey } from "../amino/pubkey";
import { AccountData } from "./signer";

export function makePubkeyAnyFromAccount(
  account: AccountData,
  chainId?: string,
) {
  const algo = `${account.algo}`;

  // Some impl use `eth_secp256k1` and some use `ethsecp256k1`, so we check for both
  const isEthSecp256k1 = algo === "eth_secp256k1" || algo === "ethsecp256k1";

  const pubkey = isEthSecp256k1
    ? encodeEthSecp256k1Pubkey(account.pubkey)
    : encodeSecp256k1Pubkey(account.pubkey);

  const pubkeyAny = encodePubkeyToAny(pubkey, chainId);

  return pubkeyAny;
}

export function encodePubkeyToAny(pubkey: Pubkey, chainId?: string): Any {
  if (isEthSecp256k1Pubkey(pubkey)) {
    const pubkeyProto = PubKey.fromPartial({
      key: fromBase64(pubkey.value),
    });
    let typeUrl = "";
    if (chainId?.includes("injective")) {
      typeUrl = "/injective.crypto.v1beta1.ethsecp256k1.PubKey";
    } else {
      typeUrl = "/ethermint.crypto.v1.ethsecp256k1.PubKey";
    }
    return Any.fromPartial({
      typeUrl,
      value: Uint8Array.from(PubKey.encode(pubkeyProto).finish()),
    });
  } else {
    return cosmEncodePubkey(pubkey);
  }
}

function decodeAnyToPubkey(pubkey: Any): SinglePubkey {
  switch (pubkey.typeUrl) {
    case "/ethermint.crypto.v1.ethsecp256k1.PubKey": {
      const { key } = PubKey.decode(pubkey.value);
      return encodeEthSecp256k1Pubkey(key);
    }
    case "/cosmos.crypto.secp256k1.PubKey": {
      const { key } = PubKey.decode(pubkey.value);
      return encodeSecp256k1Pubkey(key);
    }
    default:
      throw new Error(
        `Pubkey type_url ${pubkey.typeUrl} not recognized as single public key type`,
      );
  }
}

export function decodePubkey(pubkey?: Any | null): Pubkey | null {
  if (!pubkey || !pubkey.value) {
    return null;
  }

  switch (pubkey.typeUrl) {
    case "/ethermint.crypto.v1.ethsecp256k1.PubKey": {
      return decodeAnyToPubkey(pubkey);
    }
    case "/cosmos.crypto.secp256k1.PubKey": {
      return decodeAnyToPubkey(pubkey);
    }
    case "/cosmos.crypto.multisig.LegacyAminoPubKey": {
      const { threshold, publicKeys } = LegacyAminoPubKey.decode(pubkey.value);
      const out: MultisigThresholdPubkey = {
        type: "tendermint/PubKeyMultisigThreshold",
        value: {
          threshold: threshold.toString(),
          pubkeys: publicKeys.map(decodeAnyToPubkey),
        },
      };
      return out;
    }
    default:
      throw new Error(`Pubkey type_url ${pubkey.typeUrl} not recognized`);
  }
}
