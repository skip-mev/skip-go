//@ts-nocheck
import { Revenue, RevenueAmino, RevenueSDKType } from "./revenue";
import { Long, isSet, padDecimal } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
import { Decimal } from "@cosmjs/math";
/** GenesisState defines the module's genesis state. */
export interface GenesisState {
  /** params are the revenue module parameters */
  params: Params;
  /** revenues is a slice of active registered contracts for fee distribution */
  revenues: Revenue[];
}
export interface GenesisStateProtoMsg {
  typeUrl: "/evmos.revenue.v1.GenesisState";
  value: Uint8Array;
}
/** GenesisState defines the module's genesis state. */
export interface GenesisStateAmino {
  /** params are the revenue module parameters */
  params?: ParamsAmino;
  /** revenues is a slice of active registered contracts for fee distribution */
  revenues?: RevenueAmino[];
}
export interface GenesisStateAminoMsg {
  type: "revenue/GenesisState";
  value: GenesisStateAmino;
}
/** GenesisState defines the module's genesis state. */
export interface GenesisStateSDKType {
  params: ParamsSDKType;
  revenues: RevenueSDKType[];
}
/** Params defines the revenue module params */
export interface Params {
  /** enable_revenue defines a parameter to enable the revenue module */
  enableRevenue: boolean;
  /**
   * developer_shares defines the proportion of the transaction fees to be
   * distributed to the registered contract owner
   */
  developerShares: string;
  /**
   * addr_derivation_cost_create defines the cost of address derivation for
   * verifying the contract deployer at fee registration
   */
  addrDerivationCostCreate: Long;
}
export interface ParamsProtoMsg {
  typeUrl: "/evmos.revenue.v1.Params";
  value: Uint8Array;
}
/** Params defines the revenue module params */
export interface ParamsAmino {
  /** enable_revenue defines a parameter to enable the revenue module */
  enable_revenue?: boolean;
  /**
   * developer_shares defines the proportion of the transaction fees to be
   * distributed to the registered contract owner
   */
  developer_shares?: string;
  /**
   * addr_derivation_cost_create defines the cost of address derivation for
   * verifying the contract deployer at fee registration
   */
  addr_derivation_cost_create?: string;
}
export interface ParamsAminoMsg {
  type: "revenue/Params";
  value: ParamsAmino;
}
/** Params defines the revenue module params */
export interface ParamsSDKType {
  enable_revenue: boolean;
  developer_shares: string;
  addr_derivation_cost_create: Long;
}
function createBaseGenesisState(): GenesisState {
  return {
    params: Params.fromPartial({}),
    revenues: []
  };
}
export const GenesisState = {
  typeUrl: "/evmos.revenue.v1.GenesisState",
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.revenues) {
      Revenue.encode(v!, writer.uint32(18).fork()).ldelim();
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
          message.revenues.push(Revenue.decode(reader, reader.uint32()));
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
      revenues: Array.isArray(object?.revenues) ? object.revenues.map((e: any) => Revenue.fromJSON(e)) : []
    };
  },
  toJSON(message: GenesisState): JsonSafe<GenesisState> {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    if (message.revenues) {
      obj.revenues = message.revenues.map(e => e ? Revenue.toJSON(e) : undefined);
    } else {
      obj.revenues = [];
    }
    return obj;
  },
  fromPartial(object: Partial<GenesisState>): GenesisState {
    const message = createBaseGenesisState();
    message.params = object.params !== undefined && object.params !== null ? Params.fromPartial(object.params) : undefined;
    message.revenues = object.revenues?.map(e => Revenue.fromPartial(e)) || [];
    return message;
  },
  fromAmino(object: GenesisStateAmino): GenesisState {
    const message = createBaseGenesisState();
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromAmino(object.params);
    }
    message.revenues = object.revenues?.map(e => Revenue.fromAmino(e)) || [];
    return message;
  },
  toAmino(message: GenesisState): GenesisStateAmino {
    const obj: any = {};
    obj.params = message.params ? Params.toAmino(message.params) : undefined;
    if (message.revenues) {
      obj.revenues = message.revenues.map(e => e ? Revenue.toAmino(e) : undefined);
    } else {
      obj.revenues = message.revenues;
    }
    return obj;
  },
  fromAminoMsg(object: GenesisStateAminoMsg): GenesisState {
    return GenesisState.fromAmino(object.value);
  },
  toAminoMsg(message: GenesisState): GenesisStateAminoMsg {
    return {
      type: "revenue/GenesisState",
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
      typeUrl: "/evmos.revenue.v1.GenesisState",
      value: GenesisState.encode(message).finish()
    };
  }
};
function createBaseParams(): Params {
  return {
    enableRevenue: false,
    developerShares: "",
    addrDerivationCostCreate: Long.UZERO
  };
}
export const Params = {
  typeUrl: "/evmos.revenue.v1.Params",
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.enableRevenue === true) {
      writer.uint32(8).bool(message.enableRevenue);
    }
    if (message.developerShares !== "") {
      writer.uint32(18).string(Decimal.fromUserInput(message.developerShares, 18).atomics);
    }
    if (!message.addrDerivationCostCreate.isZero()) {
      writer.uint32(24).uint64(message.addrDerivationCostCreate);
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
          message.enableRevenue = reader.bool();
          break;
        case 2:
          message.developerShares = Decimal.fromAtomics(reader.string(), 18).toString();
          break;
        case 3:
          message.addrDerivationCostCreate = (reader.uint64() as Long);
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
      enableRevenue: isSet(object.enableRevenue) ? Boolean(object.enableRevenue) : false,
      developerShares: isSet(object.developerShares) ? String(object.developerShares) : "",
      addrDerivationCostCreate: isSet(object.addrDerivationCostCreate) ? Long.fromValue(object.addrDerivationCostCreate) : Long.UZERO
    };
  },
  toJSON(message: Params): JsonSafe<Params> {
    const obj: any = {};
    message.enableRevenue !== undefined && (obj.enableRevenue = message.enableRevenue);
    message.developerShares !== undefined && (obj.developerShares = message.developerShares);
    message.addrDerivationCostCreate !== undefined && (obj.addrDerivationCostCreate = (message.addrDerivationCostCreate || Long.UZERO).toString());
    return obj;
  },
  fromPartial(object: Partial<Params>): Params {
    const message = createBaseParams();
    message.enableRevenue = object.enableRevenue ?? false;
    message.developerShares = object.developerShares ?? "";
    message.addrDerivationCostCreate = object.addrDerivationCostCreate !== undefined && object.addrDerivationCostCreate !== null ? Long.fromValue(object.addrDerivationCostCreate) : Long.UZERO;
    return message;
  },
  fromAmino(object: ParamsAmino): Params {
    const message = createBaseParams();
    if (object.enable_revenue !== undefined && object.enable_revenue !== null) {
      message.enableRevenue = object.enable_revenue;
    }
    if (object.developer_shares !== undefined && object.developer_shares !== null) {
      message.developerShares = object.developer_shares;
    }
    if (object.addr_derivation_cost_create !== undefined && object.addr_derivation_cost_create !== null) {
      message.addrDerivationCostCreate = Long.fromString(object.addr_derivation_cost_create);
    }
    return message;
  },
  toAmino(message: Params): ParamsAmino {
    const obj: any = {};
    obj.enable_revenue = message.enableRevenue === false ? undefined : message.enableRevenue;
    obj.developer_shares = padDecimal(message.developerShares) === "" ? undefined : padDecimal(message.developerShares);
    obj.addr_derivation_cost_create = !message.addrDerivationCostCreate.isZero() ? message.addrDerivationCostCreate.toString() : undefined;
    return obj;
  },
  fromAminoMsg(object: ParamsAminoMsg): Params {
    return Params.fromAmino(object.value);
  },
  toAminoMsg(message: Params): ParamsAminoMsg {
    return {
      type: "revenue/Params",
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
      typeUrl: "/evmos.revenue.v1.Params",
      value: Params.encode(message).finish()
    };
  }
};