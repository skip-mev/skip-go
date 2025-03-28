import { AccountParser, accountFromAny } from "@cosmjs/stargate";
import { assert } from "@cosmjs/utils";
import { StridePeriodicVestingAccount } from "./stride";
import { BaseAccount } from "./codegen/cosmos/auth/v1beta1/auth";
import { accountEthParser } from "@injectivelabs/sdk-ts";

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
    case "/injective.types.v1beta1.EthAccount":
      return accountEthParser(
        acc,
        "/injective.crypto.v1beta1.ethsecp256k1.PubKey",
      );
    case "/ethermint.types.v1.EthAccount":
      return accountEthParser(acc, "/ethermint.crypto.v1.ethsecp256k1.PubKey");
    default:
      return accountFromAny(acc);
  }
};
