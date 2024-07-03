//@ts-nocheck
import { MsgCreateClawbackVestingAccount, MsgFundVestingAccount, MsgClawback, MsgUpdateVestingFunder, MsgConvertVestingAccount } from "./tx";
export const AminoConverter = {
  "/evmos.vesting.v2.MsgCreateClawbackVestingAccount": {
    aminoType: "evmos/MsgCreateClawbackVestingAccount",
    toAmino: MsgCreateClawbackVestingAccount.toAmino,
    fromAmino: MsgCreateClawbackVestingAccount.fromAmino
  },
  "/evmos.vesting.v2.MsgFundVestingAccount": {
    aminoType: "evmos/MsgFundVestingAccount",
    toAmino: MsgFundVestingAccount.toAmino,
    fromAmino: MsgFundVestingAccount.fromAmino
  },
  "/evmos.vesting.v2.MsgClawback": {
    aminoType: "evmos/MsgClawback",
    toAmino: MsgClawback.toAmino,
    fromAmino: MsgClawback.fromAmino
  },
  "/evmos.vesting.v2.MsgUpdateVestingFunder": {
    aminoType: "evmos/MsgUpdateVestingFunder",
    toAmino: MsgUpdateVestingFunder.toAmino,
    fromAmino: MsgUpdateVestingFunder.fromAmino
  },
  "/evmos.vesting.v2.MsgConvertVestingAccount": {
    aminoType: "evmos/MsgConvertVestingAccount",
    toAmino: MsgConvertVestingAccount.toAmino,
    fromAmino: MsgConvertVestingAccount.fromAmino
  }
};