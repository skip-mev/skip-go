import { erc20ABI } from "src/constants/abis";
import { ClientState } from "src/state/clientState";
import type { BalanceResponseDenomEntry, Chain, Erc20Approval, EvmTx } from "src/types/swaggerTypes";
import { formatUnits, maxUint256, publicActions } from "viem";
import type { WalletClient } from "viem";
import { BigNumber } from "bignumber.js";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";
import { updateRouteDetails } from "src/public-functions/subscribeToRouteStatus";

export const validateEvmTokenApproval = async ({
  requiredErc20Approvals,
  signer,
  chain,
  gasBalance,
  tx,
  routeId,
  options,
}: {
  requiredErc20Approvals: Erc20Approval[];
  signer: WalletClient;
  gasBalance?: BalanceResponseDenomEntry | undefined;
  chain: Chain;
  tx: EvmTx;
  routeId: string,
  options: ExecuteRouteOptions;
}) => {
  if (!signer.account?.address) {
    throw new Error("validateEvmGasBalance: Signer address not found");
  }
  for (const requiredApproval of requiredErc20Approvals) {
    const extendedSigner = signer.extend(publicActions);
    const allowance = await extendedSigner.readContract({
      address: requiredApproval.tokenContract as `0x${string}`,
      abi: erc20ABI,
      functionName: "allowance",
      args: [signer.account?.address as `0x${string}`, requiredApproval.spender as `0x${string}`],
    });

    if (allowance > BigInt(requiredApproval.amount)) {
      continue;
    }

    const fee = await extendedSigner.estimateFeesPerGas();
    const allowanceGasFee = BigInt(fee.maxFeePerGas) * BigInt(100_000);

    if (!gasBalance) {
      const chainAssets = (await ClientState.getSkipAssets({ chainId: tx.chainId }))[tx.chainId];

      const nativeAsset = chainAssets?.find((x) => x.denom.includes("-native"));
      const zeroAddressAsset = chainAssets?.find(
        (x) => x.denom.toLowerCase() === "0x0000000000000000000000000000000000000000",
      );
      const asset = nativeAsset || zeroAddressAsset;
      if (!asset?.decimals) {
        throw new Error(
          `Insufficient balance for gas on ${chain.prettyName}. Need ${allowanceGasFee} gwei.`,
        );
      }

      const formattedGasAmount = formatUnits(allowanceGasFee, asset?.decimals);

      throw new Error(
        `Insufficient balance for gas on ${chain.prettyName}. Need ${formattedGasAmount} ${asset.symbol}.`,
      );
    }
    if (BigNumber(gasBalance.amount).lt(Number(allowanceGasFee))) {
      const chainAssets = (await ClientState.getSkipAssets({ chainId: tx.chainId }))[tx.chainId];
      const asset = chainAssets?.find(
        (x) =>
          x.denom.includes("-native") ||
          x.denom.toLowerCase() === "0x0000000000000000000000000000000000000000",
      );
      if (!asset?.decimals) {
        return {
          error: `Insufficient balance for gas on ${chain.prettyName}. Need ${allowanceGasFee} gwei but only have ${gasBalance.amount} gwei.`,
          asset: null,
          fee: null,
        };
      }

      const formattedGasAmount = formatUnits(allowanceGasFee, asset?.decimals);
      return {
        error: `Insufficient balance for gas on ${chain.prettyName}. Need ${formattedGasAmount} ${asset.symbol} but only have ${gasBalance.formattedAmount} ${asset.symbol}.`,
        asset: null,
        fee: null,
      };
    }

    const { onApproveAllowance, useUnlimitedApproval } = options;

    onApproveAllowance?.({
      status: "pending",
      allowance: requiredApproval,
    });

    updateRouteDetails({
      status: "allowance",
      routeId,
      options
    });

    const txHash = await extendedSigner.writeContract({
      account: signer.account,
      address: requiredApproval.tokenContract as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
      args: [
        requiredApproval.spender as `0x${string}`,
        useUnlimitedApproval ? maxUint256 : BigInt(requiredApproval.amount) + BigInt(1000),
      ],
      chain: signer.chain,
    });

    const receipt = await extendedSigner.waitForTransactionReceipt({
      hash: txHash,
    });

    if (receipt.status === "reverted") {
      throw new Error(
        `executeEVMTransaction error: evm tx reverted for hash ${receipt.transactionHash}`,
      );
    }

    onApproveAllowance?.({
      status: "completed",
    });

    updateRouteDetails({
      status: "signing",
      routeId,
      options
    });
  }
};
