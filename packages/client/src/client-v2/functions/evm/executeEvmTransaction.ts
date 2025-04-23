import { EvmTx } from "src/client-v2/types/swaggerTypes";
import { WalletClient } from "viem/_types/clients/createWalletClient";
import { ExecuteRouteOptions } from "../executeRoute";
import { maxUint256, publicActions } from "viem";
import { erc20ABI } from "src/constants/abis";

export const executeEVMTransaction = async ({
  message,
  signer,
  options,
}: {
  message: EvmTx;
  signer: WalletClient;
  options: ExecuteRouteOptions;
}) => {
  if (!signer.account) {
    throw new Error("executeEVMTransaction error: failed to retrieve account from signer");
  }
  if (!message.chainId) {
    throw new Error("executeEVMTransaction error: chainId not found for evmTx");
  }
  if (!message.value) {
    throw new Error("executeEVMTransaction error: no value found in evmTx");
  }

  const { onApproveAllowance, onTransactionSigned, bypassApprovalCheck, useUnlimitedApproval } =
    options;
  const extendedSigner = signer.extend(publicActions);

  // Check for approvals unless bypassApprovalCheck is enabled
  if (!bypassApprovalCheck && message.requiredErc20Approvals) {
    for (const requiredApproval of message.requiredErc20Approvals) {
      const allowance = await extendedSigner.readContract({
        address: requiredApproval.tokenContract as `0x${string}`,
        abi: erc20ABI,
        functionName: "allowance",
        args: [signer.account.address as `0x${string}`, requiredApproval.spender as `0x${string}`],
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
    }

    onApproveAllowance?.({
      status: "completed",
    });
  }

  // Execute the transaction
  const txHash = await extendedSigner.sendTransaction({
    account: signer.account,
    to: message.to as `0x${string}`,
    data: `0x${message.data}`,
    chain: signer.chain,
    value: message.value === "" ? undefined : BigInt(message.value),
  });

  onTransactionSigned?.({
    chainId: message.chainId,
  });

  const receipt = await extendedSigner.waitForTransactionReceipt({
    hash: txHash,
  });

  return receipt;
};
