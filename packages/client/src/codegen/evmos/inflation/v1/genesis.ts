//@ts-nocheck
import { ExponentialCalculation, ExponentialCalculationAmino, ExponentialCalculationSDKType, InflationDistribution, InflationDistributionAmino, InflationDistributionSDKType } from "./inflation";
import { Long, isSet } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/** GenesisState defines the inflation module's genesis state. */
export interface GenesisState {
  /** params defines all the parameters of the module. */
  params: Params;
  /** period is the amount of past periods, based on the epochs per period param */
  period: Long;
  /** epoch_identifier for inflation */
  epochIdentifier: string;
  /** epochs_per_period is the number of epochs after which inflation is recalculated */
  epochsPerPeriod: Long;
  /** skipped_epochs is the number of epochs that have passed while inflation is disabled */
  skippedEpochs: Long;
}
export interface GenesisStateProtoMsg {
  typeUrl: "/evmos.inflation.v1.GenesisState";
  value: Uint8Array;
}
/**
 * GenesisState defines the inflation module's genesis state.
 * @name GenesisStateAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.GenesisState
 */
export interface GenesisStateAmino {
  /**
   * params defines all the parameters of the module.
   */
  params?: ParamsAmino;
  /**
   * period is the amount of past periods, based on the epochs per period param
   */
  period?: string;
  /**
   * epoch_identifier for inflation
   */
  epoch_identifier?: string;
  /**
   * epochs_per_period is the number of epochs after which inflation is recalculated
   */
  epochs_per_period?: string;
  /**
   * skipped_epochs is the number of epochs that have passed while inflation is disabled
   */
  skipped_epochs?: string;
}
export interface GenesisStateAminoMsg {
  type: "inflation/GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines the inflation module's genesis state. */
export interface GenesisStateSDKType {
  params: ParamsSDKType;
  period: Long;
  epoch_identifier: string;
  epochs_per_period: Long;
  skipped_epochs: Long;
}
/** Params holds parameters for the inflation module. */
export interface Params {
  /** mint_denom specifies the type of coin to mint */
  mintDenom: string;
  /** exponential_calculation takes in the variables to calculate exponential inflation */
  exponentialCalculation: ExponentialCalculation;
  /** inflation_distribution of the minted denom */
  inflationDistribution: InflationDistribution;
  /** enable_inflation is the parameter that enables inflation and halts increasing the skipped_epochs */
  enableInflation: boolean;
}
export interface ParamsProtoMsg {
  typeUrl: "/evmos.inflation.v1.Params";
  value: Uint8Array;
}
/**
 * Params holds parameters for the inflation module.
 * @name ParamsAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.Params
 */
export interface ParamsAmino {
  /**
   * mint_denom specifies the type of coin to mint
   */
  mint_denom?: string;
  /**
   * exponential_calculation takes in the variables to calculate exponential inflation
   */
  exponential_calculation?: ExponentialCalculationAmino;
  /**
   * inflation_distribution of the minted denom
   */
  inflation_distribution?: InflationDistributionAmino;
  /**
   * enable_inflation is the parameter that enables inflation and halts increasing the skipped_epochs
   */
  enable_inflation?: boolean;
}
export interface ParamsAminoMsg {
  type: "inflation/Params";
  value: ParamsAmino;
}
/** Params holds parameters for the inflation module. */
export interface ParamsSDKType {
  mint_denom: string;
  exponential_calculation: ExponentialCalculationSDKType;
  inflation_distribution: InflationDistributionSDKType;
  enable_inflation: boolean;
}
function createBaseGenesisState(): GenesisState {
  return {
    params: Params.fromPartial({}),
    period: Long.UZERO,
    epochIdentifier: "",
    epochsPerPeriod: Long.ZERO,
    skippedEpochs: Long.UZERO
  };
}
export const GenesisState = {
  typeUrl: "/evmos.inflation.v1.GenesisState",
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (!message.period.isZero()) {
      writer.uint32(16).uint64(message.period);
    }
    if (message.epochIdentifier !== "") {
      writer.uint32(26).string(message.epochIdentifier);
    }
    if (!message.epochsPerPeriod.isZero()) {
      writer.uint32(32).int64(message.epochsPerPeriod);
    }
    if (!message.skippedEpochs.isZero()) {
      writer.uint32(40).uint64(message.skippedEpochs);
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
          message.period = reader.uint64() as Long;
          break;
        case 3:
          message.epochIdentifier = reader.string();
          break;
        case 4:
          message.epochsPerPeriod = reader.int64() as Long;
          break;
        case 5:
          message.skippedEpochs = reader.uint64() as Long;
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
      period: isSet(object.period) ? Long.fromValue(object.period) : Long.UZERO,
      epochIdentifier: isSet(object.epochIdentifier) ? String(object.epochIdentifier) : "",
      epochsPerPeriod: isSet(object.epochsPerPeriod) ? Long.fromValue(object.epochsPerPeriod) : Long.ZERO,
      skippedEpochs: isSet(object.skippedEpochs) ? Long.fromValue(object.skippedEpochs) : Long.UZERO
    };
  },
  toJSON(message: GenesisState): JsonSafe<GenesisState> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.period !== undefined && (obj.period = (message.period || Long.UZERO).toString());
    message.epochIdentifier !== undefined && (obj.epochIdentifier = message.epochIdentifier);
    message.epochsPerPeriod !== undefined && (obj.epochsPerPeriod = (message.epochsPerPeriod || Long.ZERO).toString());
    message.skippedEpochs !== undefined && (obj.skippedEpochs = (message.skippedEpochs || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.period = object.period !== undefined && object.period !== null ? Long.fromValue(object.period) : Long.UZERO;
    message.epochIdentifier = object.epochIdentifier ?? "";
    message.epochsPerPeriod = object.epochsPerPeriod !== undefined && object.epochsPerPeriod !== null ? Long.fromValue(object.epochsPerPeriod) : Long.ZERO;
    message.skippedEpochs = object.skippedEpochs !== undefined && object.skippedEpochs !== null ? Long.fromValue(object.skippedEpochs) : Long.UZERO;
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    if (object.period !== undefined && object.period !== null) {
      message.period = Long.fromString(object.period);
    }
    if (object.epoch_identifier !== undefined && object.epoch_identifier !== null) {
      message.epochIdentifier = object.epoch_identifier;
    }
    if (object.epochs_per_period !== undefined && object.epochs_per_period !== null) {
      message.epochsPerPeriod = Long.fromString(object.epochs_per_period);
    }
    if (object.skipped_epochs !== undefined && object.skipped_epochs !== null) {
      message.skippedEpochs = Long.fromString(object.skipped_epochs);
    }
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    obj.period = !message.period.isZero() ? message.period?.toString() : undefined;
    obj.epoch_identifier = message.epochIdentifier === "" ? undefined : message.epochIdentifier;
    obj.epochs_per_period = !message.epochsPerPeriod.isZero() ? message.epochsPerPeriod?.toString() : undefined;
    obj.skipped_epochs = !message.skippedEpochs.isZero() ? message.skippedEpochs?.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  toAminoMsg(message: GenesisState): GenesisStateAminoMsg {
    return {
      type: "inflation/GenesisState",
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
      typeUrl: "/evmos.inflation.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};
function createBaseParams(): Params {
  return {
    mintDenom: "",
    exponentialCalculation: ExponentialCalculation.fromPartial({}),
    inflationDistribution: InflationDistribution.fromPartial({}),
    enableInflation: false
  };
}
export const Params = {
  typeUrl: "/evmos.inflation.v1.Params",
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mintDenom !== "") {
      writer.uint32(10).string(message.mintDenom);
    }
    if (message.exponentialCalculation !== undefined) {
      ExponentialCalculation.encode(message.exponentialCalculation, writer.uint32(18).fork()).ldelim();
    }
    if (message.inflationDistribution !== undefined) {
      InflationDistribution.encode(message.inflationDistribution, writer.uint32(26).fork()).ldelim();
    }
    if (message.enableInflation === true) {
      writer.uint32(32).bool(message.enableInflation);
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
          message.mintDenom = reader.string();
          break;
        case 2:
          message.exponentialCalculation = ExponentialCalculation.decode(reader, reader.uint32());
          break;
        case 3:
          message.inflationDistribution = InflationDistribution.decode(reader, reader.uint32());
          break;
        case 4:
          message.enableInflation = reader.bool();
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
      mintDenom: isSet(object.mintDenom) ? String(object.mintDenom) : "",
      exponentialCalculation: isSet(object.exponentialCalculation) ? ExponentialCalculation.fromJSON(object.exponentialCalculation) : undefined,
      inflationDistribution: isSet(object.inflationDistribution) ? InflationDistribution.fromJSON(object.inflationDistribution) : undefined,
      enableInflation: isSet(object.enableInflation) ? Boolean(object.enableInflation) : false
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.mintDenom !== undefined && (obj.mintDenom = message.mintDenom);
    message.exponentialCalculation !== undefined && (obj.exponentialCalculation = message.exponentialCalculation ? ExponentialCalculation.toJSON(message.exponentialCalculation) : undefined);
    message.inflationDistribution !== undefined && (obj.inflationDistribution = message.inflationDistribution ? InflationDistribution.toJSON(message.inflationDistribution) : undefined);
    message.enableInflation !== undefined && (obj.enableInflation = message.enableInflation);
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.mintDenom = object.mintDenom ?? "";
    message.exponentialCalculation = object.exponentialCalculation !== undefined && object.exponentialCalculation !== null ? ExponentialCalculation.fromPartial(object.exponentialCalculation) : undefined;
    message.inflationDistribution = object.inflationDistribution !== undefined && object.inflationDistribution !== null ? InflationDistribution.fromPartial(object.inflationDistribution) : undefined;
    message.enableInflation = object.enableInflation ?? false;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.mint_denom !== undefined && object.mint_denom !== null) {
      message.mintDenom = object.mint_denom;
    }
    if (object.exponential_calculation !== undefined && object.exponential_calculation !== null) {
      message.exponentialCalculation = ExponentialCalculation.fromAmino(object.exponential_calculation);
    }
    if (object.inflation_distribution !== undefined && object.inflation_distribution !== null) {
      message.inflationDistribution = InflationDistribution.fromAmino(object.inflation_distribution);
    }
    if (object.enable_inflation !== undefined && object.enable_inflation !== null) {
      message.enableInflation = object.enable_inflation;
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.mint_denom = message.mintDenom === "" ? undefined : message.mintDenom;
    obj.exponential_calculation = message.exponentialCalculation ? ExponentialCalculation.toAmino(message.exponentialCalculation) : undefined;
    obj.inflation_distribution = message.inflationDistribution ? InflationDistribution.toAmino(message.inflationDistribution) : undefined;
    obj.enable_inflation = message.enableInflation === false ? undefined : message.enableInflation;
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  toAminoMsg(message: Params): ParamsAminoMsg {
    return {
      type: "inflation/Params",
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
      typeUrl: "/evmos.inflation.v1.Params",
      value: Params.encode(message).finish()
    };
  }
};