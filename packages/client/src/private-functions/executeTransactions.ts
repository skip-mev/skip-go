import { TxResult } from "src/types/client-types";
import { ExecuteRouteOptions } from "../public-functions/executeRoute";
import { ClientState } from "../state/clientState";
import { TransferStatus, Tx } from "../types/swaggerTypes";
import { executeCosmosTransaction } from "./cosmos/executeCosmosTransaction";
import { executeEvmTransaction } from "./evm/executeEvmTransaction";
import { executeSvmTransaction } from "./svm/executeSvmTransaction";
import { validateGasBalances } from "./validateGasBalances";
import { waitForTransaction } from "./waitForTransaction";
import { GAS_STATION_CHAIN_IDS } from "src/constants/constants";

export const executeTransactions = async (options: ExecuteRouteOptions & { txs?: Tx[] }) => {
  const {
    txs,
    onTransactionBroadcast,
    onTransactionCompleted,
    simulate = true,
    batchSimulate = true,
  } = options;

  if (txs === undefined) {
    throw new Error("executeTransactions error: txs is undefined in executeTransactions");
  }

  const chainIds = txs.map((tx) => {
    if ("cosmosTx" in tx) {
      return {
        chainType: "cosmos",
        chainId: tx.cosmosTx?.chainId,
      };
    }

    if ("svmTx" in tx) {
      return {
        chainType: "svm",
        chainId: tx.svmTx?.chainId,
      };
    }

    if ("evmTx" in tx) {
      return {
        chainType: "evm",
        chainId: tx.evmTx?.chainId,
      };
    }
  });

  const isGasStationSourceEVM = chainIds.find((item, i, array) => {
    return GAS_STATION_CHAIN_IDS.includes(item?.chainId ?? "") && array[i - 1]?.chainType === "evm";
  });

  ClientState.validateGasResults = undefined;
  const validateChainIds = !batchSimulate
    ? chainIds.map((x) => x?.chainId ?? "")
    : isGasStationSourceEVM
      ? GAS_STATION_CHAIN_IDS
      : [];

  await validateGasBalances({
    txs,
    getFallbackGasAmount: options.getFallbackGasAmount,
    getCosmosSigner: options.getCosmosSigner,
    getEvmSigner: options.getEvmSigner,
    onValidateGasBalance: options.onValidateGasBalance,
    simulate: simulate,
    disabledChainIds: validateChainIds,
  });

  const validateEnabledChainIds = async (chainId: string) => {
    await validateGasBalances({
      txs,
      getFallbackGasAmount: options.getFallbackGasAmount,
      getCosmosSigner: options.getCosmosSigner,
      getEvmSigner: options.getEvmSigner,
      onValidateGasBalance: options.onValidateGasBalance,
      simulate: simulate,
      enabledChainIds: !batchSimulate ? [chainId] : validateChainIds,
    });
  };

  for (let i = 0; i < txs.length; i++) {
    const tx = txs[i];
    if (!tx) {
      throw new Error(`executeRoute error: invalid message at index ${i}`);
    }

    let txResult: TxResult;
    if ("cosmosTx" in tx) {
      await validateEnabledChainIds(tx.cosmosTx?.chainId ?? "");
      txResult = await executeCosmosTransaction({
        tx,
        options,
        index: i,
      });
    } else if ("evmTx" in tx) {
      await validateEnabledChainIds(tx.evmTx?.chainId ?? "");
      const txResponse = await executeEvmTransaction(tx, options);
      txResult = {
        chainId: tx?.evmTx?.chainId ?? "",
        txHash: txResponse.transactionHash,
      };
    } else if ("svmTx" in tx) {
      await validateEnabledChainIds(tx.svmTx?.chainId ?? "");
      txResult = await executeSvmTransaction(tx, options);
    } else {
      throw new Error("executeRoute error: invalid message type");
    }
    await onTransactionBroadcast?.({ ...txResult });

    const txStatusResponse = await waitForTransaction({
      ...txResult,
      onTransactionTracked: options.onTransactionTracked,
    });

    await onTransactionCompleted?.({
      chainId: txResult.chainId,
      txHash: txResult.txHash,
      status: txStatusResponse as TransferStatus,
    });
  }
};
