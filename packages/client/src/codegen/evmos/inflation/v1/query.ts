//@ts-nocheck
import { DecCoin, DecCoinAmino, DecCoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import { Params, ParamsAmino, ParamsSDKType } from "./genesis";
import { Long, isSet } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
import { Decimal } from "@cosmjs/math";
/** QueryPeriodRequest is the request type for the Query/Period RPC method. */
export interface QueryPeriodRequest {}
export interface QueryPeriodRequestProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryPeriodRequest";
  value: Uint8Array;
}
/**
 * QueryPeriodRequest is the request type for the Query/Period RPC method.
 * @name QueryPeriodRequestAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryPeriodRequest
 */
export interface QueryPeriodRequestAmino {}
export interface QueryPeriodRequestAminoMsg {
  type: "inflation/QueryPeriodRequest";
  value: QueryPeriodRequestAmino;
}
/** QueryPeriodRequest is the request type for the Query/Period RPC method. */
export interface QueryPeriodRequestSDKType {}
/** QueryPeriodResponse is the response type for the Query/Period RPC method. */
export interface QueryPeriodResponse {
  /** period is the current minting per epoch provision value. */
  period: Long;
}
export interface QueryPeriodResponseProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryPeriodResponse";
  value: Uint8Array;
}
/**
 * QueryPeriodResponse is the response type for the Query/Period RPC method.
 * @name QueryPeriodResponseAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryPeriodResponse
 */
export interface QueryPeriodResponseAmino {
  /**
   * period is the current minting per epoch provision value.
   */
  period?: string;
}
export interface QueryPeriodResponseAminoMsg {
  type: "inflation/QueryPeriodResponse";
  value: QueryPeriodResponseAmino;
}
/** QueryPeriodResponse is the response type for the Query/Period RPC method. */
export interface QueryPeriodResponseSDKType {
  period: Long;
}
/**
 * QueryEpochMintProvisionRequest is the request type for the
 * Query/EpochMintProvision RPC method.
 */
export interface QueryEpochMintProvisionRequest {}
export interface QueryEpochMintProvisionRequestProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryEpochMintProvisionRequest";
  value: Uint8Array;
}
/**
 * QueryEpochMintProvisionRequest is the request type for the
 * Query/EpochMintProvision RPC method.
 * @name QueryEpochMintProvisionRequestAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryEpochMintProvisionRequest
 */
export interface QueryEpochMintProvisionRequestAmino {}
export interface QueryEpochMintProvisionRequestAminoMsg {
  type: "inflation/QueryEpochMintProvisionRequest";
  value: QueryEpochMintProvisionRequestAmino;
}
/**
 * QueryEpochMintProvisionRequest is the request type for the
 * Query/EpochMintProvision RPC method.
 */
export interface QueryEpochMintProvisionRequestSDKType {}
/**
 * QueryEpochMintProvisionResponse is the response type for the
 * Query/EpochMintProvision RPC method.
 */
export interface QueryEpochMintProvisionResponse {
  /** epoch_mint_provision is the current minting per epoch provision value. */
  epochMintProvision: DecCoin;
}
export interface QueryEpochMintProvisionResponseProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryEpochMintProvisionResponse";
  value: Uint8Array;
}
/**
 * QueryEpochMintProvisionResponse is the response type for the
 * Query/EpochMintProvision RPC method.
 * @name QueryEpochMintProvisionResponseAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryEpochMintProvisionResponse
 */
export interface QueryEpochMintProvisionResponseAmino {
  /**
   * epoch_mint_provision is the current minting per epoch provision value.
   */
  epoch_mint_provision?: DecCoinAmino;
}
export interface QueryEpochMintProvisionResponseAminoMsg {
  type: "inflation/QueryEpochMintProvisionResponse";
  value: QueryEpochMintProvisionResponseAmino;
}
/**
 * QueryEpochMintProvisionResponse is the response type for the
 * Query/EpochMintProvision RPC method.
 */
export interface QueryEpochMintProvisionResponseSDKType {
  epoch_mint_provision: DecCoinSDKType;
}
/**
 * QuerySkippedEpochsRequest is the request type for the Query/SkippedEpochs RPC
 * method.
 */
export interface QuerySkippedEpochsRequest {}
export interface QuerySkippedEpochsRequestProtoMsg {
  typeUrl: "/evmos.inflation.v1.QuerySkippedEpochsRequest";
  value: Uint8Array;
}
/**
 * QuerySkippedEpochsRequest is the request type for the Query/SkippedEpochs RPC
 * method.
 * @name QuerySkippedEpochsRequestAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QuerySkippedEpochsRequest
 */
export interface QuerySkippedEpochsRequestAmino {}
export interface QuerySkippedEpochsRequestAminoMsg {
  type: "inflation/QuerySkippedEpochsRequest";
  value: QuerySkippedEpochsRequestAmino;
}
/**
 * QuerySkippedEpochsRequest is the request type for the Query/SkippedEpochs RPC
 * method.
 */
export interface QuerySkippedEpochsRequestSDKType {}
/**
 * QuerySkippedEpochsResponse is the response type for the Query/SkippedEpochs
 * RPC method.
 */
export interface QuerySkippedEpochsResponse {
  /** skipped_epochs is the number of epochs that the inflation module has been disabled. */
  skippedEpochs: Long;
}
export interface QuerySkippedEpochsResponseProtoMsg {
  typeUrl: "/evmos.inflation.v1.QuerySkippedEpochsResponse";
  value: Uint8Array;
}
/**
 * QuerySkippedEpochsResponse is the response type for the Query/SkippedEpochs
 * RPC method.
 * @name QuerySkippedEpochsResponseAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QuerySkippedEpochsResponse
 */
export interface QuerySkippedEpochsResponseAmino {
  /**
   * skipped_epochs is the number of epochs that the inflation module has been disabled.
   */
  skipped_epochs?: string;
}
export interface QuerySkippedEpochsResponseAminoMsg {
  type: "inflation/QuerySkippedEpochsResponse";
  value: QuerySkippedEpochsResponseAmino;
}
/**
 * QuerySkippedEpochsResponse is the response type for the Query/SkippedEpochs
 * RPC method.
 */
export interface QuerySkippedEpochsResponseSDKType {
  skipped_epochs: Long;
}
/**
 * QueryCirculatingSupplyRequest is the request type for the
 * Query/CirculatingSupply RPC method.
 */
export interface QueryCirculatingSupplyRequest {}
export interface QueryCirculatingSupplyRequestProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryCirculatingSupplyRequest";
  value: Uint8Array;
}
/**
 * QueryCirculatingSupplyRequest is the request type for the
 * Query/CirculatingSupply RPC method.
 * @name QueryCirculatingSupplyRequestAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryCirculatingSupplyRequest
 */
export interface QueryCirculatingSupplyRequestAmino {}
export interface QueryCirculatingSupplyRequestAminoMsg {
  type: "inflation/QueryCirculatingSupplyRequest";
  value: QueryCirculatingSupplyRequestAmino;
}
/**
 * QueryCirculatingSupplyRequest is the request type for the
 * Query/CirculatingSupply RPC method.
 */
export interface QueryCirculatingSupplyRequestSDKType {}
/**
 * QueryCirculatingSupplyResponse is the response type for the
 * Query/CirculatingSupply RPC method.
 */
export interface QueryCirculatingSupplyResponse {
  /** circulating_supply is the total amount of coins in circulation */
  circulatingSupply: DecCoin;
}
export interface QueryCirculatingSupplyResponseProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryCirculatingSupplyResponse";
  value: Uint8Array;
}
/**
 * QueryCirculatingSupplyResponse is the response type for the
 * Query/CirculatingSupply RPC method.
 * @name QueryCirculatingSupplyResponseAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryCirculatingSupplyResponse
 */
export interface QueryCirculatingSupplyResponseAmino {
  /**
   * circulating_supply is the total amount of coins in circulation
   */
  circulating_supply?: DecCoinAmino;
}
export interface QueryCirculatingSupplyResponseAminoMsg {
  type: "inflation/QueryCirculatingSupplyResponse";
  value: QueryCirculatingSupplyResponseAmino;
}
/**
 * QueryCirculatingSupplyResponse is the response type for the
 * Query/CirculatingSupply RPC method.
 */
export interface QueryCirculatingSupplyResponseSDKType {
  circulating_supply: DecCoinSDKType;
}
/**
 * QueryInflationRateRequest is the request type for the Query/InflationRate RPC
 * method.
 */
export interface QueryInflationRateRequest {}
export interface QueryInflationRateRequestProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryInflationRateRequest";
  value: Uint8Array;
}
/**
 * QueryInflationRateRequest is the request type for the Query/InflationRate RPC
 * method.
 * @name QueryInflationRateRequestAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryInflationRateRequest
 */
export interface QueryInflationRateRequestAmino {}
export interface QueryInflationRateRequestAminoMsg {
  type: "inflation/QueryInflationRateRequest";
  value: QueryInflationRateRequestAmino;
}
/**
 * QueryInflationRateRequest is the request type for the Query/InflationRate RPC
 * method.
 */
export interface QueryInflationRateRequestSDKType {}
/**
 * QueryInflationRateResponse is the response type for the Query/InflationRate
 * RPC method.
 */
export interface QueryInflationRateResponse {
  /** inflation_rate by which the total supply increases within one period */
  inflationRate: string;
}
export interface QueryInflationRateResponseProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryInflationRateResponse";
  value: Uint8Array;
}
/**
 * QueryInflationRateResponse is the response type for the Query/InflationRate
 * RPC method.
 * @name QueryInflationRateResponseAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryInflationRateResponse
 */
export interface QueryInflationRateResponseAmino {
  /**
   * inflation_rate by which the total supply increases within one period
   */
  inflation_rate?: string;
}
export interface QueryInflationRateResponseAminoMsg {
  type: "inflation/QueryInflationRateResponse";
  value: QueryInflationRateResponseAmino;
}
/**
 * QueryInflationRateResponse is the response type for the Query/InflationRate
 * RPC method.
 */
export interface QueryInflationRateResponseSDKType {
  inflation_rate: string;
}
/** QueryParamsRequest is the request type for the Query/Params RPC method. */
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryParamsRequest";
  value: Uint8Array;
}
/**
 * QueryParamsRequest is the request type for the Query/Params RPC method.
 * @name QueryParamsRequestAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryParamsRequest
 */
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "inflation/QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
/** QueryParamsRequest is the request type for the Query/Params RPC method. */
export interface QueryParamsRequestSDKType {}
/** QueryParamsResponse is the response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params defines the parameters of the module. */
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/evmos.inflation.v1.QueryParamsResponse";
  value: Uint8Array;
}
/**
 * QueryParamsResponse is the response type for the Query/Params RPC method.
 * @name QueryParamsResponseAmino
 * @package evmos.inflation.v1
 * @see proto type: evmos.inflation.v1.QueryParamsResponse
 */
export interface QueryParamsResponseAmino {
  /**
   * params defines the parameters of the module.
   */
  params?: ParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "inflation/QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
/** QueryParamsResponse is the response type for the Query/Params RPC method. */
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
function createBaseQueryPeriodRequest(): QueryPeriodRequest {
  return {};
}
export const QueryPeriodRequest = {
  typeUrl: "/evmos.inflation.v1.QueryPeriodRequest",
  encode(_: QueryPeriodRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPeriodRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPeriodRequest();
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
  fromJSON(_: any): QueryPeriodRequest {
    return {};
  },
  toJSON(_: QueryPeriodRequest): JsonSafe<QueryPeriodRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryPeriodRequest>): QueryPeriodRequest {
    const message = createBaseQueryPeriodRequest();
    return message;
  },
  fromAmino(_: QueryPeriodRequestAmino): QueryPeriodRequest {
    const message = createBaseQueryPeriodRequest();
    return message;
  },
  toAmino(_: QueryPeriodRequest): QueryPeriodRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryPeriodRequestAminoMsg): QueryPeriodRequest {
    return QueryPeriodRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPeriodRequest): QueryPeriodRequestAminoMsg {
    return {
      type: "inflation/QueryPeriodRequest",
      value: QueryPeriodRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPeriodRequestProtoMsg): QueryPeriodRequest {
    return QueryPeriodRequest.decode(message.value);
  },
  toProto(message: QueryPeriodRequest): Uint8Array {
    return QueryPeriodRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryPeriodRequest): QueryPeriodRequestProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryPeriodRequest",
      value: QueryPeriodRequest.encode(message).finish()
    };
  }
};
function createBaseQueryPeriodResponse(): QueryPeriodResponse {
  return {
    period: Long.UZERO
  };
}
export const QueryPeriodResponse = {
  typeUrl: "/evmos.inflation.v1.QueryPeriodResponse",
  encode(message: QueryPeriodResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.period.isZero()) {
      writer.uint32(8).uint64(message.period);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPeriodResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPeriodResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.period = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryPeriodResponse {
    return {
      period: isSet(object.period) ? Long.fromValue(object.period) : Long.UZERO
    };
  },
  toJSON(message: QueryPeriodResponse): JsonSafe<QueryPeriodResponse> {
    const obj: any = {};
    message.period !== undefined && (obj.period = (message.period || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryPeriodResponse>): QueryPeriodResponse {
    const message = createBaseQueryPeriodResponse();
    message.period = object.period !== undefined && object.period !== null ? Long.fromValue(object.period) : Long.UZERO;
    return message;
  },
  fromAmino(object: QueryPeriodResponseAmino): QueryPeriodResponse {
    const message = createBaseQueryPeriodResponse();
    if (object.period !== undefined && object.period !== null) {
      message.period = Long.fromString(object.period);
    }
    return message;
  },
  toAmino(message: QueryPeriodResponse): QueryPeriodResponseAmino {
    const obj: any = {};
    obj.period = !message.period.isZero() ? message.period?.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryPeriodResponseAminoMsg): QueryPeriodResponse {
    return QueryPeriodResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryPeriodResponse): QueryPeriodResponseAminoMsg {
    return {
      type: "inflation/QueryPeriodResponse",
      value: QueryPeriodResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryPeriodResponseProtoMsg): QueryPeriodResponse {
    return QueryPeriodResponse.decode(message.value);
  },
  toProto(message: QueryPeriodResponse): Uint8Array {
    return QueryPeriodResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryPeriodResponse): QueryPeriodResponseProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryPeriodResponse",
      value: QueryPeriodResponse.encode(message).finish()
    };
  }
};
function createBaseQueryEpochMintProvisionRequest(): QueryEpochMintProvisionRequest {
  return {};
}
export const QueryEpochMintProvisionRequest = {
  typeUrl: "/evmos.inflation.v1.QueryEpochMintProvisionRequest",
  encode(_: QueryEpochMintProvisionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryEpochMintProvisionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEpochMintProvisionRequest();
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
  fromJSON(_: any): QueryEpochMintProvisionRequest {
    return {};
  },
  toJSON(_: QueryEpochMintProvisionRequest): JsonSafe<QueryEpochMintProvisionRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryEpochMintProvisionRequest>): QueryEpochMintProvisionRequest {
    const message = createBaseQueryEpochMintProvisionRequest();
    return message;
  },
  fromAmino(_: QueryEpochMintProvisionRequestAmino): QueryEpochMintProvisionRequest {
    const message = createBaseQueryEpochMintProvisionRequest();
    return message;
  },
  toAmino(_: QueryEpochMintProvisionRequest): QueryEpochMintProvisionRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryEpochMintProvisionRequestAminoMsg): QueryEpochMintProvisionRequest {
    return QueryEpochMintProvisionRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryEpochMintProvisionRequest): QueryEpochMintProvisionRequestAminoMsg {
    return {
      type: "inflation/QueryEpochMintProvisionRequest",
      value: QueryEpochMintProvisionRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryEpochMintProvisionRequestProtoMsg): QueryEpochMintProvisionRequest {
    return QueryEpochMintProvisionRequest.decode(message.value);
  },
  toProto(message: QueryEpochMintProvisionRequest): Uint8Array {
    return QueryEpochMintProvisionRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryEpochMintProvisionRequest): QueryEpochMintProvisionRequestProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryEpochMintProvisionRequest",
      value: QueryEpochMintProvisionRequest.encode(message).finish()
    };
  }
};
function createBaseQueryEpochMintProvisionResponse(): QueryEpochMintProvisionResponse {
  return {
    epochMintProvision: DecCoin.fromPartial({})
  };
}
export const QueryEpochMintProvisionResponse = {
  typeUrl: "/evmos.inflation.v1.QueryEpochMintProvisionResponse",
  encode(message: QueryEpochMintProvisionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.epochMintProvision !== undefined) {
      DecCoin.encode(message.epochMintProvision, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryEpochMintProvisionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEpochMintProvisionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.epochMintProvision = DecCoin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryEpochMintProvisionResponse {
    return {
      epochMintProvision: isSet(object.epochMintProvision) ? DecCoin.fromJSON(object.epochMintProvision) : undefined
    };
  },
  toJSON(message: QueryEpochMintProvisionResponse): JsonSafe<QueryEpochMintProvisionResponse> {
    const obj: any = {};
    message.epochMintProvision !== undefined && (obj.epochMintProvision = message.epochMintProvision ? DecCoin.toJSON(message.epochMintProvision) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryEpochMintProvisionResponse>): QueryEpochMintProvisionResponse {
    const message = createBaseQueryEpochMintProvisionResponse();
    message.epochMintProvision = object.epochMintProvision !== undefined && object.epochMintProvision !== null ? DecCoin.fromPartial(object.epochMintProvision) : undefined;
    return message;
  },
  fromAmino(object: QueryEpochMintProvisionResponseAmino): QueryEpochMintProvisionResponse {
    const message = createBaseQueryEpochMintProvisionResponse();
    if (object.epoch_mint_provision !== undefined && object.epoch_mint_provision !== null) {
      message.epochMintProvision = DecCoin.fromAmino(object.epoch_mint_provision);
    }
    return message;
  },
  toAmino(message: QueryEpochMintProvisionResponse): QueryEpochMintProvisionResponseAmino {
    const obj: any = {};
    obj.epoch_mint_provision = message.epochMintProvision ? DecCoin.toAmino(message.epochMintProvision) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryEpochMintProvisionResponseAminoMsg): QueryEpochMintProvisionResponse {
    return QueryEpochMintProvisionResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryEpochMintProvisionResponse): QueryEpochMintProvisionResponseAminoMsg {
    return {
      type: "inflation/QueryEpochMintProvisionResponse",
      value: QueryEpochMintProvisionResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryEpochMintProvisionResponseProtoMsg): QueryEpochMintProvisionResponse {
    return QueryEpochMintProvisionResponse.decode(message.value);
  },
  toProto(message: QueryEpochMintProvisionResponse): Uint8Array {
    return QueryEpochMintProvisionResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryEpochMintProvisionResponse): QueryEpochMintProvisionResponseProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryEpochMintProvisionResponse",
      value: QueryEpochMintProvisionResponse.encode(message).finish()
    };
  }
};
function createBaseQuerySkippedEpochsRequest(): QuerySkippedEpochsRequest {
  return {};
}
export const QuerySkippedEpochsRequest = {
  typeUrl: "/evmos.inflation.v1.QuerySkippedEpochsRequest",
  encode(_: QuerySkippedEpochsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QuerySkippedEpochsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuerySkippedEpochsRequest();
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
  fromJSON(_: any): QuerySkippedEpochsRequest {
    return {};
  },
  toJSON(_: QuerySkippedEpochsRequest): JsonSafe<QuerySkippedEpochsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QuerySkippedEpochsRequest>): QuerySkippedEpochsRequest {
    const message = createBaseQuerySkippedEpochsRequest();
    return message;
  },
  fromAmino(_: QuerySkippedEpochsRequestAmino): QuerySkippedEpochsRequest {
    const message = createBaseQuerySkippedEpochsRequest();
    return message;
  },
  toAmino(_: QuerySkippedEpochsRequest): QuerySkippedEpochsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QuerySkippedEpochsRequestAminoMsg): QuerySkippedEpochsRequest {
    return QuerySkippedEpochsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QuerySkippedEpochsRequest): QuerySkippedEpochsRequestAminoMsg {
    return {
      type: "inflation/QuerySkippedEpochsRequest",
      value: QuerySkippedEpochsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QuerySkippedEpochsRequestProtoMsg): QuerySkippedEpochsRequest {
    return QuerySkippedEpochsRequest.decode(message.value);
  },
  toProto(message: QuerySkippedEpochsRequest): Uint8Array {
    return QuerySkippedEpochsRequest.encode(message).finish();
  },
  toProtoMsg(message: QuerySkippedEpochsRequest): QuerySkippedEpochsRequestProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QuerySkippedEpochsRequest",
      value: QuerySkippedEpochsRequest.encode(message).finish()
    };
  }
};
function createBaseQuerySkippedEpochsResponse(): QuerySkippedEpochsResponse {
  return {
    skippedEpochs: Long.UZERO
  };
}
export const QuerySkippedEpochsResponse = {
  typeUrl: "/evmos.inflation.v1.QuerySkippedEpochsResponse",
  encode(message: QuerySkippedEpochsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.skippedEpochs.isZero()) {
      writer.uint32(8).uint64(message.skippedEpochs);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QuerySkippedEpochsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuerySkippedEpochsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.skippedEpochs = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QuerySkippedEpochsResponse {
    return {
      skippedEpochs: isSet(object.skippedEpochs) ? Long.fromValue(object.skippedEpochs) : Long.UZERO
    };
  },
  toJSON(message: QuerySkippedEpochsResponse): JsonSafe<QuerySkippedEpochsResponse> {
    const obj: any = {};
    message.skippedEpochs !== undefined && (obj.skippedEpochs = (message.skippedEpochs || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<QuerySkippedEpochsResponse>): QuerySkippedEpochsResponse {
    const message = createBaseQuerySkippedEpochsResponse();
    message.skippedEpochs = object.skippedEpochs !== undefined && object.skippedEpochs !== null ? Long.fromValue(object.skippedEpochs) : Long.UZERO;
    return message;
  },
  fromAmino(object: QuerySkippedEpochsResponseAmino): QuerySkippedEpochsResponse {
    const message = createBaseQuerySkippedEpochsResponse();
    if (object.skipped_epochs !== undefined && object.skipped_epochs !== null) {
      message.skippedEpochs = Long.fromString(object.skipped_epochs);
    }
    return message;
  },
  toAmino(message: QuerySkippedEpochsResponse): QuerySkippedEpochsResponseAmino {
    const obj: any = {};
    obj.skipped_epochs = !message.skippedEpochs.isZero() ? message.skippedEpochs?.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QuerySkippedEpochsResponseAminoMsg): QuerySkippedEpochsResponse {
    return QuerySkippedEpochsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QuerySkippedEpochsResponse): QuerySkippedEpochsResponseAminoMsg {
    return {
      type: "inflation/QuerySkippedEpochsResponse",
      value: QuerySkippedEpochsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QuerySkippedEpochsResponseProtoMsg): QuerySkippedEpochsResponse {
    return QuerySkippedEpochsResponse.decode(message.value);
  },
  toProto(message: QuerySkippedEpochsResponse): Uint8Array {
    return QuerySkippedEpochsResponse.encode(message).finish();
  },
  toProtoMsg(message: QuerySkippedEpochsResponse): QuerySkippedEpochsResponseProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QuerySkippedEpochsResponse",
      value: QuerySkippedEpochsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryCirculatingSupplyRequest(): QueryCirculatingSupplyRequest {
  return {};
}
export const QueryCirculatingSupplyRequest = {
  typeUrl: "/evmos.inflation.v1.QueryCirculatingSupplyRequest",
  encode(_: QueryCirculatingSupplyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryCirculatingSupplyRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryCirculatingSupplyRequest();
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
  fromJSON(_: any): QueryCirculatingSupplyRequest {
    return {};
  },
  toJSON(_: QueryCirculatingSupplyRequest): JsonSafe<QueryCirculatingSupplyRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryCirculatingSupplyRequest>): QueryCirculatingSupplyRequest {
    const message = createBaseQueryCirculatingSupplyRequest();
    return message;
  },
  fromAmino(_: QueryCirculatingSupplyRequestAmino): QueryCirculatingSupplyRequest {
    const message = createBaseQueryCirculatingSupplyRequest();
    return message;
  },
  toAmino(_: QueryCirculatingSupplyRequest): QueryCirculatingSupplyRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryCirculatingSupplyRequestAminoMsg): QueryCirculatingSupplyRequest {
    return QueryCirculatingSupplyRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryCirculatingSupplyRequest): QueryCirculatingSupplyRequestAminoMsg {
    return {
      type: "inflation/QueryCirculatingSupplyRequest",
      value: QueryCirculatingSupplyRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryCirculatingSupplyRequestProtoMsg): QueryCirculatingSupplyRequest {
    return QueryCirculatingSupplyRequest.decode(message.value);
  },
  toProto(message: QueryCirculatingSupplyRequest): Uint8Array {
    return QueryCirculatingSupplyRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryCirculatingSupplyRequest): QueryCirculatingSupplyRequestProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryCirculatingSupplyRequest",
      value: QueryCirculatingSupplyRequest.encode(message).finish()
    };
  }
};
function createBaseQueryCirculatingSupplyResponse(): QueryCirculatingSupplyResponse {
  return {
    circulatingSupply: DecCoin.fromPartial({})
  };
}
export const QueryCirculatingSupplyResponse = {
  typeUrl: "/evmos.inflation.v1.QueryCirculatingSupplyResponse",
  encode(message: QueryCirculatingSupplyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.circulatingSupply !== undefined) {
      DecCoin.encode(message.circulatingSupply, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryCirculatingSupplyResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryCirculatingSupplyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.circulatingSupply = DecCoin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryCirculatingSupplyResponse {
    return {
      circulatingSupply: isSet(object.circulatingSupply) ? DecCoin.fromJSON(object.circulatingSupply) : undefined
    };
  },
  toJSON(message: QueryCirculatingSupplyResponse): JsonSafe<QueryCirculatingSupplyResponse> {
    const obj: any = {};
    message.circulatingSupply !== undefined && (obj.circulatingSupply = message.circulatingSupply ? DecCoin.toJSON(message.circulatingSupply) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryCirculatingSupplyResponse>): QueryCirculatingSupplyResponse {
    const message = createBaseQueryCirculatingSupplyResponse();
    message.circulatingSupply = object.circulatingSupply !== undefined && object.circulatingSupply !== null ? DecCoin.fromPartial(object.circulatingSupply) : undefined;
    return message;
  },
  fromAmino(object: QueryCirculatingSupplyResponseAmino): QueryCirculatingSupplyResponse {
    const message = createBaseQueryCirculatingSupplyResponse();
    if (object.circulating_supply !== undefined && object.circulating_supply !== null) {
      message.circulatingSupply = DecCoin.fromAmino(object.circulating_supply);
    }
    return message;
  },
  toAmino(message: QueryCirculatingSupplyResponse): QueryCirculatingSupplyResponseAmino {
    const obj: any = {};
    obj.circulating_supply = message.circulatingSupply ? DecCoin.toAmino(message.circulatingSupply) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryCirculatingSupplyResponseAminoMsg): QueryCirculatingSupplyResponse {
    return QueryCirculatingSupplyResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryCirculatingSupplyResponse): QueryCirculatingSupplyResponseAminoMsg {
    return {
      type: "inflation/QueryCirculatingSupplyResponse",
      value: QueryCirculatingSupplyResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryCirculatingSupplyResponseProtoMsg): QueryCirculatingSupplyResponse {
    return QueryCirculatingSupplyResponse.decode(message.value);
  },
  toProto(message: QueryCirculatingSupplyResponse): Uint8Array {
    return QueryCirculatingSupplyResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryCirculatingSupplyResponse): QueryCirculatingSupplyResponseProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryCirculatingSupplyResponse",
      value: QueryCirculatingSupplyResponse.encode(message).finish()
    };
  }
};
function createBaseQueryInflationRateRequest(): QueryInflationRateRequest {
  return {};
}
export const QueryInflationRateRequest = {
  typeUrl: "/evmos.inflation.v1.QueryInflationRateRequest",
  encode(_: QueryInflationRateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryInflationRateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryInflationRateRequest();
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
  fromJSON(_: any): QueryInflationRateRequest {
    return {};
  },
  toJSON(_: QueryInflationRateRequest): JsonSafe<QueryInflationRateRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryInflationRateRequest>): QueryInflationRateRequest {
    const message = createBaseQueryInflationRateRequest();
    return message;
  },
  fromAmino(_: QueryInflationRateRequestAmino): QueryInflationRateRequest {
    const message = createBaseQueryInflationRateRequest();
    return message;
  },
  toAmino(_: QueryInflationRateRequest): QueryInflationRateRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryInflationRateRequestAminoMsg): QueryInflationRateRequest {
    return QueryInflationRateRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryInflationRateRequest): QueryInflationRateRequestAminoMsg {
    return {
      type: "inflation/QueryInflationRateRequest",
      value: QueryInflationRateRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryInflationRateRequestProtoMsg): QueryInflationRateRequest {
    return QueryInflationRateRequest.decode(message.value);
  },
  toProto(message: QueryInflationRateRequest): Uint8Array {
    return QueryInflationRateRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryInflationRateRequest): QueryInflationRateRequestProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryInflationRateRequest",
      value: QueryInflationRateRequest.encode(message).finish()
    };
  }
};
function createBaseQueryInflationRateResponse(): QueryInflationRateResponse {
  return {
    inflationRate: ""
  };
}
export const QueryInflationRateResponse = {
  typeUrl: "/evmos.inflation.v1.QueryInflationRateResponse",
  encode(message: QueryInflationRateResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.inflationRate !== "") {
      writer.uint32(10).string(Decimal.fromUserInput(message.inflationRate, 18).atomics);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryInflationRateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryInflationRateResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.inflationRate = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryInflationRateResponse {
    return {
      inflationRate: isSet(object.inflationRate) ? String(object.inflationRate) : ""
    };
  },
  toJSON(message: QueryInflationRateResponse): JsonSafe<QueryInflationRateResponse> {
    const obj: any = {};
    message.inflationRate !== undefined && (obj.inflationRate = message.inflationRate);
    return obj;
  },
  fromPartial(object: Partial<QueryInflationRateResponse>): QueryInflationRateResponse {
    const message = createBaseQueryInflationRateResponse();
    message.inflationRate = object.inflationRate ?? "";
    return message;
  },
  fromAmino(object: QueryInflationRateResponseAmino): QueryInflationRateResponse {
    const message = createBaseQueryInflationRateResponse();
    if (object.inflation_rate !== undefined && object.inflation_rate !== null) {
      message.inflationRate = object.inflation_rate;
    }
    return message;
  },
  toAmino(message: QueryInflationRateResponse): QueryInflationRateResponseAmino {
    const obj: any = {};
    obj.inflation_rate = message.inflationRate === "" ? undefined : Decimal.fromUserInput(message.inflationRate, 18).atomics;
    return obj;
  },
  fromAminoMsg(object: QueryInflationRateResponseAminoMsg): QueryInflationRateResponse {
    return QueryInflationRateResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryInflationRateResponse): QueryInflationRateResponseAminoMsg {
    return {
      type: "inflation/QueryInflationRateResponse",
      value: QueryInflationRateResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryInflationRateResponseProtoMsg): QueryInflationRateResponse {
    return QueryInflationRateResponse.decode(message.value);
  },
  toProto(message: QueryInflationRateResponse): Uint8Array {
    return QueryInflationRateResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryInflationRateResponse): QueryInflationRateResponseProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryInflationRateResponse",
      value: QueryInflationRateResponse.encode(message).finish()
    };
  }
};
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/evmos.inflation.v1.QueryParamsRequest",
  encode(_: QueryParamsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
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
  fromJSON(_: any): QueryParamsRequest {
    return {};
  },
  toJSON(_: QueryParamsRequest): JsonSafe<QueryParamsRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryParamsRequest>): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
  fromAmino(_: QueryParamsRequestAmino): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
  toAmino(_: QueryParamsRequest): QueryParamsRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryParamsRequestAminoMsg): QueryParamsRequest {
    return QueryParamsRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryParamsRequest): QueryParamsRequestAminoMsg {
    return {
      type: "inflation/QueryParamsRequest",
      value: QueryParamsRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryParamsRequestProtoMsg): QueryParamsRequest {
    return QueryParamsRequest.decode(message.value);
  },
  toProto(message: QueryParamsRequest): Uint8Array {
    return QueryParamsRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsRequest): QueryParamsRequestProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryParamsRequest",
      value: QueryParamsRequest.encode(message).finish()
    };
  }
};
function createBaseQueryParamsResponse(): QueryParamsResponse {
  return {
    params: Params.fromPartial({})
  };
}
export const QueryParamsResponse = {
  typeUrl: "/evmos.inflation.v1.QueryParamsResponse",
  encode(message: QueryParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryParamsResponse {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined
    };
  },
  toJSON(message: QueryParamsResponse): JsonSafe<QueryParamsResponse> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },
  fromPartial(object: Partial<QueryParamsResponse>): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    return message;
  },
  fromAmino(object: QueryParamsResponseAmino): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    return message;
  },
  toAmino(message: QueryParamsResponse): QueryParamsResponseAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryParamsResponseAminoMsg): QueryParamsResponse {
    return QueryParamsResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryParamsResponse): QueryParamsResponseAminoMsg {
    return {
      type: "inflation/QueryParamsResponse",
      value: QueryParamsResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryParamsResponseProtoMsg): QueryParamsResponse {
    return QueryParamsResponse.decode(message.value);
  },
  toProto(message: QueryParamsResponse): Uint8Array {
    return QueryParamsResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryParamsResponse): QueryParamsResponseProtoMsg {
    return {
      typeUrl: "/evmos.inflation.v1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};