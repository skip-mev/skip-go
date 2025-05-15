//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/** EventRegisterRevenue is an event emitted when a contract is registered to receive a percentage of tx fees. */
export interface EventRegisterRevenue {
  /**
   * deployer_address is the bech32 address of message sender. It must be the same as the origin EOA
   * sending the transaction which deploys the contract
   */
  deployerAddress: string;
  /** contract_address in hex format */
  contractAddress: string;
  /**
   * effective_withdrawer is the withdrawer address that is stored after the
   * revenue registration is completed. It defaults to the deployer address if
   * the withdrawer address in the msg is omitted. When omitted, the withdraw map
   * doesn't need to be set.
   */
  effectiveWithdrawer: string;
}
export interface EventRegisterRevenueProtoMsg {
  typeUrl: "/evmos.revenue.v1.EventRegisterRevenue";
  value: Uint8Array;
}
/** EventRegisterRevenue is an event emitted when a contract is registered to receive a percentage of tx fees. */
export interface EventRegisterRevenueAmino {
  /**
   * deployer_address is the bech32 address of message sender. It must be the same as the origin EOA
   * sending the transaction which deploys the contract
   */
  deployer_address?: string;
  /** contract_address in hex format */
  contract_address?: string;
  /**
   * effective_withdrawer is the withdrawer address that is stored after the
   * revenue registration is completed. It defaults to the deployer address if
   * the withdrawer address in the msg is omitted. When omitted, the withdraw map
   * doesn't need to be set.
   */
  effective_withdrawer?: string;
}
export interface EventRegisterRevenueAminoMsg {
  type: "revenue/EventRegisterRevenue";
  value: EventRegisterRevenueAmino;
}
/** EventRegisterRevenue is an event emitted when a contract is registered to receive a percentage of tx fees. */
export interface EventRegisterRevenueSDKType {
  deployer_address: string;
  contract_address: string;
  effective_withdrawer: string;
}
/** EventUpdateRevenue is an event emitted when a withdrawer address is updated for a contract. */
export interface EventUpdateRevenue {
  /** contract_address in hex format */
  contractAddress: string;
  /**
   * deployer_address is the bech32 address of message sender. It must be the same as the origin EOA
   * sending the transaction which deploys the contract
   */
  deployerAddress: string;
  /** withdrawer_address is the bech32 address of account receiving the transaction fees */
  withdrawerAddress: string;
}
export interface EventUpdateRevenueProtoMsg {
  typeUrl: "/evmos.revenue.v1.EventUpdateRevenue";
  value: Uint8Array;
}
/** EventUpdateRevenue is an event emitted when a withdrawer address is updated for a contract. */
export interface EventUpdateRevenueAmino {
  /** contract_address in hex format */
  contract_address?: string;
  /**
   * deployer_address is the bech32 address of message sender. It must be the same as the origin EOA
   * sending the transaction which deploys the contract
   */
  deployer_address?: string;
  /** withdrawer_address is the bech32 address of account receiving the transaction fees */
  withdrawer_address?: string;
}
export interface EventUpdateRevenueAminoMsg {
  type: "revenue/EventUpdateRevenue";
  value: EventUpdateRevenueAmino;
}
/** EventUpdateRevenue is an event emitted when a withdrawer address is updated for a contract. */
export interface EventUpdateRevenueSDKType {
  contract_address: string;
  deployer_address: string;
  withdrawer_address: string;
}
/** EventCancelRevenue is an event emitted when a contract is unregistered from receiving tx fees. */
export interface EventCancelRevenue {
  /**
   * deployer_address is the bech32 address of message sender. It must be the same as the origin EOA
   * sending the transaction which deploys the contract
   */
  deployerAddress: string;
  /** contract_address in hex format */
  contractAddress: string;
}
export interface EventCancelRevenueProtoMsg {
  typeUrl: "/evmos.revenue.v1.EventCancelRevenue";
  value: Uint8Array;
}
/** EventCancelRevenue is an event emitted when a contract is unregistered from receiving tx fees. */
export interface EventCancelRevenueAmino {
  /**
   * deployer_address is the bech32 address of message sender. It must be the same as the origin EOA
   * sending the transaction which deploys the contract
   */
  deployer_address?: string;
  /** contract_address in hex format */
  contract_address?: string;
}
export interface EventCancelRevenueAminoMsg {
  type: "revenue/EventCancelRevenue";
  value: EventCancelRevenueAmino;
}
/** EventCancelRevenue is an event emitted when a contract is unregistered from receiving tx fees. */
export interface EventCancelRevenueSDKType {
  deployer_address: string;
  contract_address: string;
}
/** EventDistributeRevenue is an event emitted when a contract receives a percentage of tx fees. */
export interface EventDistributeRevenue {
  /** sender is the address of message sender. */
  sender: string;
  /** contract address in hex format */
  contract: string;
  /** withdrawer_address is the bech32 address of account receiving the transaction fees */
  withdrawerAddress: string;
  /** amount of revenue distributed */
  amount: string;
}
export interface EventDistributeRevenueProtoMsg {
  typeUrl: "/evmos.revenue.v1.EventDistributeRevenue";
  value: Uint8Array;
}
/** EventDistributeRevenue is an event emitted when a contract receives a percentage of tx fees. */
export interface EventDistributeRevenueAmino {
  /** sender is the address of message sender. */
  sender?: string;
  /** contract address in hex format */
  contract?: string;
  /** withdrawer_address is the bech32 address of account receiving the transaction fees */
  withdrawer_address?: string;
  /** amount of revenue distributed */
  amount?: string;
}
export interface EventDistributeRevenueAminoMsg {
  type: "revenue/EventDistributeRevenue";
  value: EventDistributeRevenueAmino;
}
/** EventDistributeRevenue is an event emitted when a contract receives a percentage of tx fees. */
export interface EventDistributeRevenueSDKType {
  sender: string;
  contract: string;
  withdrawer_address: string;
  amount: string;
}
function createBaseEventRegisterRevenue(): EventRegisterRevenue {
  return {
    deployerAddress: "",
    contractAddress: "",
    effectiveWithdrawer: ""
  };
}
export const EventRegisterRevenue = {
  typeUrl: "/evmos.revenue.v1.EventRegisterRevenue",
  encode(message: EventRegisterRevenue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.deployerAddress !== "") {
      writer.uint32(10).string(message.deployerAddress);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    if (message.effectiveWithdrawer !== "") {
      writer.uint32(26).string(message.effectiveWithdrawer);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventRegisterRevenue {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventRegisterRevenue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deployerAddress = reader.string();
          break;
        case 2:
          message.contractAddress = reader.string();
          break;
        case 3:
          message.effectiveWithdrawer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventRegisterRevenue {
    return {
      deployerAddress: isSet(object.deployerAddress) ? String(object.deployerAddress) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
      effectiveWithdrawer: isSet(object.effectiveWithdrawer) ? String(object.effectiveWithdrawer) : ""
    };
  },
  toJSON(message: EventRegisterRevenue): JsonSafe<EventRegisterRevenue> {
    const obj: any = {};
    message.deployerAddress !== undefined && (obj.deployerAddress = message.deployerAddress);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    message.effectiveWithdrawer !== undefined && (obj.effectiveWithdrawer = message.effectiveWithdrawer);
    return obj;
  },
  fromPartial(object: Partial<EventRegisterRevenue>): EventRegisterRevenue {
    const message = createBaseEventRegisterRevenue();
    message.deployerAddress = object.deployerAddress ?? "";
    message.contractAddress = object.contractAddress ?? "";
    message.effectiveWithdrawer = object.effectiveWithdrawer ?? "";
    return message;
  },
  fromAmino(object: EventRegisterRevenueAmino): EventRegisterRevenue {
    const message = createBaseEventRegisterRevenue();
    if (object.deployer_address !== undefined && object.deployer_address !== null) {
      message.deployerAddress = object.deployer_address;
    }
    if (object.contract_address !== undefined && object.contract_address !== null) {
      message.contractAddress = object.contract_address;
    }
    if (object.effective_withdrawer !== undefined && object.effective_withdrawer !== null) {
      message.effectiveWithdrawer = object.effective_withdrawer;
    }
    return message;
  },
  toAmino(message: EventRegisterRevenue): EventRegisterRevenueAmino {
    const obj: any = {};
    obj.deployer_address = message.deployerAddress === "" ? undefined : message.deployerAddress;
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    obj.effective_withdrawer = message.effectiveWithdrawer === "" ? undefined : message.effectiveWithdrawer;
    return obj;
  },
  fromAminoMsg(object: EventRegisterRevenueAminoMsg): EventRegisterRevenue {
    return EventRegisterRevenue.fromAmino(object.value);
  },
  toAminoMsg(message: EventRegisterRevenue): EventRegisterRevenueAminoMsg {
    return {
      type: "revenue/EventRegisterRevenue",
      value: EventRegisterRevenue.toAmino(message)
    };
  },
  fromProtoMsg(message: EventRegisterRevenueProtoMsg): EventRegisterRevenue {
    return EventRegisterRevenue.decode(message.value);
  },
  toProto(message: EventRegisterRevenue): Uint8Array {
    return EventRegisterRevenue.encode(message).finish();
  },
  toProtoMsg(message: EventRegisterRevenue): EventRegisterRevenueProtoMsg {
    return {
      typeUrl: "/evmos.revenue.v1.EventRegisterRevenue",
      value: EventRegisterRevenue.encode(message).finish()
    };
  }
};
function createBaseEventUpdateRevenue(): EventUpdateRevenue {
  return {
    contractAddress: "",
    deployerAddress: "",
    withdrawerAddress: ""
  };
}
export const EventUpdateRevenue = {
  typeUrl: "/evmos.revenue.v1.EventUpdateRevenue",
  encode(message: EventUpdateRevenue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contractAddress !== "") {
      writer.uint32(10).string(message.contractAddress);
    }
    if (message.deployerAddress !== "") {
      writer.uint32(18).string(message.deployerAddress);
    }
    if (message.withdrawerAddress !== "") {
      writer.uint32(26).string(message.withdrawerAddress);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventUpdateRevenue {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventUpdateRevenue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contractAddress = reader.string();
          break;
        case 2:
          message.deployerAddress = reader.string();
          break;
        case 3:
          message.withdrawerAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventUpdateRevenue {
    return {
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
      deployerAddress: isSet(object.deployerAddress) ? String(object.deployerAddress) : "",
      withdrawerAddress: isSet(object.withdrawerAddress) ? String(object.withdrawerAddress) : ""
    };
  },
  toJSON(message: EventUpdateRevenue): JsonSafe<EventUpdateRevenue> {
    const obj: any = {};
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    message.deployerAddress !== undefined && (obj.deployerAddress = message.deployerAddress);
    message.withdrawerAddress !== undefined && (obj.withdrawerAddress = message.withdrawerAddress);
    return obj;
  },
  fromPartial(object: Partial<EventUpdateRevenue>): EventUpdateRevenue {
    const message = createBaseEventUpdateRevenue();
    message.contractAddress = object.contractAddress ?? "";
    message.deployerAddress = object.deployerAddress ?? "";
    message.withdrawerAddress = object.withdrawerAddress ?? "";
    return message;
  },
  fromAmino(object: EventUpdateRevenueAmino): EventUpdateRevenue {
    const message = createBaseEventUpdateRevenue();
    if (object.contract_address !== undefined && object.contract_address !== null) {
      message.contractAddress = object.contract_address;
    }
    if (object.deployer_address !== undefined && object.deployer_address !== null) {
      message.deployerAddress = object.deployer_address;
    }
    if (object.withdrawer_address !== undefined && object.withdrawer_address !== null) {
      message.withdrawerAddress = object.withdrawer_address;
    }
    return message;
  },
  toAmino(message: EventUpdateRevenue): EventUpdateRevenueAmino {
    const obj: any = {};
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    obj.deployer_address = message.deployerAddress === "" ? undefined : message.deployerAddress;
    obj.withdrawer_address = message.withdrawerAddress === "" ? undefined : message.withdrawerAddress;
    return obj;
  },
  fromAminoMsg(object: EventUpdateRevenueAminoMsg): EventUpdateRevenue {
    return EventUpdateRevenue.fromAmino(object.value);
  },
  toAminoMsg(message: EventUpdateRevenue): EventUpdateRevenueAminoMsg {
    return {
      type: "revenue/EventUpdateRevenue",
      value: EventUpdateRevenue.toAmino(message)
    };
  },
  fromProtoMsg(message: EventUpdateRevenueProtoMsg): EventUpdateRevenue {
    return EventUpdateRevenue.decode(message.value);
  },
  toProto(message: EventUpdateRevenue): Uint8Array {
    return EventUpdateRevenue.encode(message).finish();
  },
  toProtoMsg(message: EventUpdateRevenue): EventUpdateRevenueProtoMsg {
    return {
      typeUrl: "/evmos.revenue.v1.EventUpdateRevenue",
      value: EventUpdateRevenue.encode(message).finish()
    };
  }
};
function createBaseEventCancelRevenue(): EventCancelRevenue {
  return {
    deployerAddress: "",
    contractAddress: ""
  };
}
export const EventCancelRevenue = {
  typeUrl: "/evmos.revenue.v1.EventCancelRevenue",
  encode(message: EventCancelRevenue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.deployerAddress !== "") {
      writer.uint32(10).string(message.deployerAddress);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventCancelRevenue {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventCancelRevenue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deployerAddress = reader.string();
          break;
        case 2:
          message.contractAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventCancelRevenue {
    return {
      deployerAddress: isSet(object.deployerAddress) ? String(object.deployerAddress) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : ""
    };
  },
  toJSON(message: EventCancelRevenue): JsonSafe<EventCancelRevenue> {
    const obj: any = {};
    message.deployerAddress !== undefined && (obj.deployerAddress = message.deployerAddress);
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    return obj;
  },
  fromPartial(object: Partial<EventCancelRevenue>): EventCancelRevenue {
    const message = createBaseEventCancelRevenue();
    message.deployerAddress = object.deployerAddress ?? "";
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
  fromAmino(object: EventCancelRevenueAmino): EventCancelRevenue {
    const message = createBaseEventCancelRevenue();
    if (object.deployer_address !== undefined && object.deployer_address !== null) {
      message.deployerAddress = object.deployer_address;
    }
    if (object.contract_address !== undefined && object.contract_address !== null) {
      message.contractAddress = object.contract_address;
    }
    return message;
  },
  toAmino(message: EventCancelRevenue): EventCancelRevenueAmino {
    const obj: any = {};
    obj.deployer_address = message.deployerAddress === "" ? undefined : message.deployerAddress;
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    return obj;
  },
  fromAminoMsg(object: EventCancelRevenueAminoMsg): EventCancelRevenue {
    return EventCancelRevenue.fromAmino(object.value);
  },
  toAminoMsg(message: EventCancelRevenue): EventCancelRevenueAminoMsg {
    return {
      type: "revenue/EventCancelRevenue",
      value: EventCancelRevenue.toAmino(message)
    };
  },
  fromProtoMsg(message: EventCancelRevenueProtoMsg): EventCancelRevenue {
    return EventCancelRevenue.decode(message.value);
  },
  toProto(message: EventCancelRevenue): Uint8Array {
    return EventCancelRevenue.encode(message).finish();
  },
  toProtoMsg(message: EventCancelRevenue): EventCancelRevenueProtoMsg {
    return {
      typeUrl: "/evmos.revenue.v1.EventCancelRevenue",
      value: EventCancelRevenue.encode(message).finish()
    };
  }
};
function createBaseEventDistributeRevenue(): EventDistributeRevenue {
  return {
    sender: "",
    contract: "",
    withdrawerAddress: "",
    amount: ""
  };
}
export const EventDistributeRevenue = {
  typeUrl: "/evmos.revenue.v1.EventDistributeRevenue",
  encode(message: EventDistributeRevenue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.contract !== "") {
      writer.uint32(18).string(message.contract);
    }
    if (message.withdrawerAddress !== "") {
      writer.uint32(26).string(message.withdrawerAddress);
    }
    if (message.amount !== "") {
      writer.uint32(34).string(message.amount);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): EventDistributeRevenue {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventDistributeRevenue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sender = reader.string();
          break;
        case 2:
          message.contract = reader.string();
          break;
        case 3:
          message.withdrawerAddress = reader.string();
          break;
        case 4:
          message.amount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): EventDistributeRevenue {
    return {
      sender: isSet(object.sender) ? String(object.sender) : "",
      contract: isSet(object.contract) ? String(object.contract) : "",
      withdrawerAddress: isSet(object.withdrawerAddress) ? String(object.withdrawerAddress) : "",
      amount: isSet(object.amount) ? String(object.amount) : ""
    };
  },
  toJSON(message: EventDistributeRevenue): JsonSafe<EventDistributeRevenue> {
    const obj: any = {};
    message.sender !== undefined && (obj.sender = message.sender);
    message.contract !== undefined && (obj.contract = message.contract);
    message.withdrawerAddress !== undefined && (obj.withdrawerAddress = message.withdrawerAddress);
    message.amount !== undefined && (obj.amount = message.amount);
    return obj;
  },
  fromPartial(object: Partial<EventDistributeRevenue>): EventDistributeRevenue {
    const message = createBaseEventDistributeRevenue();
    message.sender = object.sender ?? "";
    message.contract = object.contract ?? "";
    message.withdrawerAddress = object.withdrawerAddress ?? "";
    message.amount = object.amount ?? "";
    return message;
  },
  fromAmino(object: EventDistributeRevenueAmino): EventDistributeRevenue {
    const message = createBaseEventDistributeRevenue();
    if (object.sender !== undefined && object.sender !== null) {
      message.sender = object.sender;
    }
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    if (object.withdrawer_address !== undefined && object.withdrawer_address !== null) {
      message.withdrawerAddress = object.withdrawer_address;
    }
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    }
    return message;
  },
  toAmino(message: EventDistributeRevenue): EventDistributeRevenueAmino {
    const obj: any = {};
    obj.sender = message.sender === "" ? undefined : message.sender;
    obj.contract = message.contract === "" ? undefined : message.contract;
    obj.withdrawer_address = message.withdrawerAddress === "" ? undefined : message.withdrawerAddress;
    obj.amount = message.amount === "" ? undefined : message.amount;
    return obj;
  },
  fromAminoMsg(object: EventDistributeRevenueAminoMsg): EventDistributeRevenue {
    return EventDistributeRevenue.fromAmino(object.value);
  },
  toAminoMsg(message: EventDistributeRevenue): EventDistributeRevenueAminoMsg {
    return {
      type: "revenue/EventDistributeRevenue",
      value: EventDistributeRevenue.toAmino(message)
    };
  },
  fromProtoMsg(message: EventDistributeRevenueProtoMsg): EventDistributeRevenue {
    return EventDistributeRevenue.decode(message.value);
  },
  toProto(message: EventDistributeRevenue): Uint8Array {
    return EventDistributeRevenue.encode(message).finish();
  },
  toProtoMsg(message: EventDistributeRevenue): EventDistributeRevenueProtoMsg {
    return {
      typeUrl: "/evmos.revenue.v1.EventDistributeRevenue",
      value: EventDistributeRevenue.encode(message).finish()
    };
  }
};