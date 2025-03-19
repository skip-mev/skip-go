// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/proto-signing/pubkey.ts

import { Pubkey, encodeSecp256k1Pubkey } from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { encodePubkey as cosmEncodePubkey } from "@cosmjs/proto-signing";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import { Any } from "cosmjs-types/google/protobuf/any";
import { encodeEthSecp256k1Pubkey } from "../amino/encoding";
import { AccountData } from "./signer";
import { getKeyAlgos } from "src/chains";

export function makePubkeyAnyFromAccount(
  account: AccountData,
  chainId: string,
) {
  const keyAlgos = getKeyAlgos(chainId);

  const isEthermint = Boolean(keyAlgos?.includes("ethsecp256k1"));

  const pubkey = isEthermint
    ? encodeEthSecp256k1Pubkey(account.pubkey)
    : encodeSecp256k1Pubkey(account.pubkey);

  const pubkeyAny = encodePubkeyToAny(pubkey, chainId, isEthermint);

  return pubkeyAny;
}

export function encodePubkeyToAny(
  pubkey: Pubkey,
  chainId: string,
  isEthermint: boolean,
): Any {
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
    return cosmEncodePubkey(pubkey);
  }
}
