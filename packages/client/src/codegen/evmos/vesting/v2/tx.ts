//@ts-nocheck
import { Timestamp } from "../../../google/protobuf/timestamp";
import { Period, PeriodAmino, PeriodSDKType } from "../../../cosmos/vesting/v1beta1/vesting";
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import _m0 from "protobufjs/minimal.js";
import { isSet, toTimestamp, fromTimestamp, fromJsonTimestamp } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/**
 * MsgCreateClawbackVestingAccount defines a message that enables creating a
 * ClawbackVestingAccount.
 */
export interface MsgCreateClawbackVestingAccount {
  /** funder_address specifies the account that will be able to fund the vesting account */
  funderAddress: string;
  /** vesting_address specifies the address that will receive the vesting tokens */
  vestingAddress: string;
  /** enable_gov_clawback specifies whether the governance module can clawback this account */
  enableGovClawback: boolean;
}
export interface MsgCreateClawbackVestingAccountProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccount";
  value: Uint8Array;
}
/**
 * MsgCreateClawbackVestingAccount defines a message that enables creating a
 * ClawbackVestingAccount.
 */
export interface MsgCreateClawbackVestingAccountAmino {
  /** funder_address specifies the account that will be able to fund the vesting account */
  funder_address?: string;
  /** vesting_address specifies the address that will receive the vesting tokens */
  vesting_address?: string;
  /** enable_gov_clawback specifies whether the governance module can clawback this account */
  enable_gov_clawback?: boolean;
}
export interface MsgCreateClawbackVestingAccountAminoMsg {
  type: "evmos/MsgCreateClawbackVestingAccount";
  value: MsgCreateClawbackVestingAccountAmino;
}
/**
 * MsgCreateClawbackVestingAccount defines a message that enables creating a
 * ClawbackVestingAccount.
 */
export interface MsgCreateClawbackVestingAccountSDKType {
  funder_address: string;
  vesting_address: string;
  enable_gov_clawback: boolean;
}
/**
 * MsgCreateClawbackVestingAccountResponse defines the
 * MsgCreateClawbackVestingAccount response type.
 */
export interface MsgCreateClawbackVestingAccountResponse {}
export interface MsgCreateClawbackVestingAccountResponseProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccountResponse";
  value: Uint8Array;
}
/**
 * MsgCreateClawbackVestingAccountResponse defines the
 * MsgCreateClawbackVestingAccount response type.
 */
export interface MsgCreateClawbackVestingAccountResponseAmino {}
export interface MsgCreateClawbackVestingAccountResponseAminoMsg {
  type: "evmos/MsgCreateClawbackVestingAccountResponse";
  value: MsgCreateClawbackVestingAccountResponseAmino;
}
/**
 * MsgCreateClawbackVestingAccountResponse defines the
 * MsgCreateClawbackVestingAccount response type.
 */
export interface MsgCreateClawbackVestingAccountResponseSDKType {}
/**
 * MsgFundVestingAccount defines a message that enables funding an existing clawback
 * vesting account.
 */
export interface MsgFundVestingAccount {
  /** funder_address specifies the account that funds the vesting account */
  funderAddress: string;
  /** vesting_address specifies the account that receives the funds */
  vestingAddress: string;
  /** start_time defines the time at which the vesting period begins */
  startTime: Date;
  /** lockup_periods defines the unlocking schedule relative to the start_time */
  lockupPeriods: Period[];
  /** vesting_periods defines the vesting schedule relative to the start_time */
  vestingPeriods: Period[];
}
export interface MsgFundVestingAccountProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgFundVestingAccount";
  value: Uint8Array;
}
/**
 * MsgFundVestingAccount defines a message that enables funding an existing clawback
 * vesting account.
 */
export interface MsgFundVestingAccountAmino {
  /** funder_address specifies the account that funds the vesting account */
  funder_address?: string;
  /** vesting_address specifies the account that receives the funds */
  vesting_address?: string;
  /** start_time defines the time at which the vesting period begins */
  start_time?: string;
  /** lockup_periods defines the unlocking schedule relative to the start_time */
  lockup_periods?: PeriodAmino[];
  /** vesting_periods defines the vesting schedule relative to the start_time */
  vesting_periods?: PeriodAmino[];
}
export interface MsgFundVestingAccountAminoMsg {
  type: "evmos/MsgFundVestingAccount";
  value: MsgFundVestingAccountAmino;
}
/**
 * MsgFundVestingAccount defines a message that enables funding an existing clawback
 * vesting account.
 */
export interface MsgFundVestingAccountSDKType {
  funder_address: string;
  vesting_address: string;
  start_time: Date;
  lockup_periods: PeriodSDKType[];
  vesting_periods: PeriodSDKType[];
}
/**
 * MsgFundVestingAccountResponse defines the
 * MsgFundVestingAccount response type.
 */
export interface MsgFundVestingAccountResponse {}
export interface MsgFundVestingAccountResponseProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgFundVestingAccountResponse";
  value: Uint8Array;
}
/**
 * MsgFundVestingAccountResponse defines the
 * MsgFundVestingAccount response type.
 */
export interface MsgFundVestingAccountResponseAmino {}
export interface MsgFundVestingAccountResponseAminoMsg {
  type: "evmos/MsgFundVestingAccountResponse";
  value: MsgFundVestingAccountResponseAmino;
}
/**
 * MsgFundVestingAccountResponse defines the
 * MsgFundVestingAccount response type.
 */
export interface MsgFundVestingAccountResponseSDKType {}
/**
 * MsgClawback defines a message that removes unvested tokens from a
 * ClawbackVestingAccount.
 */
export interface MsgClawback {
  /** funder_address is the address which funded the account */
  funderAddress: string;
  /**
   * account_address is the address of the ClawbackVestingAccount to claw back
   * from.
   */
  accountAddress: string;
  /**
   * dest_address specifies where the clawed-back tokens should be transferred
   * to. If empty, the tokens will be transferred back to the original funder of
   * the account.
   */
  destAddress: string;
}
export interface MsgClawbackProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgClawback";
  value: Uint8Array;
}
/**
 * MsgClawback defines a message that removes unvested tokens from a
 * ClawbackVestingAccount.
 */
export interface MsgClawbackAmino {
  /** funder_address is the address which funded the account */
  funder_address?: string;
  /**
   * account_address is the address of the ClawbackVestingAccount to claw back
   * from.
   */
  account_address?: string;
  /**
   * dest_address specifies where the clawed-back tokens should be transferred
   * to. If empty, the tokens will be transferred back to the original funder of
   * the account.
   */
  dest_address?: string;
}
export interface MsgClawbackAminoMsg {
  type: "evmos/MsgClawback";
  value: MsgClawbackAmino;
}
/**
 * MsgClawback defines a message that removes unvested tokens from a
 * ClawbackVestingAccount.
 */
export interface MsgClawbackSDKType {
  funder_address: string;
  account_address: string;
  dest_address: string;
}
/** MsgClawbackResponse defines the MsgClawback response type. */
export interface MsgClawbackResponse {
  /** coins is the slice of clawed back coins */
  coins: Coin[];
}
export interface MsgClawbackResponseProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgClawbackResponse";
  value: Uint8Array;
}
/** MsgClawbackResponse defines the MsgClawback response type. */
export interface MsgClawbackResponseAmino {
  /** coins is the slice of clawed back coins */
  coins?: CoinAmino[];
}
export interface MsgClawbackResponseAminoMsg {
  type: "evmos/MsgClawbackResponse";
  value: MsgClawbackResponseAmino;
}
/** MsgClawbackResponse defines the MsgClawback response type. */
export interface MsgClawbackResponseSDKType {
  coins: CoinSDKType[];
}
/**
 * MsgUpdateVestingFunder defines a message that updates the funder account of a
 * ClawbackVestingAccount.
 */
export interface MsgUpdateVestingFunder {
  /** funder_address is the current funder address of the ClawbackVestingAccount */
  funderAddress: string;
  /** new_funder_address is the new address to replace the existing funder_address */
  newFunderAddress: string;
  /** vesting_address is the address of the ClawbackVestingAccount being updated */
  vestingAddress: string;
}
export interface MsgUpdateVestingFunderProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunder";
  value: Uint8Array;
}
/**
 * MsgUpdateVestingFunder defines a message that updates the funder account of a
 * ClawbackVestingAccount.
 */
export interface MsgUpdateVestingFunderAmino {
  /** funder_address is the current funder address of the ClawbackVestingAccount */
  funder_address?: string;
  /** new_funder_address is the new address to replace the existing funder_address */
  new_funder_address?: string;
  /** vesting_address is the address of the ClawbackVestingAccount being updated */
  vesting_address?: string;
}
export interface MsgUpdateVestingFunderAminoMsg {
  type: "evmos/MsgUpdateVestingFunder";
  value: MsgUpdateVestingFunderAmino;
}
/**
 * MsgUpdateVestingFunder defines a message that updates the funder account of a
 * ClawbackVestingAccount.
 */
export interface MsgUpdateVestingFunderSDKType {
  funder_address: string;
  new_funder_address: string;
  vesting_address: string;
}
/**
 * MsgUpdateVestingFunderResponse defines the MsgUpdateVestingFunder response
 * type.
 */
export interface MsgUpdateVestingFunderResponse {}
export interface MsgUpdateVestingFunderResponseProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunderResponse";
  value: Uint8Array;
}
/**
 * MsgUpdateVestingFunderResponse defines the MsgUpdateVestingFunder response
 * type.
 */
export interface MsgUpdateVestingFunderResponseAmino {}
export interface MsgUpdateVestingFunderResponseAminoMsg {
  type: "evmos/MsgUpdateVestingFunderResponse";
  value: MsgUpdateVestingFunderResponseAmino;
}
/**
 * MsgUpdateVestingFunderResponse defines the MsgUpdateVestingFunder response
 * type.
 */
export interface MsgUpdateVestingFunderResponseSDKType {}
/** MsgConvertVestingAccount defines a message that enables converting a vesting account to an eth account */
export interface MsgConvertVestingAccount {
  /** vesting_address is the address of the vesting account to convert */
  vestingAddress: string;
}
export interface MsgConvertVestingAccountProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccount";
  value: Uint8Array;
}
/** MsgConvertVestingAccount defines a message that enables converting a vesting account to an eth account */
export interface MsgConvertVestingAccountAmino {
  /** vesting_address is the address of the vesting account to convert */
  vesting_address?: string;
}
export interface MsgConvertVestingAccountAminoMsg {
  type: "evmos/MsgConvertVestingAccount";
  value: MsgConvertVestingAccountAmino;
}
/** MsgConvertVestingAccount defines a message that enables converting a vesting account to an eth account */
export interface MsgConvertVestingAccountSDKType {
  vesting_address: string;
}
/** MsgConvertVestingAccountResponse defines the MsgConvertVestingAccount response type. */
export interface MsgConvertVestingAccountResponse {}
export interface MsgConvertVestingAccountResponseProtoMsg {
  typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccountResponse";
  value: Uint8Array;
}
/** MsgConvertVestingAccountResponse defines the MsgConvertVestingAccount response type. */
export interface MsgConvertVestingAccountResponseAmino {}
export interface MsgConvertVestingAccountResponseAminoMsg {
  type: "evmos/MsgConvertVestingAccountResponse";
  value: MsgConvertVestingAccountResponseAmino;
}
/** MsgConvertVestingAccountResponse defines the MsgConvertVestingAccount response type. */
export interface MsgConvertVestingAccountResponseSDKType {}
function createBaseMsgCreateClawbackVestingAccount(): MsgCreateClawbackVestingAccount {
  return {
    funderAddress: "",
    vestingAddress: "",
    enableGovClawback: false
  };
}
export const MsgCreateClawbackVestingAccount = {
  typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccount",
  encode(message: MsgCreateClawbackVestingAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.funderAddress !== "") {
      writer.uint32(10).string(message.funderAddress);
    }
    if (message.vestingAddress !== "") {
      writer.uint32(18).string(message.vestingAddress);
    }
    if (message.enableGovClawback === true) {
      writer.uint32(24).bool(message.enableGovClawback);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateClawbackVestingAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateClawbackVestingAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.funderAddress = reader.string();
          break;
        case 2:
          message.vestingAddress = reader.string();
          break;
        case 3:
          message.enableGovClawback = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgCreateClawbackVestingAccount {
    return {
      funderAddress: isSet(object.funderAddress) ? String(object.funderAddress) : "",
      vestingAddress: isSet(object.vestingAddress) ? String(object.vestingAddress) : "",
      enableGovClawback: isSet(object.enableGovClawback) ? Boolean(object.enableGovClawback) : false
    };
  },
  toJSON(message: MsgCreateClawbackVestingAccount): JsonSafe<MsgCreateClawbackVestingAccount> {
    const obj: any = {};
    message.funderAddress !== undefined && (obj.funderAddress = message.funderAddress);
    message.vestingAddress !== undefined && (obj.vestingAddress = message.vestingAddress);
    message.enableGovClawback !== undefined && (obj.enableGovClawback = message.enableGovClawback);
    return obj;
  },
  fromPartial(object: Partial<MsgCreateClawbackVestingAccount>): MsgCreateClawbackVestingAccount {
    const message = createBaseMsgCreateClawbackVestingAccount();
    message.funderAddress = object.funderAddress ?? "";
    message.vestingAddress = object.vestingAddress ?? "";
    message.enableGovClawback = object.enableGovClawback ?? false;
    return message;
  },
  fromAmino(object: MsgCreateClawbackVestingAccountAmino): MsgCreateClawbackVestingAccount {
    const message = createBaseMsgCreateClawbackVestingAccount();
    if (object.funder_address !== undefined && object.funder_address !== null) {
      message.funderAddress = object.funder_address;
    }
    if (object.vesting_address !== undefined && object.vesting_address !== null) {
      message.vestingAddress = object.vesting_address;
    }
    if (object.enable_gov_clawback !== undefined && object.enable_gov_clawback !== null) {
      message.enableGovClawback = object.enable_gov_clawback;
    }
    return message;
  },
  toAmino(message: MsgCreateClawbackVestingAccount): MsgCreateClawbackVestingAccountAmino {
    const obj: any = {};
    obj.funder_address = message.funderAddress === "" ? undefined : message.funderAddress;
    obj.vesting_address = message.vestingAddress === "" ? undefined : message.vestingAddress;
    obj.enable_gov_clawback = message.enableGovClawback === false ? undefined : message.enableGovClawback;
    return obj;
  },
  fromAminoMsg(object: MsgCreateClawbackVestingAccountAminoMsg): MsgCreateClawbackVestingAccount {
    return MsgCreateClawbackVestingAccount.fromAmino(object.value);
  },
  toAminoMsg(message: MsgCreateClawbackVestingAccount): MsgCreateClawbackVestingAccountAminoMsg {
    return {
      type: "evmos/MsgCreateClawbackVestingAccount",
      value: MsgCreateClawbackVestingAccount.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgCreateClawbackVestingAccountProtoMsg): MsgCreateClawbackVestingAccount {
    return MsgCreateClawbackVestingAccount.decode(message.value);
  },
  toProto(message: MsgCreateClawbackVestingAccount): Uint8Array {
    return MsgCreateClawbackVestingAccount.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateClawbackVestingAccount): MsgCreateClawbackVestingAccountProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccount",
      value: MsgCreateClawbackVestingAccount.encode(message).finish()
    };
  }
};
function createBaseMsgCreateClawbackVestingAccountResponse(): MsgCreateClawbackVestingAccountResponse {
  return {};
}
export const MsgCreateClawbackVestingAccountResponse = {
  typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccountResponse",
  encode(_: MsgCreateClawbackVestingAccountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateClawbackVestingAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateClawbackVestingAccountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): MsgCreateClawbackVestingAccountResponse {
    return {};
  },
  toJSON(_: MsgCreateClawbackVestingAccountResponse): JsonSafe<MsgCreateClawbackVestingAccountResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgCreateClawbackVestingAccountResponse>): MsgCreateClawbackVestingAccountResponse {
    const message = createBaseMsgCreateClawbackVestingAccountResponse();
    return message;
  },
  fromAmino(_: MsgCreateClawbackVestingAccountResponseAmino): MsgCreateClawbackVestingAccountResponse {
    const message = createBaseMsgCreateClawbackVestingAccountResponse();
    return message;
  },
  toAmino(_: MsgCreateClawbackVestingAccountResponse): MsgCreateClawbackVestingAccountResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgCreateClawbackVestingAccountResponseAminoMsg): MsgCreateClawbackVestingAccountResponse {
    return MsgCreateClawbackVestingAccountResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgCreateClawbackVestingAccountResponse): MsgCreateClawbackVestingAccountResponseAminoMsg {
    return {
      type: "evmos/MsgCreateClawbackVestingAccountResponse",
      value: MsgCreateClawbackVestingAccountResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgCreateClawbackVestingAccountResponseProtoMsg): MsgCreateClawbackVestingAccountResponse {
    return MsgCreateClawbackVestingAccountResponse.decode(message.value);
  },
  toProto(message: MsgCreateClawbackVestingAccountResponse): Uint8Array {
    return MsgCreateClawbackVestingAccountResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgCreateClawbackVestingAccountResponse): MsgCreateClawbackVestingAccountResponseProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgCreateClawbackVestingAccountResponse",
      value: MsgCreateClawbackVestingAccountResponse.encode(message).finish()
    };
  }
};
function createBaseMsgFundVestingAccount(): MsgFundVestingAccount {
  return {
    funderAddress: "",
    vestingAddress: "",
    startTime: new Date(),
    lockupPeriods: [],
    vestingPeriods: []
  };
}
export const MsgFundVestingAccount = {
  typeUrl: "/evmos.vesting.v2.MsgFundVestingAccount",
  encode(message: MsgFundVestingAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.funderAddress !== "") {
      writer.uint32(10).string(message.funderAddress);
    }
    if (message.vestingAddress !== "") {
      writer.uint32(18).string(message.vestingAddress);
    }
    if (message.startTime !== undefined) {
      Timestamp.encode(toTimestamp(message.startTime), writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.lockupPeriods) {
      Period.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.vestingPeriods) {
      Period.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgFundVestingAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgFundVestingAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.funderAddress = reader.string();
          break;
        case 2:
          message.vestingAddress = reader.string();
          break;
        case 3:
          message.startTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 4:
          message.lockupPeriods.push(Period.decode(reader, reader.uint32()));
          break;
        case 5:
          message.vestingPeriods.push(Period.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgFundVestingAccount {
    return {
      funderAddress: isSet(object.funderAddress) ? String(object.funderAddress) : "",
      vestingAddress: isSet(object.vestingAddress) ? String(object.vestingAddress) : "",
      startTime: isSet(object.startTime) ? fromJsonTimestamp(object.startTime) : undefined,
      lockupPeriods: Array.isArray(object?.lockupPeriods) ? object.lockupPeriods.map((e: any) => Period.fromJSON(e)) : [],
      vestingPeriods: Array.isArray(object?.vestingPeriods) ? object.vestingPeriods.map((e: any) => Period.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgFundVestingAccount): JsonSafe<MsgFundVestingAccount> {
    const obj: any = {};
    message.funderAddress !== undefined && (obj.funderAddress = message.funderAddress);
    message.vestingAddress !== undefined && (obj.vestingAddress = message.vestingAddress);
    message.startTime !== undefined && (obj.startTime = message.startTime.toISOString());
    if (message.lockupPeriods) {
      obj.lockupPeriods = message.lockupPeriods.map(e => e ? Period.toJSON(e) : undefined);
    } else {
      obj.lockupPeriods = [];
    }
    if (message.vestingPeriods) {
      obj.vestingPeriods = message.vestingPeriods.map(e => e ? Period.toJSON(e) : undefined);
    } else {
      obj.vestingPeriods = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgFundVestingAccount>): MsgFundVestingAccount {
    const message = createBaseMsgFundVestingAccount();
    message.funderAddress = object.funderAddress ?? "";
    message.vestingAddress = object.vestingAddress ?? "";
    message.startTime = object.startTime ?? undefined;
    message.lockupPeriods = object.lockupPeriods?.map(e => Period.fromPartial(e)) || [];
    message.vestingPeriods = object.vestingPeriods?.map(e => Period.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MsgFundVestingAccountAmino): MsgFundVestingAccount {
    const message = createBaseMsgFundVestingAccount();
    if (object.funder_address !== undefined && object.funder_address !== null) {
      message.funderAddress = object.funder_address;
    }
    if (object.vesting_address !== undefined && object.vesting_address !== null) {
      message.vestingAddress = object.vesting_address;
    }
    if (object.start_time !== undefined && object.start_time !== null) {
      message.startTime = fromTimestamp(Timestamp.fromAmino(object.start_time));
    }
    message.lockupPeriods = object.lockup_periods?.map(e => Period.fromAmino(e)) || [];
    message.vestingPeriods = object.vesting_periods?.map(e => Period.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MsgFundVestingAccount): MsgFundVestingAccountAmino {
    const obj: any = {};
    obj.funder_address = message.funderAddress === "" ? undefined : message.funderAddress;
    obj.vesting_address = message.vestingAddress === "" ? undefined : message.vestingAddress;
    obj.start_time = message.startTime ? Timestamp.toAmino(toTimestamp(message.startTime)) : undefined;
    if (message.lockupPeriods) {
      obj.lockup_periods = message.lockupPeriods.map(e => e ? Period.toAmino(e) : undefined);
    } else {
      obj.lockup_periods = message.lockupPeriods;
    }
    if (message.vestingPeriods) {
      obj.vesting_periods = message.vestingPeriods.map(e => e ? Period.toAmino(e) : undefined);
    } else {
      obj.vesting_periods = message.vestingPeriods;
    }
    return obj;
  },
  fromAminoMsg(object: MsgFundVestingAccountAminoMsg): MsgFundVestingAccount {
    return MsgFundVestingAccount.fromAmino(object.value);
  },
  toAminoMsg(message: MsgFundVestingAccount): MsgFundVestingAccountAminoMsg {
    return {
      type: "evmos/MsgFundVestingAccount",
      value: MsgFundVestingAccount.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgFundVestingAccountProtoMsg): MsgFundVestingAccount {
    return MsgFundVestingAccount.decode(message.value);
  },
  toProto(message: MsgFundVestingAccount): Uint8Array {
    return MsgFundVestingAccount.encode(message).finish();
  },
  toProtoMsg(message: MsgFundVestingAccount): MsgFundVestingAccountProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgFundVestingAccount",
      value: MsgFundVestingAccount.encode(message).finish()
    };
  }
};
function createBaseMsgFundVestingAccountResponse(): MsgFundVestingAccountResponse {
  return {};
}
export const MsgFundVestingAccountResponse = {
  typeUrl: "/evmos.vesting.v2.MsgFundVestingAccountResponse",
  encode(_: MsgFundVestingAccountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgFundVestingAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgFundVestingAccountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): MsgFundVestingAccountResponse {
    return {};
  },
  toJSON(_: MsgFundVestingAccountResponse): JsonSafe<MsgFundVestingAccountResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgFundVestingAccountResponse>): MsgFundVestingAccountResponse {
    const message = createBaseMsgFundVestingAccountResponse();
    return message;
  },
  fromAmino(_: MsgFundVestingAccountResponseAmino): MsgFundVestingAccountResponse {
    const message = createBaseMsgFundVestingAccountResponse();
    return message;
  },
  toAmino(_: MsgFundVestingAccountResponse): MsgFundVestingAccountResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgFundVestingAccountResponseAminoMsg): MsgFundVestingAccountResponse {
    return MsgFundVestingAccountResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgFundVestingAccountResponse): MsgFundVestingAccountResponseAminoMsg {
    return {
      type: "evmos/MsgFundVestingAccountResponse",
      value: MsgFundVestingAccountResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgFundVestingAccountResponseProtoMsg): MsgFundVestingAccountResponse {
    return MsgFundVestingAccountResponse.decode(message.value);
  },
  toProto(message: MsgFundVestingAccountResponse): Uint8Array {
    return MsgFundVestingAccountResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgFundVestingAccountResponse): MsgFundVestingAccountResponseProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgFundVestingAccountResponse",
      value: MsgFundVestingAccountResponse.encode(message).finish()
    };
  }
};
function createBaseMsgClawback(): MsgClawback {
  return {
    funderAddress: "",
    accountAddress: "",
    destAddress: ""
  };
}
export const MsgClawback = {
  typeUrl: "/evmos.vesting.v2.MsgClawback",
  encode(message: MsgClawback, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.funderAddress !== "") {
      writer.uint32(10).string(message.funderAddress);
    }
    if (message.accountAddress !== "") {
      writer.uint32(18).string(message.accountAddress);
    }
    if (message.destAddress !== "") {
      writer.uint32(26).string(message.destAddress);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgClawback {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgClawback();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.funderAddress = reader.string();
          break;
        case 2:
          message.accountAddress = reader.string();
          break;
        case 3:
          message.destAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgClawback {
    return {
      funderAddress: isSet(object.funderAddress) ? String(object.funderAddress) : "",
      accountAddress: isSet(object.accountAddress) ? String(object.accountAddress) : "",
      destAddress: isSet(object.destAddress) ? String(object.destAddress) : ""
    };
  },
  toJSON(message: MsgClawback): JsonSafe<MsgClawback> {
    const obj: any = {};
    message.funderAddress !== undefined && (obj.funderAddress = message.funderAddress);
    message.accountAddress !== undefined && (obj.accountAddress = message.accountAddress);
    message.destAddress !== undefined && (obj.destAddress = message.destAddress);
    return obj;
  },
  fromPartial(object: Partial<MsgClawback>): MsgClawback {
    const message = createBaseMsgClawback();
    message.funderAddress = object.funderAddress ?? "";
    message.accountAddress = object.accountAddress ?? "";
    message.destAddress = object.destAddress ?? "";
    return message;
  },
  fromAmino(object: MsgClawbackAmino): MsgClawback {
    const message = createBaseMsgClawback();
    if (object.funder_address !== undefined && object.funder_address !== null) {
      message.funderAddress = object.funder_address;
    }
    if (object.account_address !== undefined && object.account_address !== null) {
      message.accountAddress = object.account_address;
    }
    if (object.dest_address !== undefined && object.dest_address !== null) {
      message.destAddress = object.dest_address;
    }
    return message;
  },
  toAmino(message: MsgClawback): MsgClawbackAmino {
    const obj: any = {};
    obj.funder_address = message.funderAddress === "" ? undefined : message.funderAddress;
    obj.account_address = message.accountAddress === "" ? undefined : message.accountAddress;
    obj.dest_address = message.destAddress === "" ? undefined : message.destAddress;
    return obj;
  },
  fromAminoMsg(object: MsgClawbackAminoMsg): MsgClawback {
    return MsgClawback.fromAmino(object.value);
  },
  toAminoMsg(message: MsgClawback): MsgClawbackAminoMsg {
    return {
      type: "evmos/MsgClawback",
      value: MsgClawback.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgClawbackProtoMsg): MsgClawback {
    return MsgClawback.decode(message.value);
  },
  toProto(message: MsgClawback): Uint8Array {
    return MsgClawback.encode(message).finish();
  },
  toProtoMsg(message: MsgClawback): MsgClawbackProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgClawback",
      value: MsgClawback.encode(message).finish()
    };
  }
};
function createBaseMsgClawbackResponse(): MsgClawbackResponse {
  return {
    coins: []
  };
}
export const MsgClawbackResponse = {
  typeUrl: "/evmos.vesting.v2.MsgClawbackResponse",
  encode(message: MsgClawbackResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.coins) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgClawbackResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgClawbackResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.coins.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgClawbackResponse {
    return {
      coins: Array.isArray(object?.coins) ? object.coins.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: MsgClawbackResponse): JsonSafe<MsgClawbackResponse> {
    const obj: any = {};
    if (message.coins) {
      obj.coins = message.coins.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.coins = [];
    }
    return obj;
  },
  fromPartial(object: Partial<MsgClawbackResponse>): MsgClawbackResponse {
    const message = createBaseMsgClawbackResponse();
    message.coins = object.coins?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: MsgClawbackResponseAmino): MsgClawbackResponse {
    const message = createBaseMsgClawbackResponse();
    message.coins = object.coins?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: MsgClawbackResponse): MsgClawbackResponseAmino {
    const obj: any = {};
    if (message.coins) {
      obj.coins = message.coins.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.coins = message.coins;
    }
    return obj;
  },
  fromAminoMsg(object: MsgClawbackResponseAminoMsg): MsgClawbackResponse {
    return MsgClawbackResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgClawbackResponse): MsgClawbackResponseAminoMsg {
    return {
      type: "evmos/MsgClawbackResponse",
      value: MsgClawbackResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgClawbackResponseProtoMsg): MsgClawbackResponse {
    return MsgClawbackResponse.decode(message.value);
  },
  toProto(message: MsgClawbackResponse): Uint8Array {
    return MsgClawbackResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgClawbackResponse): MsgClawbackResponseProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgClawbackResponse",
      value: MsgClawbackResponse.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateVestingFunder(): MsgUpdateVestingFunder {
  return {
    funderAddress: "",
    newFunderAddress: "",
    vestingAddress: ""
  };
}
export const MsgUpdateVestingFunder = {
  typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunder",
  encode(message: MsgUpdateVestingFunder, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.funderAddress !== "") {
      writer.uint32(10).string(message.funderAddress);
    }
    if (message.newFunderAddress !== "") {
      writer.uint32(18).string(message.newFunderAddress);
    }
    if (message.vestingAddress !== "") {
      writer.uint32(26).string(message.vestingAddress);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateVestingFunder {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateVestingFunder();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.funderAddress = reader.string();
          break;
        case 2:
          message.newFunderAddress = reader.string();
          break;
        case 3:
          message.vestingAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgUpdateVestingFunder {
    return {
      funderAddress: isSet(object.funderAddress) ? String(object.funderAddress) : "",
      newFunderAddress: isSet(object.newFunderAddress) ? String(object.newFunderAddress) : "",
      vestingAddress: isSet(object.vestingAddress) ? String(object.vestingAddress) : ""
    };
  },
  toJSON(message: MsgUpdateVestingFunder): JsonSafe<MsgUpdateVestingFunder> {
    const obj: any = {};
    message.funderAddress !== undefined && (obj.funderAddress = message.funderAddress);
    message.newFunderAddress !== undefined && (obj.newFunderAddress = message.newFunderAddress);
    message.vestingAddress !== undefined && (obj.vestingAddress = message.vestingAddress);
    return obj;
  },
  fromPartial(object: Partial<MsgUpdateVestingFunder>): MsgUpdateVestingFunder {
    const message = createBaseMsgUpdateVestingFunder();
    message.funderAddress = object.funderAddress ?? "";
    message.newFunderAddress = object.newFunderAddress ?? "";
    message.vestingAddress = object.vestingAddress ?? "";
    return message;
  },
  fromAmino(object: MsgUpdateVestingFunderAmino): MsgUpdateVestingFunder {
    const message = createBaseMsgUpdateVestingFunder();
    if (object.funder_address !== undefined && object.funder_address !== null) {
      message.funderAddress = object.funder_address;
    }
    if (object.new_funder_address !== undefined && object.new_funder_address !== null) {
      message.newFunderAddress = object.new_funder_address;
    }
    if (object.vesting_address !== undefined && object.vesting_address !== null) {
      message.vestingAddress = object.vesting_address;
    }
    return message;
  },
  toAmino(message: MsgUpdateVestingFunder): MsgUpdateVestingFunderAmino {
    const obj: any = {};
    obj.funder_address = message.funderAddress === "" ? undefined : message.funderAddress;
    obj.new_funder_address = message.newFunderAddress === "" ? undefined : message.newFunderAddress;
    obj.vesting_address = message.vestingAddress === "" ? undefined : message.vestingAddress;
    return obj;
  },
  fromAminoMsg(object: MsgUpdateVestingFunderAminoMsg): MsgUpdateVestingFunder {
    return MsgUpdateVestingFunder.fromAmino(object.value);
  },
  toAminoMsg(message: MsgUpdateVestingFunder): MsgUpdateVestingFunderAminoMsg {
    return {
      type: "evmos/MsgUpdateVestingFunder",
      value: MsgUpdateVestingFunder.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgUpdateVestingFunderProtoMsg): MsgUpdateVestingFunder {
    return MsgUpdateVestingFunder.decode(message.value);
  },
  toProto(message: MsgUpdateVestingFunder): Uint8Array {
    return MsgUpdateVestingFunder.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateVestingFunder): MsgUpdateVestingFunderProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunder",
      value: MsgUpdateVestingFunder.encode(message).finish()
    };
  }
};
function createBaseMsgUpdateVestingFunderResponse(): MsgUpdateVestingFunderResponse {
  return {};
}
export const MsgUpdateVestingFunderResponse = {
  typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunderResponse",
  encode(_: MsgUpdateVestingFunderResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateVestingFunderResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateVestingFunderResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): MsgUpdateVestingFunderResponse {
    return {};
  },
  toJSON(_: MsgUpdateVestingFunderResponse): JsonSafe<MsgUpdateVestingFunderResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgUpdateVestingFunderResponse>): MsgUpdateVestingFunderResponse {
    const message = createBaseMsgUpdateVestingFunderResponse();
    return message;
  },
  fromAmino(_: MsgUpdateVestingFunderResponseAmino): MsgUpdateVestingFunderResponse {
    const message = createBaseMsgUpdateVestingFunderResponse();
    return message;
  },
  toAmino(_: MsgUpdateVestingFunderResponse): MsgUpdateVestingFunderResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgUpdateVestingFunderResponseAminoMsg): MsgUpdateVestingFunderResponse {
    return MsgUpdateVestingFunderResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgUpdateVestingFunderResponse): MsgUpdateVestingFunderResponseAminoMsg {
    return {
      type: "evmos/MsgUpdateVestingFunderResponse",
      value: MsgUpdateVestingFunderResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgUpdateVestingFunderResponseProtoMsg): MsgUpdateVestingFunderResponse {
    return MsgUpdateVestingFunderResponse.decode(message.value);
  },
  toProto(message: MsgUpdateVestingFunderResponse): Uint8Array {
    return MsgUpdateVestingFunderResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgUpdateVestingFunderResponse): MsgUpdateVestingFunderResponseProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgUpdateVestingFunderResponse",
      value: MsgUpdateVestingFunderResponse.encode(message).finish()
    };
  }
};
function createBaseMsgConvertVestingAccount(): MsgConvertVestingAccount {
  return {
    vestingAddress: ""
  };
}
export const MsgConvertVestingAccount = {
  typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccount",
  encode(message: MsgConvertVestingAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.vestingAddress !== "") {
      writer.uint32(10).string(message.vestingAddress);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgConvertVestingAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgConvertVestingAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vestingAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): MsgConvertVestingAccount {
    return {
      vestingAddress: isSet(object.vestingAddress) ? String(object.vestingAddress) : ""
    };
  },
  toJSON(message: MsgConvertVestingAccount): JsonSafe<MsgConvertVestingAccount> {
    const obj: any = {};
    message.vestingAddress !== undefined && (obj.vestingAddress = message.vestingAddress);
    return obj;
  },
  fromPartial(object: Partial<MsgConvertVestingAccount>): MsgConvertVestingAccount {
    const message = createBaseMsgConvertVestingAccount();
    message.vestingAddress = object.vestingAddress ?? "";
    return message;
  },
  fromAmino(object: MsgConvertVestingAccountAmino): MsgConvertVestingAccount {
    const message = createBaseMsgConvertVestingAccount();
    if (object.vesting_address !== undefined && object.vesting_address !== null) {
      message.vestingAddress = object.vesting_address;
    }
    return message;
  },
  toAmino(message: MsgConvertVestingAccount): MsgConvertVestingAccountAmino {
    const obj: any = {};
    obj.vesting_address = message.vestingAddress === "" ? undefined : message.vestingAddress;
    return obj;
  },
  fromAminoMsg(object: MsgConvertVestingAccountAminoMsg): MsgConvertVestingAccount {
    return MsgConvertVestingAccount.fromAmino(object.value);
  },
  toAminoMsg(message: MsgConvertVestingAccount): MsgConvertVestingAccountAminoMsg {
    return {
      type: "evmos/MsgConvertVestingAccount",
      value: MsgConvertVestingAccount.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgConvertVestingAccountProtoMsg): MsgConvertVestingAccount {
    return MsgConvertVestingAccount.decode(message.value);
  },
  toProto(message: MsgConvertVestingAccount): Uint8Array {
    return MsgConvertVestingAccount.encode(message).finish();
  },
  toProtoMsg(message: MsgConvertVestingAccount): MsgConvertVestingAccountProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccount",
      value: MsgConvertVestingAccount.encode(message).finish()
    };
  }
};
function createBaseMsgConvertVestingAccountResponse(): MsgConvertVestingAccountResponse {
  return {};
}
export const MsgConvertVestingAccountResponse = {
  typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccountResponse",
  encode(_: MsgConvertVestingAccountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MsgConvertVestingAccountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgConvertVestingAccountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(_: any): MsgConvertVestingAccountResponse {
    return {};
  },
  toJSON(_: MsgConvertVestingAccountResponse): JsonSafe<MsgConvertVestingAccountResponse> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<MsgConvertVestingAccountResponse>): MsgConvertVestingAccountResponse {
    const message = createBaseMsgConvertVestingAccountResponse();
    return message;
  },
  fromAmino(_: MsgConvertVestingAccountResponseAmino): MsgConvertVestingAccountResponse {
    const message = createBaseMsgConvertVestingAccountResponse();
    return message;
  },
  toAmino(_: MsgConvertVestingAccountResponse): MsgConvertVestingAccountResponseAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: MsgConvertVestingAccountResponseAminoMsg): MsgConvertVestingAccountResponse {
    return MsgConvertVestingAccountResponse.fromAmino(object.value);
  },
  toAminoMsg(message: MsgConvertVestingAccountResponse): MsgConvertVestingAccountResponseAminoMsg {
    return {
      type: "evmos/MsgConvertVestingAccountResponse",
      value: MsgConvertVestingAccountResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: MsgConvertVestingAccountResponseProtoMsg): MsgConvertVestingAccountResponse {
    return MsgConvertVestingAccountResponse.decode(message.value);
  },
  toProto(message: MsgConvertVestingAccountResponse): Uint8Array {
    return MsgConvertVestingAccountResponse.encode(message).finish();
  },
  toProtoMsg(message: MsgConvertVestingAccountResponse): MsgConvertVestingAccountResponseProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.MsgConvertVestingAccountResponse",
      value: MsgConvertVestingAccountResponse.encode(message).finish()
    };
  }
};