//@ts-nocheck
import { Incentive, IncentiveAmino, IncentiveSDKType, GasMeter, GasMeterAmino, GasMeterSDKType } from "./incentives";
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
import { Decimal } from "@cosmjs/math";
/** GenesisState defines the module's genesis state. */
export interface GenesisState {
  /** params are the incentives module parameters */
  params: Params;
  /** incentives is a slice of active incentives */
  incentives: Incentive[];
  /** gas_meters is a slice of active Gasmeters */
  gasMeters: GasMeter[];
}
export interface GenesisStateProtoMsg {
  typeUrl: "/evmos.incentives.v1.GenesisState";
  value: Uint8Array;
}
/**
 * GenesisState defines the module's genesis state.
 * @name GenesisStateAmino
 * @package evmos.incentives.v1
 * @see proto type: evmos.incentives.v1.GenesisState
 */
export interface GenesisStateAmino {
  /**
   * params are the incentives module parameters
   */
  params?: ParamsAmino;
  /**
   * incentives is a slice of active incentives
   */
  incentives?: IncentiveAmino[];
  /**
   * gas_meters is a slice of active Gasmeters
   */
  gas_meters?: GasMeterAmino[];
}
export interface GenesisStateAminoMsg {
  type: "incentives/GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines the module's genesis state. */
export interface GenesisStateSDKType {
  params: ParamsSDKType;
  incentives: IncentiveSDKType[];
  gas_meters: GasMeterSDKType[];
}
/** Params defines the incentives module params */
export interface Params {
  /** enable_incentives is the parameter to enable incentives */
  enableIncentives: boolean;
  /** allocation_limit is the maximum percentage an incentive can allocate per denomination */
  allocationLimit: string;
  /** incentives_epoch_identifier for the epochs module hooks */
  incentivesEpochIdentifier: string;
  /** reward_scaler is the scaling factor for capping rewards */
  rewardScaler: string;
}
export interface ParamsProtoMsg {
  typeUrl: "/evmos.incentives.v1.Params";
  value: Uint8Array;
}
/**
 * Params defines the incentives module params
 * @name ParamsAmino
 * @package evmos.incentives.v1
 * @see proto type: evmos.incentives.v1.Params
 */
export interface ParamsAmino {
  /**
   * enable_incentives is the parameter to enable incentives
   */
  enable_incentives?: boolean;
  /**
   * allocation_limit is the maximum percentage an incentive can allocate per denomination
   */
  allocation_limit?: string;
  /**
   * incentives_epoch_identifier for the epochs module hooks
   */
  incentives_epoch_identifier?: string;
  /**
   * reward_scaler is the scaling factor for capping rewards
   */
  reward_scaler?: string;
}
export interface ParamsAminoMsg {
  type: "incentives/Params";
  value: ParamsAmino;
}
/** Params defines the incentives module params */
export interface ParamsSDKType {
  enable_incentives: boolean;
  allocation_limit: string;
  incentives_epoch_identifier: string;
  reward_scaler: string;
}
function createBaseGenesisState(): GenesisState {
  return {
    params: Params.fromPartial({}),
    incentives: [],
    gasMeters: []
  };
}
export const GenesisState = {
  typeUrl: "/evmos.incentives.v1.GenesisState",
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.incentives) {
      Incentive.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.gasMeters) {
      GasMeter.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.incentives.push(Incentive.decode(reader, reader.uint32()));
          break;
        case 3:
          message.gasMeters.push(GasMeter.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      incentives: Array.isArray(object?.incentives) ? object.incentives.map((e: any) => Incentive.fromJSON(e)) : [],
      gasMeters: Array.isArray(object?.gasMeters) ? object.gasMeters.map((e: any) => GasMeter.fromJSON(e)) : []
    };
  },
  toJSON(message: GenesisState): JsonSafe<GenesisState> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    if (message.incentives) {
      obj.incentives = message.incentives.map(e => e ? Incentive.toJSON(e) : undefined);
    } else {
      obj.incentives = [];
    }
    if (message.gasMeters) {
      obj.gasMeters = message.gasMeters.map(e => e ? GasMeter.toJSON(e) : undefined);
    } else {
      obj.gasMeters = [];
    }
    return obj;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.incentives = object.incentives?.map(e => Incentive.fromPartial(e)) || [];
    message.gasMeters = object.gasMeters?.map(e => GasMeter.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    message.incentives = object.incentives?.map(e => Incentive.fromAmino(e)) || [];
    message.gasMeters = object.gas_meters?.map(e => GasMeter.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    if (message.incentives) {
      obj.incentives = message.incentives.map(e => e ? Incentive.toAmino(e) : undefined);
    } else {
      obj.incentives = message.incentives;
    }
    if (message.gasMeters) {
      obj.gas_meters = message.gasMeters.map(e => e ? GasMeter.toAmino(e) : undefined);
    } else {
      obj.gas_meters = message.gasMeters;
    }
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  toAminoMsg(message: GenesisState): GenesisStateAminoMsg {
    return {
      type: "incentives/GenesisState",
      value: GenesisState.toAmino(message)
    };
  },
  fromProtoMsg(message: GenesisStateProtoMsg): GenesisState {
    return GenesisState.decode(message.value);
  },
  toProto(message: GenesisState): Uint8Array {
    return GenesisState.encode(message).finish();
  },
  toProtoMsg(message: GenesisState): GenesisStateProtoMsg {
    return {
      typeUrl: "/evmos.incentives.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};
function createBaseParams(): Params {
  return {
    enableIncentives: false,
    allocationLimit: "",
    incentivesEpochIdentifier: "",
    rewardScaler: ""
  };
}
export const Params = {
  typeUrl: "/evmos.incentives.v1.Params",
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.enableIncentives === true) {
      writer.uint32(8).bool(message.enableIncentives);
    }
    if (message.allocationLimit !== "") {
      writer.uint32(18).string(Decimal.fromUserInput(message.allocationLimit, 18).atomics);
    }
    if (message.incentivesEpochIdentifier !== "") {
      writer.uint32(26).string(message.incentivesEpochIdentifier);
    }
    if (message.rewardScaler !== "") {
      writer.uint32(34).string(Decimal.fromUserInput(message.rewardScaler, 18).atomics);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.enableIncentives = reader.bool();
          break;
        case 2:
          message.allocationLimit = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 3:
          message.incentivesEpochIdentifier = reader.string();
          break;
        case 4:
          message.rewardScaler = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Params {
    return {
      enableIncentives: isSet(object.enableIncentives) ? Boolean(object.enableIncentives) : false,
      allocationLimit: isSet(object.allocationLimit) ? String(object.allocationLimit) : "",
      incentivesEpochIdentifier: isSet(object.incentivesEpochIdentifier) ? String(object.incentivesEpochIdentifier) : "",
      rewardScaler: isSet(object.rewardScaler) ? String(object.rewardScaler) : ""
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.enableIncentives !== undefined && (obj.enableIncentives = message.enableIncentives);
    message.allocationLimit !== undefined && (obj.allocationLimit = message.allocationLimit);
    message.incentivesEpochIdentifier !== undefined && (obj.incentivesEpochIdentifier = message.incentivesEpochIdentifier);
    message.rewardScaler !== undefined && (obj.rewardScaler = message.rewardScaler);
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.enableIncentives = object.enableIncentives ?? false;
    message.allocationLimit = object.allocationLimit ?? "";
    message.incentivesEpochIdentifier = object.incentivesEpochIdentifier ?? "";
    message.rewardScaler = object.rewardScaler ?? "";
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.enable_incentives !== undefined && object.enable_incentives !== null) {
      message.enableIncentives = object.enable_incentives;
    }
    if (object.allocation_limit !== undefined && object.allocation_limit !== null) {
      message.allocationLimit = object.allocation_limit;
    }
    if (object.incentives_epoch_identifier !== undefined && object.incentives_epoch_identifier !== null) {
      message.incentivesEpochIdentifier = object.incentives_epoch_identifier;
    }
    if (object.reward_scaler !== undefined && object.reward_scaler !== null) {
      message.rewardScaler = object.reward_scaler;
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.enable_incentives = message.enableIncentives === false ? undefined : message.enableIncentives;
    obj.allocation_limit = message.allocationLimit === "" ? undefined : Decimal.fromUserInput(message.allocationLimit, 18).atomics;
    obj.incentives_epoch_identifier = message.incentivesEpochIdentifier === "" ? undefined : message.incentivesEpochIdentifier;
    obj.reward_scaler = message.rewardScaler === "" ? undefined : Decimal.fromUserInput(message.rewardScaler, 18).atomics;
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  toAminoMsg(message: Params): ParamsAminoMsg {
    return {
      type: "incentives/Params",
      value: Params.toAmino(message)
    };
  },
  fromProtoMsg(message: ParamsProtoMsg): Params {
    return Params.decode(message.value);
  },
  toProto(message: Params): Uint8Array {
    return Params.encode(message).finish();
  },
  toProtoMsg(message: Params): ParamsProtoMsg {
    return {
      typeUrl: "/evmos.incentives.v1.Params",
      value: Params.encode(message).finish()
    };
  }
};