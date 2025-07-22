import type { EvmTx } from "src/types/swaggerTypes";
import { ClientState } from "src/state/clientState";
import { maxUint256, publicActions } from "viem";
import { erc20ABI } from "src/constants/abis";
import type { ExecuteRouteOptions } from "src/public-functions/executeRoute";
import { updateRouteDetails } from "src/public-functions/subscribeToRouteStatus";

export const executeEvmTransaction = async (
  message: { evmTx?: EvmTx },
  options: ExecuteRouteOptions,
  index: number,
  routeId: string,
) => {
  const gasArray = ClientState.validateGasResults;

  const gas = gasArray?.find((gas) => gas?.error !== null && gas?.error !== undefined);
  if (typeof gas?.error === "string") {
    throw new Error(gas?.error);
  }

  const { evmTx } = message;

  const getEvmSigner = options.getEvmSigner;
  if (!getEvmSigner) {
    throw new Error("executeEVMTransaction error: getEvmSigner is not provided");
  }
  if (!evmTx?.chainId) {
    throw new Error("chain id not found in evmTx");
  }

  const evmSigner = await getEvmSigner(evmTx.chainId);

  if (!evmSigner.account) {
    throw new Error("executeEVMTransaction error: failed to retrieve account from signer");
  }
  if (!evmTx.chainId) {
    throw new Error("executeEVMTransaction error: chainId not found for evmTx");
  }
  if (!evmTx.value && evmTx.value !== "") {
    throw new Error("executeEVMTransaction error: no value found in evmTx");
  }

  const { onApproveAllowance, onTransactionSigned, bypassApprovalCheck, useUnlimitedApproval } =
    options;
  const extendedSigner = evmSigner.extend(publicActions);

  // Check for approvals unless bypassApprovalCheck is enabled
  if (!bypassApprovalCheck && evmTx.requiredErc20Approvals) {
    for (const requiredApproval of evmTx.requiredErc20Approvals) {
      const allowance = await extendedSigner.readContract({
        address: requiredApproval.tokenContract as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [
          evmSigner.account.address as `0x${string}`,
          requiredApproval.spender as `0x${string}`,
        ],
      });

      if (!requiredApproval.amount) {
        throw new Error("executeEVMTransaction error: no amount found in a requiredApproval");
      }

      if (allowance > BigInt(requiredApproval.amount)) {
        continue;
      }

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
        account: evmSigner.account,
        address: requiredApproval.tokenContract as `0x${string}`,
        abi: erc20ABI,
        functionName: "approve",
        args: [
          requiredApproval.spender as `0x${string}`,
          useUnlimitedApproval ? maxUint256 : BigInt(requiredApproval.amount) + BigInt(1000),
        ],
        chain: evmSigner.chain,
      });

      const receipt = await extendedSigner.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status === "reverted") {
        throw new Error(
          `executeEVMTransaction error: evm tx reverted for hash ${receipt.transactionHash}`,
        );
      }
    }

    onApproveAllowance?.({
      status: "completed",
    });
  }

  options?.onTransactionSignRequested?.({
    chainId: evmTx.chainId,
    signerAddress: evmSigner.account.address as `0x${string}`,
    txIndex: index
  });

  updateRouteDetails({
    status: "signing",
    routeId,
    options
  });

  const latestNonce = await extendedSigner.getTransactionCount({
    address: evmSigner.account.address as `0x${string}`,
  })

  const usedNonce = options.setNonce?.(latestNonce + 1) ?? latestNonce + 1;

  // Execute the transaction
  const txHash = await extendedSigner.sendTransaction({
    account: evmSigner.account,
    to: evmTx.to as `0x${string}`,
    data: `0x${evmTx.data}`,
    chain: evmSigner.chain,
    value: evmTx.value === "" ? undefined : BigInt(evmTx.value),
    nonce: usedNonce
  });

  updateRouteDetails({
    status: "pending",
    routeId,
    options
  });

  onTransactionSigned?.({
    chainId: evmTx.chainId,
  });

  const receipt = await extendedSigner.waitForTransactionReceipt({
    hash: txHash,
  });

  return receipt;
};
