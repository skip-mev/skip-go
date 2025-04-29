import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SvmTx } from "../../types/swaggerTypes";
import { getRpcEndpointForChain } from "../getRpcEndpointForChain";
import { getSVMGasAmountForMessage } from "../transactions";
import { balances } from "../../api/postBalances";
import { BigNumber } from "bignumber.js";

export const validateSvmGasBalance = async ({ tx }: { tx?: SvmTx }) => {
  const endpoint = await getRpcEndpointForChain(tx?.chainId ?? "");
  const connection = new Connection(endpoint);
  if (!connection) throw new Error(`Failed to connect to ${tx?.chainId}`);
  const gasAmount = await getSVMGasAmountForMessage(connection, tx);

  const skipBalances = await balances({
    chains: {
      solana: {
        address: tx?.signerAddress,
        denoms: ["solana-native"],
      },
    },
  });

  const gasBalance = skipBalances?.chains?.["solana"]?.denoms?.["solana-native"];
  if (!gasBalance) {
    return {
      error: `Insufficient balance for gas on Solana. Need ${gasAmount / LAMPORTS_PER_SOL} SOL.`,
      asset: null,
      fee: null,
    };
  }

  if (BigNumber(gasBalance.amount ?? "").lt(gasAmount)) {
    return {
      error: `Insufficient balance for gas on Solana. Need ${gasAmount / LAMPORTS_PER_SOL} SOL but only have ${gasBalance.formattedAmount} SOL.`,
      asset: null,
      fee: null,
    };
  }
};
