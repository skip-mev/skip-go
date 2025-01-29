import { AccountParser, accountFromAny } from "@cosmjs/stargate";
import { assert } from "@cosmjs/utils";
import { StridePeriodicVestingAccount } from "./stride";
import { BaseAccount } from "./codegen/cosmos/auth/v1beta1/auth";
import { InjectiveTypesV1Beta1Account } from "@injectivelabs/core-proto-ts";

export const accountParser: AccountParser = (acc) => {
  switch (acc.typeUrl) {
    case "/stride.vesting.StridePeriodicVestingAccount": {
      const baseAccount = StridePeriodicVestingAccount.decode(acc.value)
        .baseVestingAccount?.baseAccount;
      assert(baseAccount);
      return accountFromAny({
        typeUrl: "/cosmos.auth.v1beta1.BaseAccount",
        value: BaseAccount.encode(baseAccount).finish(),
      });
    }
    case "/injective.types.v1beta1.EthAccount": {
      const injAccount = InjectiveTypesV1Beta1Account.EthAccount.decode(
        acc.value as Uint8Array,
      );
      const baseInjAccount = injAccount.baseAccount!;
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
      const account = InjectiveTypesV1Beta1Account.EthAccount.decode(
        acc.value as Uint8Array,
      );
      const baseEthAccount = account.baseAccount!;
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
    default:
      return accountFromAny(acc);
  }
};
