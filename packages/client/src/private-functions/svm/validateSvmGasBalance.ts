import {
  Connection,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import type { SimulatedTransactionResponse } from "@solana/web3.js";
import type { SvmTx } from "../../types/swaggerTypes";
import { getRpcEndpointForChain } from "../getRpcEndpointForChain";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";

export type SimulationResult = {
  success: boolean;
  logs?: string[];
  error?: string | SimulatedTransactionResponse["err"];
};

export const validateSvmGasBalance = async ({
  tx,
  simulate
}: {
  tx?: SvmTx;
  simulate: ExecuteRouteOptions["simulate"];
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

  if (!tx.tx) {
    throw new Error("Transaction is required");
  }

  const txBuffer = Buffer.from(tx.tx, "base64");

  let transaction: Transaction;
  try {
    transaction = Transaction.from(txBuffer);
  } catch (decodeError) {
    return {
      success: false,
      error: { decodeError: (decodeError as Error).message },
      asset: null,
      fee: null,
    };
  }

  const simulation = await connection.simulateTransaction(transaction);

  if (simulation.value.err) {
    const logs = simulation.value.logs ?? [];
    const shortfall = getSolShortfall(logs);

    const insufficientLamports =
      logs.some((log) => log.includes("insufficient lamports")) && shortfall !== null;

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
      logs,
      error: errMsg,
      asset: null,
      fee: null,
    };
  }

  return {
    success: true,
    logs: simulation.value.logs ?? [],
    error: null,
    asset: null,
    fee: null,
  };
};

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
