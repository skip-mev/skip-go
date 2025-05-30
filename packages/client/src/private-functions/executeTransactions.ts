import type { TxResult } from "src/types/client-types";
import type { ExecuteRouteOptions } from "../public-functions/executeRoute";
import { ClientState } from "../state/clientState";
import { ChainType, type TransferStatus, type Tx } from "../types/swaggerTypes";
import { executeCosmosTransaction } from "./cosmos/executeCosmosTransaction";
import { executeEvmTransaction } from "./evm/executeEvmTransaction";
import { executeSvmTransaction } from "./svm/executeSvmTransaction";
import { validateGasBalances } from "./validateGasBalances";
import { waitForTransaction } from "../public-functions/waitForTransaction";
import { GAS_STATION_CHAIN_IDS } from "src/constants/constants";
import { venues } from "src/api/getVenues";
import { signCosmosTransaction } from "./cosmos/signCosmosTransaction";
import { signSvmTransaction } from "./svm/signSvmTransaction";

export const executeTransactions = async (options: ExecuteRouteOptions & { txs?: Tx[] }) => {
  const {
    txs,
    onTransactionBroadcast,
    onTransactionCompleted,
    simulate = true,
    batchSimulate = true,
    getFallbackGasAmount = getDefaultFallbackGasAmount,
    getCosmosSigner,
    getEvmSigner,
    onValidateGasBalance,
    trackTxPollingOptions,
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
    getFallbackGasAmount,
    getCosmosSigner,
    getEvmSigner,
    onValidateGasBalance,
    simulate: simulate,
    disabledChainIds: validateChainIds,
  });

  const validateEnabledChainIds = async (chainId: string) => {
    await validateGasBalances({
      txs,
      getFallbackGasAmount,
      getCosmosSigner,
      getEvmSigner,
      onValidateGasBalance,
      simulate: simulate,
      enabledChainIds: !batchSimulate ? [chainId] : validateChainIds,
    });
  };

  let signedTxs: { chainId: string, tx: string }[] = [];

  for (
    let i = 0; i < txs.length; i++
  ) {
    const tx = txs[i];
    if (!tx) {
      throw new Error(`executeRoute error: invalid message at index ${i}`);
    }

    if ("cosmosTx" in tx) {
      const signedTx =  await signCosmosTransaction({
        tx,
        options,
        index: i,
      })
      signedTxs.push({
        chainId: tx.cosmosTx?.chainId ?? "",
        tx: signedTx,
      });
    }
    if ("svmTx" in tx) {
      const signedTx = await signSvmTransaction(
        tx,
        options,
      );
      if (!signedTx) {
        throw new Error("executeRoute svm ta error: signedTx is undefined");
      }
      signedTxs.push({
        chainId: tx.svmTx?.chainId ?? "",
        tx: signedTx,
      });
    }
    if( "evmTx" in tx) {
      const evmTx = tx.evmTx;
      // TODO

    }
  }


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
      ...trackTxPollingOptions,
      onTransactionTracked: options.onTransactionTracked,
    });

    await onTransactionCompleted?.({
      chainId: txResult.chainId,
      txHash: txResult.txHash,
      status: txStatusResponse as TransferStatus,
    });
  }
};

const EVM_GAS_AMOUNT = 150_000;

const COSMOS_GAS_AMOUNT = {
  DEFAULT: 300_000,
  SWAP: 2_800_000,
  CARBON: 1_000_000,
};

const getDefaultFallbackGasAmount = async (chainId: string, chainType: ChainType): Promise<number | undefined> => {
  if (chainType === ChainType.Evm) {
    return EVM_GAS_AMOUNT;
  }
  if (chainType !== ChainType.Cosmos) return undefined;

  const venuesResult = await venues();
  const isSwapChain = venuesResult?.some((venue: { chainId?: string }) => venue.chainId === chainId) ?? false;

  const defaultGasAmount = Math.ceil(
    isSwapChain ? COSMOS_GAS_AMOUNT.SWAP : COSMOS_GAS_AMOUNT.DEFAULT,
  );

  // Special case for carbon-1
  if (chainId === "carbon-1") {
    return COSMOS_GAS_AMOUNT.CARBON;
  }

  return defaultGasAmount;
};
