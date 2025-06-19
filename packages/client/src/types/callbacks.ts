import type { Erc20Approval, TransferStatus } from "./swaggerTypes";

type CallbackStatus = "error" | "pending" | "completed";

export type TransactionCallbacks = {
  onTransactionSignRequested?: (value: {
    chainId: string,
    txIndex: number,
    signerAddress?: string,
  }) => Promise<void>
  onTransactionSigned?: (txInfo: { chainId: string }) => Promise<void>;
  onTransactionBroadcast?: (txInfo: { txHash: string; chainId: string }) => Promise<void>;
  onTransactionTracked?: (txInfo: {
    txHash: string;
    chainId: string;
    explorerLink: string;
  }) => Promise<void>;
  onTransactionCompleted?: (txInfo: {
    chainId: string;
    txHash: string;
    status?: TransferStatus;
  }) => Promise<void>;
  onValidateGasBalance?: (value: {
    chainId?: string;
    txIndex?: number;
    status: CallbackStatus;
  }) => Promise<void>;
  onApproveAllowance?: (value: {
    allowance?: Erc20Approval;
    status: CallbackStatus;
  }) => Promise<void>;
};
