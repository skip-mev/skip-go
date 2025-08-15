//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { Duration, DurationAmino, DurationSDKType } from "../../../google/protobuf/duration";
import { Timestamp } from "../../../google/protobuf/timestamp";
import { Long, toTimestamp, fromTimestamp, isSet, fromJsonTimestamp, bytesFromBase64, base64FromBytes } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/** Params defines the set of ophost parameters. */
export interface Params {
  /** The amount to be paid by l2 creator. */
  registrationFee: Coin[];
}
export interface ParamsProtoMsg {
  typeUrl: "/opinit.ophost.v1.Params";
  value: Uint8Array;
}
/**
 * Params defines the set of ophost parameters.
 * @name ParamsAmino
 * @package opinit.ophost.v1
 * @see proto type: opinit.ophost.v1.Params
 */
export interface ParamsAmino {
  /**
   * The amount to be paid by l2 creator.
   */
  registration_fee: CoinAmino[];
}
export interface ParamsAminoMsg {
  type: "ophost/Params";
  value: ParamsAmino;
}
/** Params defines the set of ophost parameters. */
export interface ParamsSDKType {
  registration_fee: CoinSDKType[];
}
/** BridgeConfig defines the set of bridge config. */
export interface BridgeConfig {
  /** The address of the challenger. */
  challengers: string[];
  /** The address of the proposer. */
  proposer: string;
  /** The information about batch submission. */
  batchInfo: BatchInfo;
  /**
   * The time interval at which checkpoints must be submitted.
   * NOTE: this param is currently not used, but will be used for challenge in future.
   */
  submissionInterval: Duration;
  /** The minium time duration that must elapse before a withdrawal can be finalized. */
  finalizationPeriod: Duration;
  /**
   * The time of the first l2 block recorded.
   * NOTE: this param is currently not used, but will be used for challenge in future.
   */
  submissionStartTime: Date;
  /** Normally it is IBC channelID for permissioned IBC relayer. */
  metadata: Uint8Array;
}
export interface BridgeConfigProtoMsg {
  typeUrl: "/opinit.ophost.v1.BridgeConfig";
  value: Uint8Array;
}
/**
 * BridgeConfig defines the set of bridge config.
 * @name BridgeConfigAmino
 * @package opinit.ophost.v1
 * @see proto type: opinit.ophost.v1.BridgeConfig
 */
export interface BridgeConfigAmino {
  /**
   * The address of the challenger.
   */
  challengers?: string[];
  /**
   * The address of the proposer.
   */
  proposer?: string;
  /**
   * The information about batch submission.
   */
  batch_info: BatchInfoAmino;
  /**
   * The time interval at which checkpoints must be submitted.
   * NOTE: this param is currently not used, but will be used for challenge in future.
   */
  submission_interval?: DurationAmino;
  /**
   * The minium time duration that must elapse before a withdrawal can be finalized.
   */
  finalization_period?: DurationAmino;
  /**
   * The time of the first l2 block recorded.
   * NOTE: this param is currently not used, but will be used for challenge in future.
   */
  submission_start_time: string;
  /**
   * Normally it is IBC channelID for permissioned IBC relayer.
   */
  metadata?: string;
}
export interface BridgeConfigAminoMsg {
  type: "/opinit.ophost.v1.BridgeConfig";
  value: BridgeConfigAmino;
}
/** BridgeConfig defines the set of bridge config. */
export interface BridgeConfigSDKType {
  challengers: string[];
  proposer: string;
  batch_info: BatchInfoSDKType;
  submission_interval: DurationSDKType;
  finalization_period: DurationSDKType;
  submission_start_time: Date;
  metadata: Uint8Array;
}
/** BatchInfo defines the set of batch information. */
export interface BatchInfo {
  /** The address of the batch submitter. */
  submitter: string;
  /** The target chain */
  chain: string;
}
export interface BatchInfoProtoMsg {
  typeUrl: "/opinit.ophost.v1.BatchInfo";
  value: Uint8Array;
}
/**
 * BatchInfo defines the set of batch information.
 * @name BatchInfoAmino
 * @package opinit.ophost.v1
 * @see proto type: opinit.ophost.v1.BatchInfo
 */
export interface BatchInfoAmino {
  /**
   * The address of the batch submitter.
   */
  submitter?: string;
  /**
   * The target chain
   */
  chain?: string;
}
export interface BatchInfoAminoMsg {
  type: "/opinit.ophost.v1.BatchInfo";
  value: BatchInfoAmino;
}
/** BatchInfo defines the set of batch information. */
export interface BatchInfoSDKType {
  submitter: string;
  chain: string;
}
/** TokenPair defines l1 and l2 token pair */
export interface TokenPair {
  l1Denom: string;
  l2Denom: string;
}
export interface TokenPairProtoMsg {
  typeUrl: "/opinit.ophost.v1.TokenPair";
  value: Uint8Array;
}
/**
 * TokenPair defines l1 and l2 token pair
 * @name TokenPairAmino
 * @package opinit.ophost.v1
 * @see proto type: opinit.ophost.v1.TokenPair
 */
export interface TokenPairAmino {
  l1_denom?: string;
  l2_denom?: string;
}
export interface TokenPairAminoMsg {
  type: "/opinit.ophost.v1.TokenPair";
  value: TokenPairAmino;
}
/** TokenPair defines l1 and l2 token pair */
export interface TokenPairSDKType {
  l1_denom: string;
  l2_denom: string;
}
/** Output is a l2 block submitted by proposer. */
export interface Output {
  /** Hash of the l2 output. */
  outputRoot: Uint8Array;
  /** Timestamp of the l1 block that the output root was submitted in. */
  l1BlockTime: Date;
  /** The l2 block number that the output root was submitted in. */
  l2BlockNumber: Long;
}
export interface OutputProtoMsg {
  typeUrl: "/opinit.ophost.v1.Output";
  value: Uint8Array;
}
/**
 * Output is a l2 block submitted by proposer.
 * @name OutputAmino
 * @package opinit.ophost.v1
 * @see proto type: opinit.ophost.v1.Output
 */
export interface OutputAmino {
  /**
   * Hash of the l2 output.
   */
  output_root?: string;
  /**
   * Timestamp of the l1 block that the output root was submitted in.
   */
  l1_block_time: string;
  /**
   * The l2 block number that the output root was submitted in.
   */
  l2_block_number?: string;
}
export interface OutputAminoMsg {
  type: "/opinit.ophost.v1.Output";
  value: OutputAmino;
}
/** Output is a l2 block submitted by proposer. */
export interface OutputSDKType {
  output_root: Uint8Array;
  l1_block_time: Date;
  l2_block_number: Long;
}
/** BatchInfoWithOutput defines the batch information with output. */
export interface BatchInfoWithOutput {
  batchInfo: BatchInfo;
  output: Output;
}
export interface BatchInfoWithOutputProtoMsg {
  typeUrl: "/opinit.ophost.v1.BatchInfoWithOutput";
  value: Uint8Array;
}
/**
 * BatchInfoWithOutput defines the batch information with output.
 * @name BatchInfoWithOutputAmino
 * @package opinit.ophost.v1
 * @see proto type: opinit.ophost.v1.BatchInfoWithOutput
 */
export interface BatchInfoWithOutputAmino {
  batch_info: BatchInfoAmino;
  output: OutputAmino;
}
export interface BatchInfoWithOutputAminoMsg {
  type: "/opinit.ophost.v1.BatchInfoWithOutput";
  value: BatchInfoWithOutputAmino;
}
/** BatchInfoWithOutput defines the batch information with output. */
export interface BatchInfoWithOutputSDKType {
  batch_info: BatchInfoSDKType;
  output: OutputSDKType;
}
function createBaseParams(): Params {
  return {
    registrationFee: []
  };
}
export const Params = {
  typeUrl: "/opinit.ophost.v1.Params",
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.registrationFee) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
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
          message.registrationFee.push(Coin.decode(reader, reader.uint32()));
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
      registrationFee: Array.isArray(object?.registrationFee) ? object.registrationFee.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    if (message.registrationFee) {
      obj.registrationFee = message.registrationFee.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.registrationFee = [];
    }
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.registrationFee = object.registrationFee?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    message.registrationFee = object.registration_fee?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    if (message.registrationFee) {
      obj.registration_fee = message.registrationFee.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.registration_fee = message.registrationFee;
    }
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  toAminoMsg(message: Params): ParamsAminoMsg {
    return {
      type: "ophost/Params",
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
      typeUrl: "/opinit.ophost.v1.Params",
      value: Params.encode(message).finish()
    };
  }
};
function createBaseBridgeConfig(): BridgeConfig {
  return {
    challengers: [],
    proposer: "",
    batchInfo: BatchInfo.fromPartial({}),
    submissionInterval: Duration.fromPartial({}),
    finalizationPeriod: Duration.fromPartial({}),
    submissionStartTime: new Date(),
    metadata: new Uint8Array()
  };
}
export const BridgeConfig = {
  typeUrl: "/opinit.ophost.v1.BridgeConfig",
  encode(message: BridgeConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.challengers) {
      writer.uint32(10).string(v!);
    }
    if (message.proposer !== "") {
      writer.uint32(18).string(message.proposer);
    }
    if (message.batchInfo !== undefined) {
      BatchInfo.encode(message.batchInfo, writer.uint32(26).fork()).ldelim();
    }
    if (message.submissionInterval !== undefined) {
      Duration.encode(message.submissionInterval, writer.uint32(34).fork()).ldelim();
    }
    if (message.finalizationPeriod !== undefined) {
      Duration.encode(message.finalizationPeriod, writer.uint32(42).fork()).ldelim();
    }
    if (message.submissionStartTime !== undefined) {
      Timestamp.encode(toTimestamp(message.submissionStartTime), writer.uint32(50).fork()).ldelim();
    }
    if (message.metadata.length !== 0) {
      writer.uint32(58).bytes(message.metadata);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): BridgeConfig {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBridgeConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.challengers.push(reader.string());
          break;
        case 2:
          message.proposer = reader.string();
          break;
        case 3:
          message.batchInfo = BatchInfo.decode(reader, reader.uint32());
          break;
        case 4:
          message.submissionInterval = Duration.decode(reader, reader.uint32());
          break;
        case 5:
          message.finalizationPeriod = Duration.decode(reader, reader.uint32());
          break;
        case 6:
          message.submissionStartTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 7:
          message.metadata = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): BridgeConfig {
    return {
      challengers: Array.isArray(object?.challengers) ? object.challengers.map((e: any) => String(e)) : [],
      proposer: isSet(object.proposer) ? String(object.proposer) : "",
      batchInfo: isSet(object.batchInfo) ? BatchInfo.fromJSON(object.batchInfo) : undefined,
      submissionInterval: isSet(object.submissionInterval) ? Duration.fromJSON(object.submissionInterval) : undefined,
      finalizationPeriod: isSet(object.finalizationPeriod) ? Duration.fromJSON(object.finalizationPeriod) : undefined,
      submissionStartTime: isSet(object.submissionStartTime) ? fromJsonTimestamp(object.submissionStartTime) : undefined,
      metadata: isSet(object.metadata) ? bytesFromBase64(object.metadata) : new Uint8Array()
    };
  },
  toJSON(message: BridgeConfig): JsonSafe<BridgeConfig> {
    const obj: any = {};
    if (message.challengers) {
      obj.challengers = message.challengers.map(e => e);
    } else {
      obj.challengers = [];
    }
    message.proposer !== undefined && (obj.proposer = message.proposer);
    message.batchInfo !== undefined && (obj.batchInfo = message.batchInfo ? BatchInfo.toJSON(message.batchInfo) : undefined);
    message.submissionInterval !== undefined && (obj.submissionInterval = message.submissionInterval ? Duration.toJSON(message.submissionInterval) : undefined);
    message.finalizationPeriod !== undefined && (obj.finalizationPeriod = message.finalizationPeriod ? Duration.toJSON(message.finalizationPeriod) : undefined);
    message.submissionStartTime !== undefined && (obj.submissionStartTime = message.submissionStartTime.toISOString());
    message.metadata !== undefined && (obj.metadata = base64FromBytes(message.metadata !== undefined ? message.metadata : new Uint8Array()));
    return obj;
  },
  fromPartial(object: Partial<BridgeConfig>): BridgeConfig {
    const message = createBaseBridgeConfig();
    message.challengers = object.challengers?.map(e => e) || [];
    message.proposer = object.proposer ?? "";
    message.batchInfo = object.batchInfo !== undefined && object.batchInfo !== null ? BatchInfo.fromPartial(object.batchInfo) : undefined;
    message.submissionInterval = object.submissionInterval !== undefined && object.submissionInterval !== null ? Duration.fromPartial(object.submissionInterval) : undefined;
    message.finalizationPeriod = object.finalizationPeriod !== undefined && object.finalizationPeriod !== null ? Duration.fromPartial(object.finalizationPeriod) : undefined;
    message.submissionStartTime = object.submissionStartTime ?? undefined;
    message.metadata = object.metadata ?? new Uint8Array();
    return message;
  },
  fromAmino(object: BridgeConfigAmino): BridgeConfig {
    const message = createBaseBridgeConfig();
    message.challengers = object.challengers?.map(e => e) || [];
    if (object.proposer !== undefined && object.proposer !== null) {
      message.proposer = object.proposer;
    }
    if (object.batch_info !== undefined && object.batch_info !== null) {
      message.batchInfo = BatchInfo.fromAmino(object.batch_info);
    }
    if (object.submission_interval !== undefined && object.submission_interval !== null) {
      message.submissionInterval = Duration.fromAmino(object.submission_interval);
    }
    if (object.finalization_period !== undefined && object.finalization_period !== null) {
      message.finalizationPeriod = Duration.fromAmino(object.finalization_period);
    }
    if (object.submission_start_time !== undefined && object.submission_start_time !== null) {
      message.submissionStartTime = fromTimestamp(Timestamp.fromAmino(object.submission_start_time));
    }
    if (object.metadata !== undefined && object.metadata !== null) {
      message.metadata = bytesFromBase64(object.metadata);
    }
    return message;
  },
  toAmino(message: BridgeConfig): BridgeConfigAmino {
    const obj: any = {};
    if (message.challengers) {
      obj.challengers = message.challengers.map(e => e);
    } else {
      obj.challengers = message.challengers;
    }
    obj.proposer = message.proposer === "" ? undefined : message.proposer;
    obj.batch_info = message.batchInfo ? BatchInfo.toAmino(message.batchInfo) : BatchInfo.toAmino(BatchInfo.fromPartial({}));
    obj.submission_interval = message.submissionInterval ? Duration.toAmino(message.submissionInterval) : undefined;
    obj.finalization_period = message.finalizationPeriod ? Duration.toAmino(message.finalizationPeriod) : undefined;
    obj.submission_start_time = message.submissionStartTime ? Timestamp.toAmino(toTimestamp(message.submissionStartTime)) : new Date();
    obj.metadata = message.metadata ? base64FromBytes(message.metadata) : undefined;
    return obj;
  },
  fromAminoMsg(object: BridgeConfigAminoMsg): BridgeConfig {
    return BridgeConfig.fromAmino(object.value);
  },
  fromProtoMsg(message: BridgeConfigProtoMsg): BridgeConfig {
    return BridgeConfig.decode(message.value);
  },
  toProto(message: BridgeConfig): Uint8Array {
    return BridgeConfig.encode(message).finish();
  },
  toProtoMsg(message: BridgeConfig): BridgeConfigProtoMsg {
    return {
      typeUrl: "/opinit.ophost.v1.BridgeConfig",
      value: BridgeConfig.encode(message).finish()
    };
  }
};
function createBaseBatchInfo(): BatchInfo {
  return {
    submitter: "",
    chain: ""
  };
}
export const BatchInfo = {
  typeUrl: "/opinit.ophost.v1.BatchInfo",
  encode(message: BatchInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.submitter !== "") {
      writer.uint32(10).string(message.submitter);
    }
    if (message.chain !== "") {
      writer.uint32(18).string(message.chain);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): BatchInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.submitter = reader.string();
          break;
        case 2:
          message.chain = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): BatchInfo {
    return {
      submitter: isSet(object.submitter) ? String(object.submitter) : "",
      chain: isSet(object.chain) ? String(object.chain) : ""
    };
  },
  toJSON(message: BatchInfo): JsonSafe<BatchInfo> {
    const obj: any = {};
    message.submitter !== undefined && (obj.submitter = message.submitter);
    message.chain !== undefined && (obj.chain = message.chain);
    return obj;
  },
  fromPartial(object: Partial<BatchInfo>): BatchInfo {
    const message = createBaseBatchInfo();
    message.submitter = object.submitter ?? "";
    message.chain = object.chain ?? "";
    return message;
  },
  fromAmino(object: BatchInfoAmino): BatchInfo {
    const message = createBaseBatchInfo();
    if (object.submitter !== undefined && object.submitter !== null) {
      message.submitter = object.submitter;
    }
    if (object.chain !== undefined && object.chain !== null) {
      message.chain = object.chain;
    }
    return message;
  },
  toAmino(message: BatchInfo): BatchInfoAmino {
    const obj: any = {};
    obj.submitter = message.submitter === "" ? undefined : message.submitter;
    obj.chain = message.chain === "" ? undefined : message.chain;
    return obj;
  },
  fromAminoMsg(object: BatchInfoAminoMsg): BatchInfo {
    return BatchInfo.fromAmino(object.value);
  },
  fromProtoMsg(message: BatchInfoProtoMsg): BatchInfo {
    return BatchInfo.decode(message.value);
  },
  toProto(message: BatchInfo): Uint8Array {
    return BatchInfo.encode(message).finish();
  },
  toProtoMsg(message: BatchInfo): BatchInfoProtoMsg {
    return {
      typeUrl: "/opinit.ophost.v1.BatchInfo",
      value: BatchInfo.encode(message).finish()
    };
  }
};
function createBaseTokenPair(): TokenPair {
  return {
    l1Denom: "",
    l2Denom: ""
  };
}
export const TokenPair = {
  typeUrl: "/opinit.ophost.v1.TokenPair",
  encode(message: TokenPair, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.l1Denom !== "") {
      writer.uint32(10).string(message.l1Denom);
    }
    if (message.l2Denom !== "") {
      writer.uint32(18).string(message.l2Denom);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): TokenPair {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTokenPair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.l1Denom = reader.string();
          break;
        case 2:
          message.l2Denom = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): TokenPair {
    return {
      l1Denom: isSet(object.l1Denom) ? String(object.l1Denom) : "",
      l2Denom: isSet(object.l2Denom) ? String(object.l2Denom) : ""
    };
  },
  toJSON(message: TokenPair): JsonSafe<TokenPair> {
    const obj: any = {};
    message.l1Denom !== undefined && (obj.l1Denom = message.l1Denom);
    message.l2Denom !== undefined && (obj.l2Denom = message.l2Denom);
    return obj;
  },
  fromPartial(object: Partial<TokenPair>): TokenPair {
    const message = createBaseTokenPair();
    message.l1Denom = object.l1Denom ?? "";
    message.l2Denom = object.l2Denom ?? "";
    return message;
  },
  fromAmino(object: TokenPairAmino): TokenPair {
    const message = createBaseTokenPair();
    if (object.l1_denom !== undefined && object.l1_denom !== null) {
      message.l1Denom = object.l1_denom;
    }
    if (object.l2_denom !== undefined && object.l2_denom !== null) {
      message.l2Denom = object.l2_denom;
    }
    return message;
  },
  toAmino(message: TokenPair): TokenPairAmino {
    const obj: any = {};
    obj.l1_denom = message.l1Denom === "" ? undefined : message.l1Denom;
    obj.l2_denom = message.l2Denom === "" ? undefined : message.l2Denom;
    return obj;
  },
  fromAminoMsg(object: TokenPairAminoMsg): TokenPair {
    return TokenPair.fromAmino(object.value);
  },
  fromProtoMsg(message: TokenPairProtoMsg): TokenPair {
    return TokenPair.decode(message.value);
  },
  toProto(message: TokenPair): Uint8Array {
    return TokenPair.encode(message).finish();
  },
  toProtoMsg(message: TokenPair): TokenPairProtoMsg {
    return {
      typeUrl: "/opinit.ophost.v1.TokenPair",
      value: TokenPair.encode(message).finish()
    };
  }
};
function createBaseOutput(): Output {
  return {
    outputRoot: new Uint8Array(),
    l1BlockTime: new Date(),
    l2BlockNumber: Long.UZERO
  };
}
export const Output = {
  typeUrl: "/opinit.ophost.v1.Output",
  encode(message: Output, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.outputRoot.length !== 0) {
      writer.uint32(10).bytes(message.outputRoot);
    }
    if (message.l1BlockTime !== undefined) {
      Timestamp.encode(toTimestamp(message.l1BlockTime), writer.uint32(18).fork()).ldelim();
    }
    if (!message.l2BlockNumber.isZero()) {
      writer.uint32(24).uint64(message.l2BlockNumber);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Output {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.outputRoot = reader.bytes();
          break;
        case 2:
          message.l1BlockTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          message.l2BlockNumber = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Output {
    return {
      outputRoot: isSet(object.outputRoot) ? bytesFromBase64(object.outputRoot) : new Uint8Array(),
      l1BlockTime: isSet(object.l1BlockTime) ? fromJsonTimestamp(object.l1BlockTime) : undefined,
      l2BlockNumber: isSet(object.l2BlockNumber) ? Long.fromValue(object.l2BlockNumber) : Long.UZERO
    };
  },
  toJSON(message: Output): JsonSafe<Output> {
    const obj: any = {};
    message.outputRoot !== undefined && (obj.outputRoot = base64FromBytes(message.outputRoot !== undefined ? message.outputRoot : new Uint8Array()));
    message.l1BlockTime !== undefined && (obj.l1BlockTime = message.l1BlockTime.toISOString());
    message.l2BlockNumber !== undefined && (obj.l2BlockNumber = (message.l2BlockNumber || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<Output>): Output {
    const message = createBaseOutput();
    message.outputRoot = object.outputRoot ?? new Uint8Array();
    message.l1BlockTime = object.l1BlockTime ?? undefined;
    message.l2BlockNumber = object.l2BlockNumber !== undefined && object.l2BlockNumber !== null ? Long.fromValue(object.l2BlockNumber) : Long.UZERO;
    return message;
  },
  fromAmino(object: OutputAmino): Output {
    const message = createBaseOutput();
    if (object.output_root !== undefined && object.output_root !== null) {
      message.outputRoot = bytesFromBase64(object.output_root);
    }
    if (object.l1_block_time !== undefined && object.l1_block_time !== null) {
      message.l1BlockTime = fromTimestamp(Timestamp.fromAmino(object.l1_block_time));
    }
    if (object.l2_block_number !== undefined && object.l2_block_number !== null) {
      message.l2BlockNumber = Long.fromString(object.l2_block_number);
    }
    return message;
  },
  toAmino(message: Output): OutputAmino {
    const obj: any = {};
    obj.output_root = message.outputRoot ? base64FromBytes(message.outputRoot) : undefined;
    obj.l1_block_time = message.l1BlockTime ? Timestamp.toAmino(toTimestamp(message.l1BlockTime)) : new Date();
    obj.l2_block_number = !message.l2BlockNumber.isZero() ? message.l2BlockNumber?.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: OutputAminoMsg): Output {
    return Output.fromAmino(object.value);
  },
  fromProtoMsg(message: OutputProtoMsg): Output {
    return Output.decode(message.value);
  },
  toProto(message: Output): Uint8Array {
    return Output.encode(message).finish();
  },
  toProtoMsg(message: Output): OutputProtoMsg {
    return {
      typeUrl: "/opinit.ophost.v1.Output",
      value: Output.encode(message).finish()
    };
  }
};
function createBaseBatchInfoWithOutput(): BatchInfoWithOutput {
  return {
    batchInfo: BatchInfo.fromPartial({}),
    output: Output.fromPartial({})
  };
}
export const BatchInfoWithOutput = {
  typeUrl: "/opinit.ophost.v1.BatchInfoWithOutput",
  encode(message: BatchInfoWithOutput, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.batchInfo !== undefined) {
      BatchInfo.encode(message.batchInfo, writer.uint32(10).fork()).ldelim();
    }
    if (message.output !== undefined) {
      Output.encode(message.output, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): BatchInfoWithOutput {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBatchInfoWithOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.batchInfo = BatchInfo.decode(reader, reader.uint32());
          break;
        case 2:
          message.output = Output.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): BatchInfoWithOutput {
    return {
      batchInfo: isSet(object.batchInfo) ? BatchInfo.fromJSON(object.batchInfo) : undefined,
      output: isSet(object.output) ? Output.fromJSON(object.output) : undefined
    };
  },
  toJSON(message: BatchInfoWithOutput): JsonSafe<BatchInfoWithOutput> {
    const obj: any = {};
    message.batchInfo !== undefined && (obj.batchInfo = message.batchInfo ? BatchInfo.toJSON(message.batchInfo) : undefined);
    message.output !== undefined && (obj.output = message.output ? Output.toJSON(message.output) : undefined);
    return obj;
  },
  fromPartial(object: Partial<BatchInfoWithOutput>): BatchInfoWithOutput {
    const message = createBaseBatchInfoWithOutput();
    message.batchInfo = object.batchInfo !== undefined && object.batchInfo !== null ? BatchInfo.fromPartial(object.batchInfo) : undefined;
    message.output = object.output !== undefined && object.output !== null ? Output.fromPartial(object.output) : undefined;
    return message;
  },
  fromAmino(object: BatchInfoWithOutputAmino): BatchInfoWithOutput {
    const message = createBaseBatchInfoWithOutput();
    if (object.batch_info !== undefined && object.batch_info !== null) {
      message.batchInfo = BatchInfo.fromAmino(object.batch_info);
    }
    if (object.output !== undefined && object.output !== null) {
      message.output = Output.fromAmino(object.output);
    }
    return message;
  },
  toAmino(message: BatchInfoWithOutput): BatchInfoWithOutputAmino {
    const obj: any = {};
    obj.batch_info = message.batchInfo ? BatchInfo.toAmino(message.batchInfo) : BatchInfo.toAmino(BatchInfo.fromPartial({}));
    obj.output = message.output ? Output.toAmino(message.output) : Output.toAmino(Output.fromPartial({}));
    return obj;
  },
  fromAminoMsg(object: BatchInfoWithOutputAminoMsg): BatchInfoWithOutput {
    return BatchInfoWithOutput.fromAmino(object.value);
  },
  fromProtoMsg(message: BatchInfoWithOutputProtoMsg): BatchInfoWithOutput {
    return BatchInfoWithOutput.decode(message.value);
  },
  toProto(message: BatchInfoWithOutput): Uint8Array {
    return BatchInfoWithOutput.encode(message).finish();
  },
  toProtoMsg(message: BatchInfoWithOutput): BatchInfoWithOutputProtoMsg {
    return {
      typeUrl: "/opinit.ophost.v1.BatchInfoWithOutput",
      value: BatchInfoWithOutput.encode(message).finish()
    };
  }
};