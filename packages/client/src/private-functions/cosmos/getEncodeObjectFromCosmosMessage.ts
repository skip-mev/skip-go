import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import {
  MsgTransfer as MsgTransferInjective,
  MsgExecuteContractCompat as MsgExecuteContractInjective,
  Msgs,
} from "@injectivelabs/sdk-ts";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";

import { CosmosMsg } from "../../types/swaggerTypes";
import { MsgInitiateTokenDeposit } from "src/codegen/opinit/ophost/v1/tx";
import { ClawbackVestingAccount } from "src/codegen/evmos/vesting/v2/vesting";
import { MsgDepositForBurn, MsgDepositForBurnWithCaller } from "src/codegen/circle/cctp/v1/tx";
import { MsgExecute } from "src/codegen/initia/move/v1/tx";

export function getEncodeObjectFromCosmosMessage(message: CosmosMsg): EncodeObject {
  const msgJson = JSON.parse(message.msg ?? "");

  if (message.msgTypeUrl === "/ibc.applications.transfer.v1.MsgTransfer") {
    return {
      typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      value: MsgTransfer.fromJSON({
        sourcePort: msgJson.source_port,
        sourceChannel: msgJson.source_channel,
        token: msgJson.token,
        sender: msgJson.sender,
        receiver: msgJson.receiver,
        timeoutHeight: msgJson.timeout_height,
        timeoutTimestamp: msgJson.timeout_timestamp,
        memo: msgJson.memo,
      }),
    };
  }

  if (message.msgTypeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract") {
    return {
      typeUrl: message.msgTypeUrl,
      value: MsgExecuteContract.fromPartial({
        sender: msgJson.sender,
        contract: msgJson.contract,
        msg: toUtf8(JSON.stringify(msgJson.msg)),
        funds: msgJson.funds,
      }),
    };
  }

  if (message.msgTypeUrl === "/cosmos.bank.v1beta1.MsgSend") {
    return {
      typeUrl: message.msgTypeUrl,
      value: MsgSend.fromPartial({
        fromAddress: msgJson.from_address,
        toAddress: msgJson.to_address,
        amount: msgJson.amount,
      }),
    };
  }

  if (message.msgTypeUrl === "/circle.cctp.v1.MsgDepositForBurn") {
    return {
      typeUrl: message.msgTypeUrl,
      value: MsgDepositForBurn.fromAmino(msgJson),
    };
  }

  if (message.msgTypeUrl === "/circle.cctp.v1.MsgDepositForBurnWithCaller") {
    return {
      typeUrl: message.msgTypeUrl,
      value: MsgDepositForBurnWithCaller.fromAmino(msgJson),
    };
  }

  if (message.msgTypeUrl === "/initia.move.v1.MsgExecute") {
    return {
      typeUrl: message.msgTypeUrl,
      value: MsgExecute.fromPartial({
        sender: msgJson.sender,
        moduleAddress: msgJson.module_address,
        moduleName: msgJson.module_name,
        functionName: msgJson.function_name,
        args: msgJson.args,
      }),
    };
  }

  if (message.msgTypeUrl === "/opinit.ophost.v1.MsgInitiateTokenDeposit") {
    return {
      typeUrl: message.msgTypeUrl,
      value: MsgInitiateTokenDeposit.fromPartial({
        sender: msgJson.sender,
        to: msgJson.to,
        amount: msgJson.amount,
        bridgeId: msgJson.bridge_id,
      }),
    };
  }

  if (message.msgTypeUrl === "/evmos.vesting.v2.ClawbackVestingAccount") {
    return {
      typeUrl: message.msgTypeUrl,
      value: ClawbackVestingAccount.fromPartial({
        baseVestingAccount: msgJson.base_vesting_account,
        funderAddress: msgJson.funder_address,
        lockupPeriods: msgJson.lockup_periods,
        startTime: msgJson.start_time,
        vestingPeriods: msgJson.vesting_periods,
      }),
    };
  }

  return {
    typeUrl: message.msgTypeUrl ?? "",
    value: msgJson,
  };
}

export function getEncodeObjectFromCosmosMessageInjective(message: CosmosMsg): Msgs {
  const msgJson = JSON.parse(message.msg ?? "");

  if (message.msgTypeUrl === "/ibc.applications.transfer.v1.MsgTransfer") {
    return MsgTransferInjective.fromJSON({
      port: msgJson.source_port,
      channelId: msgJson.source_channel,
      amount: msgJson.token,
      sender: msgJson.sender,
      receiver: msgJson.receiver,
      timeout: msgJson.timeout_timestamp,
      memo: msgJson.memo,
    });
  }

  if (message.msgTypeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract") {
    return MsgExecuteContractInjective.fromJSON({
      sender: msgJson.sender,
      contractAddress: msgJson.contract,
      msg: msgJson.msg,
      funds: msgJson.funds,
    });
  }

  throw new Error("Unsupported message type");
}
