import { AccountParser, accountFromAny } from "@cosmjs/stargate";
import { assertDefinedAndNotNull } from "@cosmjs/utils";
import { StridePeriodicVestingAccount } from "./stride";
import { decodePubkey } from "@cosmjs/proto-signing";
import { accountEthParser } from "@injectivelabs/sdk-ts";

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
    default:
      return accountFromAny(acc);
  }
};
