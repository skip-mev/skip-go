import { accountFromAny } from "@cosmjs/stargate";
import type { AccountParser } from "@cosmjs/stargate";
import { assertDefinedAndNotNull } from "@cosmjs/utils";
import { StridePeriodicVestingAccount } from "./stride";
import { decodePubkey } from "@cosmjs/proto-signing";
import { BaseAccount } from "cosmjs-types/cosmos/auth/v1beta1/auth.js";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys.js";
import { encodeSecp256k1Pubkey } from "@cosmjs/amino";
import { EthAccount } from "src/codegen/injective/types/v1beta1/account";

export const accountParser: AccountParser = (acc) => {
  switch (acc.typeUrl) {
    case "/stride.vesting.StridePeriodicVestingAccount": {
      const baseAccount = StridePeriodicVestingAccount.decode(acc.value)
        .baseVestingAccount?.baseAccount;
      assertDefinedAndNotNull(baseAccount);

      return {
        address: baseAccount.address,
        pubkey: baseAccount.pubKey ? decodePubkey(baseAccount.pubKey) : null,
        accountNumber: Number(baseAccount.accountNumber),
        sequence: Number(baseAccount.sequence),
      };
    }
    case "/injective.types.v1beta1.EthAccount":
      return accountEthParser(
        acc,
        "/injective.crypto.v1beta1.ethsecp256k1.PubKey",
      );
    case "/ethermint.types.v1.EthAccount":
      return accountEthParser(acc, "/ethermint.crypto.v1.ethsecp256k1.PubKey");
    default: {
      if (acc.typeUrl === "/cosmos.auth.v1beta1.BaseAccount") {
        const { address, pubKey, accountNumber, sequence } = BaseAccount.decode(
          acc.value,
        );
        switch (pubKey?.typeUrl) {
          case "/initia.crypto.v1beta1.ethsecp256k1.PubKey":
          case "/ethermint.crypto.v1.ethsecp256k1.PubKey":
          case "/cosmos.evm.crypto.v1.ethsecp256k1.PubKey": {
            const { key } = PubKey.decode(pubKey.value);
            const pk = encodeSecp256k1Pubkey(key);
            return {
              address,
              pubkey: pk,
              accountNumber: Number(accountNumber),
              sequence: Number(sequence),
            };
          }
        }
      }
      return accountFromAny(acc);
    }
  }
};

const accountEthParser = <T>(
  ethAccount: any,
  pubKeyTypeUrl: string = '/injective.crypto.v1beta1.ethsecp256k1.PubKey',
): T => {
  const account = EthAccount.decode(
    ethAccount.value as Uint8Array,
  )
  const baseAccount = account.baseAccount!
  const pubKey = baseAccount.pubKey

  return {
    address: baseAccount.address,
    pubkey: pubKey
      ? {
          type: pubKeyTypeUrl,
          value: Buffer.from(pubKey.value).toString('base64'),
        }
      : null,
    accountNumber: parseInt(baseAccount.accountNumber.toString(), 10),
    sequence: parseInt(baseAccount.sequence.toString(), 10),
  } as T
}
