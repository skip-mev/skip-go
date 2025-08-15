//@ts-nocheck
import { Params, ParamsAmino, ParamsSDKType } from "./feemarket";
import { Long, isSet } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/** QueryParamsRequest defines the request type for querying x/evm parameters. */
export interface QueryParamsRequest {}
export interface QueryParamsRequestProtoMsg {
  typeUrl: "/ethermint.feemarket.v1.QueryParamsRequest";
  value: Uint8Array;
}
/**
 * QueryParamsRequest defines the request type for querying x/evm parameters.
 * @name QueryParamsRequestAmino
 * @package ethermint.feemarket.v1
 * @see proto type: ethermint.feemarket.v1.QueryParamsRequest
 */
export interface QueryParamsRequestAmino {}
export interface QueryParamsRequestAminoMsg {
  type: "feemarket/QueryParamsRequest";
  value: QueryParamsRequestAmino;
}
/** QueryParamsRequest defines the request type for querying x/evm parameters. */
export interface QueryParamsRequestSDKType {}
/** QueryParamsResponse defines the response type for querying x/evm parameters. */
export interface QueryParamsResponse {
  /** params define the evm module parameters. */
  params: Params;
}
export interface QueryParamsResponseProtoMsg {
  typeUrl: "/ethermint.feemarket.v1.QueryParamsResponse";
  value: Uint8Array;
}
/**
 * QueryParamsResponse defines the response type for querying x/evm parameters.
 * @name QueryParamsResponseAmino
 * @package ethermint.feemarket.v1
 * @see proto type: ethermint.feemarket.v1.QueryParamsResponse
 */
export interface QueryParamsResponseAmino {
  /**
   * params define the evm module parameters.
   */
  params?: ParamsAmino;
}
export interface QueryParamsResponseAminoMsg {
  type: "feemarket/QueryParamsResponse";
  value: QueryParamsResponseAmino;
}
/** QueryParamsResponse defines the response type for querying x/evm parameters. */
export interface QueryParamsResponseSDKType {
  params: ParamsSDKType;
}
/**
 * QueryBaseFeeRequest defines the request type for querying the EIP1559 base
 * fee.
 */
export interface QueryBaseFeeRequest {}
export interface QueryBaseFeeRequestProtoMsg {
  typeUrl: "/ethermint.feemarket.v1.QueryBaseFeeRequest";
  value: Uint8Array;
}
/**
 * QueryBaseFeeRequest defines the request type for querying the EIP1559 base
 * fee.
 * @name QueryBaseFeeRequestAmino
 * @package ethermint.feemarket.v1
 * @see proto type: ethermint.feemarket.v1.QueryBaseFeeRequest
 */
export interface QueryBaseFeeRequestAmino {}
export interface QueryBaseFeeRequestAminoMsg {
  type: "feemarket/QueryBaseFeeRequest";
  value: QueryBaseFeeRequestAmino;
}
/**
 * QueryBaseFeeRequest defines the request type for querying the EIP1559 base
 * fee.
 */
export interface QueryBaseFeeRequestSDKType {}
/** QueryBaseFeeResponse returns the EIP1559 base fee. */
export interface QueryBaseFeeResponse {
  /** base_fee is the EIP1559 base fee */
  baseFee: string;
}
export interface QueryBaseFeeResponseProtoMsg {
  typeUrl: "/ethermint.feemarket.v1.QueryBaseFeeResponse";
  value: Uint8Array;
}
/**
 * QueryBaseFeeResponse returns the EIP1559 base fee.
 * @name QueryBaseFeeResponseAmino
 * @package ethermint.feemarket.v1
 * @see proto type: ethermint.feemarket.v1.QueryBaseFeeResponse
 */
export interface QueryBaseFeeResponseAmino {
  /**
   * base_fee is the EIP1559 base fee
   */
  base_fee?: string;
}
export interface QueryBaseFeeResponseAminoMsg {
  type: "feemarket/QueryBaseFeeResponse";
  value: QueryBaseFeeResponseAmino;
}
/** QueryBaseFeeResponse returns the EIP1559 base fee. */
export interface QueryBaseFeeResponseSDKType {
  base_fee: string;
}
/**
 * QueryBlockGasRequest defines the request type for querying the EIP1559 base
 * fee.
 */
export interface QueryBlockGasRequest {}
export interface QueryBlockGasRequestProtoMsg {
  typeUrl: "/ethermint.feemarket.v1.QueryBlockGasRequest";
  value: Uint8Array;
}
/**
 * QueryBlockGasRequest defines the request type for querying the EIP1559 base
 * fee.
 * @name QueryBlockGasRequestAmino
 * @package ethermint.feemarket.v1
 * @see proto type: ethermint.feemarket.v1.QueryBlockGasRequest
 */
export interface QueryBlockGasRequestAmino {}
export interface QueryBlockGasRequestAminoMsg {
  type: "feemarket/QueryBlockGasRequest";
  value: QueryBlockGasRequestAmino;
}
/**
 * QueryBlockGasRequest defines the request type for querying the EIP1559 base
 * fee.
 */
export interface QueryBlockGasRequestSDKType {}
/** QueryBlockGasResponse returns block gas used for a given height. */
export interface QueryBlockGasResponse {
  /** gas is the returned block gas */
  gas: Long;
}
export interface QueryBlockGasResponseProtoMsg {
  typeUrl: "/ethermint.feemarket.v1.QueryBlockGasResponse";
  value: Uint8Array;
}
/**
 * QueryBlockGasResponse returns block gas used for a given height.
 * @name QueryBlockGasResponseAmino
 * @package ethermint.feemarket.v1
 * @see proto type: ethermint.feemarket.v1.QueryBlockGasResponse
 */
export interface QueryBlockGasResponseAmino {
  /**
   * gas is the returned block gas
   */
  gas?: string;
}
export interface QueryBlockGasResponseAminoMsg {
  type: "feemarket/QueryBlockGasResponse";
  value: QueryBlockGasResponseAmino;
}
/** QueryBlockGasResponse returns block gas used for a given height. */
export interface QueryBlockGasResponseSDKType {
  gas: Long;
}
function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}
export const QueryParamsRequest = {
  typeUrl: "/ethermint.feemarket.v1.QueryParamsRequest",
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
      type: "feemarket/QueryParamsRequest",
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
      typeUrl: "/ethermint.feemarket.v1.QueryParamsRequest",
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
  typeUrl: "/ethermint.feemarket.v1.QueryParamsResponse",
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
      type: "feemarket/QueryParamsResponse",
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
      typeUrl: "/ethermint.feemarket.v1.QueryParamsResponse",
      value: QueryParamsResponse.encode(message).finish()
    };
  }
};
function createBaseQueryBaseFeeRequest(): QueryBaseFeeRequest {
  return {};
}
export const QueryBaseFeeRequest = {
  typeUrl: "/ethermint.feemarket.v1.QueryBaseFeeRequest",
  encode(_: QueryBaseFeeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBaseFeeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBaseFeeRequest();
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
  fromJSON(_: any): QueryBaseFeeRequest {
    return {};
  },
  toJSON(_: QueryBaseFeeRequest): JsonSafe<QueryBaseFeeRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryBaseFeeRequest>): QueryBaseFeeRequest {
    const message = createBaseQueryBaseFeeRequest();
    return message;
  },
  fromAmino(_: QueryBaseFeeRequestAmino): QueryBaseFeeRequest {
    const message = createBaseQueryBaseFeeRequest();
    return message;
  },
  toAmino(_: QueryBaseFeeRequest): QueryBaseFeeRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryBaseFeeRequestAminoMsg): QueryBaseFeeRequest {
    return QueryBaseFeeRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryBaseFeeRequest): QueryBaseFeeRequestAminoMsg {
    return {
      type: "feemarket/QueryBaseFeeRequest",
      value: QueryBaseFeeRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryBaseFeeRequestProtoMsg): QueryBaseFeeRequest {
    return QueryBaseFeeRequest.decode(message.value);
  },
  toProto(message: QueryBaseFeeRequest): Uint8Array {
    return QueryBaseFeeRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryBaseFeeRequest): QueryBaseFeeRequestProtoMsg {
    return {
      typeUrl: "/ethermint.feemarket.v1.QueryBaseFeeRequest",
      value: QueryBaseFeeRequest.encode(message).finish()
    };
  }
};
function createBaseQueryBaseFeeResponse(): QueryBaseFeeResponse {
  return {
    baseFee: ""
  };
}
export const QueryBaseFeeResponse = {
  typeUrl: "/ethermint.feemarket.v1.QueryBaseFeeResponse",
  encode(message: QueryBaseFeeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.baseFee !== "") {
      writer.uint32(10).string(message.baseFee);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBaseFeeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBaseFeeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.baseFee = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryBaseFeeResponse {
    return {
      baseFee: isSet(object.baseFee) ? String(object.baseFee) : ""
    };
  },
  toJSON(message: QueryBaseFeeResponse): JsonSafe<QueryBaseFeeResponse> {
    const obj: any = {};
    message.baseFee !== undefined && (obj.baseFee = message.baseFee);
    return obj;
  },
  fromPartial(object: Partial<QueryBaseFeeResponse>): QueryBaseFeeResponse {
    const message = createBaseQueryBaseFeeResponse();
    message.baseFee = object.baseFee ?? "";
    return message;
  },
  fromAmino(object: QueryBaseFeeResponseAmino): QueryBaseFeeResponse {
    const message = createBaseQueryBaseFeeResponse();
    if (object.base_fee !== undefined && object.base_fee !== null) {
      message.baseFee = object.base_fee;
    }
    return message;
  },
  toAmino(message: QueryBaseFeeResponse): QueryBaseFeeResponseAmino {
    const obj: any = {};
    obj.base_fee = message.baseFee === "" ? undefined : message.baseFee;
    return obj;
  },
  fromAminoMsg(object: QueryBaseFeeResponseAminoMsg): QueryBaseFeeResponse {
    return QueryBaseFeeResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryBaseFeeResponse): QueryBaseFeeResponseAminoMsg {
    return {
      type: "feemarket/QueryBaseFeeResponse",
      value: QueryBaseFeeResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryBaseFeeResponseProtoMsg): QueryBaseFeeResponse {
    return QueryBaseFeeResponse.decode(message.value);
  },
  toProto(message: QueryBaseFeeResponse): Uint8Array {
    return QueryBaseFeeResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryBaseFeeResponse): QueryBaseFeeResponseProtoMsg {
    return {
      typeUrl: "/ethermint.feemarket.v1.QueryBaseFeeResponse",
      value: QueryBaseFeeResponse.encode(message).finish()
    };
  }
};
function createBaseQueryBlockGasRequest(): QueryBlockGasRequest {
  return {};
}
export const QueryBlockGasRequest = {
  typeUrl: "/ethermint.feemarket.v1.QueryBlockGasRequest",
  encode(_: QueryBlockGasRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBlockGasRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBlockGasRequest();
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
  fromJSON(_: any): QueryBlockGasRequest {
    return {};
  },
  toJSON(_: QueryBlockGasRequest): JsonSafe<QueryBlockGasRequest> {
    const obj: any = {};
    return obj;
  },
  fromPartial(_: Partial<QueryBlockGasRequest>): QueryBlockGasRequest {
    const message = createBaseQueryBlockGasRequest();
    return message;
  },
  fromAmino(_: QueryBlockGasRequestAmino): QueryBlockGasRequest {
    const message = createBaseQueryBlockGasRequest();
    return message;
  },
  toAmino(_: QueryBlockGasRequest): QueryBlockGasRequestAmino {
    const obj: any = {};
    return obj;
  },
  fromAminoMsg(object: QueryBlockGasRequestAminoMsg): QueryBlockGasRequest {
    return QueryBlockGasRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryBlockGasRequest): QueryBlockGasRequestAminoMsg {
    return {
      type: "feemarket/QueryBlockGasRequest",
      value: QueryBlockGasRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryBlockGasRequestProtoMsg): QueryBlockGasRequest {
    return QueryBlockGasRequest.decode(message.value);
  },
  toProto(message: QueryBlockGasRequest): Uint8Array {
    return QueryBlockGasRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryBlockGasRequest): QueryBlockGasRequestProtoMsg {
    return {
      typeUrl: "/ethermint.feemarket.v1.QueryBlockGasRequest",
      value: QueryBlockGasRequest.encode(message).finish()
    };
  }
};
function createBaseQueryBlockGasResponse(): QueryBlockGasResponse {
  return {
    gas: Long.ZERO
  };
}
export const QueryBlockGasResponse = {
  typeUrl: "/ethermint.feemarket.v1.QueryBlockGasResponse",
  encode(message: QueryBlockGasResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.gas.isZero()) {
      writer.uint32(8).int64(message.gas);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBlockGasResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBlockGasResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.gas = reader.int64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryBlockGasResponse {
    return {
      gas: isSet(object.gas) ? Long.fromValue(object.gas) : Long.ZERO
    };
  },
  toJSON(message: QueryBlockGasResponse): JsonSafe<QueryBlockGasResponse> {
    const obj: any = {};
    message.gas !== undefined && (obj.gas = (message.gas || Long.ZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<QueryBlockGasResponse>): QueryBlockGasResponse {
    const message = createBaseQueryBlockGasResponse();
    message.gas = object.gas !== undefined && object.gas !== null ? Long.fromValue(object.gas) : Long.ZERO;
    return message;
  },
  fromAmino(object: QueryBlockGasResponseAmino): QueryBlockGasResponse {
    const message = createBaseQueryBlockGasResponse();
    if (object.gas !== undefined && object.gas !== null) {
      message.gas = Long.fromString(object.gas);
    }
    return message;
  },
  toAmino(message: QueryBlockGasResponse): QueryBlockGasResponseAmino {
    const obj: any = {};
    obj.gas = !message.gas.isZero() ? message.gas?.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: QueryBlockGasResponseAminoMsg): QueryBlockGasResponse {
    return QueryBlockGasResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryBlockGasResponse): QueryBlockGasResponseAminoMsg {
    return {
      type: "feemarket/QueryBlockGasResponse",
      value: QueryBlockGasResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryBlockGasResponseProtoMsg): QueryBlockGasResponse {
    return QueryBlockGasResponse.decode(message.value);
  },
  toProto(message: QueryBlockGasResponse): Uint8Array {
    return QueryBlockGasResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryBlockGasResponse): QueryBlockGasResponseProtoMsg {
    return {
      typeUrl: "/ethermint.feemarket.v1.QueryBlockGasResponse",
      value: QueryBlockGasResponse.encode(message).finish()
    };
  }
};