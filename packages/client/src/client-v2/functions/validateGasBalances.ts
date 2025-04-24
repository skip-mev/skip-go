import { ClientState, SignerGetters, ValidateGasResult } from "../state";
import { GetFallbackGasAmount } from "../types/client";
import { Tx } from "../types/swaggerTypes";
import { ExecuteRouteOptions } from "./executeRoute";
import { validateCosmosGasBalance } from "./validateCosmosGasBalance";
import { validateEvmGasBalance } from "./validateEvmGasBalance";
import { validateSvmGasBalance } from "./validateSvmGasBalance";

export type ValidateGasBalancesProps = {
  txs: Tx[];
  onValidateGasBalance?: ExecuteRouteOptions["onValidateGasBalance"];
  getFallbackGasAmount?: GetFallbackGasAmount;
  simulate?: ExecuteRouteOptions["simulate"];
  // skip gas validation for specific chainId
  disabledChainIds?: string[];
  // run gas validation for specific chainId
  enabledChainIds?: string[];
} & Pick<SignerGetters, "getCosmosSigner" | "getEVMSigner">;

export const validateGasBalances = async ({
  txs,
  onValidateGasBalance,
  getFallbackGasAmount,
  getCosmosSigner,
  getEVMSigner,
  simulate,
  disabledChainIds,
  enabledChainIds,
}: ValidateGasBalancesProps) => {
  // cosmos or svm tx in txs
  if (
    txs.every((tx) => "cosmosTx" in tx === undefined) ||
    txs.every((tx) => "svmTx" in tx === undefined)
  ) {
    return;
  }

  onValidateGasBalance?.({
    status: "pending",
  });

  const validateResult = await Promise.all(
    txs.map(async (tx, i) => {
      if (!tx) {
        throw new Error(`invalid tx at index ${i}`);
      }
      if (
        "cosmosTx" in tx &&
        !disabledChainIds?.includes(tx?.cosmosTx?.chainId ?? "") &&
        (enabledChainIds === undefined || enabledChainIds.includes(tx?.cosmosTx?.chainId ?? ""))
      ) {
        if (!tx?.cosmosTx?.msgs) {
          throw new Error(`invalid msgs ${tx?.cosmosTx?.msgs}`);
        }

        try {
          const res = await validateCosmosGasBalance({
            chainId: tx.cosmosTx.chainId ?? "",
            signerAddress: tx.cosmosTx.signerAddress ?? "",
            messages: tx.cosmosTx.msgs,
            getFallbackGasAmount,
            getOfflineSigner: getCosmosSigner,
            txIndex: i,
            simulate,
          });

          return res;
        } catch (e) {
          const error = e as Error;
          return {
            error: error.message,
            asset: null,
            fee: null,
          };
        }
      }

      if (
        "evmTx" in tx &&
        !disabledChainIds?.includes(tx?.evmTx?.chainId ?? "") &&
        (enabledChainIds === undefined || enabledChainIds.includes(tx?.evmTx?.chainId ?? ""))
      ) {
        const signer = await getEVMSigner?.(tx?.evmTx?.chainId ?? "");
        if (!signer) {
          throw new Error(`failed to get signer for chain ${tx?.evmTx?.chainId}`);
        }
        try {
          const res = await validateEvmGasBalance({
            tx: tx.evmTx,
            signer,
            getFallbackGasAmount,
          });
          return res;
        } catch (e) {
          const error = e as Error;
          return {
            error: error.message,
            asset: null,
            fee: null,
          };
        }
      }

      if (
        "svmTx" in tx &&
        !disabledChainIds?.includes(tx?.svmTx?.chainId ?? "") &&
        (enabledChainIds === undefined || enabledChainIds.includes(tx?.svmTx?.chainId ?? ""))
      ) {
        try {
          const res = await validateSvmGasBalance({
            tx: tx.svmTx,
          });
          return res;
        } catch (e) {
          const error = e as Error;
          return {
            error: error.message,
            asset: null,
            fee: null,
          };
        }
      }
    }),
  );

  if (validateResult.filter(Boolean).length === 0) {
    return;
  }

  const txError = validateResult.find((res) => res && res?.error !== null);
  if (txError) {
    onValidateGasBalance?.({
      status: "error",
    });
    ClientState.validateGasResults = validateResult as ValidateGasResult[];
    throw new Error(`${txError.error}`);
  }
  onValidateGasBalance?.({
    status: "completed",
  });

  ClientState.validateGasResults = validateResult as ValidateGasResult[];
};
