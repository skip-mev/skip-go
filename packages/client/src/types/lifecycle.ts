import { ERC20Approval } from "../types";

export type SubmitTxRequestJSON = {
  tx: string;
  chain_id: string;
};

export type SubmitTxRequest = {
  tx: string;
  chainID: string;
};

export type SubmitTxResponseJSON = {
  tx_hash: string;
};

export type SubmitTxResponse = {
  txHash: string;
};

export type StatusState =
  | "STATE_UNKNOWN"
  | "STATE_SUBMITTED"
  | "STATE_PENDING"
  | "STATE_RECEIVED"
  | "STATE_COMPLETED"
  | "STATE_ABANDONED"
  | "STATE_COMPLETED_SUCCESS"
  | "STATE_COMPLETED_ERROR"
  | "STATE_PENDING_ERROR";

export type NextBlockingTransferJSON = {
  transfer_sequence_index: number;
};

export type NextBlockingTransfer = {
  transferSequenceIndex: number;
};

export type StatusRequestJSON = {
  tx_hash: string;
  chain_id: string;
};

export type StatusRequest = {
  txHash: string;
  chainID: string;
};

export type TransferState =
  | "TRANSFER_UNKNOWN"
  | "TRANSFER_PENDING"
  | "TRANSFER_RECEIVED"
  | "TRANSFER_SUCCESS"
  | "TRANSFER_FAILURE";

export type TransferInfoJSON = {
  from_chain_id: string;
  to_chain_id: string;
  state: TransferState;
  packet_txs: PacketJSON;

  // Deprecated
  src_chain_id: string;
  dst_chain_id: string;
};

export type TransferInfo = {
  fromChainID: string;
  toChainID: string;
  state: TransferState;
  packetTxs: Packet;

  /**
   * Deprecated use `packetTxs` instead
   */
  packetTXs: Packet;
  /**
   * Deprecated use `fromChainID` instead
   */
  srcChainID: string;
  /**
   * Deprecated use `toChainID` instead
   */
  dstChainID: string;
};

export type TransferAssetReleaseJSON = {
  chain_id: string;
  denom: string;
  amount?: string;
  released: boolean;
};

export type TransferAssetRelease = {
  chainID: string;
  denom: string;
  amount?: string;
  released: boolean;
};

export type TxStatusResponseJSON = {
  status: StatusState;
  transfer_sequence: TransferEventJSON[];
  next_blocking_transfer: NextBlockingTransferJSON | null;
  transfer_asset_release: TransferAssetReleaseJSON | null;
  error: StatusError | null;
  state: StatusState;
  transfers: TransferStatusJSON[];
};

export type TxStatusResponse = {
  status: StatusState;
  transferSequence: TransferEvent[];
  nextBlockingTransfer: NextBlockingTransfer | null;
  transferAssetRelease: TransferAssetRelease | null;
  error: StatusError | null;
  state: StatusState;
  transfers: TransferStatus[];
};

export type TransferStatusJSON = {
  state: StatusState;
  transfer_sequence: TransferEventJSON[];
  next_blocking_transfer: NextBlockingTransferJSON | null;
  transfer_asset_release: TransferAssetReleaseJSON | null;
  error: StatusError | null;
};

export type TransferStatus = {
  state: StatusState;
  transferSequence: TransferEvent[];
  nextBlockingTransfer: NextBlockingTransfer | null;
  transferAssetRelease: TransferAssetRelease | null;
  error: StatusError | null;
};

export type PacketJSON = {
  send_tx: ChainTransactionJSON | null;
  receive_tx: ChainTransactionJSON | null;
  acknowledge_tx: ChainTransactionJSON | null;
  timeout_tx: ChainTransactionJSON | null;

  error: PacketError | null;
};

export type Packet = {
  sendTx: ChainTransaction | null;
  receiveTx: ChainTransaction | null;
  acknowledgeTx: ChainTransaction | null;
  timeoutTx: ChainTransaction | null;

  error: PacketError | null;
};

export type StatusErrorType =
  | "STATUS_ERROR_UNKNOWN"
  | "STATUS_ERROR_TRANSACTION_EXECUTION"
  | "STATUS_ERROR_INDEXING";

export type TransactionExecutionError = {
  code: number;
  message: string;
};

export type StatusErrorJSON = {
  code: number;
  message: string;
  type: StatusErrorType;
  details: {
    transaction_execution_error: TransactionExecutionError;
  };
};

export type StatusError = {
  code: number;
  message: string;
  type: StatusErrorType;
  details: {
    transactionExecutionError: TransactionExecutionError;
  };
};

export type PacketErrorType =
  | "PACKET_ERROR_UNKNOWN"
  | "PACKET_ERROR_ACKNOWLEDGEMENT"
  | "PACKET_ERROR_TIMEOUT";

export type AcknowledgementError = {
  message: string;
  code: number;
};

export type PacketErrorJSON = {
  code: number;
  message: string;
  type: PacketErrorType;
  details: {
    acknowledgement_error: AcknowledgementError;
  };
};

export type PacketError = {
  code: number;
  message: string;
  type: PacketErrorType;
  details: {
    acknowledgementError: AcknowledgementError;
  };
};

export type ChainTransactionJSON = {
  chain_id: string;
  tx_hash: string;
  explorer_link: string;
  on_chain_at: string;
};

export type ChainTransaction = {
  chainID: string;
  txHash: string;
  explorerLink: string;
  onChainAt: Date;
};

export type TrackTxRequestJSON = {
  tx_hash: string;
  chain_id: string;
};

export type TrackTxRequest = {
  txHash: string;
  chainID: string;
};

export type TrackTxResponseJSON = {
  tx_hash: string;
  explorer_link: string;
};

export type TrackTxResponse = {
  txHash: string;
  explorerLink: string;
};

export type AxelarTransferType =
  | "AXELAR_TRANSFER_CONTRACT_CALL_WITH_TOKEN"
  | "AXELAR_TRANSFER_SEND_TOKEN";

export type AxelarTransferState =
  | "AXELAR_TRANSFER_UNKNOWN"
  | "AXELAR_TRANSFER_PENDING_CONFIRMATION"
  | "AXELAR_TRANSFER_PENDING_RECEIPT"
  | "AXELAR_TRANSFER_SUCCESS"
  | "AXELAR_TRANSFER_FAILURE";

export type AxelarTransferInfoJSON = {
  from_chain_id: string;
  to_chain_id: string;
  type: AxelarTransferType;
  state: AxelarTransferState;
  txs: AxelarTransferTransactionsJSON;
  axelar_scan_link: string;

  // Deprecated
  src_chain_id: string;
  dst_chain_id: string;
};

export type AxelarTransferInfo = {
  fromChainID: string;
  toChainID: string;
  type: AxelarTransferType;
  state: AxelarTransferState;
  txs: AxelarTransferTransactions;
  axelarScanLink: string;

  /**
   * Deprecated use `fromChainID` instead
   */
  srcChainID: string;
  /**
   * Deprecated use `toChainID` instead
   */
  dstChainID: string;
};

export type AxelarTransferTransactionsJSON =
  | {
      contract_call_with_token_txs: ContractCallWithTokenTransactionsJSON;
    }
  | {
      send_token_txs: SendTokenTransactionsJSON;
    };

export type AxelarTransferTransactions =
  | {
      contractCallWithTokenTxs: ContractCallWithTokenTransactions;
    }
  | {
      sendTokenTxs: SendTokenTransactions;
    };

export type ContractCallWithTokenTransactionsJSON = {
  send_tx: ChainTransactionJSON | null;
  gas_paid_tx: ChainTransactionJSON | null;
  confirm_tx: ChainTransactionJSON | null;
  approve_tx: ChainTransactionJSON | null;
  execute_tx: ChainTransactionJSON | null;
  error: ContractCallWithTokenError | null;
};

export type ContractCallWithTokenTransactions = {
  sendTx: ChainTransaction | null;
  gasPaidTx: ChainTransaction | null;
  confirmTx: ChainTransaction | null;
  approveTx: ChainTransaction | null;
  executeTx: ChainTransaction | null;
  error: ContractCallWithTokenError | null;
};

export type ContractCallWithTokenError = {
  message: string;
  type: ContractCallWithTokenErrorType;
};

export type ContractCallWithTokenErrorType =
  "CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR";

export type SendTokenTransactionsJSON = {
  send_tx: ChainTransactionJSON | null;
  confirm_tx: ChainTransactionJSON | null;
  execute_tx: ChainTransactionJSON | null;
  error: SendTokenError | null;
};

export type SendTokenTransactions = {
  sendTx: ChainTransaction | null;
  confirmTx: ChainTransaction | null;
  executeTx: ChainTransaction | null;
  error: SendTokenError | null;
};

export type SendTokenErrorType = "SEND_TOKEN_EXECUTION_ERROR";

export type SendTokenError = {
  message: string;
  type: SendTokenErrorType;
};

export type CCTPTransferState =
  | "CCTP_TRANSFER_UNKNOWN"
  | "CCTP_TRANSFER_SENT"
  | "CCTP_TRANSFER_PENDING_CONFIRMATION"
  | "CCTP_TRANSFER_CONFIRMED"
  | "CCTP_TRANSFER_RECEIVED";

export type CCTPTransferTransactionsJSON = {
  send_tx: ChainTransactionJSON | null;
  receive_tx: ChainTransactionJSON | null;
};

export type CCTPTransferTransactions = {
  sendTx: ChainTransaction | null;
  receiveTx: ChainTransaction | null;
};

export type CCTPTransferInfoJSON = {
  from_chain_id: string;
  to_chain_id: string;
  state: CCTPTransferState;
  txs: CCTPTransferTransactionsJSON;

  // Deprecated
  src_chain_id: string;
  dst_chain_id: string;
};

export type CCTPTransferInfo = {
  fromChainID: string;
  toChainID: string;
  state: CCTPTransferState;
  txs: CCTPTransferTransactions;

  /**
   * Deprecated use `fromChainID` instead
   */
  srcChainID: string;
  /**
   * Deprecated use `toChainID` instead
   */
  dstChainID: string;
};

export type HyperlaneTransferState =
  | "HYPERLANE_TRANSFER_UNKNOWN"
  | "HYPERLANE_TRANSFER_SENT"
  | "HYPERLANE_TRANSFER_FAILED"
  | "HYPERLANE_TRANSFER_RECEIVED";

export type HyperlaneTransferTransactionsJSON = {
  send_tx: ChainTransactionJSON | null;
  receive_tx: ChainTransactionJSON | null;
};

export type HyperlaneTransferTransactions = {
  sendTx: ChainTransaction | null;
  receiveTx: ChainTransaction | null;
};

export type HyperlaneTransferInfoJSON = {
  from_chain_id: string;
  to_chain_id: string;
  state: HyperlaneTransferState;
  txs: HyperlaneTransferTransactionsJSON;
};

export type HyperlaneTransferInfo = {
  fromChainID: string;
  toChainID: string;
  state: HyperlaneTransferState;
  txs: HyperlaneTransferTransactions;
};

export type GoFastTransferTransactionsJSON = {
  order_submitted_tx: ChainTransactionJSON | null;
  order_filled_tx: ChainTransactionJSON | null;
  order_refunded_tx: ChainTransactionJSON | null;
  order_timeout_tx: ChainTransactionJSON | null;
};

export type GoFastTransferTransactions = {
  orderSubmittedTx: ChainTransaction | null;
  orderFilledTx: ChainTransaction | null;
  orderRefundedTx: ChainTransaction | null;
  orderTimeoutTx: ChainTransaction | null;
};

export type GoFastTransferState =
  | "GO_FAST_TRANSFER_UNKNOWN"
  | "GO_FAST_TRANSFER_SENT"
  | "GO_FAST_POST_ACTION_FAILED"
  | "GO_FAST_TRANSFER_TIMEOUT"
  | "GO_FAST_TRANSFER_FILLED"
  | "GO_FAST_TRANSFER_REFUNDED";

export type GoFastTransferInfoJSON = {
  from_chain_id: string;
  to_chain_id: string;
  state: GoFastTransferState;
  txs: GoFastTransferTransactionsJSON;
  error_message: string | null;
};

export type GoFastTransferInfo = {
  fromChainID: string;
  toChainID: string;
  state: GoFastTransferState;
  txs: GoFastTransferTransactions;
  errorMessage: string | null;
};

export type StargateTransferState =
  | "STARGATE_TRANSFER_UNKNOWN"
  | "STARGATE_TRANSFER_SENT"
  | "STARGATE_TRANSFER_RECEIVED"
  | "STARGATE_TRANSFER_FAILED";

export type StargateTransferTransactionsJSON = {
  send_tx: ChainTransactionJSON | null;
  receive_tx: ChainTransactionJSON | null;
  error_tx: ChainTransactionJSON | null;
};

export type StargateTransferTransactions = {
  sendTx: ChainTransaction | null;
  receiveTx: ChainTransaction | null;
  errorTx: ChainTransaction | null;
};

export type StargateTransferInfoJSON = {
  from_chain_id: string;
  to_chain_id: string;
  state: StargateTransferState;
  txs: StargateTransferTransactionsJSON;
};

export type StargateTransferInfo = {
  fromChainID: string;
  toChainID: string;
  state: StargateTransferState;
  txs: StargateTransferTransactions;
};

export type OPInitTransferState =
  | "OPINIT_TRANSFER_UNKNOWN"
  | "OPINIT_TRANSFER_SENT"
  | "OPINIT_TRANSFER_RECEIVED";

export type OPInitTransferTransactionsJSON = {
  send_tx: ChainTransactionJSON | null;
  receive_tx: ChainTransactionJSON | null;
};

export type OPInitTransferTransactions = {
  sendTx: ChainTransaction | null;
  receiveTx: ChainTransaction | null;
};

export type OPInitTransferInfoJSON = {
  from_chain_id: string;
  to_chain_id: string;
  state: OPInitTransferState;
  txs: OPInitTransferTransactionsJSON;
};

export type OPInitTransferInfo = {
  fromChainID: string;
  toChainID: string;
  state: OPInitTransferState;
  txs: OPInitTransferTransactions;
};

export type EurekaTransferInfoJSON = {
  from_chain_id: string;
  to_chain_id: string;
  state: TransferState;
  packet_txs: PacketJSON;
};

export type EurekaTransferInfo = {
  fromChainID: string;
  toChainID: string;
  state: TransferState;
  packetTxs: Packet;
};

export type TransferEventJSON =
  | { ibc_transfer: TransferInfoJSON }
  | { axelar_transfer: AxelarTransferInfoJSON }
  | { cctp_transfer: CCTPTransferInfoJSON }
  | { hyperlane_transfer: HyperlaneTransferInfoJSON }
  | { op_init_transfer: OPInitTransferInfoJSON }
  | { go_fast_transfer: GoFastTransferInfoJSON }
  | { stargate_transfer: StargateTransferInfoJSON }
  | { eureka_transfer: EurekaTransferInfoJSON };

export type TransferEvent =
  | { ibcTransfer: TransferInfo }
  | { axelarTransfer: AxelarTransferInfo }
  | { cctpTransfer: CCTPTransferInfo }
  | { hyperlaneTransfer: HyperlaneTransferInfo }
  | { opInitTransfer: OPInitTransferInfo }
  | { goFastTransfer: GoFastTransferInfo }
  | { stargateTransfer: StargateTransferInfo }
  | { eurekaTransfer: EurekaTransferInfo };

type CallbackStatus = "success" | "error" | "pending" | "completed";
export interface TransactionCallbacks {
  onTransactionSigned?: (txInfo: { chainID: string }) => Promise<void>;
  onTransactionBroadcast?: (txInfo: {
    txHash: string;
    chainID: string;
  }) => Promise<void>;
  onTransactionTracked?: (txInfo: {
    txHash: string;
    chainID: string;
    explorerLink: string;
  }) => Promise<void>;
  onTransactionCompleted?: (
    chainID: string,
    txHash: string,
    status: TxStatusResponse,
  ) => Promise<void>;
  onValidateGasBalance?: (value: {
    chainID?: string;
    txIndex?: number;
    status: CallbackStatus;
  }) => Promise<void>;
  onApproveAllowance?: (value: {
    allowance?: ERC20Approval;
    status: CallbackStatus;
  }) => Promise<void>;
}
