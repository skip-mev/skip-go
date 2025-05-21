import type { GetFallbackGasAmount } from "src/types/client-types";
import { ChainType } from "src/types/swaggerTypes";
import type { EvmTx } from "src/types/swaggerTypes";
import { publicActions } from "viem";
import type { WalletClient } from "viem";

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
