//@ts-nocheck
import { Coin, CoinAmino, CoinSDKType } from "../../../cosmos/base/v1beta1/coin";
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/** QueryBalancesRequest is the request type for the Query/Balances RPC method. */
export interface QueryBalancesRequest {
  /** address of the clawback vesting account */
  address: string;
}
export interface QueryBalancesRequestProtoMsg {
  typeUrl: "/evmos.vesting.v2.QueryBalancesRequest";
  value: Uint8Array;
}
/** QueryBalancesRequest is the request type for the Query/Balances RPC method. */
export interface QueryBalancesRequestAmino {
  /** address of the clawback vesting account */
  address?: string;
}
export interface QueryBalancesRequestAminoMsg {
  type: "vesting/QueryBalancesRequest";
  value: QueryBalancesRequestAmino;
}
/** QueryBalancesRequest is the request type for the Query/Balances RPC method. */
export interface QueryBalancesRequestSDKType {
  address: string;
}
/**
 * QueryBalancesResponse is the response type for the Query/Balances RPC
 * method.
 */
export interface QueryBalancesResponse {
  /** locked defines the current amount of locked tokens */
  locked: Coin[];
  /** unvested defines the current amount of unvested tokens */
  unvested: Coin[];
  /** vested defines the current amount of vested tokens */
  vested: Coin[];
}
export interface QueryBalancesResponseProtoMsg {
  typeUrl: "/evmos.vesting.v2.QueryBalancesResponse";
  value: Uint8Array;
}
/**
 * QueryBalancesResponse is the response type for the Query/Balances RPC
 * method.
 */
export interface QueryBalancesResponseAmino {
  /** locked defines the current amount of locked tokens */
  locked?: CoinAmino[];
  /** unvested defines the current amount of unvested tokens */
  unvested?: CoinAmino[];
  /** vested defines the current amount of vested tokens */
  vested?: CoinAmino[];
}
export interface QueryBalancesResponseAminoMsg {
  type: "vesting/QueryBalancesResponse";
  value: QueryBalancesResponseAmino;
}
/**
 * QueryBalancesResponse is the response type for the Query/Balances RPC
 * method.
 */
export interface QueryBalancesResponseSDKType {
  locked: CoinSDKType[];
  unvested: CoinSDKType[];
  vested: CoinSDKType[];
}
function createBaseQueryBalancesRequest(): QueryBalancesRequest {
  return {
    address: ""
  };
}
export const QueryBalancesRequest = {
  typeUrl: "/evmos.vesting.v2.QueryBalancesRequest",
  encode(message: QueryBalancesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBalancesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBalancesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryBalancesRequest {
    return {
      address: isSet(object.address) ? String(object.address) : ""
    };
  },
  toJSON(message: QueryBalancesRequest): JsonSafe<QueryBalancesRequest> {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },
  fromPartial(object: Partial<QueryBalancesRequest>): QueryBalancesRequest {
    const message = createBaseQueryBalancesRequest();
    message.address = object.address ?? "";
    return message;
  },
  fromAmino(object: QueryBalancesRequestAmino): QueryBalancesRequest {
    const message = createBaseQueryBalancesRequest();
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    return message;
  },
  toAmino(message: QueryBalancesRequest): QueryBalancesRequestAmino {
    const obj: any = {};
    obj.address = message.address === "" ? undefined : message.address;
    return obj;
  },
  fromAminoMsg(object: QueryBalancesRequestAminoMsg): QueryBalancesRequest {
    return QueryBalancesRequest.fromAmino(object.value);
  },
  toAminoMsg(message: QueryBalancesRequest): QueryBalancesRequestAminoMsg {
    return {
      type: "vesting/QueryBalancesRequest",
      value: QueryBalancesRequest.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryBalancesRequestProtoMsg): QueryBalancesRequest {
    return QueryBalancesRequest.decode(message.value);
  },
  toProto(message: QueryBalancesRequest): Uint8Array {
    return QueryBalancesRequest.encode(message).finish();
  },
  toProtoMsg(message: QueryBalancesRequest): QueryBalancesRequestProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.QueryBalancesRequest",
      value: QueryBalancesRequest.encode(message).finish()
    };
  }
};
function createBaseQueryBalancesResponse(): QueryBalancesResponse {
  return {
    locked: [],
    unvested: [],
    vested: []
  };
}
export const QueryBalancesResponse = {
  typeUrl: "/evmos.vesting.v2.QueryBalancesResponse",
  encode(message: QueryBalancesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.locked) {
      Coin.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.unvested) {
      Coin.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.vested) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryBalancesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryBalancesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.locked.push(Coin.decode(reader, reader.uint32()));
          break;
        case 2:
          message.unvested.push(Coin.decode(reader, reader.uint32()));
          break;
        case 3:
          message.vested.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): QueryBalancesResponse {
    return {
      locked: Array.isArray(object?.locked) ? object.locked.map((e: any) => Coin.fromJSON(e)) : [],
      unvested: Array.isArray(object?.unvested) ? object.unvested.map((e: any) => Coin.fromJSON(e)) : [],
      vested: Array.isArray(object?.vested) ? object.vested.map((e: any) => Coin.fromJSON(e)) : []
    };
  },
  toJSON(message: QueryBalancesResponse): JsonSafe<QueryBalancesResponse> {
    const obj: any = {};
    if (message.locked) {
      obj.locked = message.locked.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.locked = [];
    }
    if (message.unvested) {
      obj.unvested = message.unvested.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.unvested = [];
    }
    if (message.vested) {
      obj.vested = message.vested.map(e => e ? Coin.toJSON(e) : undefined);
    } else {
      obj.vested = [];
    }
    return obj;
  },
  fromPartial(object: Partial<QueryBalancesResponse>): QueryBalancesResponse {
    const message = createBaseQueryBalancesResponse();
    message.locked = object.locked?.map(e => Coin.fromPartial(e)) || [];
    message.unvested = object.unvested?.map(e => Coin.fromPartial(e)) || [];
    message.vested = object.vested?.map(e => Coin.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: QueryBalancesResponseAmino): QueryBalancesResponse {
    const message = createBaseQueryBalancesResponse();
    message.locked = object.locked?.map(e => Coin.fromAmino(e)) || [];
    message.unvested = object.unvested?.map(e => Coin.fromAmino(e)) || [];
    message.vested = object.vested?.map(e => Coin.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: QueryBalancesResponse): QueryBalancesResponseAmino {
    const obj: any = {};
    if (message.locked) {
      obj.locked = message.locked.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.locked = message.locked;
    }
    if (message.unvested) {
      obj.unvested = message.unvested.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.unvested = message.unvested;
    }
    if (message.vested) {
      obj.vested = message.vested.map(e => e ? Coin.toAmino(e) : undefined);
    } else {
      obj.vested = message.vested;
    }
    return obj;
  },
  fromAminoMsg(object: QueryBalancesResponseAminoMsg): QueryBalancesResponse {
    return QueryBalancesResponse.fromAmino(object.value);
  },
  toAminoMsg(message: QueryBalancesResponse): QueryBalancesResponseAminoMsg {
    return {
      type: "vesting/QueryBalancesResponse",
      value: QueryBalancesResponse.toAmino(message)
    };
  },
  fromProtoMsg(message: QueryBalancesResponseProtoMsg): QueryBalancesResponse {
    return QueryBalancesResponse.decode(message.value);
  },
  toProto(message: QueryBalancesResponse): Uint8Array {
    return QueryBalancesResponse.encode(message).finish();
  },
  toProtoMsg(message: QueryBalancesResponse): QueryBalancesResponseProtoMsg {
    return {
      typeUrl: "/evmos.vesting.v2.QueryBalancesResponse",
      value: QueryBalancesResponse.encode(message).finish()
    };
  }
};