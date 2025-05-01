import { Connection } from "@solana/web3.js";
import { SvmTx } from "../../types/swaggerTypes";
import { getRpcEndpointForChain } from "../getRpcEndpointForChain";
import { simulateSvmTx } from "../transactions";


export const validateSvmGasBalance = async ({ tx }: { tx?: SvmTx }) => {
  const endpoint = await getRpcEndpointForChain(tx?.chainId ?? "");
  const connection = new Connection(endpoint);
  if (!connection) throw new Error(`Failed to connect to ${tx?.chainId}`);
  if (!tx) throw new Error("Transaction is required");
  const simResult = await simulateSvmTx(connection, tx);

  if (simResult.error) {
    return {
      error: simResult.error,
      asset: null,
      fee: null,
    };
  }
};
