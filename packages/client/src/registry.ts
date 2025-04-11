import { AccountParser, accountFromAny } from "@cosmjs/stargate";
import { assertDefinedAndNotNull } from "@cosmjs/utils";
import { StridePeriodicVestingAccount } from "./stride";
import { EthAccount } from "@injectivelabs/core-proto-ts/cjs/injective/types/v1beta1/account";
import { decodePubkey } from "@cosmjs/proto-signing";
import { BaseAccount } from "cosmjs-types/cosmos/auth/v1beta1/auth";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import { encodeSecp256k1Pubkey } from "@cosmjs/amino";

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
    case "/injective.types.v1beta1.EthAccount": {
      const injAccount = EthAccount.decode(acc.value as Uint8Array);
      const baseInjAccount = injAccount.baseAccount;
      assertDefinedAndNotNull(baseInjAccount);

      const pubKey = baseInjAccount.pubKey;

      return {
        address: baseInjAccount.address,
        pubkey: pubKey
          ? {
              type: "/injective.crypto.v1beta1.ethsecp256k1.PubKey",
              value: Buffer.from(pubKey.value).toString("base64"),
            }
          : null,
        accountNumber: Number(baseInjAccount.accountNumber),
        sequence: Number(baseInjAccount.sequence),
      };
    }
    case "/ethermint.types.v1.EthAccount": {
      const account = EthAccount.decode(acc.value as Uint8Array);
      const baseEthAccount = account.baseAccount;
      assertDefinedAndNotNull(baseEthAccount);

      const pubKeyEth = baseEthAccount.pubKey;

      return {
        address: baseEthAccount.address,
        pubkey: pubKeyEth
          ? {
              type: "/ethermint.crypto.v1.ethsecp256k1.PubKey",
              value: Buffer.from(pubKeyEth.value).toString("base64"),
            }
          : null,
        accountNumber: Number(baseEthAccount.accountNumber),
        sequence: Number(baseEthAccount.sequence),
      };
    }
    default: {
      if (acc.typeUrl === "/cosmos.auth.v1beta1.BaseAccount") {
        const { address, pubKey, accountNumber, sequence } = BaseAccount.decode(
          acc.value,
        );
        if (pubKey?.typeUrl === "/initia.crypto.v1beta1.ethsecp256k1.PubKey") {
          const { key } = PubKey.decode(pubKey.value);
          const pk = encodeSecp256k1Pubkey(key);
          return {
            address,
            pubkey: pk,
            accountNumber: Number(accountNumber),
            sequence: Number(sequence),
          };
        }
        return accountFromAny(acc);
      }
      return accountFromAny(acc);
    }
  }
};
