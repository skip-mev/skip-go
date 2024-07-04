//@ts-nocheck
import { MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/cosmos.mint.v1beta1.MsgUpdateParams": {
    aminoType: "cosmos-sdk/x/mint/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};