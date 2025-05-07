// https://github.com/archmage-live/archmage-x/blob/develop/lib/network/cosm/amino/pubkey.ts

import { Pubkey, SinglePubkey, pubkeyType as cosmPubkeyType } from "@cosmjs/amino";

export type EthSecp256k1Pubkey = {
  readonly type: "ethermint/PubKeyEthSecp256k1";
  readonly value: string;
} & SinglePubkey;

export function isEthSecp256k1Pubkey(pubkey: Pubkey): pubkey is EthSecp256k1Pubkey {
  return (pubkey as EthSecp256k1Pubkey).type === "ethermint/PubKeyEthSecp256k1";
}

export const pubkeyType = {
  ethsecp256k1: "ethermint/PubKeyEthSecp256k1" as const,
  ...cosmPubkeyType,
};
