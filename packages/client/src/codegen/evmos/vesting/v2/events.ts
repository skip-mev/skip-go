//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/**
 * EventCreateClawbackVestingAccount defines the event type
 * for creating a clawback vesting account
 */
export interface EventCreateClawbackVestingAccount {
  /** funder is the address of the funder */
  funder: string;
  /** vesting_account is the address of the created vesting account */
  vestingAccount: string;
}
export interface EventCreateClawbackVestingAccountProtoMsg {
  typeUrl: "/evmos.vesting.v2.EventCreateClawbackVestingAccount";
  value: Uint8Array;
}
/**
 * EventCreateClawbackVestingAccount defines the event type
 * for creating a clawback vesting account
 */
export interface EventCreateClawbackVestingAccountAmino {
  /** funder is the address of the funder */
  funder?: string;
  /** vesting_account is the address of the created vesting account */
  vesting_account?: string;
}
export interface EventCreateClawbackVestingAccountAminoMsg {
  type: "vesting/EventCreateClawbackVestingAccount";
  value: EventCreateClawbackVestingAccountAmino;
}
/**
 * EventCreateClawbackVestingAccount defines the event type
 * for creating a clawback vesting account
 */
export interface EventCreateClawbackVestingAccountSDKType {
  funder: string;
  vesting_account: string;
}
/** EventFundVestingAccount defines the event type for funding a vesting account */
export interface EventFundVestingAccount {
  /** funder is the address of the funder */
  funder: string;
  /** coins to be vested */
  coins: string;
  /** start_time is the time when the coins start to vest */
  startTime: string;
  /** vesting_account is the address of the recipient */
  vestingAccount: string;
}
export interface EventFundVestingAccountProtoMsg {
  typeUrl: "/evmos.vesting.v2.EventFundVestingAccount";
  value: Uint8Array;
}
/** EventFundVestingAccount defines the event type for funding a vesting account */
export interface EventFundVestingAccountAmino {
  /** funder is the address of the funder */
  funder?: string;
  /** coins to be vested */
  coins?: string;
  /** start_time is the time when the coins start to vest */
  start_time?: string;
  /** vesting_account is the address of the recipient */
  vesting_account?: string;
}
export interface EventFundVestingAccountAminoMsg {
  type: "vesting/EventFundVestingAccount";
  value: EventFundVestingAccountAmino;
}
/** EventFundVestingAccount defines the event type for funding a vesting account */
export interface EventFundVestingAccountSDKType {
  funder: string;
  coins: string;
  start_time: string;
  vesting_account: string;
}
/** EventClawback defines the event type for clawback */
export interface EventClawback {
  /** funder is the address of the funder */
  funder: string;
  /** account is the address of the account */
  account: string;
  /** destination is the address of the destination */
  destination: string;
}
export interface EventClawbackProtoMsg {
  typeUrl: "/evmos.vesting.v2.EventClawback";
  value: Uint8Array;
}
/** EventClawback defines the event type for clawback */
export interface EventClawbackAmino {
  /** funder is the address of the funder */
  funder?: string;
  /** account is the address of the account */
  account?: string;
  /** destination is the address of the destination */
  destination?: string;
}
export interface EventClawbackAminoMsg {
  type: "vesting/EventClawback";
  value: EventClawbackAmino;
}
/** EventClawback defines the event type for clawback */
export interface EventClawbackSDKType {
  funder: string;
  account: string;
  destination: string;
}
/** EventUpdateVestingFunder defines the event type for updating the vesting funder */
export interface EventUpdateVestingFunder {
  /** funder is the address of the funder */
  funder: string;
  /** account is the address of the account */
  account: string;
  /** new_funder is the address of the new funder */
  newFunder: string;
}
export interface EventUpdateVestingFunderProtoMsg {
  typeUrl: "/evmos.vesting.v2.EventUpdateVestingFunder";
  value: Uint8Array;
}
/** EventUpdateVestingFunder defines the event type for updating the vesting funder */
export interface EventUpdateVestingFunderAmino {
  /** funder is the address of the funder */
  funder?: string;
  /** account is the address of the account */
  account?: string;
  /** new_funder is the address of the new funder */
  new_funder?: string;
}
export interface EventUpdateVestingFunderAminoMsg {
  type: "vesting/EventUpdateVestingFunder";
  value: EventUpdateVestingFunderAmino;
}
/** EventUpdateVestingFunder defines the event type for updating the vesting funder */
export interface EventUpdateVestingFunderSDKType {
  funder: string;
  account: string;
  new_funder: string;
}
function createBaseEventCreateClawbackVestingAccount(): EventCreateClawbackVestingAccount {
  return {
    funder: "",
    vestingAccount: ""
  };
}
export const EventCreateClawbackVestingAccount = {
  typeUrl: "/evmos.vesting.v2.EventCreateClawbackVestingAccount",
  encode(message: EventCreateClawbackVestingAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.funder !== "") {
      writer.uint32(10).string(message.funder);
    }
    if (message.vestingAccount !== "") {
      writer.uint32(18).string(message.vestingAccount);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventCreateClawbackVestingAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventCreateClawbackVestingAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.funder = reader.string();
          break;
        case 2:
          message.vestingAccount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventCreateClawbackVestingAccount {
    return {
      funder: isSet(object.funder) ? String(object.funder) : "",
      vestingAccount: isSet(object.vestingAccount) ? String(object.vestingAccount) : ""
    };
  },
  toJSON(message: EventCreateClawbackVestingAccount): JsonSafe<EventCreateClawbackVestingAccount> {
    const obj: any = {};
    message.funder !== undefined && (obj.funder = message.funder);
    message.vestingAccount !== undefined && (obj.vestingAccount = message.vestingAccount);
    return obj;
  },
  fromPartial(object: Partial<EventCreateClawbackVestingAccount>): EventCreateClawbackVestingAccount {
    const message = createBaseEventCreateClawbackVestingAccount();
    message.funder = object.funder ?? "";
    message.vestingAccount = object.vestingAccount ?? "";
    return message;
  },
  fromAmino(object: EventCreateClawbackVestingAccountAmino): EventCreateClawbackVestingAccount {
    const message = createBaseEventCreateClawbackVestingAccount();
    if (object.funder !== undefined && object.funder !== null) {
      message.funder = object.funder;
    }
    if (object.vesting_account !== undefined && object.vesting_account !== null) {
      message.vestingAccount = object.vesting_account;
    }
    return message;
  },
  toAmino(message: EventCreateClawbackVestingAccount): EventCreateClawbackVestingAccountAmino {
    const obj: any = {};
    obj.funder = message.funder === "" ? undefined : message.funder;
    obj.vesting_account = message.vestingAccount === "" ? undefined : message.vestingAccount;
    return obj;
  },
  fromAminoMsg(object: EventCreateClawbackVestingAccountAminoMsg): EventCreateClawbackVestingAccount {
    return EventCreateClawbackVestingAccount.fromAmino(object.value);
  },
  toAminoMsg(message: EventCreateClawbackVestingAccount): EventCreateClawbackVestingAccountAminoMsg {
    return {
      type: "vesting/EventCreateClawbackVestingAccount",
      value: EventCreateClawbackVestingAccount.toAmino(message)
    };
  },
  fromProtoMsg(message: EventCreateClawbackVestingAccountProtoMsg): EventCreateClawbackVestingAccount {
    return EventCreateClawbackVestingAccount.decode(message.value);
  },
  toProto(message: EventCreateClawbackVestingAccount): Uint8Array {
    return EventCreateClawbackVestingAccount.encode(message).finish();
  },
  toProtoMsg(message: EventCreateClawbackVestingAccount): EventCreateClawbackVestingAccountProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.EventCreateClawbackVestingAccount",
      value: EventCreateClawbackVestingAccount.encode(message).finish()
    };
  }
};
function createBaseEventFundVestingAccount(): EventFundVestingAccount {
  return {
    funder: "",
    coins: "",
    startTime: "",
    vestingAccount: ""
  };
}
export const EventFundVestingAccount = {
  typeUrl: "/evmos.vesting.v2.EventFundVestingAccount",
  encode(message: EventFundVestingAccount, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.funder !== "") {
      writer.uint32(10).string(message.funder);
    }
    if (message.coins !== "") {
      writer.uint32(18).string(message.coins);
    }
    if (message.startTime !== "") {
      writer.uint32(26).string(message.startTime);
    }
    if (message.vestingAccount !== "") {
      writer.uint32(42).string(message.vestingAccount);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventFundVestingAccount {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventFundVestingAccount();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.funder = reader.string();
          break;
        case 2:
          message.coins = reader.string();
          break;
        case 3:
          message.startTime = reader.string();
          break;
        case 5:
          message.vestingAccount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventFundVestingAccount {
    return {
      funder: isSet(object.funder) ? String(object.funder) : "",
      coins: isSet(object.coins) ? String(object.coins) : "",
      startTime: isSet(object.startTime) ? String(object.startTime) : "",
      vestingAccount: isSet(object.vestingAccount) ? String(object.vestingAccount) : ""
    };
  },
  toJSON(message: EventFundVestingAccount): JsonSafe<EventFundVestingAccount> {
    const obj: any = {};
    message.funder !== undefined && (obj.funder = message.funder);
    message.coins !== undefined && (obj.coins = message.coins);
    message.startTime !== undefined && (obj.startTime = message.startTime);
    message.vestingAccount !== undefined && (obj.vestingAccount = message.vestingAccount);
    return obj;
  },
  fromPartial(object: Partial<EventFundVestingAccount>): EventFundVestingAccount {
    const message = createBaseEventFundVestingAccount();
    message.funder = object.funder ?? "";
    message.coins = object.coins ?? "";
    message.startTime = object.startTime ?? "";
    message.vestingAccount = object.vestingAccount ?? "";
    return message;
  },
  fromAmino(object: EventFundVestingAccountAmino): EventFundVestingAccount {
    const message = createBaseEventFundVestingAccount();
    if (object.funder !== undefined && object.funder !== null) {
      message.funder = object.funder;
    }
    if (object.coins !== undefined && object.coins !== null) {
      message.coins = object.coins;
    }
    if (object.start_time !== undefined && object.start_time !== null) {
      message.startTime = object.start_time;
    }
    if (object.vesting_account !== undefined && object.vesting_account !== null) {
      message.vestingAccount = object.vesting_account;
    }
    return message;
  },
  toAmino(message: EventFundVestingAccount): EventFundVestingAccountAmino {
    const obj: any = {};
    obj.funder = message.funder === "" ? undefined : message.funder;
    obj.coins = message.coins === "" ? undefined : message.coins;
    obj.start_time = message.startTime === "" ? undefined : message.startTime;
    obj.vesting_account = message.vestingAccount === "" ? undefined : message.vestingAccount;
    return obj;
  },
  fromAminoMsg(object: EventFundVestingAccountAminoMsg): EventFundVestingAccount {
    return EventFundVestingAccount.fromAmino(object.value);
  },
  toAminoMsg(message: EventFundVestingAccount): EventFundVestingAccountAminoMsg {
    return {
      type: "vesting/EventFundVestingAccount",
      value: EventFundVestingAccount.toAmino(message)
    };
  },
  fromProtoMsg(message: EventFundVestingAccountProtoMsg): EventFundVestingAccount {
    return EventFundVestingAccount.decode(message.value);
  },
  toProto(message: EventFundVestingAccount): Uint8Array {
    return EventFundVestingAccount.encode(message).finish();
  },
  toProtoMsg(message: EventFundVestingAccount): EventFundVestingAccountProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.EventFundVestingAccount",
      value: EventFundVestingAccount.encode(message).finish()
    };
  }
};
function createBaseEventClawback(): EventClawback {
  return {
    funder: "",
    account: "",
    destination: ""
  };
}
export const EventClawback = {
  typeUrl: "/evmos.vesting.v2.EventClawback",
  encode(message: EventClawback, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.funder !== "") {
      writer.uint32(10).string(message.funder);
    }
    if (message.account !== "") {
      writer.uint32(18).string(message.account);
    }
    if (message.destination !== "") {
      writer.uint32(26).string(message.destination);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventClawback {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventClawback();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.funder = reader.string();
          break;
        case 2:
          message.account = reader.string();
          break;
        case 3:
          message.destination = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventClawback {
    return {
      funder: isSet(object.funder) ? String(object.funder) : "",
      account: isSet(object.account) ? String(object.account) : "",
      destination: isSet(object.destination) ? String(object.destination) : ""
    };
  },
  toJSON(message: EventClawback): JsonSafe<EventClawback> {
    const obj: any = {};
    message.funder !== undefined && (obj.funder = message.funder);
    message.account !== undefined && (obj.account = message.account);
    message.destination !== undefined && (obj.destination = message.destination);
    return obj;
  },
  fromPartial(object: Partial<EventClawback>): EventClawback {
    const message = createBaseEventClawback();
    message.funder = object.funder ?? "";
    message.account = object.account ?? "";
    message.destination = object.destination ?? "";
    return message;
  },
  fromAmino(object: EventClawbackAmino): EventClawback {
    const message = createBaseEventClawback();
    if (object.funder !== undefined && object.funder !== null) {
      message.funder = object.funder;
    }
    if (object.account !== undefined && object.account !== null) {
      message.account = object.account;
    }
    if (object.destination !== undefined && object.destination !== null) {
      message.destination = object.destination;
    }
    return message;
  },
  toAmino(message: EventClawback): EventClawbackAmino {
    const obj: any = {};
    obj.funder = message.funder === "" ? undefined : message.funder;
    obj.account = message.account === "" ? undefined : message.account;
    obj.destination = message.destination === "" ? undefined : message.destination;
    return obj;
  },
  fromAminoMsg(object: EventClawbackAminoMsg): EventClawback {
    return EventClawback.fromAmino(object.value);
  },
  toAminoMsg(message: EventClawback): EventClawbackAminoMsg {
    return {
      type: "vesting/EventClawback",
      value: EventClawback.toAmino(message)
    };
  },
  fromProtoMsg(message: EventClawbackProtoMsg): EventClawback {
    return EventClawback.decode(message.value);
  },
  toProto(message: EventClawback): Uint8Array {
    return EventClawback.encode(message).finish();
  },
  toProtoMsg(message: EventClawback): EventClawbackProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.EventClawback",
      value: EventClawback.encode(message).finish()
    };
  }
};
function createBaseEventUpdateVestingFunder(): EventUpdateVestingFunder {
  return {
    funder: "",
    account: "",
    newFunder: ""
  };
}
export const EventUpdateVestingFunder = {
  typeUrl: "/evmos.vesting.v2.EventUpdateVestingFunder",
  encode(message: EventUpdateVestingFunder, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.funder !== "") {
      writer.uint32(10).string(message.funder);
    }
    if (message.account !== "") {
      writer.uint32(18).string(message.account);
    }
    if (message.newFunder !== "") {
      writer.uint32(26).string(message.newFunder);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventUpdateVestingFunder {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventUpdateVestingFunder();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.funder = reader.string();
          break;
        case 2:
          message.account = reader.string();
          break;
        case 3:
          message.newFunder = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventUpdateVestingFunder {
    return {
      funder: isSet(object.funder) ? String(object.funder) : "",
      account: isSet(object.account) ? String(object.account) : "",
      newFunder: isSet(object.newFunder) ? String(object.newFunder) : ""
    };
  },
  toJSON(message: EventUpdateVestingFunder): JsonSafe<EventUpdateVestingFunder> {
    const obj: any = {};
    message.funder !== undefined && (obj.funder = message.funder);
    message.account !== undefined && (obj.account = message.account);
    message.newFunder !== undefined && (obj.newFunder = message.newFunder);
    return obj;
  },
  fromPartial(object: Partial<EventUpdateVestingFunder>): EventUpdateVestingFunder {
    const message = createBaseEventUpdateVestingFunder();
    message.funder = object.funder ?? "";
    message.account = object.account ?? "";
    message.newFunder = object.newFunder ?? "";
    return message;
  },
  fromAmino(object: EventUpdateVestingFunderAmino): EventUpdateVestingFunder {
    const message = createBaseEventUpdateVestingFunder();
    if (object.funder !== undefined && object.funder !== null) {
      message.funder = object.funder;
    }
    if (object.account !== undefined && object.account !== null) {
      message.account = object.account;
    }
    if (object.new_funder !== undefined && object.new_funder !== null) {
      message.newFunder = object.new_funder;
    }
    return message;
  },
  toAmino(message: EventUpdateVestingFunder): EventUpdateVestingFunderAmino {
    const obj: any = {};
    obj.funder = message.funder === "" ? undefined : message.funder;
    obj.account = message.account === "" ? undefined : message.account;
    obj.new_funder = message.newFunder === "" ? undefined : message.newFunder;
    return obj;
  },
  fromAminoMsg(object: EventUpdateVestingFunderAminoMsg): EventUpdateVestingFunder {
    return EventUpdateVestingFunder.fromAmino(object.value);
  },
  toAminoMsg(message: EventUpdateVestingFunder): EventUpdateVestingFunderAminoMsg {
    return {
      type: "vesting/EventUpdateVestingFunder",
      value: EventUpdateVestingFunder.toAmino(message)
    };
  },
  fromProtoMsg(message: EventUpdateVestingFunderProtoMsg): EventUpdateVestingFunder {
    return EventUpdateVestingFunder.decode(message.value);
  },
  toProto(message: EventUpdateVestingFunder): Uint8Array {
    return EventUpdateVestingFunder.encode(message).finish();
  },
  toProtoMsg(message: EventUpdateVestingFunder): EventUpdateVestingFunderProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.EventUpdateVestingFunder",
      value: EventUpdateVestingFunder.encode(message).finish()
    };
  }
};