//@ts-nocheck
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgCreateClawbackVestingAccount, MsgFundVestingAccount, MsgClawback, MsgUpdateVestingFunder, MsgConvertVestingAccount } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/evmos.vesting.v2.MsgCreateClawbackVestingAccount", MsgCreateClawbackVestingAccount], ["/evmos.vesting.v2.MsgFundVestingAccount", MsgFundVestingAccount], ["/evmos.vesting.v2.MsgClawback", MsgClawback], ["/evmos.vesting.v2.MsgUpdateVestingFunder", MsgUpdateVestingFunder], ["/evmos.vesting.v2.MsgConvertVestingAccount", MsgConvertVestingAccount]];
export const MessageComposer = {
  encoded: {
    createClawbackVestingAccount(value: MsgCreateClawbackVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccount",
        value: MsgCreateClawbackVestingAccount.encode(value).finish()
      };
    },
    fundVestingAccount(value: MsgFundVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgFundVestingAccount",
        value: MsgFundVestingAccount.encode(value).finish()
      };
    },
    clawback(value: MsgClawback) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgClawback",
        value: MsgClawback.encode(value).finish()
      };
    },
    updateVestingFunder(value: MsgUpdateVestingFunder) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunder",
        value: MsgUpdateVestingFunder.encode(value).finish()
      };
    },
    convertVestingAccount(value: MsgConvertVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccount",
        value: MsgConvertVestingAccount.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    createClawbackVestingAccount(value: MsgCreateClawbackVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccount",
        value
      };
    },
    fundVestingAccount(value: MsgFundVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgFundVestingAccount",
        value
      };
    },
    clawback(value: MsgClawback) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgClawback",
        value
      };
    },
    updateVestingFunder(value: MsgUpdateVestingFunder) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunder",
        value
      };
    },
    convertVestingAccount(value: MsgConvertVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccount",
        value
      };
    }
  },
  toJSON: {
    createClawbackVestingAccount(value: MsgCreateClawbackVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccount",
        value: MsgCreateClawbackVestingAccount.toJSON(value)
      };
    },
    fundVestingAccount(value: MsgFundVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgFundVestingAccount",
        value: MsgFundVestingAccount.toJSON(value)
      };
    },
    clawback(value: MsgClawback) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgClawback",
        value: MsgClawback.toJSON(value)
      };
    },
    updateVestingFunder(value: MsgUpdateVestingFunder) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunder",
        value: MsgUpdateVestingFunder.toJSON(value)
      };
    },
    convertVestingAccount(value: MsgConvertVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccount",
        value: MsgConvertVestingAccount.toJSON(value)
      };
    }
  },
  fromJSON: {
    createClawbackVestingAccount(value: any) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccount",
        value: MsgCreateClawbackVestingAccount.fromJSON(value)
      };
    },
    fundVestingAccount(value: any) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgFundVestingAccount",
        value: MsgFundVestingAccount.fromJSON(value)
      };
    },
    clawback(value: any) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgClawback",
        value: MsgClawback.fromJSON(value)
      };
    },
    updateVestingFunder(value: any) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunder",
        value: MsgUpdateVestingFunder.fromJSON(value)
      };
    },
    convertVestingAccount(value: any) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccount",
        value: MsgConvertVestingAccount.fromJSON(value)
      };
    }
  },
  fromPartial: {
    createClawbackVestingAccount(value: MsgCreateClawbackVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccount",
        value: MsgCreateClawbackVestingAccount.fromPartial(value)
      };
    },
    fundVestingAccount(value: MsgFundVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgFundVestingAccount",
        value: MsgFundVestingAccount.fromPartial(value)
      };
    },
    clawback(value: MsgClawback) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgClawback",
        value: MsgClawback.fromPartial(value)
      };
    },
    updateVestingFunder(value: MsgUpdateVestingFunder) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunder",
        value: MsgUpdateVestingFunder.fromPartial(value)
      };
    },
    convertVestingAccount(value: MsgConvertVestingAccount) {
      return {
        typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccount",
        value: MsgConvertVestingAccount.fromPartial(value)
      };
    }
  }
};