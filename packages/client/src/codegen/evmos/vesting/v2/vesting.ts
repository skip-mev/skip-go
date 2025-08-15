//@ts-nocheck
import { BaseVestingAccount, BaseVestingAccountAmino, BaseVestingAccountSDKType, Period, PeriodAmino, PeriodSDKType } from "../../../cosmos/vesting/v1beta1/vesting";
import { Timestamp } from "../../../google/protobuf/timestamp";
import _m0 from "protobufjs/minimal.js";
import { toTimestamp, fromTimestamp, isSet, fromJsonTimestamp } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/**
 * ClawbackVestingAccount implements the VestingAccount interface. It provides
 * an account that can hold contributions subject to "lockup" (like a
 * PeriodicVestingAccount), or vesting which is subject to clawback
 * of unvested tokens, or a combination (tokens vest, but are still locked).
 */
export interface ClawbackVestingAccount {
  /**
   * base_vesting_account implements the VestingAccount interface. It contains
   * all the necessary fields needed for any vesting account implementation
   */
  baseVestingAccount?: BaseVestingAccount;
  /** funder_address specifies the account which can perform clawback */
  funderAddress: string;
  /** start_time defines the time at which the vesting period begins */
  startTime: Date;
  /** lockup_periods defines the unlocking schedule relative to the start_time */
  lockupPeriods: Period[];
  /** vesting_periods defines the vesting schedule relative to the start_time */
  vestingPeriods: Period[];
}
export interface ClawbackVestingAccountProtoMsg {
  typeUrl: "/evmos.vesting.v2.ClawbackVestingAccount";
  value: Uint8Array;
}
/**
 * ClawbackVestingAccount implements the VestingAccount interface. It provides
 * an account that can hold contributions subject to "lockup" (like a
 * PeriodicVestingAccount), or vesting which is subject to clawback
 * of unvested tokens, or a combination (tokens vest, but are still locked).
 * @name ClawbackVestingAccountAmino
 * @package evmos.vesting.v2
 * @see proto type: evmos.vesting.v2.ClawbackVestingAccount
 */
export interface ClawbackVestingAccountAmino {
  /**
   * base_vesting_account implements the VestingAccount interface. It contains
   * all the necessary fields needed for any vesting account implementation
   */
  base_vesting_account?: BaseVestingAccountAmino;
  /**
   * funder_address specifies the account which can perform clawback
   */
  funder_address?: string;
  /**
   * start_time defines the time at which the vesting period begins
   */
  start_time?: string;
  /**
   * lockup_periods defines the unlocking schedule relative to the start_time
   */
  lockup_periods?: PeriodAmino[];
  /**
   * vesting_periods defines the vesting schedule relative to the start_time
   */
  vesting_periods?: PeriodAmino[];
}
export interface ClawbackVestingAccountAminoMsg {
  type: "vesting/ClawbackVestingAccount";
  value: ClawbackVestingAccountAmino;
}
/**
 * ClawbackVestingAccount implements the VestingAccount interface. It provides
 * an account that can hold contributions subject to "lockup" (like a
 * PeriodicVestingAccount), or vesting which is subject to clawback
 * of unvested tokens, or a combination (tokens vest, but are still locked).
 */
export interface ClawbackVestingAccountSDKType {
  base_vesting_account?: BaseVestingAccountSDKType;
  funder_address: string;
  start_time: Date;
  lockup_periods: PeriodSDKType[];
  vesting_periods: PeriodSDKType[];
}
/**
 * ClawbackProposal is a gov Content type to clawback funds
 * from a vesting account that has this functionality enabled.
 */
export interface ClawbackProposal {
  /** title of the proposal */
  title: string;
  /** description of the proposal */
  description: string;
  /**
   * address is the vesting account address
   * to clawback the funds from
   */
  address: string;
  /**
   * destination_address is the address that will receive
   * the clawbacked funds from the given vesting account. When
   * empty, proposal will return the coins to the vesting
   * account funder.
   */
  destinationAddress: string;
}
export interface ClawbackProposalProtoMsg {
  typeUrl: "/evmos.vesting.v2.ClawbackProposal";
  value: Uint8Array;
}
/**
 * ClawbackProposal is a gov Content type to clawback funds
 * from a vesting account that has this functionality enabled.
 * @name ClawbackProposalAmino
 * @package evmos.vesting.v2
 * @see proto type: evmos.vesting.v2.ClawbackProposal
 */
export interface ClawbackProposalAmino {
  /**
   * title of the proposal
   */
  title?: string;
  /**
   * description of the proposal
   */
  description?: string;
  /**
   * address is the vesting account address
   * to clawback the funds from
   */
  address?: string;
  /**
   * destination_address is the address that will receive
   * the clawbacked funds from the given vesting account. When
   * empty, proposal will return the coins to the vesting
   * account funder.
   */
  destination_address?: string;
}
export interface ClawbackProposalAminoMsg {
  type: "vesting/ClawbackProposal";
  value: ClawbackProposalAmino;
}
/**
 * ClawbackProposal is a gov Content type to clawback funds
 * from a vesting account that has this functionality enabled.
 */
export interface ClawbackProposalSDKType {
  title: string;
  description: string;
  address: string;
  destination_address: string;
}
function createBaseClawbackVestingAccount(): ClawbackVestingAccount {
  return {
    baseVestingAccount: undefined,
    funderAddress: "",
    startTime: new Date(),
    lockupPeriods: [],
    vestingPeriods: []
  };
}
export const ClawbackVestingAccount = {
  typeUrl: "/evmos.vesting.v2.ClawbackVestingAccount",
  encode(message: ClawbackVestingAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.baseVestingAccount !== undefined) {
      BaseVestingAccount.encode(message.baseVestingAccount, writer.uint32(10).fork()).ldelim();
    }
    if (message.funderAddress !== "") {
      writer.uint32(18).string(message.funderAddress);
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
  decode(input: _m0.Reader | Uint8Array, length?: number): ClawbackVestingAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClawbackVestingAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.baseVestingAccount = BaseVestingAccount.decode(reader, reader.uint32());
          break;
        case 2:
          message.funderAddress = reader.string();
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
  fromJSON(object: any): ClawbackVestingAccount {
    return {
      baseVestingAccount: isSet(object.baseVestingAccount) ? BaseVestingAccount.fromJSON(object.baseVestingAccount) : undefined,
      funderAddress: isSet(object.funderAddress) ? String(object.funderAddress) : "",
      startTime: isSet(object.startTime) ? fromJsonTimestamp(object.startTime) : undefined,
      lockupPeriods: Array.isArray(object?.lockupPeriods) ? object.lockupPeriods.map((e: any) => Period.fromJSON(e)) : [],
      vestingPeriods: Array.isArray(object?.vestingPeriods) ? object.vestingPeriods.map((e: any) => Period.fromJSON(e)) : []
    };
  },
  toJSON(message: ClawbackVestingAccount): JsonSafe<ClawbackVestingAccount> {
    const obj: any = {};
    message.baseVestingAccount !== undefined && (obj.baseVestingAccount = message.baseVestingAccount ? BaseVestingAccount.toJSON(message.baseVestingAccount) : undefined);
    message.funderAddress !== undefined && (obj.funderAddress = message.funderAddress);
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
  fromPartial(object: Partial<ClawbackVestingAccount>): ClawbackVestingAccount {
    const message = createBaseClawbackVestingAccount();
    message.baseVestingAccount = object.baseVestingAccount !== undefined && object.baseVestingAccount !== null ? BaseVestingAccount.fromPartial(object.baseVestingAccount) : undefined;
    message.funderAddress = object.funderAddress ?? "";
    message.startTime = object.startTime ?? undefined;
    message.lockupPeriods = object.lockupPeriods?.map(e => Period.fromPartial(e)) || [];
    message.vestingPeriods = object.vestingPeriods?.map(e => Period.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: ClawbackVestingAccountAmino): ClawbackVestingAccount {
    const message = createBaseClawbackVestingAccount();
    if (object.base_vesting_account !== undefined && object.base_vesting_account !== null) {
      message.baseVestingAccount = BaseVestingAccount.fromAmino(object.base_vesting_account);
    }
    if (object.funder_address !== undefined && object.funder_address !== null) {
      message.funderAddress = object.funder_address;
    }
    if (object.start_time !== undefined && object.start_time !== null) {
      message.startTime = fromTimestamp(Timestamp.fromAmino(object.start_time));
    }
    message.lockupPeriods = object.lockup_periods?.map(e => Period.fromAmino(e)) || [];
    message.vestingPeriods = object.vesting_periods?.map(e => Period.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: ClawbackVestingAccount): ClawbackVestingAccountAmino {
    const obj: any = {};
    obj.base_vesting_account = message.baseVestingAccount ? BaseVestingAccount.toAmino(message.baseVestingAccount) : undefined;
    obj.funder_address = message.funderAddress === "" ? undefined : message.funderAddress;
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
  fromAminoMsg(object: ClawbackVestingAccountAminoMsg): ClawbackVestingAccount {
    return ClawbackVestingAccount.fromAmino(object.value);
  },
  toAminoMsg(message: ClawbackVestingAccount): ClawbackVestingAccountAminoMsg {
    return {
      type: "vesting/ClawbackVestingAccount",
      value: ClawbackVestingAccount.toAmino(message)
    };
  },
  fromProtoMsg(message: ClawbackVestingAccountProtoMsg): ClawbackVestingAccount {
    return ClawbackVestingAccount.decode(message.value);
  },
  toProto(message: ClawbackVestingAccount): Uint8Array {
    return ClawbackVestingAccount.encode(message).finish();
  },
  toProtoMsg(message: ClawbackVestingAccount): ClawbackVestingAccountProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.ClawbackVestingAccount",
      value: ClawbackVestingAccount.encode(message).finish()
    };
  }
};
function createBaseClawbackProposal(): ClawbackProposal {
  return {
    title: "",
    description: "",
    address: "",
    destinationAddress: ""
  };
}
export const ClawbackProposal = {
  typeUrl: "/evmos.vesting.v2.ClawbackProposal",
  encode(message: ClawbackProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.address !== "") {
      writer.uint32(26).string(message.address);
    }
    if (message.destinationAddress !== "") {
      writer.uint32(34).string(message.destinationAddress);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): ClawbackProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClawbackProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.address = reader.string();
          break;
        case 4:
          message.destinationAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ClawbackProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      address: isSet(object.address) ? String(object.address) : "",
      destinationAddress: isSet(object.destinationAddress) ? String(object.destinationAddress) : ""
    };
  },
  toJSON(message: ClawbackProposal): JsonSafe<ClawbackProposal> {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.address !== undefined && (obj.address = message.address);
    message.destinationAddress !== undefined && (obj.destinationAddress = message.destinationAddress);
    return obj;
  },
  fromPartial(object: Partial<ClawbackProposal>): ClawbackProposal {
    const message = createBaseClawbackProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.address = object.address ?? "";
    message.destinationAddress = object.destinationAddress ?? "";
    return message;
  },
  fromAmino(object: ClawbackProposalAmino): ClawbackProposal {
    const message = createBaseClawbackProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    if (object.destination_address !== undefined && object.destination_address !== null) {
      message.destinationAddress = object.destination_address;
    }
    return message;
  },
  toAmino(message: ClawbackProposal): ClawbackProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.address = message.address === "" ? undefined : message.address;
    obj.destination_address = message.destinationAddress === "" ? undefined : message.destinationAddress;
    return obj;
  },
  fromAminoMsg(object: ClawbackProposalAminoMsg): ClawbackProposal {
    return ClawbackProposal.fromAmino(object.value);
  },
  toAminoMsg(message: ClawbackProposal): ClawbackProposalAminoMsg {
    return {
      type: "vesting/ClawbackProposal",
      value: ClawbackProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: ClawbackProposalProtoMsg): ClawbackProposal {
    return ClawbackProposal.decode(message.value);
  },
  toProto(message: ClawbackProposal): Uint8Array {
    return ClawbackProposal.encode(message).finish();
  },
  toProtoMsg(message: ClawbackProposal): ClawbackProposalProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.ClawbackProposal",
      value: ClawbackProposal.encode(message).finish()
    };
  }
};