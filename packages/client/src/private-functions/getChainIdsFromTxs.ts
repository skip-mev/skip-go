import { ChainType, type Tx } from "src/types";

export const getChainIdsFromTxs = (txs: Tx[]) => {
  return txs.map((tx) => {
    if ("cosmosTx" in tx) {
      return {
        chainType: ChainType.Cosmos,
        chainId: tx.cosmosTx?.chainId,
      };
    }

    if ("svmTx" in tx) {
      return {
        chainType: ChainType.Svm,
        chainId: tx.svmTx?.chainId,
      };
    }

    if ("evmTx" in tx) {
      return {
        chainType: ChainType.Evm,
        chainId: tx.evmTx?.chainId,
      };
    }
  });
 }
