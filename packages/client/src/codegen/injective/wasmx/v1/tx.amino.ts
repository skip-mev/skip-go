//@ts-nocheck
import { MsgUpdateContract, MsgActivateContract, MsgDeactivateContract, MsgExecuteContractCompat, MsgUpdateParams, MsgRegisterContract } from "./tx";
export const AminoConverter = {
  "/injective.wasmx.v1.MsgUpdateContract": {
    aminoType: "wasmx/MsgUpdateContract",
    toAmino: MsgUpdateContract.toAmino,
    fromAmino: MsgUpdateContract.fromAmino
  },
  "/injective.wasmx.v1.MsgActivateContract": {
    aminoType: "wasmx/MsgActivateContract",
    toAmino: MsgActivateContract.toAmino,
    fromAmino: MsgActivateContract.fromAmino
  },
  "/injective.wasmx.v1.MsgDeactivateContract": {
    aminoType: "wasmx/MsgDeactivateContract",
    toAmino: MsgDeactivateContract.toAmino,
    fromAmino: MsgDeactivateContract.fromAmino
  },
  "/injective.wasmx.v1.MsgExecuteContractCompat": {
    aminoType: "wasmx/MsgExecuteContractCompat",
    toAmino: MsgExecuteContractCompat.toAmino,
    fromAmino: MsgExecuteContractCompat.fromAmino
  },
  "/injective.wasmx.v1.MsgUpdateParams": {
    aminoType: "wasmx/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  },
  "/injective.wasmx.v1.MsgRegisterContract": {
    aminoType: "wasmx/MsgRegisterContract",
    toAmino: MsgRegisterContract.toAmino,
    fromAmino: MsgRegisterContract.fromAmino
  }
};