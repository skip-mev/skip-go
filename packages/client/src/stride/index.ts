import { BinaryReader, BinaryWriter } from "cosmjs-types/binary.js";
import { BaseAccount } from "cosmjs-types/cosmos/auth/v1beta1/auth.js";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin.js";

export type BaseVestingAccount = {
  baseAccount: BaseAccount;
  originalVesting: Coin[];
  delegatedFree: Coin[];
  delegatedVesting: Coin[];
  endTime: bigint;
};

export interface StridePeriodicVestingAccount {
  baseVestingAccount: BaseVestingAccount;
  vestingPeriods: Period[];
}

const createBaseVestingAccount = (): BaseVestingAccount => {
  return {
    // @ts-expect-error
    baseAccount: undefined,
    originalVesting: [],
    delegatedFree: [],
    delegatedVesting: [],
    endTime: BigInt(0),
  };
};

export const BaseVestingAccount = {
  encode(
    message: BaseVestingAccount,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    if (message.baseAccount !== undefined) {
      BaseAccount.encode(
        message.baseAccount,
        writer.uint32(10).fork(),
      ).ldelim();
    }

    for (const v of message.originalVesting) {
      Coin.encode(v!, writer.uint32(18).fork()).ldelim();
    }

    for (const v of message.delegatedFree) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }

    for (const v of message.delegatedVesting) {
      Coin.encode(v!, writer.uint32(34).fork()).ldelim();
    }

    if (message.endTime !== BigInt(0)) {
      writer.uint32(40).int64(message.endTime);
    }

    return writer;
  },

  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): BaseVestingAccount {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVestingAccount();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.baseAccount = BaseAccount.decode(reader, reader.uint32());
          break;

        case 2:
          message.originalVesting.push(Coin.decode(reader, reader.uint32()));
          break;

        case 3:
          message.delegatedFree.push(Coin.decode(reader, reader.uint32()));
          break;

        case 4:
          message.delegatedVesting.push(Coin.decode(reader, reader.uint32()));
          break;

        case 5:
          message.endTime = reader.int64();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },
};

export interface Period {
  startTime: bigint;
  length: bigint;
  amount: Coin[];
  actionType: number;
}

function createBasePeriod(): Period {
  return {
    startTime: BigInt(0),
    length: BigInt(0),
    amount: [],
    actionType: 0,
  };
}

export const Period = {
  encode(
    message: Period,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    if (message.startTime !== BigInt(0)) {
      writer.uint32(8).int64(message.startTime);
    }

    if (message.length !== BigInt(0)) {
      writer.uint32(16).int64(message.length);
    }

    for (const v of message.amount) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }

    if (message.actionType !== 0) {
      writer.uint32(32).int32(message.actionType);
    }

    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Period {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePeriod();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          message.startTime = reader.int64();
          break;

        case 2:
          message.length = reader.int64();
          break;

        case 3:
          message.amount.push(Coin.decode(reader, reader.uint32()));
          break;

        case 4:
          message.actionType = reader.int32();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },
};

function createBaseStridePeriodicVestingAccount(): StridePeriodicVestingAccount {
  return {
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    baseVestingAccount: undefined,
    vestingPeriods: [],
  };
}

export const StridePeriodicVestingAccount = {
  encode(
    message: StridePeriodicVestingAccount,
    writer: BinaryWriter = BinaryWriter.create(),
  ): BinaryWriter {
    if (message.baseVestingAccount !== undefined) {
      BaseVestingAccount.encode(
        message.baseVestingAccount,
        writer.uint32(10).fork(),
      ).ldelim();
    }

    for (const v of message.vestingPeriods) {
      Period.encode(v!, writer.uint32(26).fork()).ldelim();
    }

    return writer;
  },

  decode(
    input: BinaryReader | Uint8Array,
    length?: number,
  ): StridePeriodicVestingAccount {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStridePeriodicVestingAccount();

    while (reader.pos < end) {
      const tag = reader.uint32();

      switch (tag >>> 3) {
        case 1:
          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          message.baseVestingAccount = BaseVestingAccount.decode(
            reader,
            reader.uint32(),
          );
          break;

        case 3:
          message.vestingPeriods.push(Period.decode(reader, reader.uint32()));
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  },
};
