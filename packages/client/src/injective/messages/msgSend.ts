import { Coin, AminoMsg } from "@cosmjs/amino";
import { MsgSend as CosmosMsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import TransactionMsg, { ProtoMsg } from "./txMsg";


export type MsgSendValue = {
  fromAddress: string;
  toAddress: string;
  amount: Coin[];
};

export class MsgSend extends TransactionMsg<MsgSendValue> {
  static TYPE = "/cosmos.bank.v1beta1.MsgSend";
  static AMINO_TYPE = "cosmos-sdk/MsgSend";

  constructor({ fromAddress, toAddress, amount }: MsgSendValue) {
    super(MsgSend.TYPE, MsgSend.AMINO_TYPE, {
      fromAddress,
      toAddress,
      amount,
    });
  }

  toTerraExtensionMsg(): string {
    return JSON.stringify({
      "@type": this.typeUrl,
      from_address: this.value.fromAddress,
      to_address: this.value.toAddress,
      amount: this.value.amount,
    });
  }

  toAminoMsg(): AminoMsg {
    return {
      type: this.aminoTypeUrl,
      value: {
        from_address: this.value.fromAddress,
        to_address: this.value.toAddress,
        amount: this.value.amount,
      },
    };
  }

  toProtoMsg(): ProtoMsg {
    const cosmosMsg = this.toCosmosMsg();
    return {
      typeUrl: this.typeUrl,
      value: CosmosMsgSend.encode(CosmosMsgSend.fromPartial(cosmosMsg.value)).finish(),
    };
  }
}

export default MsgSend;
