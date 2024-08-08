//@ts-nocheck
import { MsgEthereumTx, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/ethermint.evm.v1.MsgEthereumTx": {
    aminoType: "ethermint/MsgEthereumTx",
    toAmino: MsgEthereumTx.toAmino,
    fromAmino: MsgEthereumTx.fromAmino
  },
  "/ethermint.evm.v1.MsgUpdateParams": {
    aminoType: "ethermint/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};