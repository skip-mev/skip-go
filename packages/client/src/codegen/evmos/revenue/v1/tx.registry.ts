//@ts-nocheck
import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgRegisterRevenue, MsgUpdateRevenue, MsgCancelRevenue, MsgUpdateParams } from "./tx";
export const registry: ReadonlyArray<[string, GeneratedType]> = [["/evmos.revenue.v1.MsgRegisterRevenue", MsgRegisterRevenue], ["/evmos.revenue.v1.MsgUpdateRevenue", MsgUpdateRevenue], ["/evmos.revenue.v1.MsgCancelRevenue", MsgCancelRevenue], ["/evmos.revenue.v1.MsgUpdateParams", MsgUpdateParams]];
export const MessageComposer = {
  encoded: {
    registerRevenue(value: MsgRegisterRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgRegisterRevenue",
        value: MsgRegisterRevenue.encode(value).finish()
      };
    },
    updateRevenue(value: MsgUpdateRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateRevenue",
        value: MsgUpdateRevenue.encode(value).finish()
      };
    },
    cancelRevenue(value: MsgCancelRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgCancelRevenue",
        value: MsgCancelRevenue.encode(value).finish()
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateParams",
        value: MsgUpdateParams.encode(value).finish()
      };
    }
  },
  withTypeUrl: {
    registerRevenue(value: MsgRegisterRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgRegisterRevenue",
        value
      };
    },
    updateRevenue(value: MsgUpdateRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateRevenue",
        value
      };
    },
    cancelRevenue(value: MsgCancelRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgCancelRevenue",
        value
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateParams",
        value
      };
    }
  },
  toJSON: {
    registerRevenue(value: MsgRegisterRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgRegisterRevenue",
        value: MsgRegisterRevenue.toJSON(value)
      };
    },
    updateRevenue(value: MsgUpdateRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateRevenue",
        value: MsgUpdateRevenue.toJSON(value)
      };
    },
    cancelRevenue(value: MsgCancelRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgCancelRevenue",
        value: MsgCancelRevenue.toJSON(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateParams",
        value: MsgUpdateParams.toJSON(value)
      };
    }
  },
  fromJSON: {
    registerRevenue(value: any) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgRegisterRevenue",
        value: MsgRegisterRevenue.fromJSON(value)
      };
    },
    updateRevenue(value: any) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateRevenue",
        value: MsgUpdateRevenue.fromJSON(value)
      };
    },
    cancelRevenue(value: any) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgCancelRevenue",
        value: MsgCancelRevenue.fromJSON(value)
      };
    },
    updateParams(value: any) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateParams",
        value: MsgUpdateParams.fromJSON(value)
      };
    }
  },
  fromPartial: {
    registerRevenue(value: MsgRegisterRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgRegisterRevenue",
        value: MsgRegisterRevenue.fromPartial(value)
      };
    },
    updateRevenue(value: MsgUpdateRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateRevenue",
        value: MsgUpdateRevenue.fromPartial(value)
      };
    },
    cancelRevenue(value: MsgCancelRevenue) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgCancelRevenue",
        value: MsgCancelRevenue.fromPartial(value)
      };
    },
    updateParams(value: MsgUpdateParams) {
      return {
        typeUrl: "/evmos.revenue.v1.MsgUpdateParams",
        value: MsgUpdateParams.fromPartial(value)
      };
    }
  }
};