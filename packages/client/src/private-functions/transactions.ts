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

import { SigningStargateClient } from "@cosmjs/stargate";

import { WalletClient, publicActions } from "viem";
import {
  Connection,
  LAMPORTS_PER_SOL,
  SimulatedTransactionResponse,
  Transaction,
} from "@solana/web3.js";
import { ChainType, CosmosMsg, EvmTx, SvmTx } from "../types/swaggerTypes";
import { MsgInitiateTokenDeposit } from "src/codegen/opinit/ophost/v1/tx";
import { ClawbackVestingAccount } from "src/codegen/evmos/vesting/v2/vesting";
import { MsgDepositForBurn, MsgDepositForBurnWithCaller } from "src/codegen/circle/cctp/v1/tx";
import { MsgExecute } from "src/codegen/initia/move/v1/tx";
import { GetFallbackGasAmount } from "src/types/client-types";

export const DEFAULT_GAS_MULTIPLIER = 1.5;

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

export async function getCosmosGasAmountForMessage(
  client: SigningStargateClient,
  signerAddress: string,
  chainId: string,
  messages?: CosmosMsg[],
  encodedMsgs?: EncodeObject[],
  multiplier: number = DEFAULT_GAS_MULTIPLIER,
) {
  if (!messages && !encodedMsgs) {
    throw new Error("Either message or encodedMsg must be provided");
  }
  const _encodedMsgs = messages?.map((message) => getEncodeObjectFromCosmosMessage(message));
  encodedMsgs = encodedMsgs || _encodedMsgs;

  if (!encodedMsgs) {
    throw new Error("Either message or encodedMsg must be provided");
  }
  if (
    chainId.includes("evmos") ||
    chainId.includes("injective") ||
    chainId.includes("dymension") ||
    process?.env.NODE_ENV === "test"
  ) {
    if (messages?.find((i) => i.msgTypeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract")) {
      return "2400000";
    }
    return "280000";
  }

  const estimatedGas = await client.simulate(signerAddress, encodedMsgs, "");

  const estimatedGasWithBuffer = estimatedGas * multiplier;

  return Math.ceil(estimatedGasWithBuffer).toFixed(0);
}

export async function getEVMGasAmountForMessage(
  signer: WalletClient,
  tx: EvmTx,
  getFallbackGasAmount?: GetFallbackGasAmount,
) {
  const { to, data, value } = tx;
  if (!signer.account) throw new Error("estimateGasForEvmTx: No account found");
  const extendedSigner = signer.extend(publicActions);

  const fee = await extendedSigner.estimateFeesPerGas();
  try {
    const gasAmount = await extendedSigner.estimateGas({
      account: signer.account,
      to: to as `0x${string}`,
      data: `0x${data}`,
      value: value === "" ? undefined : BigInt(value ?? ""),
    });

    return gasAmount * fee.maxFeePerGas;
  } catch (error) {
    const fallbackGasAmount = await getFallbackGasAmount?.(tx.chainId ?? "", ChainType.Evm);
    if (fallbackGasAmount) {
      return BigInt(fallbackGasAmount) * fee.maxFeePerGas;
    }
    throw error;
  }
}

export async function getSVMGasAmountForMessage(connection: Connection, tx?: SvmTx) {
  const _tx = Buffer.from(tx?.tx ?? "", "base64");
  const transaction = Transaction.from(_tx);
  const gas = await connection.getFeeForMessage(transaction.compileMessage(), "confirmed");
  if (!gas.value) {
    throw new Error(
      `estimateGasForSVMTx error: unable to get gas for transaction on ${tx?.chainId}`,
    );
  }
  return gas.value;
}

export type SimulationResult = {
  success: boolean;
  logs?: string[];
  error?: SimulatedTransactionResponse["err"];
};

export async function simulateSvmTx(
  connection: Connection,
  svmTx: SvmTx,
): Promise<SimulationResult> {
  if (!svmTx.tx) {
    throw new Error("Transaction data is undefined");
  }
  const txBuffer = Buffer.from(svmTx.tx, "base64");
  let transaction: Transaction;
  try {
    transaction = Transaction.from(txBuffer);
  } catch (decodeError) {
    return {
      success: false,
      error: { decodeError: (decodeError as Error).message },
    };
  }

  const simulation = await connection.simulateTransaction(transaction);

  if (simulation.value.err) {
    const shortfall = getSolShortfall(simulation.value.logs ?? []);

    const insufficientLamports =
      simulation.value.logs?.some((log) => log.includes("insufficient lamports")) &&
      shortfall !== null;

    const insufficientFundsForRent = Object.keys(simulation.value.err).includes(
      "InsufficientFundsForRent",
    );

    const errMsg = insufficientLamports
      ? `Insufficient balance for gas on Solana. You need ${shortfall.toFixed(6)} SOL to proceed.`
      : insufficientFundsForRent
        ? "Insufficient funds for rent on Solana. You need to fund your account."
        : "Simulation failed";

    return {
      success: false,
      logs: simulation.value.logs ?? [],
      error: errMsg,
    };
  }

  return {
    success: true,
    logs: simulation.value.logs ?? [],
  };
}

export function getSolShortfall(logs: string[]): number | null {
  const line = logs.find((l) => l.includes("insufficient lamports"));
  if (!line) return null;

  const m = line.match(/insufficient lamports (\d+), need (\d+)/);
  if (!m) return null;

  const have = parseInt(m[1] ?? "0", 10);
  const need = parseInt(m[2] ?? "0", 10);
  const shortfallLamports = need - have;
  return shortfallLamports / LAMPORTS_PER_SOL;
}
