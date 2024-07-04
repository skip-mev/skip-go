//@ts-nocheck
import { MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/ethermint.feemarket.v1.MsgUpdateParams": {
    aminoType: "ethermint/feemarket/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};