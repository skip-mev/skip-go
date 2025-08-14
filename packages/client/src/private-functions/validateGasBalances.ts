import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";
import { ClientState } from "src/state/clientState";
import type {
  GetFallbackGasAmount,
  SignerGetters,
  ValidateGasResult,
} from "src/types/client-types";
import type { Tx } from "../types/swaggerTypes";
import { validateCosmosGasBalance } from "../public-functions/validateCosmosGasBalance";
import { validateEvmGasBalance } from "./evm/validateEvmGasBalance";
import { validateSvmGasBalance } from "./svm/validateSvmGasBalance";
import { updateRouteDetails } from "src/public-functions/subscribeToRouteStatus";

export type ValidateGasBalancesProps = {
  txs: Tx[];
  onValidateGasBalance?: ExecuteRouteOptions["onValidateGasBalance"];
  getCosmosPriorityFeeDenom?: ExecuteRouteOptions["getCosmosPriorityFeeDenom"];
  getFallbackGasAmount?: GetFallbackGasAmount;
  simulate?: ExecuteRouteOptions["simulate"];
  // skip gas validation for specific chainId
  disabledChainIds?: string[];
  // run gas validation for specific chainId
  enabledChainIds?: string[];
  routeId: string;
  options: ExecuteRouteOptions;
  isMultiRoutes?: boolean;
} & Pick<SignerGetters, "getCosmosSigner" | "getEvmSigner">;

export const validateGasBalances = async ({
  txs,
  onValidateGasBalance,
  getFallbackGasAmount,
  getCosmosSigner,
  getEvmSigner,
  simulate,
  disabledChainIds,
  enabledChainIds,
  getCosmosPriorityFeeDenom,
  routeId,
  options,
  isMultiRoutes
}: ValidateGasBalancesProps) => {
  const validateResult = await Promise.all(
    txs.map(async (tx, i) => {
      if (!tx) {
        throw new Error(`invalid tx at index ${i}`);
      }
      if (
        "cosmosTx" in tx &&
        !disabledChainIds?.includes(tx?.cosmosTx?.chainId ?? "") &&
        (enabledChainIds === undefined ||
          enabledChainIds.includes(tx?.cosmosTx?.chainId ?? ""))
      ) {
        onValidateGasBalance?.({
          status: "pending",
        });
        updateRouteDetails({
          status: "validating",
          routeId,
          options
        });
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
            getCosmosPriorityFeeDenom: getCosmosPriorityFeeDenom,
            isMultiRoutes: isMultiRoutes,
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
        (enabledChainIds === undefined ||
          enabledChainIds.includes(tx?.evmTx?.chainId ?? ""))
      ) {
        onValidateGasBalance?.({
          status: "pending",
        });
        updateRouteDetails({
          status: "validating",
          routeId,
          options
        });
        const signer = await getEvmSigner?.(tx?.evmTx?.chainId ?? "");
        if (!signer) {
          throw new Error(
            `failed to get signer for chain ${tx?.evmTx?.chainId}`
          );
        }
        try {
          const res = await validateEvmGasBalance({
            tx: tx.evmTx,
            signer,
            getFallbackGasAmount,
            useUnlimitedApproval: options?.useUnlimitedApproval,
            bypassApprovalCheck: options?.bypassApprovalCheck,
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
        (enabledChainIds === undefined ||
          enabledChainIds.includes(tx?.svmTx?.chainId ?? ""))
      ) {
        onValidateGasBalance?.({
          status: "pending",
        });
        updateRouteDetails({
          status: "validating",
          routeId,
          options
        });
        try {
          const res = await validateSvmGasBalance({
            tx: tx.svmTx,
            simulate,
            feePayerAddress: options.svmFeePayer?.address
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
    })
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
