//@ts-nocheck
import { MsgConvertCoin, MsgConvertERC20, MsgUpdateParams } from "./tx";
export const AminoConverter = {
  "/evmos.erc20.v1.MsgConvertCoin": {
    aminoType: "evmos/MsgConvertCoin",
    toAmino: MsgConvertCoin.toAmino,
    fromAmino: MsgConvertCoin.fromAmino
  },
  "/evmos.erc20.v1.MsgConvertERC20": {
    aminoType: "evmos/MsgConvertERC20",
    toAmino: MsgConvertERC20.toAmino,
    fromAmino: MsgConvertERC20.fromAmino
  },
  "/evmos.erc20.v1.MsgUpdateParams": {
    aminoType: "evmos/erc20/MsgUpdateParams",
    toAmino: MsgUpdateParams.toAmino,
    fromAmino: MsgUpdateParams.fromAmino
  }
};