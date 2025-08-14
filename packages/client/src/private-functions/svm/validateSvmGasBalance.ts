import { Connection, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import type { SimulatedTransactionResponse } from "@solana/web3.js";
import type { SvmTx } from "../../types/swaggerTypes";
import { getRpcEndpointForChain } from "../getRpcEndpointForChain";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";
import { balances } from "src";
import BigNumber from "bignumber.js";

export type SimulationResult = {
  success: boolean;
  logs?: string[];
  error?: string | SimulatedTransactionResponse["err"];
};

export const validateSvmGasBalance = async ({
  tx,
  simulate,
  feePayerAddress,
}: {
  tx?: SvmTx;
  simulate: ExecuteRouteOptions["simulate"];
  feePayerAddress?: string;
}): Promise<SimulationResult & { asset?: null; fee?: null }> => {
  if (!tx) throw new Error("Transaction is required");
  if (simulate === false) {
    return {
      success: true,
      logs: [],
      error: null,
      asset: null,
      fee: null,
    };
  }

  const endpoint = await getRpcEndpointForChain(tx.chainId ?? "");
  const connection = new Connection(endpoint);
  if (!connection) throw new Error(`Failed to connect to ${tx.chainId}`);

  const gasAmount = await getSVMGasAmountForMessage(connection, tx);

  const skipBalances = await balances({
    chains: {
      solana: {
        address: feePayerAddress ?? tx?.signerAddress,
        denoms: ["solana-native"],
      },
    },
  });

  const gasBalance =
    skipBalances?.chains?.["solana"]?.denoms?.["solana-native"];
  if (!gasBalance) {
    return {
      success: false,
      error: `Insufficient balance for gas on Solana. Need ${gasAmount / LAMPORTS_PER_SOL} SOL.`,
      asset: null,
      fee: null,
    };
  }

  if (BigNumber(gasBalance.amount ?? "").lt(gasAmount)) {
    return {
      success: false,
      error: `Insufficient balance for gas on Solana. Need ${gasAmount / LAMPORTS_PER_SOL} SOL but only have ${gasBalance.formattedAmount} SOL.`,
      asset: null,
      fee: null,
    };
  }
  return {
    success: true,
    error: null,
    asset: null,
    fee: null,
  };
};

export async function getSVMGasAmountForMessage(
  connection: Connection,
  tx?: SvmTx
) {
  const _tx = Buffer.from(tx?.tx ?? "", "base64");
  const transaction = Transaction.from(_tx);
  const gas = await connection.getFeeForMessage(
    transaction.compileMessage(),
    "confirmed"
  );
  if (!gas.value) {
    throw new Error(
      `estimateGasForSVMTx error: unable to get gas for transaction on ${tx?.chainId}`
    );
  }
  return gas.value;
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
