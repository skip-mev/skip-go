//@ts-nocheck
import { MsgInitiateTokenDeposit } from "./tx";
export const AminoConverter = {
  "/opinit.ophost.v1.MsgInitiateTokenDeposit": {
    aminoType: "ophost/MsgInitiateTokenDeposit",
    toAmino: MsgInitiateTokenDeposit.toAmino,
    fromAmino: MsgInitiateTokenDeposit.fromAmino
  }
};