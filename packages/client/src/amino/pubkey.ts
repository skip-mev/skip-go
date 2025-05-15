// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/amino/pubkey.ts

import {
  pubkeyType as cosmPubkeyType,
} from "@cosmjs/amino";
import type { Pubkey, SinglePubkey } from "@cosmjs/amino";

export interface EthSecp256k1Pubkey extends SinglePubkey {
  readonly type: "ethermint/PubKeyEthSecp256k1";
  readonly value: string;
}

export function isEthSecp256k1Pubkey(
  pubkey: Pubkey,
): pubkey is EthSecp256k1Pubkey {
  return (pubkey as EthSecp256k1Pubkey).type === "ethermint/PubKeyEthSecp256k1";
}

export const pubkeyType = {
  ethsecp256k1: "ethermint/PubKeyEthSecp256k1" as const,
  ...cosmPubkeyType,
};
