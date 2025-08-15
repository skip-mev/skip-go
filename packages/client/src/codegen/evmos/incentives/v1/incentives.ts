//@ts-nocheck
import { DecCoin, DecCoinAmino, DecCoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { Timestamp } from "../../../google/protobuf/timestamp";
import { Long, toTimestamp, fromTimestamp, isSet, fromJsonTimestamp } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/**
 * Incentive defines an instance that organizes distribution conditions for a
 * given smart contract
 */
export interface Incentive {
  /** contract address of the smart contract to be incentivized */
  contract: string;
  /** allocations is a slice of denoms and percentages of rewards to be allocated */
  allocations: DecCoin[];
  /** epochs defines the number of remaining epochs for the incentive */
  epochs: number;
  /** start_time of the incentive distribution */
  startTime: Date;
  /** total_gas is the cumulative gas spent by all gas meters of the incentive during the epoch */
  totalGas: Long;
}
export interface IncentiveProtoMsg {
  typeUrl: "/evmos.incentives.v1.Incentive";
  value: Uint8Array;
}
/**
 * Incentive defines an instance that organizes distribution conditions for a
 * given smart contract
 * @name IncentiveAmino
 * @package evmos.incentives.v1
 * @see proto type: evmos.incentives.v1.Incentive
 */
export interface IncentiveAmino {
  /**
   * contract address of the smart contract to be incentivized
   */
  contract?: string;
  /**
   * allocations is a slice of denoms and percentages of rewards to be allocated
   */
  allocations?: DecCoinAmino[];
  /**
   * epochs defines the number of remaining epochs for the incentive
   */
  epochs?: number;
  /**
   * start_time of the incentive distribution
   */
  start_time?: string;
  /**
   * total_gas is the cumulative gas spent by all gas meters of the incentive during the epoch
   */
  total_gas?: string;
}
export interface IncentiveAminoMsg {
  type: "incentives/Incentive";
  value: IncentiveAmino;
}
/**
 * Incentive defines an instance that organizes distribution conditions for a
 * given smart contract
 */
export interface IncentiveSDKType {
  contract: string;
  allocations: DecCoinSDKType[];
  epochs: number;
  start_time: Date;
  total_gas: Long;
}
/** GasMeter tracks the cumulative gas spent per participant in one epoch */
export interface GasMeter {
  /** contract is the hex address of the incentivized smart contract */
  contract: string;
  /** participant address that interacts with the incentive */
  participant: string;
  /** cumulative_gas spent during the epoch */
  cumulativeGas: Long;
}
export interface GasMeterProtoMsg {
  typeUrl: "/evmos.incentives.v1.GasMeter";
  value: Uint8Array;
}
/**
 * GasMeter tracks the cumulative gas spent per participant in one epoch
 * @name GasMeterAmino
 * @package evmos.incentives.v1
 * @see proto type: evmos.incentives.v1.GasMeter
 */
export interface GasMeterAmino {
  /**
   * contract is the hex address of the incentivized smart contract
   */
  contract?: string;
  /**
   * participant address that interacts with the incentive
   */
  participant?: string;
  /**
   * cumulative_gas spent during the epoch
   */
  cumulative_gas?: string;
}
export interface GasMeterAminoMsg {
  type: "incentives/GasMeter";
  value: GasMeterAmino;
}
/** GasMeter tracks the cumulative gas spent per participant in one epoch */
export interface GasMeterSDKType {
  contract: string;
  participant: string;
  cumulative_gas: Long;
}
/** RegisterIncentiveProposal is a gov Content type to register an incentive */
export interface RegisterIncentiveProposal {
  /** title of the proposal */
  title: string;
  /** description of the proposal */
  description: string;
  /** contract address to be registered */
  contract: string;
  /** allocations defines the denoms and percentage of rewards to be allocated */
  allocations: DecCoin[];
  /** epochs is the number of remaining epochs for the incentive */
  epochs: number;
}
export interface RegisterIncentiveProposalProtoMsg {
  typeUrl: "/evmos.incentives.v1.RegisterIncentiveProposal";
  value: Uint8Array;
}
/**
 * RegisterIncentiveProposal is a gov Content type to register an incentive
 * @name RegisterIncentiveProposalAmino
 * @package evmos.incentives.v1
 * @see proto type: evmos.incentives.v1.RegisterIncentiveProposal
 */
export interface RegisterIncentiveProposalAmino {
  /**
   * title of the proposal
   */
  title?: string;
  /**
   * description of the proposal
   */
  description?: string;
  /**
   * contract address to be registered
   */
  contract?: string;
  /**
   * allocations defines the denoms and percentage of rewards to be allocated
   */
  allocations?: DecCoinAmino[];
  /**
   * epochs is the number of remaining epochs for the incentive
   */
  epochs?: number;
}
export interface RegisterIncentiveProposalAminoMsg {
  type: "incentives/RegisterIncentiveProposal";
  value: RegisterIncentiveProposalAmino;
}
/** RegisterIncentiveProposal is a gov Content type to register an incentive */
export interface RegisterIncentiveProposalSDKType {
  title: string;
  description: string;
  contract: string;
  allocations: DecCoinSDKType[];
  epochs: number;
}
/** CancelIncentiveProposal is a gov Content type to cancel an incentive */
export interface CancelIncentiveProposal {
  /** title of the proposal */
  title: string;
  /** description of the proposal */
  description: string;
  /** contract address of the incentivized smart contract */
  contract: string;
}
export interface CancelIncentiveProposalProtoMsg {
  typeUrl: "/evmos.incentives.v1.CancelIncentiveProposal";
  value: Uint8Array;
}
/**
 * CancelIncentiveProposal is a gov Content type to cancel an incentive
 * @name CancelIncentiveProposalAmino
 * @package evmos.incentives.v1
 * @see proto type: evmos.incentives.v1.CancelIncentiveProposal
 */
export interface CancelIncentiveProposalAmino {
  /**
   * title of the proposal
   */
  title?: string;
  /**
   * description of the proposal
   */
  description?: string;
  /**
   * contract address of the incentivized smart contract
   */
  contract?: string;
}
export interface CancelIncentiveProposalAminoMsg {
  type: "incentives/CancelIncentiveProposal";
  value: CancelIncentiveProposalAmino;
}
/** CancelIncentiveProposal is a gov Content type to cancel an incentive */
export interface CancelIncentiveProposalSDKType {
  title: string;
  description: string;
  contract: string;
}
function createBaseIncentive(): Incentive {
  return {
    contract: "",
    allocations: [],
    epochs: 0,
    startTime: new Date(),
    totalGas: Long.UZERO
  };
}
export const Incentive = {
  typeUrl: "/evmos.incentives.v1.Incentive",
  encode(message: Incentive, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contract !== "") {
      writer.uint32(10).string(message.contract);
    }
    for (const v of message.allocations) {
      DecCoin.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.epochs !== 0) {
      writer.uint32(24).uint32(message.epochs);
    }
    if (message.startTime !== undefined) {
      Timestamp.encode(toTimestamp(message.startTime), writer.uint32(34).fork()).ldelim();
    }
    if (!message.totalGas.isZero()) {
      writer.uint32(40).uint64(message.totalGas);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Incentive {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIncentive();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contract = reader.string();
          break;
        case 2:
          message.allocations.push(DecCoin.decode(reader, reader.uint32()));
          break;
        case 3:
          message.epochs = reader.uint32();
          break;
        case 4:
          message.startTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 5:
          message.totalGas = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Incentive {
    return {
      contract: isSet(object.contract) ? String(object.contract) : "",
      allocations: Array.isArray(object?.allocations) ? object.allocations.map((e: any) => DecCoin.fromJSON(e)) : [],
      epochs: isSet(object.epochs) ? Number(object.epochs) : 0,
      startTime: isSet(object.startTime) ? fromJsonTimestamp(object.startTime) : undefined,
      totalGas: isSet(object.totalGas) ? Long.fromValue(object.totalGas) : Long.UZERO
    };
  },
  toJSON(message: Incentive): JsonSafe<Incentive> {
    const obj: any = {};
    message.contract !== undefined && (obj.contract = message.contract);
    if (message.allocations) {
      obj.allocations = message.allocations.map(e => e ? DecCoin.toJSON(e) : undefined);
    } else {
      obj.allocations = [];
    }
    message.epochs !== undefined && (obj.epochs = Math.round(message.epochs));
    message.startTime !== undefined && (obj.startTime = message.startTime.toISOString());
    message.totalGas !== undefined && (obj.totalGas = (message.totalGas || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<Incentive>): Incentive {
    const message = createBaseIncentive();
    message.contract = object.contract ?? "";
    message.allocations = object.allocations?.map(e => DecCoin.fromPartial(e)) || [];
    message.epochs = object.epochs ?? 0;
    message.startTime = object.startTime ?? undefined;
    message.totalGas = object.totalGas !== undefined && object.totalGas !== null ? Long.fromValue(object.totalGas) : Long.UZERO;
    return message;
  },
  fromAmino(object: IncentiveAmino): Incentive {
    const message = createBaseIncentive();
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    message.allocations = object.allocations?.map(e => DecCoin.fromAmino(e)) || [];
    if (object.epochs !== undefined && object.epochs !== null) {
      message.epochs = object.epochs;
    }
    if (object.start_time !== undefined && object.start_time !== null) {
      message.startTime = fromTimestamp(Timestamp.fromAmino(object.start_time));
    }
    if (object.total_gas !== undefined && object.total_gas !== null) {
      message.totalGas = Long.fromString(object.total_gas);
    }
    return message;
  },
  toAmino(message: Incentive): IncentiveAmino {
    const obj: any = {};
    obj.contract = message.contract === "" ? undefined : message.contract;
    if (message.allocations) {
      obj.allocations = message.allocations.map(e => e ? DecCoin.toAmino(e) : undefined);
    } else {
      obj.allocations = message.allocations;
    }
    obj.epochs = message.epochs === 0 ? undefined : message.epochs;
    obj.start_time = message.startTime ? Timestamp.toAmino(toTimestamp(message.startTime)) : undefined;
    obj.total_gas = !message.totalGas.isZero() ? message.totalGas?.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: IncentiveAminoMsg): Incentive {
    return Incentive.fromAmino(object.value);
  },
  toAminoMsg(message: Incentive): IncentiveAminoMsg {
    return {
      type: "incentives/Incentive",
      value: Incentive.toAmino(message)
    };
  },
  fromProtoMsg(message: IncentiveProtoMsg): Incentive {
    return Incentive.decode(message.value);
  },
  toProto(message: Incentive): Uint8Array {
    return Incentive.encode(message).finish();
  },
  toProtoMsg(message: Incentive): IncentiveProtoMsg {
    return {
      typeUrl: "/evmos.incentives.v1.Incentive",
      value: Incentive.encode(message).finish()
    };
  }
};
function createBaseGasMeter(): GasMeter {
  return {
    contract: "",
    participant: "",
    cumulativeGas: Long.UZERO
  };
}
export const GasMeter = {
  typeUrl: "/evmos.incentives.v1.GasMeter",
  encode(message: GasMeter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contract !== "") {
      writer.uint32(10).string(message.contract);
    }
    if (message.participant !== "") {
      writer.uint32(18).string(message.participant);
    }
    if (!message.cumulativeGas.isZero()) {
      writer.uint32(24).uint64(message.cumulativeGas);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GasMeter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGasMeter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contract = reader.string();
          break;
        case 2:
          message.participant = reader.string();
          break;
        case 3:
          message.cumulativeGas = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GasMeter {
    return {
      contract: isSet(object.contract) ? String(object.contract) : "",
      participant: isSet(object.participant) ? String(object.participant) : "",
      cumulativeGas: isSet(object.cumulativeGas) ? Long.fromValue(object.cumulativeGas) : Long.UZERO
    };
  },
  toJSON(message: GasMeter): JsonSafe<GasMeter> {
    const obj: any = {};
    message.contract !== undefined && (obj.contract = message.contract);
    message.participant !== undefined && (obj.participant = message.participant);
    message.cumulativeGas !== undefined && (obj.cumulativeGas = (message.cumulativeGas || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<GasMeter>): GasMeter {
    const message = createBaseGasMeter();
    message.contract = object.contract ?? "";
    message.participant = object.participant ?? "";
    message.cumulativeGas = object.cumulativeGas !== undefined && object.cumulativeGas !== null ? Long.fromValue(object.cumulativeGas) : Long.UZERO;
    return message;
  },
  fromAmino(object: GasMeterAmino): GasMeter {
    const message = createBaseGasMeter();
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    if (object.participant !== undefined && object.participant !== null) {
      message.participant = object.participant;
    }
    if (object.cumulative_gas !== undefined && object.cumulative_gas !== null) {
      message.cumulativeGas = Long.fromString(object.cumulative_gas);
    }
    return message;
  },
  toAmino(message: GasMeter): GasMeterAmino {
    const obj: any = {};
    obj.contract = message.contract === "" ? undefined : message.contract;
    obj.participant = message.participant === "" ? undefined : message.participant;
    obj.cumulative_gas = !message.cumulativeGas.isZero() ? message.cumulativeGas?.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: GasMeterAminoMsg): GasMeter {
    return GasMeter.fromAmino(object.value);
  },
  toAminoMsg(message: GasMeter): GasMeterAminoMsg {
    return {
      type: "incentives/GasMeter",
      value: GasMeter.toAmino(message)
    };
  },
  fromProtoMsg(message: GasMeterProtoMsg): GasMeter {
    return GasMeter.decode(message.value);
  },
  toProto(message: GasMeter): Uint8Array {
    return GasMeter.encode(message).finish();
  },
  toProtoMsg(message: GasMeter): GasMeterProtoMsg {
    return {
      typeUrl: "/evmos.incentives.v1.GasMeter",
      value: GasMeter.encode(message).finish()
    };
  }
};
function createBaseRegisterIncentiveProposal(): RegisterIncentiveProposal {
  return {
    title: "",
    description: "",
    contract: "",
    allocations: [],
    epochs: 0
  };
}
export const RegisterIncentiveProposal = {
  typeUrl: "/evmos.incentives.v1.RegisterIncentiveProposal",
  encode(message: RegisterIncentiveProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.contract !== "") {
      writer.uint32(26).string(message.contract);
    }
    for (const v of message.allocations) {
      DecCoin.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.epochs !== 0) {
      writer.uint32(40).uint32(message.epochs);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): RegisterIncentiveProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisterIncentiveProposal();
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
          message.contract = reader.string();
          break;
        case 4:
          message.allocations.push(DecCoin.decode(reader, reader.uint32()));
          break;
        case 5:
          message.epochs = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): RegisterIncentiveProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      contract: isSet(object.contract) ? String(object.contract) : "",
      allocations: Array.isArray(object?.allocations) ? object.allocations.map((e: any) => DecCoin.fromJSON(e)) : [],
      epochs: isSet(object.epochs) ? Number(object.epochs) : 0
    };
  },
  toJSON(message: RegisterIncentiveProposal): JsonSafe<RegisterIncentiveProposal> {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.contract !== undefined && (obj.contract = message.contract);
    if (message.allocations) {
      obj.allocations = message.allocations.map(e => e ? DecCoin.toJSON(e) : undefined);
    } else {
      obj.allocations = [];
    }
    message.epochs !== undefined && (obj.epochs = Math.round(message.epochs));
    return obj;
  },
  fromPartial(object: Partial<RegisterIncentiveProposal>): RegisterIncentiveProposal {
    const message = createBaseRegisterIncentiveProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.contract = object.contract ?? "";
    message.allocations = object.allocations?.map(e => DecCoin.fromPartial(e)) || [];
    message.epochs = object.epochs ?? 0;
    return message;
  },
  fromAmino(object: RegisterIncentiveProposalAmino): RegisterIncentiveProposal {
    const message = createBaseRegisterIncentiveProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    message.allocations = object.allocations?.map(e => DecCoin.fromAmino(e)) || [];
    if (object.epochs !== undefined && object.epochs !== null) {
      message.epochs = object.epochs;
    }
    return message;
  },
  toAmino(message: RegisterIncentiveProposal): RegisterIncentiveProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.contract = message.contract === "" ? undefined : message.contract;
    if (message.allocations) {
      obj.allocations = message.allocations.map(e => e ? DecCoin.toAmino(e) : undefined);
    } else {
      obj.allocations = message.allocations;
    }
    obj.epochs = message.epochs === 0 ? undefined : message.epochs;
    return obj;
  },
  fromAminoMsg(object: RegisterIncentiveProposalAminoMsg): RegisterIncentiveProposal {
    return RegisterIncentiveProposal.fromAmino(object.value);
  },
  toAminoMsg(message: RegisterIncentiveProposal): RegisterIncentiveProposalAminoMsg {
    return {
      type: "incentives/RegisterIncentiveProposal",
      value: RegisterIncentiveProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: RegisterIncentiveProposalProtoMsg): RegisterIncentiveProposal {
    return RegisterIncentiveProposal.decode(message.value);
  },
  toProto(message: RegisterIncentiveProposal): Uint8Array {
    return RegisterIncentiveProposal.encode(message).finish();
  },
  toProtoMsg(message: RegisterIncentiveProposal): RegisterIncentiveProposalProtoMsg {
    return {
      typeUrl: "/evmos.incentives.v1.RegisterIncentiveProposal",
      value: RegisterIncentiveProposal.encode(message).finish()
    };
  }
};
function createBaseCancelIncentiveProposal(): CancelIncentiveProposal {
  return {
    title: "",
    description: "",
    contract: ""
  };
}
export const CancelIncentiveProposal = {
  typeUrl: "/evmos.incentives.v1.CancelIncentiveProposal",
  encode(message: CancelIncentiveProposal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(10).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.contract !== "") {
      writer.uint32(26).string(message.contract);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): CancelIncentiveProposal {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelIncentiveProposal();
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
          message.contract = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CancelIncentiveProposal {
    return {
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      contract: isSet(object.contract) ? String(object.contract) : ""
    };
  },
  toJSON(message: CancelIncentiveProposal): JsonSafe<CancelIncentiveProposal> {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.contract !== undefined && (obj.contract = message.contract);
    return obj;
  },
  fromPartial(object: Partial<CancelIncentiveProposal>): CancelIncentiveProposal {
    const message = createBaseCancelIncentiveProposal();
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.contract = object.contract ?? "";
    return message;
  },
  fromAmino(object: CancelIncentiveProposalAmino): CancelIncentiveProposal {
    const message = createBaseCancelIncentiveProposal();
    if (object.title !== undefined && object.title !== null) {
      message.title = object.title;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.contract !== undefined && object.contract !== null) {
      message.contract = object.contract;
    }
    return message;
  },
  toAmino(message: CancelIncentiveProposal): CancelIncentiveProposalAmino {
    const obj: any = {};
    obj.title = message.title === "" ? undefined : message.title;
    obj.description = message.description === "" ? undefined : message.description;
    obj.contract = message.contract === "" ? undefined : message.contract;
    return obj;
  },
  fromAminoMsg(object: CancelIncentiveProposalAminoMsg): CancelIncentiveProposal {
    return CancelIncentiveProposal.fromAmino(object.value);
  },
  toAminoMsg(message: CancelIncentiveProposal): CancelIncentiveProposalAminoMsg {
    return {
      type: "incentives/CancelIncentiveProposal",
      value: CancelIncentiveProposal.toAmino(message)
    };
  },
  fromProtoMsg(message: CancelIncentiveProposalProtoMsg): CancelIncentiveProposal {
    return CancelIncentiveProposal.decode(message.value);
  },
  toProto(message: CancelIncentiveProposal): Uint8Array {
    return CancelIncentiveProposal.encode(message).finish();
  },
  toProtoMsg(message: CancelIncentiveProposal): CancelIncentiveProposalProtoMsg {
    return {
      typeUrl: "/evmos.incentives.v1.CancelIncentiveProposal",
      value: CancelIncentiveProposal.encode(message).finish()
    };
  }
};