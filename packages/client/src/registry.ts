import { accountFromAny } from "@cosmjs/stargate";
import type { AccountParser } from "@cosmjs/stargate";
import { assertDefinedAndNotNull } from "@cosmjs/utils";
import { StridePeriodicVestingAccount } from "./stride";
import { decodePubkey } from "@cosmjs/proto-signing";
import { accountEthParser } from "@injectivelabs/sdk-ts";
import { BaseAccount } from "cosmjs-types/cosmos/auth/v1beta1/auth.js";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys.js";
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
      }
      return accountFromAny(acc);
    }
  }
};
