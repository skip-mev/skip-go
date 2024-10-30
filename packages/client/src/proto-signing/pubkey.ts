// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/proto-signing/pubkey.ts

import {
  Pubkey,
  encodeSecp256k1Pubkey,
} from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { encodePubkey as cosmEncodePubkey } from "@cosmjs/proto-signing";
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
  const isDymension = chainId?.includes("dymension");
  const pubkey = (isEthSecp256k1 || isDymension)
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
    } else if (chainId?.includes("dymension")) {
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
