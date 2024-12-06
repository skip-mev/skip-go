export type CosmosMsg = {
  typeUrl: string;
  value: any;
};

export type AminoMsg = {
  type: string;
  value: any;
};

export type ProtoMsg = {
  typeUrl: string;
  value: Uint8Array;
};

export class TransactionMsg<T = any> {
  static TYPE: string;
  static AMINO_TYPE: string;

  constructor(public typeUrl: string, public aminoTypeUrl: string, public value: T) { }

  toCosmosMsg(): CosmosMsg {
    return {
      typeUrl: this.typeUrl,
      value: this.value,
    };
  }

  toAminoMsg(): AminoMsg {
    return {
      type: this.aminoTypeUrl,
      value: this.value,
    };
  }

  toProtoMsg(): ProtoMsg {
    return {
      typeUrl: this.typeUrl,
      value: new Uint8Array(),
    };
  }

  toTerraExtensionMsg(): string {
    return JSON.stringify({
      "@type": this.typeUrl,
      ...this.value,
    });
  }
}

export default TransactionMsg;
