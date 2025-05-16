// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/proto-signing/pubkey.ts

import { encodeSecp256k1Pubkey } from "@cosmjs/amino";
import type { Pubkey } from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { encodePubkey as cosmEncodePubkey } from "@cosmjs/proto-signing";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys.js";
import { Any } from "cosmjs-types/google/protobuf/any.js";
import { encodeEthSecp256k1Pubkey } from "../amino/encoding";
import type { AccountData } from "./signer";
import { getIsEthermint, getIsInitia } from "src/chains";

export function makePubkeyAnyFromAccount(account: AccountData, chainId: string) {
  const isEthermint = getIsEthermint(chainId);

  const pubkey = isEthermint
    ? encodeEthSecp256k1Pubkey(account.pubkey)
    : encodeSecp256k1Pubkey(account.pubkey);

  const pubkeyAny = encodePubkeyToAny(pubkey, chainId, isEthermint);

  return pubkeyAny;
}

export function encodePubkeyToAny(pubkey: Pubkey, chainId: string, isEthermint: boolean): Any {
  if (isEthermint) {
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
    const isInitia = getIsInitia(chainId);
    const pubkeyProto = PubKey.fromPartial({
      key: fromBase64(pubkey.value),
    });
    if (isInitia) {
      return Any.fromPartial({
        typeUrl: "/initia.crypto.v1beta1.ethsecp256k1.PubKey",
        value: Uint8Array.from(PubKey.encode(pubkeyProto).finish()),
      });
    }
    return cosmEncodePubkey(pubkey);
  }
}
