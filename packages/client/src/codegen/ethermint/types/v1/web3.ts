//@ts-nocheck
import { Long, isSet, bytesFromBase64, base64FromBytes } from "../../../helpers";
import _m0 from "protobufjs/minimal.js";
import { JsonSafe } from "../../../json-safe";
/**
 * ExtensionOptionsWeb3Tx is an extension option that specifies the typed chain id,
 * the fee payer as well as its signature data.
 */
export interface ExtensionOptionsWeb3Tx {
  /**
   * typed_data_chain_id is used only in EIP712 Domain and should match
   * Ethereum network ID in a Web3 provider (e.g. Metamask).
   */
  typedDataChainId: Long;
  /**
   * fee_payer is an account address for the fee payer. It will be validated
   * during EIP712 signature checking.
   */
  feePayer: string;
  /**
   * fee_payer_sig is a signature data from the fee paying account,
   * allows to perform fee delegation when using EIP712 Domain.
   */
  feePayerSig: Uint8Array;
}
export interface ExtensionOptionsWeb3TxProtoMsg {
  typeUrl: "/ethermint.types.v1.ExtensionOptionsWeb3Tx";
  value: Uint8Array;
}
/**
 * ExtensionOptionsWeb3Tx is an extension option that specifies the typed chain id,
 * the fee payer as well as its signature data.
 * @name ExtensionOptionsWeb3TxAmino
 * @package ethermint.types.v1
 * @see proto type: ethermint.types.v1.ExtensionOptionsWeb3Tx
 */
export interface ExtensionOptionsWeb3TxAmino {
  /**
   * typed_data_chain_id is used only in EIP712 Domain and should match
   * Ethereum network ID in a Web3 provider (e.g. Metamask).
   */
  typed_data_chain_id?: string;
  /**
   * fee_payer is an account address for the fee payer. It will be validated
   * during EIP712 signature checking.
   */
  fee_payer?: string;
  /**
   * fee_payer_sig is a signature data from the fee paying account,
   * allows to perform fee delegation when using EIP712 Domain.
   */
  fee_payer_sig?: string;
}
export interface ExtensionOptionsWeb3TxAminoMsg {
  type: "types/ExtensionOptionsWeb3Tx";
  value: ExtensionOptionsWeb3TxAmino;
}
/**
 * ExtensionOptionsWeb3Tx is an extension option that specifies the typed chain id,
 * the fee payer as well as its signature data.
 */
export interface ExtensionOptionsWeb3TxSDKType {
  typed_data_chain_id: Long;
  fee_payer: string;
  fee_payer_sig: Uint8Array;
}
function createBaseExtensionOptionsWeb3Tx(): ExtensionOptionsWeb3Tx {
  return {
    typedDataChainId: Long.UZERO,
    feePayer: "",
    feePayerSig: new Uint8Array()
  };
}
export const ExtensionOptionsWeb3Tx = {
  typeUrl: "/ethermint.types.v1.ExtensionOptionsWeb3Tx",
  encode(message: ExtensionOptionsWeb3Tx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.typedDataChainId.isZero()) {
      writer.uint32(8).uint64(message.typedDataChainId);
    }
    if (message.feePayer !== "") {
      writer.uint32(18).string(message.feePayer);
    }
    if (message.feePayerSig.length !== 0) {
      writer.uint32(26).bytes(message.feePayerSig);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): ExtensionOptionsWeb3Tx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExtensionOptionsWeb3Tx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.typedDataChainId = reader.uint64() as Long;
          break;
        case 2:
          message.feePayer = reader.string();
          break;
        case 3:
          message.feePayerSig = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ExtensionOptionsWeb3Tx {
    return {
      typedDataChainId: isSet(object.typedDataChainId) ? Long.fromValue(object.typedDataChainId) : Long.UZERO,
      feePayer: isSet(object.feePayer) ? String(object.feePayer) : "",
      feePayerSig: isSet(object.feePayerSig) ? bytesFromBase64(object.feePayerSig) : new Uint8Array()
    };
  },
  toJSON(message: ExtensionOptionsWeb3Tx): JsonSafe<ExtensionOptionsWeb3Tx> {
    const obj: any = {};
    message.typedDataChainId !== undefined && (obj.typedDataChainId = (message.typedDataChainId || Long.UZERO).toString());
    message.feePayer !== undefined && (obj.feePayer = message.feePayer);
    message.feePayerSig !== undefined && (obj.feePayerSig = base64FromBytes(message.feePayerSig !== undefined ? message.feePayerSig : new Uint8Array()));
    return obj;
  },
  fromPartial(object: Partial<ExtensionOptionsWeb3Tx>): ExtensionOptionsWeb3Tx {
    const message = createBaseExtensionOptionsWeb3Tx();
    message.typedDataChainId = object.typedDataChainId !== undefined && object.typedDataChainId !== null ? Long.fromValue(object.typedDataChainId) : Long.UZERO;
    message.feePayer = object.feePayer ?? "";
    message.feePayerSig = object.feePayerSig ?? new Uint8Array();
    return message;
  },
  fromAmino(object: ExtensionOptionsWeb3TxAmino): ExtensionOptionsWeb3Tx {
    const message = createBaseExtensionOptionsWeb3Tx();
    if (object.typed_data_chain_id !== undefined && object.typed_data_chain_id !== null) {
      message.typedDataChainId = Long.fromString(object.typed_data_chain_id);
    }
    if (object.fee_payer !== undefined && object.fee_payer !== null) {
      message.feePayer = object.fee_payer;
    }
    if (object.fee_payer_sig !== undefined && object.fee_payer_sig !== null) {
      message.feePayerSig = bytesFromBase64(object.fee_payer_sig);
    }
    return message;
  },
  toAmino(message: ExtensionOptionsWeb3Tx): ExtensionOptionsWeb3TxAmino {
    const obj: any = {};
    obj.typed_data_chain_id = !message.typedDataChainId.isZero() ? message.typedDataChainId?.toString() : undefined;
    obj.fee_payer = message.feePayer === "" ? undefined : message.feePayer;
    obj.fee_payer_sig = message.feePayerSig ? base64FromBytes(message.feePayerSig) : undefined;
    return obj;
  },
  fromAminoMsg(object: ExtensionOptionsWeb3TxAminoMsg): ExtensionOptionsWeb3Tx {
    return ExtensionOptionsWeb3Tx.fromAmino(object.value);
  },
  toAminoMsg(message: ExtensionOptionsWeb3Tx): ExtensionOptionsWeb3TxAminoMsg {
    return {
      type: "types/ExtensionOptionsWeb3Tx",
      value: ExtensionOptionsWeb3Tx.toAmino(message)
    };
  },
  fromProtoMsg(message: ExtensionOptionsWeb3TxProtoMsg): ExtensionOptionsWeb3Tx {
    return ExtensionOptionsWeb3Tx.decode(message.value);
  },
  toProto(message: ExtensionOptionsWeb3Tx): Uint8Array {
    return ExtensionOptionsWeb3Tx.encode(message).finish();
  },
  toProtoMsg(message: ExtensionOptionsWeb3Tx): ExtensionOptionsWeb3TxProtoMsg {
    return {
      typeUrl: "/ethermint.types.v1.ExtensionOptionsWeb3Tx",
      value: ExtensionOptionsWeb3Tx.encode(message).finish()
    };
  }
};