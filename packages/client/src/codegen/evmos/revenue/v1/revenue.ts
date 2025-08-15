//@ts-nocheck
import _m0 from "protobufjs/minimal.js";
import { isSet } from "../../../helpers";
import { JsonSafe } from "../../../json-safe";
/**
 * Revenue defines an instance that organizes fee distribution conditions for
 * the owner of a given smart contract
 */
export interface Revenue {
  /** contract_address is the hex address of a registered contract */
  contractAddress: string;
  /**
   * deployer_address is the bech32 address of message sender. It must be the same as the origin EOA
   * sending the transaction which deploys the contract
   */
  deployerAddress: string;
  /**
   * withdrawer_address is the bech32 address of account receiving the transaction fees it defaults to
   * deployer_address
   */
  withdrawerAddress: string;
}
export interface RevenueProtoMsg {
  typeUrl: "/evmos.revenue.v1.Revenue";
  value: Uint8Array;
}
/**
 * Revenue defines an instance that organizes fee distribution conditions for
 * the owner of a given smart contract
 * @name RevenueAmino
 * @package evmos.revenue.v1
 * @see proto type: evmos.revenue.v1.Revenue
 */
export interface RevenueAmino {
  /**
   * contract_address is the hex address of a registered contract
   */
  contract_address?: string;
  /**
   * deployer_address is the bech32 address of message sender. It must be the same as the origin EOA
   * sending the transaction which deploys the contract
   */
  deployer_address?: string;
  /**
   * withdrawer_address is the bech32 address of account receiving the transaction fees it defaults to
   * deployer_address
   */
  withdrawer_address?: string;
}
export interface RevenueAminoMsg {
  type: "revenue/Revenue";
  value: RevenueAmino;
}
/**
 * Revenue defines an instance that organizes fee distribution conditions for
 * the owner of a given smart contract
 */
export interface RevenueSDKType {
  contract_address: string;
  deployer_address: string;
  withdrawer_address: string;
}
function createBaseRevenue(): Revenue {
  return {
    contractAddress: "",
    deployerAddress: "",
    withdrawerAddress: ""
  };
}
export const Revenue = {
  typeUrl: "/evmos.revenue.v1.Revenue",
  encode(message: Revenue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
  decode(input: _m0.Reader | Uint8Array, length?: number): Revenue {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRevenue();
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
  fromJSON(object: any): Revenue {
    return {
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
      deployerAddress: isSet(object.deployerAddress) ? String(object.deployerAddress) : "",
      withdrawerAddress: isSet(object.withdrawerAddress) ? String(object.withdrawerAddress) : ""
    };
  },
  toJSON(message: Revenue): JsonSafe<Revenue> {
    const obj: any = {};
    message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
    message.deployerAddress !== undefined && (obj.deployerAddress = message.deployerAddress);
    message.withdrawerAddress !== undefined && (obj.withdrawerAddress = message.withdrawerAddress);
    return obj;
  },
  fromPartial(object: Partial<Revenue>): Revenue {
    const message = createBaseRevenue();
    message.contractAddress = object.contractAddress ?? "";
    message.deployerAddress = object.deployerAddress ?? "";
    message.withdrawerAddress = object.withdrawerAddress ?? "";
    return message;
  },
  fromAmino(object: RevenueAmino): Revenue {
    const message = createBaseRevenue();
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
  toAmino(message: Revenue): RevenueAmino {
    const obj: any = {};
    obj.contract_address = message.contractAddress === "" ? undefined : message.contractAddress;
    obj.deployer_address = message.deployerAddress === "" ? undefined : message.deployerAddress;
    obj.withdrawer_address = message.withdrawerAddress === "" ? undefined : message.withdrawerAddress;
    return obj;
  },
  fromAminoMsg(object: RevenueAminoMsg): Revenue {
    return Revenue.fromAmino(object.value);
  },
  toAminoMsg(message: Revenue): RevenueAminoMsg {
    return {
      type: "revenue/Revenue",
      value: Revenue.toAmino(message)
    };
  },
  fromProtoMsg(message: RevenueProtoMsg): Revenue {
    return Revenue.decode(message.value);
  },
  toProto(message: Revenue): Uint8Array {
    return Revenue.encode(message).finish();
  },
  toProtoMsg(message: Revenue): RevenueProtoMsg {
    return {
      typeUrl: "/evmos.revenue.v1.Revenue",
      value: Revenue.encode(message).finish()
    };
  }
};