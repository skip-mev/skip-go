//@ts-nocheck
import { MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/evmos.inflation.v1.MsgUpdateParams": {
    aminoType: "evmos/inflation/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};