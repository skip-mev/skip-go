/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * Indicates whether the fee is deducted from the transfer amount or charged additionally.
 * - FEE_BEHAVIOR_DEDUCTED: Fee is subtracted from the transfer amount (default, typical for Cosmos chains)
 * - FEE_BEHAVIOR_ADDITIONAL: Fee is charged on top of the transfer amount (typical for EVM chains with native tokens)
 */
export enum FeeBehavior {
  FEE_BEHAVIOR_DEDUCTED = "FEE_BEHAVIOR_DEDUCTED",
  FEE_BEHAVIOR_ADDITIONAL = "FEE_BEHAVIOR_ADDITIONAL",
}

/**
 * Fee type:
 * * SMART_RELAY - Fees for Smart relaying services.'
 */
export enum FeeType {
  SMART_RELAY = "SMART_RELAY",
}

/**
 * Transfer state:
 * * `TRANSFER_UNKNOWN` - Transfer state is not known.
 * * `TRANSFER_PENDING` - The send packet for the transfer has been committed and the transfer is pending.
 * * `TRANSFER_RECEIVED` - The transfer packet has been received by the destination chain. It can still fail and revert if it is part of a multi-hop PFM transfer.
 * * `TRANSFER_SUCCESS` - The transfer has been successfully completed and will not revert.
 * * `TRANSFER_FAILURE`- The transfer has failed.
 */
export enum TransferState {
  TRANSFER_UNKNOWN = "TRANSFER_UNKNOWN",
  TRANSFER_PENDING = "TRANSFER_PENDING",
  TRANSFER_RECEIVED = "TRANSFER_RECEIVED",
  TRANSFER_SUCCESS = "TRANSFER_SUCCESS",
  TRANSFER_FAILURE = "TRANSFER_FAILURE",
}

/**
 * LayerZero transfer state:
 * * `LAYER_ZERO_TRANSFER_UNKNOWN` - Unknown error
 * * `LAYER_ZERO_TRANSFER_SENT` - The transaction on the source chain has executed
 * * `LAYER_ZERO_TRANSFER_WAITING_FOR_COMPOSE` - The transfer has been delivered to the destination chain but there is an additional lz_compose transaction that still needs to be delivered before marking this transfer as LAYER_ZERO_TRANSFER_RECEIVED
 * * `LAYER_ZERO_TRANSFER_RECEIVED` - The transfer has been received at the destination chain
 * * `LAYER_ZERO_TRANSFER_FAILED` - The transfer has failed
 */
export enum LayerZeroTransferState {
  LAYER_ZERO_TRANSFER_UNKNOWN = "LAYER_ZERO_TRANSFER_UNKNOWN",
  LAYER_ZERO_TRANSFER_SENT = "LAYER_ZERO_TRANSFER_SENT",
  LAYER_ZERO_TRANSFER_WAITING_FOR_COMPOSE = "LAYER_ZERO_TRANSFER_WAITING_FOR_COMPOSE",
  LAYER_ZERO_TRANSFER_RECEIVED = "LAYER_ZERO_TRANSFER_RECEIVED",
  LAYER_ZERO_TRANSFER_FAILED = "LAYER_ZERO_TRANSFER_FAILED",
}

/**
 * OPInit transfer state:
 * * `OPINIT_TRANSFER_UNKNOWN` - Unknown error
 * * `OPINIT_TRANSFER_SENT` - The deposit transaction on the source chain has executed
 * * `OPINIT_TRANSFER_RECEIVED` - OPInit transfer has been received at the destination chain
 */
export enum OPInitTransferState {
  OPINIT_TRANSFER_UNKNOWN = "OPINIT_TRANSFER_UNKNOWN",
  OPINIT_TRANSFER_SENT = "OPINIT_TRANSFER_SENT",
  OPINIT_TRANSFER_RECEIVED = "OPINIT_TRANSFER_RECEIVED",
}

/**
 * Transaction state:
 * * `STATE_SUBMITTED` - The initial transaction has been submitted to Skip Go API but not observed on chain yet
 * * `STATE_PENDING` - The initial transaction has been observed on chain, and there are still pending actions
 * * `STATE_COMPLETED_SUCCESS` - The route has completed successfully and the user has their tokens on the destination. (indicated by `transfer_asset_release`)
 * * `STATE_COMPLETED_ERROR` - The route errored somewhere and the user has their tokens unlocked in one of their wallets. Their tokens are either on the source chain, an intermediate chain, or the destination chain but as the wrong asset.
 * (Again, `transfer_asset_release` indicates where the tokens are)
 * * `STATE_ABANDONED` - Tracking for the transaction has been abandoned. This happens if the cross-chain  sequence of actions stalls for more than 10 minutes or if the initial transaction does not get observed in a block for 5 minutes.
 * * `STATE_PENDING_ERROR` - The overall transaction will fail, pending error propagation
 */
export enum TransactionState {
  STATE_SUBMITTED = "STATE_SUBMITTED",
  STATE_PENDING = "STATE_PENDING",
  STATE_ABANDONED = "STATE_ABANDONED",
  STATE_COMPLETED_SUCCESS = "STATE_COMPLETED_SUCCESS",
  STATE_COMPLETED_ERROR = "STATE_COMPLETED_ERROR",
  STATE_PENDING_ERROR = "STATE_PENDING_ERROR",
}

/**
 * Packet error types:
 * * `STATUS_ERROR_UNKNOWN` - Unknown error
 * * `STATUS_ERROR_TRANSACTION_EXECUTION` - Error was encountered during transaction execution
 * * `STATUS_ERROR_INDEXING` - Error was encountered while indexing the transaction and packet data
 * * `STATUS_ERROR_TRANSFER` - The transfer failed to complete successfully
 */
export enum StatusErrorType {
  STATUS_ERROR_UNKNOWN = "STATUS_ERROR_UNKNOWN",
  STATUS_ERROR_TRANSACTION_EXECUTION = "STATUS_ERROR_TRANSACTION_EXECUTION",
  STATUS_ERROR_INDEXING = "STATUS_ERROR_INDEXING",
  STATUS_ERROR_TRANSFER = "STATUS_ERROR_TRANSFER",
}

/**
 * SendToken error types:
 * * `SEND_TOKEN_EXECUTION_ERROR` - Error occurred during the execute transaction
 */
export enum SendTokenErrorType {
  SEND_TOKEN_EXECUTION_ERROR = "SEND_TOKEN_EXECUTION_ERROR",
}

/**
 * Recommendation reason:
 * * `LOW_INFO_WARNING` - Not enough asset pricing information to determine the price safety of the route.
 * * `BAD_PRICE_WARNING` - The execution price of the route deviates significantly from the current market price.
 */
export enum RoutePriceWarningType {
  LOW_INFO_WARNING = "LOW_INFO_WARNING",
  BAD_PRICE_WARNING = "BAD_PRICE_WARNING",
}

/**
 * Recommendation reason:
 * * `UNKNOWN` - Unknown recommendation reason.
 * * `MOST_LIQUID` - Highest liquidity form of the transferred token on the destination chain.
 * * `BASE_TOKEN` - The base token if the destination chain is the origin chain of the source token.
 * * `DIRECT` - The token resulting from the least amount of transfers to the destination chain.
 */
export enum Reason {
  UNKNOWN = "UNKNOWN",
  MOST_LIQUID = "MOST_LIQUID",
  BASE_TOKEN = "BASE_TOKEN",
  DIRECT = "DIRECT",
}

/**
 * Packet error type:
 * * `PACKET_ERROR_UNKNOWN` - Unknown error
 * * `PACKET_ERROR_ACKNOWLEDGEMENT` - Packet acknowledgement error
 * * `PACKET_ERROR_TIMEOUT` - Packet timed out
 */
export enum PacketErrorType {
  PACKET_ERROR_UNKNOWN = "PACKET_ERROR_UNKNOWN",
  PACKET_ERROR_ACKNOWLEDGEMENT = "PACKET_ERROR_ACKNOWLEDGEMENT",
  PACKET_ERROR_TIMEOUT = "PACKET_ERROR_TIMEOUT",
}

/**
 * Hyperlane transfer state:
 * * `HYPERLANE_TRANSFER_UNKNOWN` - Unknown error
 * * `HYPERLANE_TRANSFER_SENT` - The Hyperlane transfer transaction on the source chain has executed
 * * `HYPERLANE_TRANSFER_FAILED` - The Hyperlane transfer failed
 * * `HYPERLANE_TRANSFER_RECEIVED` - The Hyperlane transfer has been received at the destination chain
 */
export enum HyperlaneTransferState {
  HYPERLANE_TRANSFER_UNKNOWN = "HYPERLANE_TRANSFER_UNKNOWN",
  HYPERLANE_TRANSFER_SENT = "HYPERLANE_TRANSFER_SENT",
  HYPERLANE_TRANSFER_FAILED = "HYPERLANE_TRANSFER_FAILED",
  HYPERLANE_TRANSFER_RECEIVED = "HYPERLANE_TRANSFER_RECEIVED",
}

/**
 * ContractCallWithToken errors:
 * * `CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR` - Error occurred during the execute transaction
 */
export enum ContractCallWithTokenErrorType {
  CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR = "CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR",
}

export enum ChainType {
  Cosmos = "cosmos",
  Evm = "evm",
  Svm = "svm",
}

/**
 * Bridge Type:
 * * `IBC` - IBC Bridge
 * * `AXELAR` - Axelar Bridge
 * * `CCTP` - CCTP Bridge
 * * `HYPERLANE` - Hyperlane Bridge
 * * `OPINIT` - Opinit Bridge
 * * `GO_FAST` - Go Fast Bridge
 * * `STARGATE` - Stargate Bridge
 * * `LAYER_ZERO` - Layerzero Bridge
 * * `EUREKA` - IBC Eureka Bridge
 */
export enum BridgeType {
  IBC = "IBC",
  AXELAR = "AXELAR",
  CCTP = "CCTP",
  HYPERLANE = "HYPERLANE",
  OPINIT = "OPINIT",
  GO_FAST = "GO_FAST",
  STARGATE = "STARGATE",
  LAYER_ZERO = "LAYER_ZERO",
  EUREKA = "EUREKA",
}

/**
 * GoFast transfer state:
 * * `GO_FAST_TRANSFER_UNKNOWN` - Unknown state
 * * `GO_FAST_TRANSFER_SENT` - Order submitted on source chain
 * * `GO_FAST_POST_ACTION_FAILED` - Order filled, but subsequent action (e.g., swap) failed
 * * `GO_FAST_TRANSFER_TIMEOUT` - Order timed out
 * * `GO_FAST_TRANSFER_FILLED` - Order filled on destination chain
 * * `GO_FAST_TRANSFER_REFUNDED` - Order refunded
 */
export enum GoFastTransferState {
  GO_FAST_TRANSFER_UNKNOWN = "GO_FAST_TRANSFER_UNKNOWN",
  GO_FAST_TRANSFER_SENT = "GO_FAST_TRANSFER_SENT",
  GO_FAST_POST_ACTION_FAILED = "GO_FAST_POST_ACTION_FAILED",
  GO_FAST_TRANSFER_TIMEOUT = "GO_FAST_TRANSFER_TIMEOUT",
  GO_FAST_TRANSFER_FILLED = "GO_FAST_TRANSFER_FILLED",
  GO_FAST_TRANSFER_REFUNDED = "GO_FAST_TRANSFER_REFUNDED",
}

/**
 * Stargate transfer state:
 * * `STARGATE_TRANSFER_UNKNOWN` - Unknown error
 * * `STARGATE_TRANSFER_SENT` - The Stargate transfer transaction on the source chain has executed
 * * `STARGATE_TRANSFER_PENDING_CONFIRMATION` - Stargate transfer is pending confirmation
 * * `STARGATE_TRANSFER_CONFIRMED` - Stargate transfer has been confirmed
 * * `STARGATE_TRANSFER_RECEIVED` - Stargate transfer has been received at the destination chain
 * * `STARGATE_TRANSFER_FAILED` - Stargate transfer failed
 */
export enum StargateTransferState {
  STARGATE_TRANSFER_UNKNOWN = "STARGATE_TRANSFER_UNKNOWN",
  STARGATE_TRANSFER_SENT = "STARGATE_TRANSFER_SENT",
  STARGATE_TRANSFER_PENDING_CONFIRMATION = "STARGATE_TRANSFER_PENDING_CONFIRMATION",
  STARGATE_TRANSFER_CONFIRMED = "STARGATE_TRANSFER_CONFIRMED",
  STARGATE_TRANSFER_RECEIVED = "STARGATE_TRANSFER_RECEIVED",
  STARGATE_TRANSFER_FAILED = "STARGATE_TRANSFER_FAILED",
}

/**
 * CCTP transfer state:
 * * `CCTP_TRANSFER_UNKNOWN` - Unknown error
 * * `CCTP_TRANSFER_SENT` - The burn transaction on the source chain has executed
 * * `CCTP_TRANSFER_PENDING_CONFIRMATION` - CCTP transfer is pending confirmation by the cctp attestation api
 * * `CCTP_TRANSFER_CONFIRMED` - CCTP transfer has been confirmed by the cctp attestation api
 * * `CCTP_TRANSFER_RECEIVED` - CCTP transfer has been received at the destination chain
 */
export enum CCTPTransferState {
  CCTP_TRANSFER_UNKNOWN = "CCTP_TRANSFER_UNKNOWN",
  CCTP_TRANSFER_SENT = "CCTP_TRANSFER_SENT",
  CCTP_TRANSFER_PENDING_CONFIRMATION = "CCTP_TRANSFER_PENDING_CONFIRMATION",
  CCTP_TRANSFER_CONFIRMED = "CCTP_TRANSFER_CONFIRMED",
  CCTP_TRANSFER_RECEIVED = "CCTP_TRANSFER_RECEIVED",
}

/**
 * Axelar transfer type:
 * * `AXELAR_TRANSFER_CONTRACT_CALL_WITH_TOKEN` - GMP contract call with token transfer type
 * * `AXELAR_TRANSFER_SEND_TOKEN` - Send token transfer type
 */
export enum AxelarTransferType {
  AXELAR_TRANSFER_CONTRACT_CALL_WITH_TOKEN = "AXELAR_TRANSFER_CONTRACT_CALL_WITH_TOKEN",
  AXELAR_TRANSFER_SEND_TOKEN = "AXELAR_TRANSFER_SEND_TOKEN",
}

/**
 * Axelar transfer state:
 * * `AXELAR_TRANSFER_UNKNOWN` - Unknown error
 * * `AXELAR_TRANSFER_PENDING_CONFIRMATION` - Axelar transfer is pending confirmation
 * * `AXELAR_TRANSFER_PENDING_RECEIPT` - Axelar transfer is pending receipt at destination
 * * `AXELAR_TRANSFER_SUCCESS` - Axelar transfer succeeded and assets have been received
 * * `AXELAR_TRANSFER_FAILURE` - Axelar transfer failed
 */
export enum AxelarTransferState {
  AXELAR_TRANSFER_UNKNOWN = "AXELAR_TRANSFER_UNKNOWN",
  AXELAR_TRANSFER_PENDING_CONFIRMATION = "AXELAR_TRANSFER_PENDING_CONFIRMATION",
  AXELAR_TRANSFER_PENDING_RECEIPT = "AXELAR_TRANSFER_PENDING_RECEIPT",
  AXELAR_TRANSFER_SUCCESS = "AXELAR_TRANSFER_SUCCESS",
  AXELAR_TRANSFER_FAILURE = "AXELAR_TRANSFER_FAILURE",
}

export enum AutopilotAction {
  LIQUID_STAKE = "LIQUID_STAKE",
  CLAIM = "CLAIM",
}

export interface AcknowledgementErrorDetails {
  /** Error code */
  code?: number;
  /** Error message */
  message?: string;
}

/** An affiliate that receives fees from a swap */
export interface Affiliate {
  /** Address to which to pay the fee */
  address?: string;
  /** Bps fee to pay to the affiliate */
  basisPointsFee?: string;
}

export interface ApiError {
  /** Error message */
  message?: string;
}

export interface Asset {
  /** Denom of the asset */
  denom: string;
  /** Chain-id of the asset */
  chainId: string;
  /** Denom of the origin of the asset. If this is an ibc denom, this is the original denom that the ibc token represents */
  originDenom: string;
  /** Chain-id of the origin of the asset. If this is an ibc denom, this is the chain-id of the asset that the ibc token represents */
  originChainId: string;
  /** The forward slash delimited sequence of ibc ports and channels that can be traversed to unwind an ibc token to its origin asset. */
  trace: string;
  /** Indicates whether asset is a CW20 token */
  isCw20: boolean;
  /** Indicates whether asset is an EVM token */
  isEvm: boolean;
  /** Indicates whether asset is an SVM token */
  isSvm: boolean;
  /** Symbol of the asset, e.g. ATOM for uatom */
  symbol?: string;
  /** Name of the asset */
  name?: string;
  /** URI pointing to an image of the logo of the asset */
  logoUri?: string;
  /** Number of decimals used for amounts of the asset */
  decimals?: number;
  /** Address of the contract for the asset, e.g. if it is a CW20 or ERC20 token */
  tokenContract?: string;
  /** Description of the asset */
  description?: string;
  /** Coingecko id of the asset */
  coingeckoId?: string;
  /** Recommended symbol of the asset used to differentiate between bridged assets with the same symbol, e.g. USDC.axl for Axelar USDC and USDC.grv for Gravity USDC */
  recommendedSymbol?: string;
}

export interface AssetBetweenChains {
  assetOnSource?: Asset;
  assetOnDest?: Asset;
  /** Number of transactions required to transfer the asset */
  txsRequired: number;
  /** Bridges that are used to transfer the asset */
  bridges?: BridgeType[];
}

export interface AssetRecommendation {
  /** Asset that is recommended */
  asset?: Asset;
  /** Reason for recommending the asset */
  reason?: Reason;
}

export interface AutopilotMsg {
  action?: AutopilotAction;
  receiver?: string;
}

export interface AutopilotMsgWrapper {
  autpilotMsg?: AutopilotMsg;
}

/** A transfer facilitated by the Axelar bridge */
export interface AxelarTransfer {
  /** Canonical chain-id of the source chain of the bridge transaction */
  fromChainId?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  toChainId?: string;
  /** Axelar-name of the asset to bridge */
  asset?: string;
  /** Whether to unwrap the asset at the destination chain (from ERC-20 to native) */
  shouldUnwrap?: boolean;
  /** Denom of the input asset */
  denomIn?: string;
  /** Denom of the output asset */
  denomOut?: string;
  /** Amount of the fee asset to be paid as the Axelar bridge fee. This is denominated in the fee asset. */
  feeAmount?: string;
  /** Amount of the fee asset to be paid as the Axelar bridge fee, converted to USD value */
  usdFeeAmount?: string;
  feeAsset?: Asset;
  /** Whether the source and destination chains are both testnets */
  isTestnet?: boolean;
  /** A cross-chain transfer */
  ibcTransferToAxelar?: Transfer;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId?: BridgeType;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smartRelay?: boolean;
  /**
   * Deprecated, use from_chain_id instead. Name for source chain of the bridge transaction used on Axelar
   * @deprecated
   */
  fromChain?: string;
  /**
   * Deprecated, use to_chain_id instead. Name for destination chain of the bridge transaction used on Axelar
   * @deprecated
   */
  toChain?: string;
}

export interface AxelarTransferInfo {
  /** Link to the transaction on the Axelar Scan explorer */
  axelarScanLink?: string;
  /** Chain ID of the destination chain */
  toChainId: string;
  /** Chain ID of the source chain */
  fromChainId: string;
  /**
   * Axelar transfer state:
   * * `AXELAR_TRANSFER_UNKNOWN` - Unknown error
   * * `AXELAR_TRANSFER_PENDING_CONFIRMATION` - Axelar transfer is pending confirmation
   * * `AXELAR_TRANSFER_PENDING_RECEIPT` - Axelar transfer is pending receipt at destination
   * * `AXELAR_TRANSFER_SUCCESS` - Axelar transfer succeeded and assets have been received
   * * `AXELAR_TRANSFER_FAILURE` - Axelar transfer failed
   */
  state: AxelarTransferState;
  txs:
    | {
        contractCallWithTokenTxs?: ContractCallWithTokenTxs;
      }
    | SendTokenTxs;
  /**
   * Axelar transfer type:
   * * `AXELAR_TRANSFER_CONTRACT_CALL_WITH_TOKEN` - GMP contract call with token transfer type
   * * `AXELAR_TRANSFER_SEND_TOKEN` - Send token transfer type
   */
  type?: AxelarTransferType;
}

export interface AxelarTransferWrapper {
  /** A transfer facilitated by the Axelar bridge */
  axelarTransfer?: AxelarTransfer;
}

/** Details about the fee paid for Smart Relaying */
export interface SmartRelayFeeQuote {
  /** The USDC fee amount */
  feeAmount?: string;
  /** Address of the relayer */
  relayerAddress?: string;
  /** Expiration time of the fee quote */
  expiration?: string;
  /** The fee asset denomination */
  feeDenom?: string;
  /** The address the fee should be sent to */
  feePaymentAddress?: string;
}

/** A transfer facilitated by the CCTP bridge */
export interface CCTPTransfer {
  /** Canonical chain-id of the source chain of the bridge transaction */
  fromChainId?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  toChainId?: string;
  /** Name of the asset to bridge. It will be the erc-20 contract address for EVM chains and `uusdc` for Noble. */
  burnToken?: string;
  /** Denom of the input asset */
  denomIn?: string;
  /** Denom of the output asset */
  denomOut?: string;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId?: BridgeType;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smartRelay?: boolean;
  smartRelayFeeQuote?: SmartRelayFeeQuote;
}

export interface CCTPTransferInfo {
  /** Chain ID of the destination chain */
  toChainId?: string;
  /** Chain ID of the source chain */
  fromChainId?: string;
  /**
   * CCTP transfer state:
   * * `CCTP_TRANSFER_UNKNOWN` - Unknown error
   * * `CCTP_TRANSFER_SENT` - The burn transaction on the source chain has executed
   * * `CCTP_TRANSFER_PENDING_CONFIRMATION` - CCTP transfer is pending confirmation by the cctp attestation api
   * * `CCTP_TRANSFER_CONFIRMED` - CCTP transfer has been confirmed by the cctp attestation api
   * * `CCTP_TRANSFER_RECEIVED` - CCTP transfer has been received at the destination chain
   */
  state?: CCTPTransferState;
  txs?: CCTPTransferTxs;
}

export interface CCTPTransferTxs {
  sendTx?: ChainTransaction;
  receiveTx?: ChainTransaction;
}

export interface CCTPTransferWrapper {
  /** A transfer facilitated by the CCTP bridge */
  cctpTransfer?: CCTPTransfer;
}

/** A transfer facilitated by the Stargate bridge */
export interface StargateTransfer {
  /** Canonical chain-id of the source chain of the bridge transaction */
  fromChainId?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  toChainId?: string;
  /** Denom of the input asset */
  denomIn?: string;
  /** Denom of the output asset */
  denomOut?: string;
  poolAddress?: string;
  destinationEndpointId?: number;
  oftFeeAsset?: Asset;
  oftFeeAmount?: string;
  oftFeeAmountUsd?: string;
  messagingFeeAsset?: Asset;
  messagingFeeAmount?: string;
  messagingFeeAmountUsd?: string;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId?: BridgeType;
}

export interface StargateTransferTxs {
  sendTx?: ChainTransaction;
  receiveTx?: ChainTransaction;
  errorTx?: ChainTransaction;
}

export interface StargateTransferInfo {
  /** Chain ID of the source chain */
  fromChainId?: string;
  /** Chain ID of the destination chain */
  toChainId?: string;
  /**
   * Stargate transfer state:
   * * `STARGATE_TRANSFER_UNKNOWN` - Unknown error
   * * `STARGATE_TRANSFER_SENT` - The Stargate transfer transaction on the source chain has executed
   * * `STARGATE_TRANSFER_PENDING_CONFIRMATION` - Stargate transfer is pending confirmation
   * * `STARGATE_TRANSFER_CONFIRMED` - Stargate transfer has been confirmed
   * * `STARGATE_TRANSFER_RECEIVED` - Stargate transfer has been received at the destination chain
   * * `STARGATE_TRANSFER_FAILED` - Stargate transfer failed
   */
  state?: StargateTransferState;
  txs?: StargateTransferTxs;
}

export interface StargateTransferWrapper {
  /** A transfer facilitated by the Stargate bridge */
  stargateTransfer?: StargateTransfer;
}

/** A transfer facilitated by GoFast */
export interface GoFastTransfer {
  /** Canonical chain-id of the source chain of the bridge transaction */
  fromChainId?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  toChainId?: string;
  /** Go fast Fee */
  fee?: GoFastFee;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId?: BridgeType;
  /** Denom of the input asset */
  denomIn?: string;
  /** Denom of the output asset */
  denomOut?: string;
  /** Source domain ID of the transfer */
  sourceDomain?: string;
  /** Destination domain ID of the transfer */
  destinationDomain?: string;
}

export interface GoFastTransferTxs {
  orderSubmittedTx?: ChainTransaction;
  orderFilledTx?: ChainTransaction;
  orderRefundedTx?: ChainTransaction;
  orderTimeoutTx?: ChainTransaction;
}

export interface GoFastTransferInfo {
  /** Chain Id of the source chain */
  fromChainId: string;
  /** Chain Id of the destination chain */
  toChainId: string;
  /**
   * GoFast transfer state:
   * * `GO_FAST_TRANSFER_UNKNOWN` - Unknown state
   * * `GO_FAST_TRANSFER_SENT` - Order submitted on source chain
   * * `GO_FAST_POST_ACTION_FAILED` - Order filled, but subsequent action (e.g., swap) failed
   * * `GO_FAST_TRANSFER_TIMEOUT` - Order timed out
   * * `GO_FAST_TRANSFER_FILLED` - Order filled on destination chain
   * * `GO_FAST_TRANSFER_REFUNDED` - Order refunded
   */
  state: GoFastTransferState;
  txs: GoFastTransferTxs;
  /** Error message if the transfer failed post-fill */
  errorMessage?: string;
}

export interface GoFastTransferWrapper {
  /** A transfer facilitated by GoFast */
  goFastTransfer?: GoFastTransfer;
}

export interface BalanceRequestChainEntry {
  /** Address of the wallet that the balance is requested for */
  address?: string;
  /** Denoms of the assets to get the balance for */
  denoms?: string[];
}

export interface BalanceResponseDenomEntry {
  amount: string;
  /** @format int32 */
  decimals?: number;
  formattedAmount: string;
  price?: string;
  valueUsd?: string;
  error?: ApiError;
}

export interface BalanceResponseChainEntry {
  denoms?: Record<string, BalanceResponseDenomEntry>;
}

export interface BankSend {
  /** Chain-id of the chain that the transaction is intended for */
  chainId?: string;
  /** Denom of the asset to send */
  denom?: string;
}

export interface BankSendWrapper {
  bankSend?: BankSend;
}

export interface Bridge {
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  id?: BridgeType;
  /** Name of the bridge */
  name?: string;
  /** URI pointing to an image of the logo of the bridge */
  logoUri?: string;
}

export interface Chain {
  /** Name of the chain */
  chainName: string;
  /** Chain-id of the chain */
  chainId: string;
  /** Whether the PFM module is enabled on the chain */
  pfmEnabled: boolean;
  /** Supported cosmos modules */
  cosmosModuleSupport: CosmosModuleSupport;
  /** Whether the chain supports IBC memos */
  supportsMemo: boolean;
  /** chain logo URI */
  logoUri?: string;
  /** Bech32 prefix of the chain */
  bech32Prefix: string;
  /** Fee assets of the chain */
  feeAssets: FeeAsset[];
  /** Type of chain, e.g. "cosmos" or "evm" */
  chainType: ChainType;
  /** IBC capabilities of the chain */
  ibcCapabilities: IbcCapabilities;
  /** Whether the chain is a testnet */
  isTestnet: boolean;
  /** User friendly name of the chain */
  prettyName: string;
}

export interface ChainAffiliates {
  /** An array of affiliates that receives fees from a swap */
  affiliates?: Affiliate[];
}

export interface ContractCallWithTokenError {
  /** Error message */
  message?: string;
  /**
   * ContractCallWithToken errors:
   * * `CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR` - Error occurred during the execute transaction
   */
  type?: ContractCallWithTokenErrorType;
}

export interface ContractCallWithTokenTxs {
  approveTx?: ChainTransaction;
  confirmTx?: ChainTransaction;
  error?: ContractCallWithTokenError;
  executeTx?: ChainTransaction;
  gasPaidTx?: ChainTransaction;
  sendTx?: ChainTransaction;
}

export interface CosmWasmContractMsg {
  /** Address of the contract to execute the message on */
  contractAddress?: string;
  /** JSON string of the message */
  msg?: string;
}

export interface CosmWasmContractMsgWrapper {
  wasmMsg?: CosmWasmContractMsg;
}

/** An ERC20 token contract approval */
export interface Erc20Approval {
  /** Amount of the approval */
  amount: string;
  /** Address of the spender */
  spender: string;
  /** Address of the ERC20 token contract */
  tokenContract: string;
}

export interface ErrorDetail {
  /**
   * Error detail:
   * * `LOW_INFO_ERROR` - Not enough asset pricing information to determine the price safety of the route.
   * * `BAD_PRICE_ERROR` - The execution price of the route deviates significantly from the current market price.
   * * `HIGH_LOSS_ERROR` - The route would result in a USD loss exceeding the configured threshold and has been blocked.
   */
  reason?: "LOW_INFO_ERROR" | "BAD_PRICE_ERROR" | "HIGH_LOSS_ERROR";
}

export interface Error {
  /** Error code */
  code?: GRPCStatusCode;
  /** Additional error details */
  details?: ErrorDetail[];
  /** Error message */
  message?: string;
}

/** A message in a cosmos transaction */
export interface CosmosMsg {
  /** JSON string of the message */
  msg?: string;
  /** TypeUrl of the message */
  msgTypeUrl?: string;
}

/** A transaction on a Cosmos chain */
export interface CosmosTx {
  /** Chain-id of the chain that the transaction is intended for */
  chainId: string;
  /** Path of chain-ids that the message is intended to interact with */
  path?: string[];
  /** The address of the wallet that will sign this transaction */
  signerAddress?: string;
  /** The messages that should be included in the transaction. The ordering must be adhered to. */
  msgs?: CosmosMsg[];
}

export interface CosmosTxWrapper {
  /** A transaction on a Cosmos chain */
  cosmosTx: CosmosTx;
}

/** A swap on an EVM chain */
export interface EvmSwap {
  /** Address of the input token. Empty string if native token. */
  inputToken?: string;
  /** Amount of the input token */
  amountIn?: string;
  /** Calldata for the swap */
  swapCalldata?: string;
  /** Amount of the output token */
  amountOut?: string;
  /** Chain-id for the swap */
  fromChainId?: string;
  /** Denom of the input asset */
  denomIn?: string;
  /** Denom of the output asset */
  denomOut?: string;
  /** Venues used for the swap */
  swapVenues?: SwapVenue[];
}

export interface EvmSwapWrapper {
  /** A swap on an EVM chain */
  evmSwap?: EvmSwap;
}

/** A transaction on an EVM chain */
export interface EvmTx {
  /** Chain-id of the chain that the transaction is intended for */
  chainId: string;
  /** Data of the transaction */
  data?: string;
  /** ERC20 approvals required for the transaction */
  requiredErc20Approvals?: Erc20Approval[];
  /** The address of the wallet that will sign this transaction */
  signerAddress?: string;
  /** Address of the recipient of the transaction */
  to?: string;
  /** Amount of the transaction */
  value?: string;
}

export interface EvmTxWrapper {
  /** A transaction on an EVM chain */
  evmTx: EvmTx;
}

/** A transaction on an SVM chain */
export interface SvmTx {
  /** Chain-id of the chain that the transaction is intended for */
  chainId: string;
  /** The address of the wallet that will sign this transaction */
  signerAddress?: string;
  /** Base64 encoded unsigned or partially signed transaction */
  tx?: string;
}

export interface SvmTxWrapper {
  /** A transaction on an SVM chain */
  svmTx: SvmTx;
}

/** Asset used to pay gas fees and the recommended price tiers. Assets and gas price recommendations are sourced from the [keplr chain registry](https://github.com/chainapsis/keplr-chain-registry) */
export interface FeeAsset {
  /** Asset denom */
  denom: string;
  /** Gas price tiers */
  gasPrice?: {
    /** Average gas price */
    average?: string;
    /** High gas price */
    high?: string;
    /** Low gas price */
    low?: string;
  };
}

/** Go fast Fee */
export interface GoFastFee {
  feeAsset: Asset;
  bpsFee?: string;
  bpsFeeAmount?: string;
  bpsFeeUsd?: string;
  sourceChainFeeAmount?: string;
  sourceChainFeeUsd?: string;
  destinationChainFeeAmount?: string;
  destinationChainFeeUsd?: string;
}

/** grpc status codes as defined [here](https://grpc.github.io/grpc/core/md_doc_statuscodes.html) */
export type GRPCStatusCode = number;

/** A transfer facilitated by the Hyperlane bridge */
export interface HyperlaneTransfer {
  /** Canonical chain-id of the source chain of the bridge transaction */
  fromChainId?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  toChainId?: string;
  /** Denom of the input asset */
  denomIn?: string;
  /** Denom of the output asset */
  denomOut?: string;
  /** Contract address of the hyperlane warp route contract that initiates the transfer */
  hyperlaneContractAddress?: string;
  /** Amount of the fee asset to be paid as the Hyperlane bridge fee. This is denominated in the fee asset. */
  feeAmount?: string;
  /** Amount of the fee asset to be paid as the Hyperlane bridge fee, converted to USD value */
  usdFeeAmount?: string;
  feeAsset?: Asset;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId?: BridgeType;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smartRelay?: boolean;
}

export interface HyperlaneTransferInfo {
  /** Chain ID of the source chain */
  fromChainId: string;
  /** Chain ID of the destination chain */
  toChainId: string;
  /**
   * Hyperlane transfer state:
   * * `HYPERLANE_TRANSFER_UNKNOWN` - Unknown error
   * * `HYPERLANE_TRANSFER_SENT` - The Hyperlane transfer transaction on the source chain has executed
   * * `HYPERLANE_TRANSFER_FAILED` - The Hyperlane transfer failed
   * * `HYPERLANE_TRANSFER_RECEIVED` - The Hyperlane transfer has been received at the destination chain
   */
  state: HyperlaneTransferState;
  txs: HyperlaneTransferTransactions;
}

export interface HyperlaneTransferTransactions {
  sendTx?: ChainTransaction;
  receiveTx?: ChainTransaction;
}

export interface HyperlaneTransferWrapper {
  /** A transfer facilitated by the Hyperlane bridge */
  hyperlaneTransfer?: HyperlaneTransfer;
}

export interface IBCTransferInfo {
  /** Chain ID of the destination chain */
  toChainId: string;
  packetTxs: Packet;
  /** Chain ID of the source chain */
  fromChainId: string;
  /**
   * Transfer state:
   * * `TRANSFER_UNKNOWN` - Transfer state is not known.
   * * `TRANSFER_PENDING` - The send packet for the transfer has been committed and the transfer is pending.
   * * `TRANSFER_RECEIVED` - The transfer packet has been received by the destination chain. It can still fail and revert if it is part of a multi-hop PFM transfer.
   * * `TRANSFER_SUCCESS` - The transfer has been successfully completed and will not revert.
   * * `TRANSFER_FAILURE`- The transfer has failed.
   */
  state: TransferState;
}

export type Msg = MultiChainMsgWrapper | EvmTxWrapper | SvmTxWrapper;

export type Tx = (CosmosTxWrapper | EvmTxWrapper | SvmTxWrapper) & {
  /** Array of indices of the operations that this transaction executes */
  operationsIndices?: number[];
};

/** A message that interacts with multiple chains */
export interface MultiChainMsg {
  /** Chain-id of the chain that the transaction containing the message is intended for */
  chainId?: string;
  /** JSON string of the message */
  msg?: string;
  /** TypeUrl of the message */
  msgTypeUrl?: string;
  /** Path of chain-ids that the message is intended to interact with */
  path?: string[];
}

export interface MultiChainMsgWrapper {
  /** A message that interacts with multiple chains */
  multiChainMsg?: MultiChainMsg;
}

export type Operation = (
  | TransferWrapper
  | SwapWrapper
  | AxelarTransferWrapper
  | BankSendWrapper
  | CCTPTransferWrapper
  | HyperlaneTransferWrapper
  | EvmSwapWrapper
  | OPInitTransferWrapper
  | GoFastTransferWrapper
  | StargateTransferWrapper
  | LayerZeroTransferWrapper
  | EurekaTransferWrapper
) & {
  /** Index of the tx returned from Msgs that executes this operation */
  txIndex: number;
  /** Amount of input asset to this operation */
  amountIn: string;
  /** Amount of output asset from this operation */
  amountOut: string;
};

export interface OptionalAsset {
  asset?: Asset;
  /** Whether the asset was found */
  assetFound?: boolean;
}

export interface LayerZeroTransferTransactions {
  sendTx?: ChainTransaction;
  receiveTx?: ChainTransaction;
  composeTx?: ChainTransaction;
  errorTx?: ChainTransaction;
}

export interface Packet {
  acknowledgeTx?: ChainTransaction;
  error?: PacketError;
  receiveTx?: ChainTransaction;
  sendTx?: ChainTransaction;
  timeoutTx?: ChainTransaction;
}

export interface PacketError {
  details?: AcknowledgementErrorDetails;
  /** Error message */
  message?: string;
  /**
   * Packet error type:
   * * `PACKET_ERROR_UNKNOWN` - Unknown error
   * * `PACKET_ERROR_ACKNOWLEDGEMENT` - Packet acknowledgement error
   * * `PACKET_ERROR_TIMEOUT` - Packet timed out
   */
  type?: PacketErrorType;
}

export interface ChainTransaction {
  /** Chain ID the packet event occurs on */
  chainId?: string;
  /** Link to the transaction on block explorer */
  explorerLink: string;
  /** Hash of the transaction the packet event occurred in */
  txHash?: string;
  /** RFC3339 formatted UTC timestamp of when the transaction landed on chain */
  onChainAt?: string;
}

export type PostHandler = CosmWasmContractMsgWrapper | AutopilotMsgWrapper;

export interface Route {
  /** Amount of source asset to be transferred or swapped */
  amountIn: string;
  /** Amount of destination asset out */
  amountOut: string;
  /** Chain-ids of all chains of the transfer or swap, in order of usage by operations in the route */
  chainIds: string[];
  /** All chain-ids that require an address to be provided for, in order of usage by operations in the route */
  requiredChainAddresses: string[];
  /** Chain-id of the destination asset */
  destAssetChainId: string;
  /** Denom of the destination asset */
  destAssetDenom: string;
  /** Whether this route performs a swap */
  doesSwap?: boolean;
  /** Amount of destination asset out, if a swap is performed */
  estimatedAmountOut: string;
  /** Array of operations required to perform the transfer or swap */
  operations: Operation[];
  /** Chain-id of the source asset */
  sourceAssetChainId: string;
  /** Denom of the source asset */
  sourceAssetDenom: string;
  /** Swap venue on which the swap is performed, if a swap is performed */
  swapVenues?: SwapVenue[];
  /** Number of transactions required to perform the transfer or swap */
  txsRequired: number;
  /** Amount of the source denom, converted to USD value */
  usdAmountIn?: string;
  /** Amount of the destination denom expected to be received, converted to USD value */
  usdAmountOut?: string;
  /** Price impact of the estimated swap, if present.  Measured in percentage e.g. "0.5" is .5% */
  swapPriceImpactPercent?: string;
  /** Indicates if the route is unsafe due to poor execution price or if safety cannot be determined due to lack of pricing information */
  warning?: {
    /**
     * Recommendation reason:
     * * `LOW_INFO_WARNING` - Not enough asset pricing information to determine the price safety of the route.
     * * `BAD_PRICE_WARNING` - The execution price of the route deviates significantly from the current market price.
     */
    type?: RoutePriceWarningType;
    /** Warning message */
    message?: string;
  };
  /** Indicates fees incurred in the execution of the transfer */
  estimatedFees?: Fee[];
  /** The estimated time in seconds for the route to execute */
  estimatedRouteDurationSeconds: number;
}

export interface SendTokenError {
  /** Error message */
  message?: string;
  /**
   * SendToken error types:
   * * `SEND_TOKEN_EXECUTION_ERROR` - Error occurred during the execute transaction
   */
  type?: SendTokenErrorType;
}

export interface SendTokenTxs {
  confirmTx?: ChainTransaction;
  error?: SendTokenError;
  executeTx?: ChainTransaction;
  sendTx?: ChainTransaction;
}

export interface StatusError {
  details?: TransactionExecutionErrorDetails;
  /** Error message */
  message?: string;
  /**
   * Packet error types:
   * * `STATUS_ERROR_UNKNOWN` - Unknown error
   * * `STATUS_ERROR_TRANSACTION_EXECUTION` - Error was encountered during transaction execution
   * * `STATUS_ERROR_INDEXING` - Error was encountered while indexing the transaction and packet data
   * * `STATUS_ERROR_TRANSFER` - The transfer failed to complete successfully
   */
  type?: StatusErrorType;
}

export type Swap = (SwapInWrapper | SwapOutWrapper | SmartSwapInWrapper) & {
  /** Estimated total affiliate fee generated by the swap */
  estimatedAffiliateFee?: string;
  /** Chain ID that the swap will be executed on (alias for chain_id) */
  fromChainId?: string;
  /** Chain ID that the swap will be executed on */
  chainId?: string;
  /** Input denom of the swap */
  denomIn?: string;
  /** Output denom of the swap */
  denomOut?: string;
  /** Swap venues that the swap will route through */
  swapVenues?: SwapVenue[];
};

/** Specification of a swap with an exact amount in */
export interface SwapExactCoinIn {
  /** Swap venue that this swap should execute on */
  swapVenue?: SwapVenue;
  /** Operations required to execute the swap */
  swapOperations?: SwapOperation[];
  /** Amount to swap in */
  swapAmountIn?: string;
  /** Price impact of the estimated swap, if present.  Measured in percentage e.g. "0.5" is .5% */
  priceImpactPercent?: string;
  /** The estimated amount out received from the swap */
  estimatedAmountOut?: string;
}

/** Specification of a swap with an exact amount out */
export interface SwapExactCoinOut {
  /** Swap venue that this swap should execute on */
  swapVenue?: SwapVenue;
  /** Operations required to execute the swap */
  swapOperations?: SwapOperation[];
  /** Amount to get out of the swap */
  swapAmountOut?: string;
  /** Price impact of the estimated swap, if present.  Measured in percentage e.g. "0.5" is .5% */
  priceImpactPercent?: string;
}

export interface SwapInWrapper {
  /** Specification of a swap with an exact amount in */
  swapIn?: SwapExactCoinIn;
}

/** Description of a single swap operation */
export interface SwapOperation {
  /** Input denom of the swap */
  denomIn?: string;
  /** Output denom of the swap */
  denomOut?: string;
  /** Identifier of the pool to use for the swap */
  pool?: string;
  /** Optional dditional metadata a swap adapter may require */
  interface?: string;
}

export interface SwapOutWrapper {
  /** Specification of a swap with an exact amount out */
  swapOut?: SwapExactCoinOut;
}

export interface SwapRoute {
  /** Amount to swap in */
  swapAmountIn?: string;
  /** Denom in of the swap */
  denomIn?: string;
  /** Operations required to execute the swap route */
  swapOperations?: SwapOperation[];
}

/** Specification of a smart swap in operation */
export interface SmartSwapExactCoinIn {
  /** Swap venue that this swap should execute on */
  swapVenue?: SwapVenue;
  /** Routes to execute the swap */
  swapRoutes?: SwapRoute[];
  /** The estimated amount out received from the swap */
  estimatedAmountOut?: string;
}

export interface SmartSwapOptions {
  /** Indicates whether the swap can be split into multiple swap routes */
  splitRoutes?: boolean;
  /** Indicates whether to include routes that swap on EVM chains */
  evmSwaps?: boolean;
}

export interface SmartSwapInWrapper {
  /** Specification of a smart swap in operation */
  smartSwapIn?: SmartSwapExactCoinIn;
}

/** A venue on which swaps can be exceuted */
export interface SwapVenue {
  /** Chain ID of the swap venue */
  chainId?: string;
  /** Name of the swap venue */
  name?: string;
  /** URI for the venue's logo */
  logoUri?: string;
}

export interface SwapWrapper {
  swap?: Swap;
}

export interface TransactionExecutionErrorDetails {
  /** Error code */
  code?: number;
  /** Error message */
  message?: string;
}

/** A transfer facilitated by the OP Init bridge */
export interface OPInitTransfer {
  /** Canonical chain-id of the source chain of the bridge transaction */
  fromChainId?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  toChainId?: string;
  /** Denom of the input asset */
  denomIn?: string;
  /** Denom of the output asset */
  denomOut?: string;
  /** Identifier used by the OPInit bridge to identify the L1-L2 pair the transfer occurs between */
  opInitBridgeId?: any;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId?: BridgeType;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smartRelay?: boolean;
}

export interface OPInitTransferWrapper {
  /** A transfer facilitated by the OP Init bridge */
  opInitTransfer?: OPInitTransfer;
}

export interface OPInitTransferInfo {
  /** Chain ID of the destination chain */
  toChainId: string;
  /** Chain ID of the source chain */
  fromChainId: string;
  /**
   * OPInit transfer state:
   * * `OPINIT_TRANSFER_UNKNOWN` - Unknown error
   * * `OPINIT_TRANSFER_SENT` - The deposit transaction on the source chain has executed
   * * `OPINIT_TRANSFER_RECEIVED` - OPInit transfer has been received at the destination chain
   */
  state: OPInitTransferState;
  txs: OPInitTransferTxs;
}

export interface OPInitTransferTxs {
  sendTx?: ChainTransaction;
  receiveTx?: ChainTransaction;
}

/** A cross-chain transfer */
export interface Transfer {
  /** Port to use to initiate the transfer */
  port?: string;
  /** Channel to use to initiate the transfer */
  channel?: string;
  /** Chain-id on which the transfer is initiated */
  fromChainId?: string;
  /** Chain-id on which the transfer is received */
  toChainId?: string;
  /** Whether pfm is enabled on the chain where the transfer is initiated */
  pfmEnabled?: boolean;
  /** Whether the transfer chain supports a memo */
  supportsMemo?: boolean;
  /** Denom of the input asset of the transfer */
  denomIn?: string;
  /** Denom of the output asset of the transfer */
  denomOut?: string;
  /** Amount of the fee asset to be paid as the transfer fee if applicable. */
  feeAmount?: string;
  /** Amount of the fee asset to be paid as the transfer fee if applicable, converted to USD value */
  usdFeeAmount?: string;
  /** Asset to be paid as the transfer fee if applicable. */
  feeAsset?: Asset;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId?: BridgeType;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smartRelay?: boolean;
  /** Address of the entry contract on the destination chain */
  toChainEntryContractAddress?: string;
  /** Address of the callback contract on the destination chain */
  toChainCallbackContractAddress?: string;
  /**
   * Deprecated, use denom_out instead. Denom of the destination asset of the transfer
   * @deprecated
   */
  destDenom?: string;
}

export interface TransferEvent {
  ibcTransfer?: IBCTransferInfo;
  axelarTransfer?: AxelarTransferInfo;
  cctpTransfer?: CCTPTransferInfo;
  hyperlaneTransfer?: HyperlaneTransferInfo;
  opInitTransfer?: OPInitTransferInfo;
  stargateTransfer?: StargateTransferInfo;
  goFastTransfer?: GoFastTransferInfo;
  eurekaTransfer?: EurekaTransferInfo;
  layerZeroTransfer?: LayerZeroTransferInfo;
}

/** Indicates location and denom of transfer asset release. */
export interface TransferAssetRelease {
  /** The chain ID of the chain that the transfer asset is released on. */
  chainId?: string;
  /** The denom of the asset that is released. */
  denom?: string;
  /** The amount of the asset that is released. */
  amount?: string;
  /** Indicates whether assets have been released and are accessible. The assets may still be in transit. */
  released?: boolean;
}

export interface TransferStatus {
  /**
   * Transaction state:
   * * `STATE_SUBMITTED` - The initial transaction has been submitted to Skip Go API but not observed on chain yet
   * * `STATE_PENDING` - The initial transaction has been observed on chain, and there are still pending actions
   * * `STATE_COMPLETED_SUCCESS` - The route has completed successfully and the user has their tokens on the destination. (indicated by `transfer_asset_release`)
   * * `STATE_COMPLETED_ERROR` - The route errored somewhere and the user has their tokens unlocked in one of their wallets. Their tokens are either on the source chain, an intermediate chain, or the destination chain but as the wrong asset.
   * (Again, `transfer_asset_release` indicates where the tokens are)
   * * `STATE_ABANDONED` - Tracking for the transaction has been abandoned. This happens if the cross-chain  sequence of actions stalls for more than 10 minutes or if the initial transaction does not get observed in a block for 5 minutes.
   * * `STATE_PENDING_ERROR` - The overall transaction will fail, pending error propagation
   */
  state?: TransactionState;
  /** Lists any IBC and Axelar transfers as they are seen. */
  transferSequence?: TransferEvent[];
  /** Indicates which entry in the `transfer_sequence` field that the transfer is blocked on. Will be null if there is no blocked transfer. */
  nextBlockingTransfer?: {
    /** The index of the entry in the `transfer_sequence` field that the transfer is blocked on. */
    transferSequenceIndex?: number;
  };
  /** Indicates location and denom of transfer asset release. */
  transferAssetRelease?: TransferAssetRelease;
  error?: StatusError;
}

export interface TransferWrapper {
  /** A cross-chain transfer */
  transfer?: Transfer;
}

/** An IBC Eureka transfer */
export interface EurekaTransfer {
  /** Port on the destination chain */
  destinationPort?: string;
  /** Client on the source chain */
  sourceClient?: string;
  /** Chain-id on which the transfer is initiated */
  fromChainId?: string;
  /** Chain-id on which the transfer is received */
  toChainId?: string;
  /** Whether pfm is enabled on the chain where the transfer is initiated */
  pfmEnabled?: boolean;
  /** Whether the transfer chain supports a memo */
  supportsMemo?: boolean;
  /** Denom of the input asset of the transfer */
  denomIn?: string;
  /** Denom of the output asset of the transfer */
  denomOut?: string;
  /** Address of the Eureka entry contract on the source chain */
  entryContractAddress?: string;
  /** Optional address of the Eureka callback adapter contract on the source chain */
  callbackAdapterContractAddress?: string;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId?: BridgeType;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smartRelay?: boolean;
  smartRelayFeeQuote?: SmartRelayFeeQuote;
  /** Optional address of the Eureka callback contract on the destination chain */
  toChainCallbackContractAddress?: string;
  /** Optional address of the Eureka entry contract on the destination chain */
  toChainEntryContractAddress?: string;
}

export interface EurekaTransferInfo {
  /** Chain ID of the source chain */
  fromChainId: string;
  /** Chain ID of the destination chain */
  toChainId: string;
  /**
   * Transfer state:
   * * `TRANSFER_UNKNOWN` - Transfer state is not known.
   * * `TRANSFER_PENDING` - The send packet for the transfer has been committed and the transfer is pending.
   * * `TRANSFER_RECEIVED` - The transfer packet has been received by the destination chain. It can still fail and revert if it is part of a multi-hop PFM transfer.
   * * `TRANSFER_SUCCESS` - The transfer has been successfully completed and will not revert.
   * * `TRANSFER_FAILURE`- The transfer has failed.
   */
  state: TransferState;
  packetTxs: Packet;
}

export interface EurekaTransferWrapper {
  /** An IBC Eureka transfer */
  eurekaTransfer?: EurekaTransfer;
}

/** A Layer Zero Transfer */
export interface LayerZeroTransfer {
  /** Chain-id on which the transfer is initiated */
  fromChainId: string;
  /** Chain-id on which the transfer is received */
  toChainId: string;
  /** Denom of the input asset of the transfer */
  denomIn: string;
  /** Denom of the output asset of the transfer */
  denomOut: string;
  sourceOftContractAddress: string;
  destinationEndpointId: number;
  messagingFeeAsset: Asset;
  messagingFeeAmount: string;
  messagingFeeAmountUsd: string;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId: BridgeType;
}

export interface LayerZeroTransferInfo {
  /** Chain ID of the source chain */
  fromChainId: string;
  /** Chain ID of the destination chain */
  toChainId: string;
  /**
   * LayerZero transfer state:
   * * `LAYER_ZERO_TRANSFER_UNKNOWN` - Unknown error
   * * `LAYER_ZERO_TRANSFER_SENT` - The transaction on the source chain has executed
   * * `LAYER_ZERO_TRANSFER_WAITING_FOR_COMPOSE` - The transfer has been delivered to the destination chain but there is an additional lz_compose transaction that still needs to be delivered before marking this transfer as LAYER_ZERO_TRANSFER_RECEIVED
   * * `LAYER_ZERO_TRANSFER_RECEIVED` - The transfer has been received at the destination chain
   * * `LAYER_ZERO_TRANSFER_FAILED` - The transfer has failed
   */
  state: LayerZeroTransferState;
  txs: LayerZeroTransferTransactions;
}

export interface LayerZeroTransferWrapper {
  /** A Layer Zero Transfer */
  layerZeroTransfer?: LayerZeroTransfer;
}

export interface RecommendationRequest {
  /** Denom of the source asset */
  sourceAssetDenom?: string;
  /** Chain-id of the source asset */
  sourceAssetChainId?: string;
  /** Chain-id of the recommended destination asset */
  destChainId?: string;
  /** Reason for recommendation (optional) */
  reason?: Reason;
}

export interface CosmosModuleSupport {
  /** Whether the authz module is supported */
  authz?: boolean;
  /** Whether the feegrant module is supported */
  feegrant?: boolean;
}

export interface IbcCapabilities {
  /** Whether the packet forwarding middleware module is supported */
  cosmosPfm?: boolean;
  /** Whether the ibc hooks module is supported */
  cosmosIbcHooks?: boolean;
  /** Whether the chain supports IBC memos */
  cosmosMemo?: boolean;
  /** Whether the autopilot module is supported */
  cosmosAutopilot?: boolean;
}

export interface Fee {
  /**
   * Fee type:
   * * SMART_RELAY - Fees for Smart relaying services.'
   */
  feeType?: FeeType;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `LAYER_ZERO` - Layerzero Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridgeId?: BridgeType;
  /** Amount of the fee asset to be paid */
  amount?: string;
  /** The value of the fee in USD */
  usdAmount?: string;
  originAsset: Asset;
  /** Chain ID of the chain where fees are collected */
  chainId?: string;
  /** The index of the transaction in the list of transactions required to execute the transfer where fees are paid */
  txIndex?: number;
  /** The index of the operation in the returned operations list which incurs the fee */
  operationIndex?: number;
  /** Indicates whether this fee is deducted from the transfer amount or charged additionally */
  feeBehavior?: FeeBehavior;
}

export interface BalancesRequest {
  chains?: Record<string, BalanceRequestChainEntry>;
}

export interface AssetsFromSourceRequest {
  /** Denom of the source asset */
  sourceAssetDenom: string;
  /** Chain-id of the source asset */
  sourceAssetChainId: string;
  /**
   * Whether to include recommendations requiring multiple transactions to reach the destination
   * @default false
   */
  allowMultiTx?: boolean;
  /** Optional reason for recommending assets */
  recommendationReason?: Reason;
  /**
   * Whether to include swap routes
   * @default false
   */
  includeSwaps?: boolean;
  /** Swap venues to consider if including swap routes */
  swapVenues?: SwapVenue[];
  /**
   * Whether to only return native assets
   * @default false
   */
  nativeOnly?: boolean;
  /** Optional grouping key for results */
  groupBy?: string;
  /**
   * Whether to include CW20 tokens
   * @default false
   */
  includeCw20Assets?: boolean;
}

export interface RouteRequest {
  /** Denom of the source asset */
  sourceAssetDenom?: string;
  /** Chain-id of the source asset */
  sourceAssetChainId?: string;
  /** Denom of the destination asset */
  destAssetDenom?: string;
  /** Chain-id of the destination asset */
  destAssetChainId?: string;
  /** Amount of source asset to be transferred or swapped. Only one of amount_in and amount_out should be provided. */
  amountIn?: string;
  /** Amount of destination asset to receive. Only one of amount_in and amount_out should be provided. If amount_out is provided for a swap, the route will be computed to give exactly amount_out. */
  amountOut?: string;
  /** Cumulative fee to be distributed to affiliates, in bps (optional) */
  cumulativeAffiliateFeeBps?: string;
  /** Swap venues to consider, if provided (optional) */
  swapVenues?: SwapVenue[];
  /** Toggles whether the api should return routes that fail price safety checks. */
  allowUnsafe?: boolean;
  /** Array of experimental features to enable */
  experimentalFeatures?: string[];
  /**
   * Whether to allow route responses requiring multiple
   * transactions
   */
  allowMultiTx?: boolean;
  /** Array of bridges to use */
  bridges?: BridgeType[];
  /** Indicates whether this transfer route should be relayed via Skip's Smart Relay service - true by default. */
  smartRelay?: boolean;
  smartSwapOptions?: SmartSwapOptions;
  /** Whether to allow swaps in the route */
  allowSwaps?: boolean;
  /** Whether to enable Go Fast routes */
  goFast?: boolean;
}

export interface MsgsRequest {
  /** Denom of the source asset */
  sourceAssetDenom?: string;
  /** Chain-id of the source asset */
  sourceAssetChainId?: string;
  /** Denom of the destination asset */
  destAssetDenom?: string;
  /** Chain-id of the destination asset */
  destAssetChainId?: string;
  /** Amount of source asset to be transferred or swapped */
  amountIn?: string;
  /** Amount of destination asset out */
  amountOut?: string;
  /** Array of receipient and/or sender address for each chain in the path, corresponding to the required_chain_addresses array returned from a route request */
  addressList?: string[];
  /** Array of operations required to perform the transfer or swap */
  operations?: Operation[];
  estimatedAmountOut?: string;
  /** Percent tolerance for slippage on swap, if a swap is performed */
  slippageTolerancePercent?: string;
  /** Map of chain-ids to arrays of affiliates. The API expects all chains to have the same cumulative affiliate fee bps for each chain specified. If any of the provided affiliate arrays does not have the same cumulative fee, the API will return an error. */
  chainIdsToAffiliates?: Record<string, ChainAffiliates>;
  postRouteHandler?: PostHandler;
  /** Number of seconds for the IBC transfer timeout, defaults to 5 minutes */
  timeoutSeconds?: string;
  /**
   * Whether to enable gas warnings for intermediate and destination chains
   * @default false
   */
  enableGasWarnings?: boolean;
  /**
   * Alternative address to use for paying for fees, currently only for SVM source CCTP transfers, in b58 format.
   * @default false
   */
  feePayerAddress?: string;
}

export interface MsgsDirectRequest {
  /** Denom of the source asset */
  sourceAssetDenom?: string;
  /** Chain-id of the source asset */
  sourceAssetChainId?: string;
  /** Denom of the destination asset */
  destAssetDenom?: string;
  /** Chain-id of the destination asset */
  destAssetChainId?: string;
  /** Amount of source asset to be transferred or swapped. If this is a swap, only one of amount_in and amount_out should be provided. */
  amountIn?: string;
  /** Amount of destination asset out. If this is a swap, only one of amount_in and amount_out should be provided. If amount_out is provided for a swap, the route will be computed to give exactly amount_out. */
  amountOut?: string;
  /** Map of chain-ids to receipient and/or sender address for each chain in the path. Since the path is not known to the caller beforehand, the caller should attempt to provide addresses for all chains in the path, and the API will return an error if the path cannot be constructed. */
  chainIdsToAddresses?: Record<string, string>;
  /** Swap venues to consider, if provided (optional) */
  swapVenues?: SwapVenue[];
  /** Percent tolerance for slippage on swap, if a swap is performed */
  slippageTolerancePercent?: string;
  /** Map of chain-ids to arrays of affiliates. Since cumulative_affiliate_fee_bps must be provided to retrieve a route, and the swap chain is not known at this time, all chains must have the same cumulative_affiliate_fee_bps otherwise the API will return an error. */
  chainIdsToAffiliates?: Record<string, ChainAffiliates>;
  postRouteHandler?: PostHandler;
  /** Number of seconds for the IBC transfer timeout, defaults to 5 minutes */
  timeoutSeconds?: string;
  /** Toggles whether the api should return routes that fail price safety checks. */
  allowUnsafe?: boolean;
  /** Array of experimental features to enable */
  experimentalFeatures?: string[];
  /**
   * Whether to allow route responses requiring multiple
   * transactions
   */
  allowMultiTx?: boolean;
  /** Array of bridges to use */
  bridges?: BridgeType[];
  /** Indicates whether this transfer route should be relayed via Skip's Smart Relay service */
  smartRelay?: boolean;
  smartSwapOptions?: SmartSwapOptions;
  /** Whether to allow swaps in the route */
  allowSwaps?: boolean;
  /**
   * Whether to enable gas warnings for intermediate and destination chains
   * @default false
   */
  enableGasWarnings?: boolean;
  /** Whether to enable Go Fast routes */
  goFast?: boolean;
  /**
   * Alternative address to use for paying for fees, currently only for SVM source CCTP transfers, in b58 format.
   * @default false
   */
  feePayerAddress?: string;
}

export interface AssetRecommendationsRequest {
  /** Array where each entry corresponds to a distinct asset recommendation request. */
  requests?: RecommendationRequest[];
}

export interface SubmitTxRequest {
  /** Signed base64 encoded transaction */
  tx?: string;
  /** Chain ID of the transaction */
  chainId?: string;
}

export interface TrackTxRequest {
  /** Hex encoded hash of the transaction to track */
  txHash: string;
  /** Chain ID of the transaction */
  chainId: string;
}

export interface TrackTxResponse {
  /** Hash of the transaction */
  txHash: string;
  /** Link to the transaction on the relevant block explorer */
  explorerLink: string;
}

export interface StatusTxResponse {
  /** Transfer status for all transfers initiated by the transaction in the order they were initiated. */
  transfers?: TransferStatus[];
  /** The overall state reflecting the end-to-end status of all transfers initiated by the original transaction. */
  state: TransactionState;
  /** Details about the next transfer in the sequence that is preventing further progress, if any. */
  nextBlockingTransfer?: {
    transferSequenceIndex?: number;
  };
  /** Indicates location and denom of transfer asset release. */
  transferAssetRelease?: TransferAssetRelease;
  /** Details about any error encountered during the transaction or its subsequent transfers. */
  error?: StatusError;
  /**
   * **DEPRECATED.** This field provides a flat list of all transfer events. For a more structured and detailed status of each transfer leg, including its individual events, please use the 'transfers' array instead. This field may be removed in a future version.
   * @deprecated
   */
  transferSequence: TransferEvent[];
  /**
   * A high-level status indicator for the transaction's completion state.
   * @example "STATE_COMPLETED"
   */
  status?: string;
}

export interface IbcOriginAssetsRequest {
  /** Array of assets to get origin assets for */
  assets?: {
    /** Denom of the asset */
    denom?: string;
    /** Chain-id of the asset */
    chainId?: string;
  }[];
}

export interface AssetsBetweenChainsRequest {
  /** Chain-id of the source chain */
  sourceChainId?: string;
  /** Chain-id of the destination chain */
  destChainId?: string;
  /**
   * Whether to include assets without metadata (symbol, name, logo_uri, etc.)
   * @default false
   */
  includeNoMetadataAssets?: boolean;
  /**
   * Whether to include CW20 tokens
   * @default false
   */
  includeCw20Assets?: boolean;
  /**
   * Whether to include EVM tokens
   * @default false
   */
  includeEvmAssets?: boolean;
  /**
   * Whether to include recommendations requiring multiple transactions to reach the destination
   * @default false
   */
  allowMultiTx?: boolean;
}

export interface ChainsRequest {
  /** Chain IDs to limit the response to, defaults to all chains if not provided */
  chainIds?: string[];
  /**
   * Whether to include EVM chains in the response
   * @example false
   */
  includeEvm?: boolean;
  /** Whether to include SVM chains in the response */
  includeSvm?: boolean;
  /**
   * Whether to display only testnets in the response
   * @example false
   */
  onlyTestnets?: boolean;
}

export interface ChainsResponse {
  /** Array of supported chain-ids */
  chains?: Chain[];
}

export interface BalancesResponse {
  chains?: Record<string, BalanceResponseChainEntry>;
}

export interface BridgesResponse {
  /** Array of supported bridges */
  bridges?: Bridge[];
}

export interface VenuesRequest {
  /**
   * Whether to display only venues from testnets in the response
   * @example false
   */
  onlyTestnets?: boolean;
}

export interface VenuesResponse {
  /** Array of supported swap venues */
  venues?: SwapVenue[];
}

export interface AssetsRequest {
  /** Chain IDs to limit the response to, defaults to all chains if not provided */
  chainIds?: string[];
  /** Whether to restrict assets to those native to their chain */
  nativeOnly?: boolean;
  /** Whether to include assets without metadata (symbol, name, logo_uri, etc.) */
  includeNoMetadataAssets?: boolean;
  /** Whether to include CW20 tokens */
  includeCw20Assets?: boolean;
  /** Whether to include EVM tokens */
  includeEvmAssets?: boolean;
  /** Whether to include SVM tokens */
  includeSvmAssets?: boolean;
  /**
   * Whether to display only assets from testnets in the response
   * @example false
   */
  onlyTestnets?: boolean;
}

export interface AssetsResponse {
  /** Map of chain-ids to array of assets supported on the chain */
  chainToAssetsMap?: Record<
    string,
    {
      assets?: Asset[];
    }
  >;
}

export interface AssetsFromSourceResponse {
  /** Array of assets that are reachable from the specified source asset */
  destAssets?: Record<
    string,
    {
      assets?: Asset[];
    }
  >;
}

export type RouteResponse = Route;

export interface MsgsResponse {
  msgs?: Msg[];
  txs?: Tx[];
  /** Minimum possible output after all operations, including fees and slippage */
  minAmountOut?: string;
  /** Indicates fees incurred in the execution of the transfer */
  estimatedFees?: Fee[];
}

export interface MsgsDirectResponse {
  msgs?: Msg[];
  txs?: Tx[];
  /** Minimum possible output after all operations, including fees and slippage */
  minAmountOut?: string;
  route?: Route;
}

export interface AssetRecommendationsResponse {
  /** Array of recommendations for each entry in the `request` field. */
  recommendationEntries?: {
    recommendations?: AssetRecommendation[];
    error?: ApiError;
  }[];
}

export interface SubmitResponse {
  /** Hash of the transaction */
  txHash?: string;
  /** Link to the transaction on the relevant block explorer */
  explorerLink?: string;
}

export type TrackResponse = TrackTxResponse;

export interface StatusRequest {
  /**
   * Hex encoded hash of the transaction to query for
   * @example "EEC65138E6A7BDD047ED0D4BBA249A754F0BBBC7AA976568C4F35A32CD7FB8EB"
   */
  txHash: string;
  /**
   * Chain ID of the transaction
   * @example "cosmoshub-4"
   */
  chainId: string;
}

export type StatusResponse = StatusTxResponse;

export interface IbcOriginAssetsResponse {
  originAssets?: OptionalAsset[];
}

export interface FungibleAssetsBetweenChainsCreateResponse {
  assetsBetweenChains?: AssetBetweenChains[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.skip.build";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Skip Go API
 * @version 0.1.0
 * @baseUrl https://api.skip.build
 *
 * Simple APIs to build seamless cross-chain products that do more with fewer transactions. For devs with all levels of cross-chain experience.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Get all supported chains along with additional data useful for building applications + frontends that interface with them (e.g. logo URI, IBC capabilities, fee assets, bech32 prefix, etc...)
   *
   * @tags Info
   * @name Chains
   * @request GET:/v2/info/chains
   * @response `200` `ChainsResponse` Returns a list of supported chains with additional data
   */
  chains = (query: ChainsRequest, params: RequestParams = {}) =>
    this.request<ChainsResponse, any>({
      path: `/v2/info/chains`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * @description Get the balances of a given set of assets on a given chain and wallet address. Compatible with all Skip Go-supported assets, excluding CW20 assets, across SVM, EVM, and Cosmos chains.
   *
   * @tags Info
   * @name Balances
   * @request POST:/v2/info/balances
   * @response `200` `BalancesResponse` The balances of the assets
   */
  balances = (data: BalancesRequest, params: RequestParams = {}) =>
    this.request<BalancesResponse, any>({
      path: `/v2/info/balances`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Get all supported bridges
   *
   * @tags Info
   * @name Bridges
   * @request GET:/v2/info/bridges
   * @response `200` `BridgesResponse` A list of supported bridges
   */
  bridges = (params: RequestParams = {}) =>
    this.request<BridgesResponse, any>({
      path: `/v2/info/bridges`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * @description Get supported swap venues.
   *
   * @tags Fungible
   * @name Venues
   * @request GET:/v2/fungible/venues
   * @response `200` `VenuesResponse` A list of supported swap venues
   */
  venues = (query: VenuesRequest, params: RequestParams = {}) =>
    this.request<VenuesResponse, any>({
      path: `/v2/fungible/venues`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * @description Get supported assets. Optionally limit to assets on a given chain and/or native assets.
   *
   * @tags Fungible
   * @name Assets
   * @request GET:/v2/fungible/assets
   * @response `200` `AssetsResponse` A map of chain_id to assets
   * @response `400` `Error` The request was invalid, e.g. field is invalid
   * @response `500` `Error` Internal server error
   */
  assets = (query: AssetsRequest, params: RequestParams = {}) =>
    this.request<AssetsResponse, Error>({
      path: `/v2/fungible/assets`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * @description Get assets that can be reached from a source via transfers under different conditions (e.g. single vs multiple txs)
   *
   * @tags Fungible
   * @name AssetsFromSource
   * @request POST:/v2/fungible/assets_from_source
   * @response `200` `AssetsFromSourceResponse` Assets reachable from the specified source without swapping
   * @response `400` `Error` The request was invalid, e.g. field is invalid
   * @response `500` `Error` Internal server error
   */
  assetsFromSource = (
    data: AssetsFromSourceRequest,
    params: RequestParams = {},
  ) =>
    this.request<AssetsFromSourceResponse, Error>({
      path: `/v2/fungible/assets_from_source`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description This supports cross-chain actions among EVM chains, Cosmos chains, and between them. Returns the sequence of transfers and/or swaps to reach the given destination asset from the given source asset, along with estimated amount out. Commonly called before /msgs to generate route info and quote.
   *
   * @tags Fungible
   * @name Route
   * @request POST:/v2/fungible/route
   * @response `200` `RouteResponse` Swap and transfer route summary & quote
   * @response `400` `Error` The request was invalid, e.g. an invalid amount was passed or the swap size is unsafe
   * @response `500` `Error` Internal server error
   */
  route = (data: RouteRequest, params: RequestParams = {}) =>
    this.request<RouteResponse, Error>({
      path: `/v2/fungible/route`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description This supports cross-chain actions among EVM chains, Cosmos chains, and between them. Returns minimal number of messages required to execute a multi-chain swap or transfer. Input consists of the output of route with additional information required for message construction (e.g. destination addresses for each chain)
   *
   * @tags Fungible
   * @name Msgs
   * @request POST:/v2/fungible/msgs
   * @response `200` `MsgsResponse` The messages required to execute the swap, as JSON.
   * @response `400` `Error` The request was invalid, e.g. an invalid amount was passed.
   * @response `500` `Error` Internal server error
   */
  msgs = (data: MsgsRequest, params: RequestParams = {}) =>
    this.request<MsgsResponse, Error>({
      path: `/v2/fungible/msgs`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description This supports cross-chain actions among EVM chains, Cosmos chains, and between them. Returns minimal number of messages required to execute a multi-chain swap or transfer. This is a convenience endpoint that combines /route and /msgs into a single call.
   *
   * @tags Fungible
   * @name MsgsDirect
   * @request POST:/v2/fungible/msgs_direct
   * @response `200` `MsgsDirectResponse` The messages required to execute the swap, as JSON.
   * @response `400` `Error` The request was invalid, e.g. an invalid amount was passed or the swap size is unsafe
   * @response `500` `Error` Internal server error
   */
  msgsDirect = (data: MsgsDirectRequest, params: RequestParams = {}) =>
    this.request<MsgsDirectResponse, Error>({
      path: `/v2/fungible/msgs_direct`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Request asset recommendations for the given source assets on a given destination chain. The response includes recommended destination assets and recommendation reasons.
   *
   * @tags Fungible
   * @name AssetRecommendations
   * @request POST:/v2/fungible/recommend_assets
   * @response `200` `AssetRecommendationsResponse` Recommended destination assets and reasons
   * @response `400` `Error` The request was invalid, i.e. required fields are missing
   * @response `404` `Error` A recommendation or the specified token was not found
   * @response `500` `Error` Internal server error
   */
  assetRecommendations = (
    data: AssetRecommendationsRequest,
    params: RequestParams = {},
  ) =>
    this.request<AssetRecommendationsResponse, Error>({
      path: `/v2/fungible/recommend_assets`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Submit a signed base64 encoded transaction to be broadcast to the specified network. On successful submission, the status of the transaction and any subsequent IBC or Axelar transfers can be queried through the /status endpoint.
   *
   * @tags Transaction
   * @name Submit
   * @request POST:/v2/tx/submit
   * @response `200` `SubmitResponse` The hash of the transaction.
   * @response `400` `Error` The request was invalid, i.e. the submitted transaction was malformed or fails on execution.
   * @response `404` `Error` The specified chain is not supported.
   * @response `500` `Error` Internal server error
   */
  submit = (data: SubmitTxRequest, params: RequestParams = {}) =>
    this.request<SubmitResponse, Error>({
      path: `/v2/tx/submit`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Requests tracking of a transaction that has already landed on-chain but was not broadcast through the Skip Go API. The status of a tracked transaction and subsequent IBC or Axelar transfers if routing assets cross chain can be queried through the /status endpoint.
   *
   * @tags Transaction
   * @name Track
   * @request POST:/v2/tx/track
   * @response `200` `TrackResponse` The hash of the transaction and a link to its explorer page.
   * @response `400` `Error` The request was invalid, i.e. the transaction hash was malformed or the specified transaction did not execute successfully.
   * @response `404` `Error` The specified chain is not supported or the specified transaction was not found.
   * @response `500` `Error` Internal server error
   */
  track = (data: TrackTxRequest, params: RequestParams = {}) =>
    this.request<TrackResponse, Error>({
      path: `/v2/tx/track`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Get the status of the specified transaction and any subsequent IBC or Axelar transfers if routing assets cross chain. The transaction must have previously been submitted to either the /submit or /track endpoints.
   *
   * @tags Transaction
   * @name Status
   * @request GET:/v2/tx/status
   * @response `200` `StatusResponse` The status of the transaction and any subsequent ibc or Axelar transfers.
   * @response `404` `Error` The specified tx was not found.
   * @response `500` `Error` Internal server error
   */
  status = (query: StatusRequest, params: RequestParams = {}) =>
    this.request<StatusResponse, Error>({
      path: `/v2/tx/status`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });

  /**
   * @description Get origin assets from a given list of denoms and chain IDs.
   *
   * @tags Fungible
   * @name IbcOriginAssets
   * @request POST:/v2/fungible/ibc_origin_assets
   * @response `200` `IbcOriginAssetsResponse` The origin assets of the specified denoms and chain IDs.
   * @response `400` `Error` The request was invalid, i.e. required fields are missing
   * @response `500` `Error` Internal server error
   */
  ibcOriginAssets = (
    data: IbcOriginAssetsRequest,
    params: RequestParams = {},
  ) =>
    this.request<IbcOriginAssetsResponse, Error>({
      path: `/v2/fungible/ibc_origin_assets`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });

  /**
   * @description Given 2 chain IDs, returns a list of equivalent assets that can be transferred
   *
   * @tags Fungible
   * @name FungibleAssetsBetweenChainsCreate
   * @request POST:/v2/fungible/assets_between_chains
   * @response `200` `FungibleAssetsBetweenChainsCreateResponse` OK
   * @response `404` `Error` One of the chain IDs was not found
   * @response `500` `Error` Internal server error
   */
  fungibleAssetsBetweenChainsCreate = (
    data: AssetsBetweenChainsRequest,
    params: RequestParams = {},
  ) =>
    this.request<FungibleAssetsBetweenChainsCreateResponse, Error>({
      path: `/v2/fungible/assets_between_chains`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
