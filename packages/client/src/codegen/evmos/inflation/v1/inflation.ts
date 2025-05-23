//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { Decimal } from "@cosmjs/math";
import { isSet, padDecimal } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/**
 * InflationDistribution defines the distribution in which inflation is
 * allocated through minting on each epoch (staking, incentives, community). It
 * excludes the team vesting distribution, as this is minted once at genesis.
 * The initial InflationDistribution can be calculated from the Evmos Token
 * Model like this:
 * mintDistribution1 = distribution1 / (1 - teamVestingDistribution)
 * 0.5333333         = 40%           / (1 - 25%)
 */
export interface InflationDistribution {
  /**
   * staking_rewards defines the proportion of the minted minted_denom that is
   * to be allocated as staking rewards
   */
  stakingRewards: string;
  /**
   * Deprecated: usage_incentives defines the proportion of the minted minted_denom that is
   * to be allocated to the incentives module address
   */
  /** @deprecated */
  usageIncentives: string;
  /**
   * community_pool defines the proportion of the minted minted_denom that is to
   * be allocated to the community pool
   */
  communityPool: string;
}
export interface InflationDistributionProtoMsg {
  typeUrl: "/evmos.inflation.v1.InflationDistribution";
  value: Uint8Array;
}
/**
 * InflationDistribution defines the distribution in which inflation is
 * allocated through minting on each epoch (staking, incentives, community). It
 * excludes the team vesting distribution, as this is minted once at genesis.
 * The initial InflationDistribution can be calculated from the Evmos Token
 * Model like this:
 * mintDistribution1 = distribution1 / (1 - teamVestingDistribution)
 * 0.5333333         = 40%           / (1 - 25%)
 */
export interface InflationDistributionAmino {
  /**
   * staking_rewards defines the proportion of the minted minted_denom that is
   * to be allocated as staking rewards
   */
  staking_rewards?: string;
  /**
   * Deprecated: usage_incentives defines the proportion of the minted minted_denom that is
   * to be allocated to the incentives module address
   */
  /** @deprecated */
  usage_incentives?: string;
  /**
   * community_pool defines the proportion of the minted minted_denom that is to
   * be allocated to the community pool
   */
  community_pool?: string;
}
export interface InflationDistributionAminoMsg {
  type: "inflation/InflationDistribution";
  value: InflationDistributionAmino;
}
/**
 * InflationDistribution defines the distribution in which inflation is
 * allocated through minting on each epoch (staking, incentives, community). It
 * excludes the team vesting distribution, as this is minted once at genesis.
 * The initial InflationDistribution can be calculated from the Evmos Token
 * Model like this:
 * mintDistribution1 = distribution1 / (1 - teamVestingDistribution)
 * 0.5333333         = 40%           / (1 - 25%)
 */
export interface InflationDistributionSDKType {
  staking_rewards: string;
  /** @deprecated */
  usage_incentives: string;
  community_pool: string;
}
/**
 * ExponentialCalculation holds factors to calculate exponential inflation on
 * each period. Calculation reference:
 * periodProvision = exponentialDecay       *  bondingIncentive
 * f(x)            = (a * (1 - r) ^ x + c)  *  (1 + max_variance - bondedRatio *
 * (max_variance / bonding_target))
 */
export interface ExponentialCalculation {
  /** a defines the initial value */
  a: string;
  /** r defines the reduction factor */
  r: string;
  /** c defines the parameter for long term inflation */
  c: string;
  /** bonding_target */
  bondingTarget: string;
  /** max_variance */
  maxVariance: string;
}
export interface ExponentialCalculationProtoMsg {
  typeUrl: "/evmos.inflation.v1.ExponentialCalculation";
  value: Uint8Array;
}
/**
 * ExponentialCalculation holds factors to calculate exponential inflation on
 * each period. Calculation reference:
 * periodProvision = exponentialDecay       *  bondingIncentive
 * f(x)            = (a * (1 - r) ^ x + c)  *  (1 + max_variance - bondedRatio *
 * (max_variance / bonding_target))
 */
export interface ExponentialCalculationAmino {
  /** a defines the initial value */
  a?: string;
  /** r defines the reduction factor */
  r?: string;
  /** c defines the parameter for long term inflation */
  c?: string;
  /** bonding_target */
  bonding_target?: string;
  /** max_variance */
  max_variance?: string;
}
export interface ExponentialCalculationAminoMsg {
  type: "inflation/ExponentialCalculation";
  value: ExponentialCalculationAmino;
}
/**
 * ExponentialCalculation holds factors to calculate exponential inflation on
 * each period. Calculation reference:
 * periodProvision = exponentialDecay       *  bondingIncentive
 * f(x)            = (a * (1 - r) ^ x + c)  *  (1 + max_variance - bondedRatio *
 * (max_variance / bonding_target))
 */
export interface ExponentialCalculationSDKType {
  a: string;
  r: string;
  c: string;
  bonding_target: string;
  max_variance: string;
}
function createBaseInflationDistribution(): InflationDistribution {
  return {
    stakingRewards: "",
    usageIncentives: "",
    communityPool: ""
  };
}
export const InflationDistribution = {
  typeUrl: "/evmos.inflation.v1.InflationDistribution",
  encode(message: InflationDistribution, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stakingRewards !== "") {
      writer.uint32(10).string(Decimal.fromUserInput(message.stakingRewards, 18).atomics);
    }
    if (message.usageIncentives !== "") {
      writer.uint32(18).string(Decimal.fromUserInput(message.usageIncentives, 18).atomics);
    }
    if (message.communityPool !== "") {
      writer.uint32(26).string(Decimal.fromUserInput(message.communityPool, 18).atomics);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): InflationDistribution {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInflationDistribution();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.stakingRewards = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 2:
          message.usageIncentives = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 3:
          message.communityPool = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): InflationDistribution {
    return {
      stakingRewards: isSet(object.stakingRewards) ? String(object.stakingRewards) : "",
      usageIncentives: isSet(object.usageIncentives) ? String(object.usageIncentives) : "",
      communityPool: isSet(object.communityPool) ? String(object.communityPool) : ""
    };
  },
  toJSON(message: InflationDistribution): JsonSafe<InflationDistribution> {
    const obj: any = {};
    message.stakingRewards !== undefined && (obj.stakingRewards = message.stakingRewards);
    message.usageIncentives !== undefined && (obj.usageIncentives = message.usageIncentives);
    message.communityPool !== undefined && (obj.communityPool = message.communityPool);
    return obj;
  },
  fromPartial(object: Partial<InflationDistribution>): InflationDistribution {
    const message = createBaseInflationDistribution();
    message.stakingRewards = object.stakingRewards ?? "";
    message.usageIncentives = object.usageIncentives ?? "";
    message.communityPool = object.communityPool ?? "";
    return message;
  },
  fromAmino(object: InflationDistributionAmino): InflationDistribution {
    const message = createBaseInflationDistribution();
    if (object.staking_rewards !== undefined && object.staking_rewards !== null) {
      message.stakingRewards = object.staking_rewards;
    }
    if (object.usage_incentives !== undefined && object.usage_incentives !== null) {
      message.usageIncentives = object.usage_incentives;
    }
    if (object.community_pool !== undefined && object.community_pool !== null) {
      message.communityPool = object.community_pool;
    }
    return message;
  },
  toAmino(message: InflationDistribution): InflationDistributionAmino {
    const obj: any = {};
    obj.staking_rewards = padDecimal(message.stakingRewards) === "" ? undefined : padDecimal(message.stakingRewards);
    obj.usage_incentives = padDecimal(message.usageIncentives) === "" ? undefined : padDecimal(message.usageIncentives);
    obj.community_pool = padDecimal(message.communityPool) === "" ? undefined : padDecimal(message.communityPool);
    return obj;
  },
  fromAminoMsg(object: InflationDistributionAminoMsg): InflationDistribution {
    return InflationDistribution.fromAmino(object.value);
  },
  toAminoMsg(message: InflationDistribution): InflationDistributionAminoMsg {
    return {
      type: "inflation/InflationDistribution",
      value: InflationDistribution.toAmino(message)
    };
  },
  fromProtoMsg(message: InflationDistributionProtoMsg): InflationDistribution {
    return InflationDistribution.decode(message.value);
  },
  toProto(message: InflationDistribution): Uint8Array {
    return InflationDistribution.encode(message).finish();
  },
  toProtoMsg(message: InflationDistribution): InflationDistributionProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.InflationDistribution",
      value: InflationDistribution.encode(message).finish()
    };
  }
};
function createBaseExponentialCalculation(): ExponentialCalculation {
  return {
    a: "",
    r: "",
    c: "",
    bondingTarget: "",
    maxVariance: ""
  };
}
export const ExponentialCalculation = {
  typeUrl: "/evmos.inflation.v1.ExponentialCalculation",
  encode(message: ExponentialCalculation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.a !== "") {
      writer.uint32(10).string(Decimal.fromUserInput(message.a, 18).atomics);
    }
    if (message.r !== "") {
      writer.uint32(18).string(Decimal.fromUserInput(message.r, 18).atomics);
    }
    if (message.c !== "") {
      writer.uint32(26).string(Decimal.fromUserInput(message.c, 18).atomics);
    }
    if (message.bondingTarget !== "") {
      writer.uint32(34).string(Decimal.fromUserInput(message.bondingTarget, 18).atomics);
    }
    if (message.maxVariance !== "") {
      writer.uint32(42).string(Decimal.fromUserInput(message.maxVariance, 18).atomics);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): ExponentialCalculation {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExponentialCalculation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.a = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 2:
          message.r = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 3:
          message.c = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 4:
          message.bondingTarget = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 5:
          message.maxVariance = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ExponentialCalculation {
    return {
      a: isSet(object.a) ? String(object.a) : "",
      r: isSet(object.r) ? String(object.r) : "",
      c: isSet(object.c) ? String(object.c) : "",
      bondingTarget: isSet(object.bondingTarget) ? String(object.bondingTarget) : "",
      maxVariance: isSet(object.maxVariance) ? String(object.maxVariance) : ""
    };
  },
  toJSON(message: ExponentialCalculation): JsonSafe<ExponentialCalculation> {
    const obj: any = {};
    message.a !== undefined && (obj.a = message.a);
    message.r !== undefined && (obj.r = message.r);
    message.c !== undefined && (obj.c = message.c);
    message.bondingTarget !== undefined && (obj.bondingTarget = message.bondingTarget);
    message.maxVariance !== undefined && (obj.maxVariance = message.maxVariance);
    return obj;
  },
  fromPartial(object: Partial<ExponentialCalculation>): ExponentialCalculation {
    const message = createBaseExponentialCalculation();
    message.a = object.a ?? "";
    message.r = object.r ?? "";
    message.c = object.c ?? "";
    message.bondingTarget = object.bondingTarget ?? "";
    message.maxVariance = object.maxVariance ?? "";
    return message;
  },
  fromAmino(object: ExponentialCalculationAmino): ExponentialCalculation {
    const message = createBaseExponentialCalculation();
    if (object.a !== undefined && object.a !== null) {
      message.a = object.a;
    }
    if (object.r !== undefined && object.r !== null) {
      message.r = object.r;
    }
    if (object.c !== undefined && object.c !== null) {
      message.c = object.c;
    }
    if (object.bonding_target !== undefined && object.bonding_target !== null) {
      message.bondingTarget = object.bonding_target;
    }
    if (object.max_variance !== undefined && object.max_variance !== null) {
      message.maxVariance = object.max_variance;
    }
    return message;
  },
  toAmino(message: ExponentialCalculation): ExponentialCalculationAmino {
    const obj: any = {};
    obj.a = padDecimal(message.a) === "" ? undefined : padDecimal(message.a);
    obj.r = padDecimal(message.r) === "" ? undefined : padDecimal(message.r);
    obj.c = padDecimal(message.c) === "" ? undefined : padDecimal(message.c);
    obj.bonding_target = padDecimal(message.bondingTarget) === "" ? undefined : padDecimal(message.bondingTarget);
    obj.max_variance = padDecimal(message.maxVariance) === "" ? undefined : padDecimal(message.maxVariance);
    return obj;
  },
  fromAminoMsg(object: ExponentialCalculationAminoMsg): ExponentialCalculation {
    return ExponentialCalculation.fromAmino(object.value);
  },
  toAminoMsg(message: ExponentialCalculation): ExponentialCalculationAminoMsg {
    return {
      type: "inflation/ExponentialCalculation",
      value: ExponentialCalculation.toAmino(message)
    };
  },
  fromProtoMsg(message: ExponentialCalculationProtoMsg): ExponentialCalculation {
    return ExponentialCalculation.decode(message.value);
  },
  toProto(message: ExponentialCalculation): Uint8Array {
    return ExponentialCalculation.encode(message).finish();
  },
  toProtoMsg(message: ExponentialCalculation): ExponentialCalculationProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.ExponentialCalculation",
      value: ExponentialCalculation.encode(message).finish()
    };
  }
};