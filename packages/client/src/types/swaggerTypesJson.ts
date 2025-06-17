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

export interface AcknowledgementErrorDetailsJson {
  /** Error code */
  code?: number;
  /** Error message */
  message?: string;
}

/** An affiliate that receives fees from a swap */
export interface AffiliateJson {
  /** Address to which to pay the fee */
  address?: string;
  /** Bps fee to pay to the affiliate */
  basis_points_fee?: string;
}

export interface ApiErrorJson {
  /** Error message */
  message?: string;
}

export interface AssetJson {
  /** Chain-id of the asset */
  chain_id: string;
  /** Coingecko id of the asset */
  coingecko_id?: string | null;
  /** Number of decimals used for amounts of the asset */
  decimals?: number | null;
  /** Denom of the asset */
  denom: string;
  /** Description of the asset */
  description?: string | null;
  /** Indicates whether asset is a CW20 token */
  is_cw20: boolean;
  /** Indicates whether asset is an EVM token */
  is_evm: boolean;
  /** Indicates whether asset is an SVM token */
  is_svm: boolean;
  /** URI pointing to an image of the logo of the asset */
  logo_uri?: string | null;
  /** Name of the asset */
  name?: string | null;
  /** Chain-id of the origin of the asset. If this is an ibc denom, this is the chain-id of the asset that the ibc token represents */
  origin_chain_id: string;
  /** Denom of the origin of the asset. If this is an ibc denom, this is the original denom that the ibc token represents */
  origin_denom: string;
  /** Recommended symbol of the asset used to differentiate between bridged assets with the same symbol, e.g. USDC.axl for Axelar USDC and USDC.grv for Gravity USDC */
  recommended_symbol?: string | null;
  /** Symbol of the asset, e.g. ATOM for uatom */
  symbol?: string | null;
  /** Address of the contract for the asset, e.g. if it is a CW20 or ERC20 token */
  token_contract?: string | null;
  /** The forward slash delimited sequence of ibc ports and channels that can be traversed to unwind an ibc token to its origin asset. */
  trace: string;
}

export interface AssetBetweenChainsJson {
  asset_on_source?: AssetJson;
  asset_on_dest?: AssetJson;
  /** Number of transactions required to transfer the asset */
  txs_required: number;
  /** Bridges that are used to transfer the asset */
  bridges?: BridgeTypeJson[];
}

export interface AssetRecommendationJson {
  /** Asset that is recommended */
  asset?: AssetJson;
  /** Reason for recommending the asset */
  reason?: ReasonJson;
}

export enum AutopilotActionJson {
  LIQUID_STAKE = "LIQUID_STAKE",
  CLAIM = "CLAIM",
}

export interface AutopilotMsgJson {
  action?: AutopilotActionJson;
  receiver?: string;
}

export interface AutopilotMsgWrapperJson {
  autpilot_msg?: AutopilotMsgJson;
}

/** A transfer facilitated by the Axelar bridge */
export interface AxelarTransferJson {
  /** Axelar-name of the asset to bridge */
  asset?: string;
  /** Amount of the fee asset to be paid as the Axelar bridge fee. This is denominated in the fee asset. */
  fee_amount?: string;
  fee_asset?: AssetJson;
  /** Name for source chain of the bridge transaction used on Axelar */
  from_chain?: string;
  /** Canonical chain-id of the source chain of the bridge transaction */
  from_chain_id?: string;
  /** Whether the source and destination chains are both testnets */
  is_testnet?: boolean;
  /** Whether to unwrap the asset at the destination chain (from ERC-20 to native) */
  should_unwrap?: boolean;
  /** Name for destination chain of the bridge transaction used on Axelar */
  to_chain?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  to_chain_id?: string;
  /** Denom of the input asset */
  denom_in?: string;
  /** Denom of the output asset */
  denom_out?: string;
  /** Amount of the fee asset to be paid as the Axelar bridge fee, converted to USD value */
  usd_fee_amount?: string;
  /** A cross-chain transfer */
  ibc_transfer_to_axelar?: TransferJson;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id?: BridgeTypeJson;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smart_relay?: boolean;
}

export interface AxelarTransferInfoJson {
  /** Link to the transaction on the Axelar Scan explorer */
  axelar_scan_link?: string;
  /** Chain ID of the destination chain */
  to_chain_id: string;
  /** Chain ID of the source chain */
  from_chain_id: string;
  /**
   * Axelar transfer state:
   * * `AXELAR_TRANSFER_UNKNOWN` - Unknown error
   * * `AXELAR_TRANSFER_PENDING_CONFIRMATION` - Axelar transfer is pending confirmation
   * * `AXELAR_TRANSFER_PENDING_RECEIPT` - Axelar transfer is pending receipt at destination
   * * `AXELAR_TRANSFER_SUCCESS` - Axelar transfer succeeded and assets have been received
   * * `AXELAR_TRANSFER_FAILURE` - Axelar transfer failed
   */
  state: AxelarTransferStateJson;
  txs: ContractCallWithTokenTxsJson | SendTokenTxsJson;
  /**
   * Axelar transfer type:
   * * `AXELAR_TRANSFER_CONTRACT_CALL_WITH_TOKEN` - GMP contract call with token transfer type
   * * `AXELAR_TRANSFER_SEND_TOKEN` - Send token transfer type
   */
  type?: AxelarTransferTypeJson;
}

/**
 * Axelar transfer state:
 * * `AXELAR_TRANSFER_UNKNOWN` - Unknown error
 * * `AXELAR_TRANSFER_PENDING_CONFIRMATION` - Axelar transfer is pending confirmation
 * * `AXELAR_TRANSFER_PENDING_RECEIPT` - Axelar transfer is pending receipt at destination
 * * `AXELAR_TRANSFER_SUCCESS` - Axelar transfer succeeded and assets have been received
 * * `AXELAR_TRANSFER_FAILURE` - Axelar transfer failed
 */
export enum AxelarTransferStateJson {
  AXELAR_TRANSFER_UNKNOWN = "AXELAR_TRANSFER_UNKNOWN",
  AXELAR_TRANSFER_PENDING_CONFIRMATION = "AXELAR_TRANSFER_PENDING_CONFIRMATION",
  AXELAR_TRANSFER_PENDING_RECEIPT = "AXELAR_TRANSFER_PENDING_RECEIPT",
  AXELAR_TRANSFER_SUCCESS = "AXELAR_TRANSFER_SUCCESS",
  AXELAR_TRANSFER_FAILURE = "AXELAR_TRANSFER_FAILURE",
}

/**
 * Axelar transfer type:
 * * `AXELAR_TRANSFER_CONTRACT_CALL_WITH_TOKEN` - GMP contract call with token transfer type
 * * `AXELAR_TRANSFER_SEND_TOKEN` - Send token transfer type
 */
export enum AxelarTransferTypeJson {
  AXELAR_TRANSFER_CONTRACT_CALL_WITH_TOKEN = "AXELAR_TRANSFER_CONTRACT_CALL_WITH_TOKEN",
  AXELAR_TRANSFER_SEND_TOKEN = "AXELAR_TRANSFER_SEND_TOKEN",
}

export interface AxelarTransferWrapperJson {
  /** A transfer facilitated by the Axelar bridge */
  axelar_transfer?: AxelarTransferJson;
}

/** Details about the fee paid for Smart Relaying */
export interface SmartRelayFeeQuoteJson {
  /** The USDC fee amount */
  fee_amount?: string;
  /** The fee asset denomination */
  fee_denom?: string;
  /** The address the fee should be sent to */
  fee_payment_address?: string | null;
  /** Address of the relayer */
  relayer_address?: string;
  /** Expiration time of the fee quote */
  expiration?: string;
}

/** A transfer facilitated by the CCTP bridge */
export interface CCTPTransferJson {
  /** Canonical chain-id of the source chain of the bridge transaction */
  from_chain_id?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  to_chain_id?: string;
  /** Name of the asset to bridge. It will be the erc-20 contract address for EVM chains and `uusdc` for Noble. */
  burn_token?: string;
  /** Denom of the input asset */
  denom_in?: string;
  /** Denom of the output asset */
  denom_out?: string;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id?: BridgeTypeJson;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smart_relay?: boolean;
  smart_relay_fee_quote?: SmartRelayFeeQuoteJson | null;
}

export interface CCTPTransferInfoJson {
  /** Chain ID of the destination chain */
  to_chain_id?: string;
  /** Chain ID of the source chain */
  from_chain_id?: string;
  /**
   * CCTP transfer state:
   * * `CCTP_TRANSFER_UNKNOWN` - Unknown error
   * * `CCTP_TRANSFER_SENT` - The burn transaction on the source chain has executed
   * * `CCTP_TRANSFER_PENDING_CONFIRMATION` - CCTP transfer is pending confirmation by the cctp attestation api
   * * `CCTP_TRANSFER_CONFIRMED` - CCTP transfer has been confirmed by the cctp attestation api
   * * `CCTP_TRANSFER_RECEIVED` - CCTP transfer has been received at the destination chain
   */
  state?: CCTPTransferStateJson;
  txs?: CCTPTransferTxsJson;
}

export interface CCTPTransferTxsJson {
  send_tx?: ChainTransactionJson | null;
  receive_tx?: ChainTransactionJson | null;
}

/**
 * CCTP transfer state:
 * * `CCTP_TRANSFER_UNKNOWN` - Unknown error
 * * `CCTP_TRANSFER_SENT` - The burn transaction on the source chain has executed
 * * `CCTP_TRANSFER_PENDING_CONFIRMATION` - CCTP transfer is pending confirmation by the cctp attestation api
 * * `CCTP_TRANSFER_CONFIRMED` - CCTP transfer has been confirmed by the cctp attestation api
 * * `CCTP_TRANSFER_RECEIVED` - CCTP transfer has been received at the destination chain
 */
export enum CCTPTransferStateJson {
  CCTP_TRANSFER_UNKNOWN = "CCTP_TRANSFER_UNKNOWN",
  CCTP_TRANSFER_SENT = "CCTP_TRANSFER_SENT",
  CCTP_TRANSFER_PENDING_CONFIRMATION = "CCTP_TRANSFER_PENDING_CONFIRMATION",
  CCTP_TRANSFER_CONFIRMED = "CCTP_TRANSFER_CONFIRMED",
  CCTP_TRANSFER_RECEIVED = "CCTP_TRANSFER_RECEIVED",
}

export interface CCTPTransferWrapperJson {
  /** A transfer facilitated by the CCTP bridge */
  cctp_transfer?: CCTPTransferJson;
}

/** A transfer facilitated by the Stargate bridge */
export interface StargateTransferJson {
  /** Canonical chain-id of the source chain of the bridge transaction */
  from_chain_id?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  to_chain_id?: string;
  /** Denom of the input asset */
  denom_in?: string;
  /** Denom of the output asset */
  denom_out?: string;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id?: BridgeTypeJson;
  pool_address?: string;
  destination_endpoint_id?: number;
  oft_fee_asset?: AssetJson;
  oft_fee_amount?: string;
  oft_fee_amount_usd?: string;
  messaging_fee_asset?: AssetJson;
  messaging_fee_amount?: string;
  messaging_fee_amount_usd?: string;
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
export enum StargateTransferStateJson {
  STARGATE_TRANSFER_UNKNOWN = "STARGATE_TRANSFER_UNKNOWN",
  STARGATE_TRANSFER_SENT = "STARGATE_TRANSFER_SENT",
  STARGATE_TRANSFER_PENDING_CONFIRMATION = "STARGATE_TRANSFER_PENDING_CONFIRMATION",
  STARGATE_TRANSFER_CONFIRMED = "STARGATE_TRANSFER_CONFIRMED",
  STARGATE_TRANSFER_RECEIVED = "STARGATE_TRANSFER_RECEIVED",
  STARGATE_TRANSFER_FAILED = "STARGATE_TRANSFER_FAILED",
}

export interface StargateTransferTxsJson {
  send_tx?: ChainTransactionJson | null;
  receive_tx?: ChainTransactionJson | null;
  error_tx?: ChainTransactionJson | null;
}

export interface StargateTransferInfoJson {
  /** Chain ID of the source chain */
  from_chain_id?: string;
  /** Chain ID of the destination chain */
  to_chain_id?: string;
  /**
   * Stargate transfer state:
   * * `STARGATE_TRANSFER_UNKNOWN` - Unknown error
   * * `STARGATE_TRANSFER_SENT` - The Stargate transfer transaction on the source chain has executed
   * * `STARGATE_TRANSFER_PENDING_CONFIRMATION` - Stargate transfer is pending confirmation
   * * `STARGATE_TRANSFER_CONFIRMED` - Stargate transfer has been confirmed
   * * `STARGATE_TRANSFER_RECEIVED` - Stargate transfer has been received at the destination chain
   * * `STARGATE_TRANSFER_FAILED` - Stargate transfer failed
   */
  state?: StargateTransferStateJson;
  txs?: StargateTransferTxsJson;
}

export interface StargateTransferWrapperJson {
  /** A transfer facilitated by the Stargate bridge */
  stargate_transfer?: StargateTransferJson;
}

/** A transfer facilitated by GoFast */
export interface GoFastTransferJson {
  /** Canonical chain-id of the source chain of the bridge transaction */
  from_chain_id?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  to_chain_id?: string;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id?: BridgeTypeJson;
  /** Denom of the input asset */
  denom_in?: string;
  /** Denom of the output asset */
  denom_out?: string;
  /** Go fast Fee */
  fee?: GoFastFeeJson;
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
export enum GoFastTransferStateJson {
  GO_FAST_TRANSFER_UNKNOWN = "GO_FAST_TRANSFER_UNKNOWN",
  GO_FAST_TRANSFER_SENT = "GO_FAST_TRANSFER_SENT",
  GO_FAST_POST_ACTION_FAILED = "GO_FAST_POST_ACTION_FAILED",
  GO_FAST_TRANSFER_TIMEOUT = "GO_FAST_TRANSFER_TIMEOUT",
  GO_FAST_TRANSFER_FILLED = "GO_FAST_TRANSFER_FILLED",
  GO_FAST_TRANSFER_REFUNDED = "GO_FAST_TRANSFER_REFUNDED",
}

export interface GoFastTransferTxsJson {
  order_submitted_tx?: ChainTransactionJson | null;
  order_filled_tx?: ChainTransactionJson | null;
  order_refunded_tx?: ChainTransactionJson | null;
  order_timeout_tx?: ChainTransactionJson | null;
}

export interface GoFastTransferInfoJson {
  /** Chain Id of the source chain */
  from_chain_id: string;
  /** Chain Id of the destination chain */
  to_chain_id: string;
  /**
   * GoFast transfer state:
   * * `GO_FAST_TRANSFER_UNKNOWN` - Unknown state
   * * `GO_FAST_TRANSFER_SENT` - Order submitted on source chain
   * * `GO_FAST_POST_ACTION_FAILED` - Order filled, but subsequent action (e.g., swap) failed
   * * `GO_FAST_TRANSFER_TIMEOUT` - Order timed out
   * * `GO_FAST_TRANSFER_FILLED` - Order filled on destination chain
   * * `GO_FAST_TRANSFER_REFUNDED` - Order refunded
   */
  state: GoFastTransferStateJson;
  txs: GoFastTransferTxsJson;
  /** Error message if the transfer failed post-fill */
  error_message?: string | null;
}

export interface GoFastTransferWrapperJson {
  /** A transfer facilitated by GoFast */
  go_fast_transfer?: GoFastTransferJson;
}

export interface BalanceRequestChainEntryJson {
  /** Address of the wallet that the balance is requested for */
  address?: string;
  /** Denoms of the assets to get the balance for */
  denoms?: string[];
}

export interface BalanceResponseDenomEntryJson {
  amount: string;
  /** @format int32 */
  decimals?: number | null;
  formatted_amount: string;
  price?: string | null;
  value_usd?: string | null;
  error?: ApiErrorJson | null;
}

export interface BalanceResponseChainEntryJson {
  denoms?: Record<string, BalanceResponseDenomEntryJson>;
}

export interface BankSendJson {
  /** Chain-id of the chain that the transaction is intended for */
  chain_id?: string;
  /** Denom of the asset to send */
  denom?: string;
}

export interface BankSendWrapperJson {
  bank_send?: BankSendJson;
}

export interface BridgeJson {
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  id?: BridgeTypeJson;
  /** Name of the bridge */
  name?: string;
  /** URI pointing to an image of the logo of the bridge */
  logo_uri?: string;
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
 * * `EUREKA` - IBC Eureka Bridge
 */
export enum BridgeTypeJson {
  IBC = "IBC",
  AXELAR = "AXELAR",
  CCTP = "CCTP",
  HYPERLANE = "HYPERLANE",
  OPINIT = "OPINIT",
  GO_FAST = "GO_FAST",
  STARGATE = "STARGATE",
  EUREKA = "EUREKA",
}

export interface ChainJson {
  /** Name of the chain */
  chain_name: string;
  /** Chain-id of the chain */
  chain_id: string;
  /** Whether the PFM module is enabled on the chain */
  pfm_enabled: boolean;
  /** Supported cosmos modules */
  cosmos_module_support: CosmosModuleSupportJson;
  /** Whether the chain supports IBC memos */
  supports_memo: boolean;
  /** chain logo URI */
  logo_uri?: string | null;
  /** Bech32 prefix of the chain */
  bech32_prefix: string;
  /** Fee assets of the chain */
  fee_assets: FeeAssetJson[];
  /** Type of chain, e.g. "cosmos" or "evm" */
  chain_type: ChainTypeJson;
  /** IBC capabilities of the chain */
  ibc_capabilities: IbcCapabilitiesJson;
  /** Whether the chain is a testnet */
  is_testnet: boolean;
  /** User friendly name of the chain */
  pretty_name: string;
}

export enum ChainTypeJson {
  Cosmos = "cosmos",
  Evm = "evm",
  Svm = "svm",
}

export interface ChainAffiliatesJson {
  /** An array of affiliates that receives fees from a swap */
  affiliates?: AffiliateJson[];
}

export interface ContractCallWithTokenErrorJson {
  /** Error message */
  message?: string;
  /**
   * ContractCallWithToken errors:
   * * `CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR` - Error occurred during the execute transaction
   */
  type?: ContractCallWithTokenErrorTypeJson;
}

/**
 * ContractCallWithToken errors:
 * * `CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR` - Error occurred during the execute transaction
 */
export enum ContractCallWithTokenErrorTypeJson {
  CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR = "CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR",
}

export interface ContractCallWithTokenTxsJson {
  approve_tx?: ChainTransactionJson | null;
  confirm_tx?: ChainTransactionJson | null;
  error?: ContractCallWithTokenErrorJson | null;
  execute_tx?: ChainTransactionJson | null;
  gas_paid_tx?: ChainTransactionJson | null;
  send_tx?: ChainTransactionJson | null;
}

export interface CosmWasmContractMsgJson {
  /** Address of the contract to execute the message on */
  contract_address?: string;
  /** JSON string of the message */
  msg?: string;
}

export interface CosmWasmContractMsgWrapperJson {
  wasm_msg?: CosmWasmContractMsgJson;
}

/** An ERC20 token contract approval */
export interface Erc20ApprovalJson {
  /** Amount of the approval */
  amount: string;
  /** Address of the spender */
  spender: string;
  /** Address of the ERC20 token contract */
  token_contract: string;
}

export interface ErrorDetailJson {
  /**
   * Error detail:
   * * `LOW_INFO_ERROR` - Not enough asset pricing information to determine the price safety of the route.
   * * `BAD_PRICE_ERROR` - The execution price of the route deviates significantly from the current market price.
   */
  reason?: "LOW_INFO_ERROR" | "BAD_PRICE_ERROR";
}

export interface ErrorJson {
  /** Error code */
  code?: GRPCStatusCodeJson;
  /** Additional error details */
  details?: ErrorDetailJson[];
  /** Error message */
  message?: string;
}

/** A message in a cosmos transaction */
export interface CosmosMsgJson {
  /** JSON string of the message */
  msg?: string;
  /** TypeUrl of the message */
  msg_type_url?: string;
}

/** A transaction on a Cosmos chain */
export interface CosmosTxJson {
  /** Chain-id of the chain that the transaction is intended for */
  chain_id: string;
  /** Path of chain-ids that the message is intended to interact with */
  path?: string[];
  /** The address of the wallet that will sign this transaction */
  signer_address?: string;
  /** The messages that should be included in the transaction. The ordering must be adhered to. */
  msgs?: CosmosMsgJson[];
}

export interface CosmosTxWrapperJson {
  /** A transaction on a Cosmos chain */
  cosmos_tx: CosmosTxJson;
}

/** A swap on an EVM chain */
export interface EvmSwapJson {
  /** Address of the input token. Empty string if native token. */
  input_token?: string;
  /** Amount of the input token */
  amount_in?: string;
  /** Calldata for the swap */
  swap_calldata?: string;
  /** Amount of the output token */
  amount_out?: string;
  /** Chain-id for the swap */
  from_chain_id?: string;
  /** Denom of the input asset */
  denom_in?: string;
  /** Denom of the output asset */
  denom_out?: string;
  /** Venues used for the swap */
  swap_venues?: SwapVenueJson[];
}

export interface EvmSwapWrapperJson {
  /** A swap on an EVM chain */
  evm_swap?: EvmSwapJson;
}

/** A transaction on an EVM chain */
export interface EvmTxJson {
  /** Chain-id of the chain that the transaction is intended for */
  chain_id: string;
  /** Data of the transaction */
  data?: string;
  /** ERC20 approvals required for the transaction */
  required_erc20_approvals?: Erc20ApprovalJson[];
  /** The address of the wallet that will sign this transaction */
  signer_address?: string;
  /** Address of the recipient of the transaction */
  to?: string;
  /** Amount of the transaction */
  value?: string;
}

export interface EvmTxWrapperJson {
  /** A transaction on an EVM chain */
  evm_tx: EvmTxJson;
}

/** A transaction on an SVM chain */
export interface SvmTxJson {
  /** Chain-id of the chain that the transaction is intended for */
  chain_id: string;
  /** The address of the wallet that will sign this transaction */
  signer_address?: string;
  /** Base64 encoded unsigned or partially signed transaction */
  tx?: string;
}

export interface SvmTxWrapperJson {
  /** A transaction on an SVM chain */
  svm_tx: SvmTxJson;
}

/** Asset used to pay gas fees and the recommended price tiers. Assets and gas price recommendations are sourced from the [keplr chain registry](https://github.com/chainapsis/keplr-chain-registry) */
export interface FeeAssetJson {
  /** Asset denom */
  denom: string;
  /** Gas price tiers */
  gas_price?: {
    /** Average gas price */
    average?: string;
    /** High gas price */
    high?: string;
    /** Low gas price */
    low?: string;
  } | null;
}

/** Go fast Fee */
export interface GoFastFeeJson {
  feeAsset: AssetJson;
  bpsFee?: string;
  bpsFeeAmount?: string;
  bpsFeeUsd?: string;
  sourceChainFeeAmount?: string;
  sourceChainFeeUsd?: string;
  destinationChainFeeAmount?: string;
  destinationChainFeeUsd?: string;
}

/** grpc status codes as defined [here](https://grpc.github.io/grpc/core/md_doc_statuscodes.html) */
export type GRPCStatusCodeJson = number;

/** A transfer facilitated by the Hyperlane bridge */
export interface HyperlaneTransferJson {
  /** Canonical chain-id of the source chain of the bridge transaction */
  from_chain_id?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  to_chain_id?: string;
  /** Denom of the input asset */
  denom_in?: string;
  /** Denom of the output asset */
  denom_out?: string;
  /** Contract address of the hyperlane warp route contract that initiates the transfer */
  hyperlane_contract_address?: string;
  /** Amount of the fee asset to be paid as the Hyperlane bridge fee. This is denominated in the fee asset. */
  fee_amount?: string;
  fee_asset?: AssetJson;
  /** Amount of the fee asset to be paid as the Hyperlane bridge fee, converted to USD value */
  usd_fee_amount?: string;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id?: BridgeTypeJson;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smart_relay?: boolean;
}

export interface HyperlaneTransferInfoJson {
  /** Chain ID of the source chain */
  from_chain_id: string;
  /** Chain ID of the destination chain */
  to_chain_id: string;
  /**
   * Hyperlane transfer state:
   * * `HYPERLANE_TRANSFER_UNKNOWN` - Unknown error
   * * `HYPERLANE_TRANSFER_SENT` - The Hyperlane transfer transaction on the source chain has executed
   * * `HYPERLANE_TRANSFER_FAILED` - The Hyperlane transfer failed
   * * `HYPERLANE_TRANSFER_RECEIVED` - The Hyperlane transfer has been received at the destination chain
   */
  state: HyperlaneTransferStateJson;
  txs: HyperlaneTransferTransactionsJson;
}

/**
 * Hyperlane transfer state:
 * * `HYPERLANE_TRANSFER_UNKNOWN` - Unknown error
 * * `HYPERLANE_TRANSFER_SENT` - The Hyperlane transfer transaction on the source chain has executed
 * * `HYPERLANE_TRANSFER_FAILED` - The Hyperlane transfer failed
 * * `HYPERLANE_TRANSFER_RECEIVED` - The Hyperlane transfer has been received at the destination chain
 */
export enum HyperlaneTransferStateJson {
  HYPERLANE_TRANSFER_UNKNOWN = "HYPERLANE_TRANSFER_UNKNOWN",
  HYPERLANE_TRANSFER_SENT = "HYPERLANE_TRANSFER_SENT",
  HYPERLANE_TRANSFER_FAILED = "HYPERLANE_TRANSFER_FAILED",
  HYPERLANE_TRANSFER_RECEIVED = "HYPERLANE_TRANSFER_RECEIVED",
}

export interface HyperlaneTransferTransactionsJson {
  send_tx?: ChainTransactionJson | null;
  receive_tx?: ChainTransactionJson | null;
}

export interface HyperlaneTransferWrapperJson {
  /** A transfer facilitated by the Hyperlane bridge */
  hyperlane_transfer?: HyperlaneTransferJson;
}

export interface IBCTransferInfoJson {
  /** Chain ID of the destination chain */
  to_chain_id: string;
  packet_txs: PacketJson;
  /** Chain ID of the source chain */
  from_chain_id: string;
  /**
   * Transfer state:
   * * `TRANSFER_UNKNOWN` - Transfer state is not known.
   * * `TRANSFER_PENDING` - The send packet for the transfer has been committed and the transfer is pending.
   * * `TRANSFER_RECEIVED` - The transfer packet has been received by the destination chain. It can still fail and revert if it is part of a multi-hop PFM transfer.
   * * `TRANSFER_SUCCESS` - The transfer has been successfully completed and will not revert.
   * * `TRANSFER_FAILURE`- The transfer has failed.
   */
  state: TransferStateJson;
}

export type MsgJson = MultiChainMsgWrapperJson | EvmTxWrapperJson | SvmTxWrapperJson;

export type TxJson = (CosmosTxWrapperJson | EvmTxWrapperJson | SvmTxWrapperJson) & {
  /** Array of indices of the operations that this transaction executes */
  operations_indices?: number[];
};

/** A message that interacts with multiple chains */
export interface MultiChainMsgJson {
  /** Chain-id of the chain that the transaction containing the message is intended for */
  chain_id?: string;
  /** JSON string of the message */
  msg?: string;
  /** TypeUrl of the message */
  msg_type_url?: string;
  /** Path of chain-ids that the message is intended to interact with */
  path?: string[];
}

export interface MultiChainMsgWrapperJson {
  /** A message that interacts with multiple chains */
  multi_chain_msg?: MultiChainMsgJson;
}

export type OperationJson = (
  | TransferWrapperJson
  | SwapWrapperJson
  | AxelarTransferWrapperJson
  | BankSendWrapperJson
  | CCTPTransferWrapperJson
  | HyperlaneTransferWrapperJson
  | EvmSwapWrapperJson
  | OPInitTransferWrapperJson
  | StargateTransferWrapperJson
  | GoFastTransferWrapperJson
  | EurekaTransferWrapperJson
  | LayerZeroTransferWrapperJson
) & {
  /** Index of the tx returned from Msgs that executes this operation */
  tx_index: number;
  /** Amount of input asset to this operation */
  amount_in: string;
  /** Amount of output asset from this operation */
  amount_out: string;
};

export interface OptionalAssetJson {
  asset?: AssetJson;
  /** Whether the asset was found */
  asset_found?: boolean;
}

export interface LayerZeroTransferTransactionsJson {
  send_tx?: ChainTransactionJson | null;
  receive_tx?: ChainTransactionJson | null;
  compose_tx?: ChainTransactionJson | null;
  error_tx?: ChainTransactionJson | null;
}

export interface PacketJson {
  acknowledge_tx?: ChainTransactionJson | null;
  error?: PacketErrorJson | null;
  receive_tx?: ChainTransactionJson | null;
  send_tx?: ChainTransactionJson | null;
  timeout_tx?: ChainTransactionJson | null;
}

export interface PacketErrorJson {
  details?: AcknowledgementErrorDetailsJson;
  /** Error message */
  message?: string;
  /**
   * Packet error type:
   * * `PACKET_ERROR_UNKNOWN` - Unknown error
   * * `PACKET_ERROR_ACKNOWLEDGEMENT` - Packet acknowledgement error
   * * `PACKET_ERROR_TIMEOUT` - Packet timed out
   */
  type?: PacketErrorTypeJson;
}

/**
 * Packet error type:
 * * `PACKET_ERROR_UNKNOWN` - Unknown error
 * * `PACKET_ERROR_ACKNOWLEDGEMENT` - Packet acknowledgement error
 * * `PACKET_ERROR_TIMEOUT` - Packet timed out
 */
export enum PacketErrorTypeJson {
  PACKET_ERROR_UNKNOWN = "PACKET_ERROR_UNKNOWN",
  PACKET_ERROR_ACKNOWLEDGEMENT = "PACKET_ERROR_ACKNOWLEDGEMENT",
  PACKET_ERROR_TIMEOUT = "PACKET_ERROR_TIMEOUT",
}

export interface ChainTransactionJson {
  /** Chain ID the packet event occurs on */
  chain_id?: string;
  /** Link to the transaction on block explorer */
  explorer_link: string;
  /** Hash of the transaction the packet event occurred in */
  tx_hash?: string;
  /** RFC3339 formatted UTC timestamp of when the transaction landed on chain */
  on_chain_at?: string;
}

export type PostHandlerJson = CosmWasmContractMsgWrapperJson | AutopilotMsgWrapperJson;

/**
 * Recommendation reason:
 * * `UNKNOWN` - Unknown recommendation reason.
 * * `MOST_LIQUID` - Highest liquidity form of the transferred token on the destination chain.
 * * `BASE_TOKEN` - The base token if the destination chain is the origin chain of the source token.
 * * `DIRECT` - The token resulting from the least amount of transfers to the destination chain.
 */
export enum ReasonJson {
  UNKNOWN = "UNKNOWN",
  MOST_LIQUID = "MOST_LIQUID",
  BASE_TOKEN = "BASE_TOKEN",
  DIRECT = "DIRECT",
}

/**
 * Recommendation reason:
 * * `LOW_INFO_WARNING` - Not enough asset pricing information to determine the price safety of the route.
 * * `BAD_PRICE_WARNING` - The execution price of the route deviates significantly from the current market price.
 */
export enum RoutePriceWarningTypeJson {
  LOW_INFO_WARNING = "LOW_INFO_WARNING",
  BAD_PRICE_WARNING = "BAD_PRICE_WARNING",
}

export interface RouteJson {
  /** Amount of source asset to be transferred or swapped */
  amount_in: string;
  /** Amount of destination asset out */
  amount_out: string;
  /** Chain-ids of all chains of the transfer or swap, in order of usage by operations in the route */
  chain_ids: string[];
  /** All chain-ids that require an address to be provided for, in order of usage by operations in the route */
  required_chain_addresses: string[];
  /** Chain-id of the destination asset */
  dest_asset_chain_id: string;
  /** Denom of the destination asset */
  dest_asset_denom: string;
  /** Whether this route performs a swap */
  does_swap?: boolean;
  /** Amount of destination asset out, if a swap is performed */
  estimated_amount_out: string;
  /** Array of operations required to perform the transfer or swap */
  operations: OperationJson[];
  /** Chain-id of the source asset */
  source_asset_chain_id: string;
  /** Denom of the source asset */
  source_asset_denom: string;
  /** Swap venue on which the swap is performed, if a swap is performed */
  swap_venues?: SwapVenueJson[];
  /** Number of transactions required to perform the transfer or swap */
  txs_required: number;
  /** Amount of the source denom, converted to USD value */
  usd_amount_in?: string;
  /** Amount of the destination denom expected to be received, converted to USD value */
  usd_amount_out?: string;
  /** Price impact of the estimated swap, if present.  Measured in percentage e.g. "0.5" is .5% */
  swap_price_impact_percent?: string | null;
  /** Indicates if the route is unsafe due to poor execution price or if safety cannot be determined due to lack of pricing information */
  warning?: {
    /**
     * Recommendation reason:
     * * `LOW_INFO_WARNING` - Not enough asset pricing information to determine the price safety of the route.
     * * `BAD_PRICE_WARNING` - The execution price of the route deviates significantly from the current market price.
     */
    type?: RoutePriceWarningTypeJson;
    /** Warning message */
    message?: string;
  } | null;
  /** Indicates fees incurred in the execution of the transfer */
  estimated_fees?: FeeJson[];
  /** The estimated time in seconds for the route to execute */
  estimated_route_duration_seconds: number;
}

export interface SendTokenErrorJson {
  /** Error message */
  message?: string;
  /**
   * SendToken error types:
   * * `SEND_TOKEN_EXECUTION_ERROR` - Error occurred during the execute transaction
   */
  type?: SendTokenErrorTypeJson;
}

/**
 * SendToken error types:
 * * `SEND_TOKEN_EXECUTION_ERROR` - Error occurred during the execute transaction
 */
export enum SendTokenErrorTypeJson {
  SEND_TOKEN_EXECUTION_ERROR = "SEND_TOKEN_EXECUTION_ERROR",
}

export interface SendTokenTxsJson {
  confirm_tx?: ChainTransactionJson | null;
  error?: SendTokenErrorJson | null;
  execute_tx?: ChainTransactionJson | null;
  send_tx?: ChainTransactionJson | null;
}

export interface StatusErrorJson {
  details?: TransactionExecutionErrorDetailsJson | null;
  /** Error message */
  message?: string;
  /**
   * Packet error types:
   * * `STATUS_ERROR_UNKNOWN` - Unknown error
   * * `STATUS_ERROR_TRANSACTION_EXECUTION` - Error was encountered during transaction execution
   * * `STATUS_ERROR_INDEXING` - Error was encountered while indexing the transaction and packet data
   * * `STATUS_ERROR_TRANSFER` - The transfer failed to complete successfully
   */
  type?: StatusErrorTypeJson;
}

/**
 * Packet error types:
 * * `STATUS_ERROR_UNKNOWN` - Unknown error
 * * `STATUS_ERROR_TRANSACTION_EXECUTION` - Error was encountered during transaction execution
 * * `STATUS_ERROR_INDEXING` - Error was encountered while indexing the transaction and packet data
 * * `STATUS_ERROR_TRANSFER` - The transfer failed to complete successfully
 */
export enum StatusErrorTypeJson {
  STATUS_ERROR_UNKNOWN = "STATUS_ERROR_UNKNOWN",
  STATUS_ERROR_TRANSACTION_EXECUTION = "STATUS_ERROR_TRANSACTION_EXECUTION",
  STATUS_ERROR_INDEXING = "STATUS_ERROR_INDEXING",
  STATUS_ERROR_TRANSFER = "STATUS_ERROR_TRANSFER",
}

export type SwapJson = (SwapInWrapperJson | SwapOutWrapperJson | SmartSwapInWrapperJson) & {
  /** Estimated total affiliate fee generated by the swap */
  estimated_affiliate_fee?: string;
  /** Chain ID that the swap will be executed on */
  chain_id?: string;
  /** Chain ID that the swap will be executed on (alias for chain_id) */
  from_chain_id?: string;
  /** Input denom of the swap */
  denom_in?: string;
  /** Output denom of the swap */
  denom_out?: string;
  /** Swap venues that the swap will route through */
  swap_venues?: SwapVenueJson[];
};

/** Specification of a swap with an exact amount in */
export interface SwapExactCoinInJson {
  /** Amount to swap in */
  swap_amount_in?: string | null;
  /** Operations required to execute the swap */
  swap_operations?: SwapOperationJson[];
  /** Swap venue that this swap should execute on */
  swap_venue?: SwapVenueJson;
  /** Price impact of the estimated swap, if present.  Measured in percentage e.g. "0.5" is .5% */
  price_impact_percent?: string | null;
}

/** Specification of a swap with an exact amount out */
export interface SwapExactCoinOutJson {
  /** Amount to get out of the swap */
  swap_amount_out?: string;
  /** Operations required to execute the swap */
  swap_operations?: SwapOperationJson[];
  /** Swap venue that this swap should execute on */
  swap_venue?: SwapVenueJson;
  /** Price impact of the estimated swap, if present.  Measured in percentage e.g. "0.5" is .5% */
  price_impact_percent?: string | null;
}

export interface SwapInWrapperJson {
  /** Specification of a swap with an exact amount in */
  swap_in?: SwapExactCoinInJson;
}

/** Description of a single swap operation */
export interface SwapOperationJson {
  /** Input denom of the swap */
  denom_in?: string;
  /** Output denom of the swap */
  denom_out?: string;
  /** Identifier of the pool to use for the swap */
  pool?: string;
  /** Optional dditional metadata a swap adapter may require */
  interface?: string | null;
}

export interface SwapOutWrapperJson {
  /** Specification of a swap with an exact amount out */
  swap_out?: SwapExactCoinOutJson;
}

export interface SwapRouteJson {
  /** Amount to swap in */
  swap_amount_in?: string;
  /** Denom in of the swap */
  denom_in?: string;
  /** Operations required to execute the swap route */
  swap_operations?: SwapOperationJson[];
}

/** Specification of a smart swap in operation */
export interface SmartSwapExactCoinInJson {
  /** Swap venue that this swap should execute on */
  swap_venue?: SwapVenueJson;
  /** Routes to execute the swap */
  swap_routes?: SwapRouteJson[];
}

export interface SmartSwapOptionsJson {
  /** Indicates whether the swap can be split into multiple swap routes */
  split_routes?: boolean;
  /** Indicates whether to include routes that swap on EVM chains */
  evm_swaps?: boolean;
}

export interface SmartSwapInWrapperJson {
  /** Specification of a smart swap in operation */
  smart_swap_in?: SmartSwapExactCoinInJson;
}

/** A venue on which swaps can be exceuted */
export interface SwapVenueJson {
  /** Chain ID of the swap venue */
  chain_id?: string;
  /** Name of the swap venue */
  name?: string;
  /** URI for the venue's logo */
  logo_uri?: string | null;
}

export interface SwapWrapperJson {
  swap?: SwapJson;
}

export interface TransactionExecutionErrorDetailsJson {
  /** Error code */
  code?: number;
  /** Error message */
  message?: string;
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
export enum TransactionStateJson {
  STATE_SUBMITTED = "STATE_SUBMITTED",
  STATE_PENDING = "STATE_PENDING",
  STATE_COMPLETED_SUCCESS = "STATE_COMPLETED_SUCCESS",
  STATE_COMPLETED_ERROR = "STATE_COMPLETED_ERROR",
  STATE_ABANDONED = "STATE_ABANDONED",
  STATE_PENDING_ERROR = "STATE_PENDING_ERROR",
}

/** A transfer facilitated by the OP Init bridge */
export interface OPInitTransferJson {
  /** Canonical chain-id of the source chain of the bridge transaction */
  from_chain_id?: string;
  /** Canonical chain-id of the destination chain of the bridge transaction */
  to_chain_id?: string;
  /** Denom of the input asset */
  denom_in?: string;
  /** Denom of the output asset */
  denom_out?: string;
  /** Identifier used by the OPInit bridge to identify the L1-L2 pair the transfer occurs between */
  op_init_bridge_id?: any;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id?: BridgeTypeJson;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smart_relay?: boolean;
}

export interface OPInitTransferWrapperJson {
  /** A transfer facilitated by the OP Init bridge */
  op_init_transfer?: OPInitTransferJson;
}

export interface OPInitTransferInfoJson {
  /** Chain ID of the destination chain */
  to_chain_id: string;
  /** Chain ID of the source chain */
  from_chain_id: string;
  /**
   * OPInit transfer state:
   * * `OPINIT_TRANSFER_UNKNOWN` - Unknown error
   * * `OPINIT_TRANSFER_SENT` - The deposit transaction on the source chain has executed
   * * `OPINIT_TRANSFER_RECEIVED` - OPInit transfer has been received at the destination chain
   */
  state: OPInitTransferStateJson;
  txs: OPInitTransferTxsJson;
}

export interface OPInitTransferTxsJson {
  send_tx?: ChainTransactionJson | null;
  receive_tx?: ChainTransactionJson | null;
}

/**
 * OPInit transfer state:
 * * `OPINIT_TRANSFER_UNKNOWN` - Unknown error
 * * `OPINIT_TRANSFER_SENT` - The deposit transaction on the source chain has executed
 * * `OPINIT_TRANSFER_RECEIVED` - OPInit transfer has been received at the destination chain
 */
export enum OPInitTransferStateJson {
  OPINIT_TRANSFER_UNKNOWN = "OPINIT_TRANSFER_UNKNOWN",
  OPINIT_TRANSFER_SENT = "OPINIT_TRANSFER_SENT",
  OPINIT_TRANSFER_RECEIVED = "OPINIT_TRANSFER_RECEIVED",
}

/**
 * LayerZero transfer state:
 * * `LAYER_ZERO_TRANSFER_UNKNOWN` - Unknown error
 * * `LAYER_ZERO_TRANSFER_SENT` - The transaction on the source chain has executed
 * * `LAYER_ZERO_TRANSFER_RECEIVED` - The transfer has been received at the destination chain
 * * `LAYER_ZERO_TRANSFER_FAILED` - The transfer has failed
 */
export enum LayerZeroTransferStateJson {
  LAYER_ZERO_TRANSFER_UNKNOWN = "LAYER_ZERO_TRANSFER_UNKNOWN",
  LAYER_ZERO_TRANSFER_SENT = "LAYER_ZERO_TRANSFER_SENT",
  LAYER_ZERO_TRANSFER_RECEIVED = "LAYER_ZERO_TRANSFER_RECEIVED",
  LAYER_ZERO_TRANSFER_FAILED = "LAYER_ZERO_TRANSFER_FAILED",
}

/** A cross-chain transfer */
export interface TransferJson {
  /** Chain-id on which the transfer is initiated */
  from_chain_id?: string;
  /** Chain-id on which the transfer is received */
  to_chain_id?: string;
  /** Channel to use to initiate the transfer */
  channel?: string;
  /** Denom of the destination asset of the transfer */
  dest_denom?: string;
  /** Whether pfm is enabled on the chain where the transfer is initiated */
  pfm_enabled?: boolean;
  /** Port to use to initiate the transfer */
  port?: string;
  /** Whether the transfer chain supports a memo */
  supports_memo?: boolean;
  /** Denom of the input asset of the transfer */
  denom_in?: string;
  /** Denom of the output asset of the transfer */
  denom_out?: string;
  /** Amount of the fee asset to be paid as the transfer fee if applicable. */
  fee_amount?: string | null;
  /** Address of the entry contract on the destination chain */
  to_chain_entry_contract_address?: string | null;
  to_chain_callback_contract_address?: string | null;
  /** Amount of the fee asset to be paid as the transfer fee if applicable, converted to USD value */
  usd_fee_amount?: string | null;
  /** Asset to be paid as the transfer fee if applicable. */
  fee_asset?: AssetJson | null;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id?: BridgeTypeJson;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smart_relay?: boolean;
}

export interface TransferEventJson {
  ibc_transfer?: IBCTransferInfoJson;
  axelar_transfer?: AxelarTransferInfoJson;
  cctp_transfer?: CCTPTransferInfoJson;
  hyperlane_transfer?: HyperlaneTransferInfoJson;
  op_init_transfer?: OPInitTransferInfoJson;
  stargate_transfer?: StargateTransferInfoJson;
  go_fast_transfer?: GoFastTransferInfoJson;
  eureka_transfer?: EurekaTransferInfoJson;
  layer_zero_transfer?: LayerZeroTransferInfoJson;
}

/**
 * Transfer state:
 * * `TRANSFER_UNKNOWN` - Transfer state is not known.
 * * `TRANSFER_PENDING` - The send packet for the transfer has been committed and the transfer is pending.
 * * `TRANSFER_RECEIVED` - The transfer packet has been received by the destination chain. It can still fail and revert if it is part of a multi-hop PFM transfer.
 * * `TRANSFER_SUCCESS` - The transfer has been successfully completed and will not revert.
 * * `TRANSFER_FAILURE`- The transfer has failed.
 */
export enum TransferStateJson {
  TRANSFER_UNKNOWN = "TRANSFER_UNKNOWN",
  TRANSFER_PENDING = "TRANSFER_PENDING",
  TRANSFER_RECEIVED = "TRANSFER_RECEIVED",
  TRANSFER_SUCCESS = "TRANSFER_SUCCESS",
  TRANSFER_FAILURE = "TRANSFER_FAILURE",
}

/** Indicates location and denom of transfer asset release. */
export interface TransferAssetReleaseJson {
  /** The chain ID of the chain that the transfer asset is released on. */
  chain_id?: string;
  /** The denom of the asset that is released. */
  denom?: string;
  /** The amount of the asset that is released. */
  amount?: string | null;
  /** Indicates whether assets have been released and are accessible. The assets may still be in transit. */
  released?: boolean;
}

export interface TransferStatusJson {
  error?: StatusErrorJson | null;
  /** Indicates which entry in the `transfer_sequence` field that the transfer is blocked on. Will be null if there is no blocked transfer. */
  next_blocking_transfer?: {
    /** The index of the entry in the `transfer_sequence` field that the transfer is blocked on. */
    transfer_sequence_index?: number;
  } | null;
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
  state?: TransactionStateJson;
  /** Indicates location and denom of transfer asset release. */
  transfer_asset_release?: TransferAssetReleaseJson;
  /** Lists any IBC and Axelar transfers as they are seen. */
  transfer_sequence?: TransferEventJson[];
}

export interface TransferWrapperJson {
  /** A cross-chain transfer */
  transfer?: TransferJson;
}

/** An IBC Eureka transfer */
export interface EurekaTransferJson {
  /** Port on the destination chain */
  destination_port?: string;
  /** Client on the source chain */
  source_client?: string;
  /** Chain-id on which the transfer is initiated */
  from_chain_id?: string;
  /** Chain-id on which the transfer is received */
  to_chain_id?: string;
  /** Whether pfm is enabled on the chain where the transfer is initiated */
  pfm_enabled?: boolean;
  /** Whether the transfer chain supports a memo */
  supports_memo?: boolean;
  /** Denom of the input asset of the transfer */
  denom_in?: string;
  /** Denom of the output asset of the transfer */
  denom_out?: string;
  /** Address of the Eureka entry contract on the source chain */
  entry_contract_address?: string;
  /** Optional address of the Eureka callback adapter contract on the source chain */
  callback_adapter_contract_address?: string | null;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id?: BridgeTypeJson;
  /** Indicates whether this transfer is relayed via Smart Relay */
  smart_relay?: boolean;
  smart_relay_fee_quote?: SmartRelayFeeQuoteJson | null;
  /** Optional address of the Eureka callback contract on the destination chain */
  to_chain_callback_contract_address?: string | null;
  /** Optional address of the Eureka entry contract on the destination chain */
  to_chain_entry_contract_address?: string | null;
}

export interface EurekaTransferInfoJson {
  /** Chain ID of the source chain */
  from_chain_id: string;
  /** Chain ID of the destination chain */
  to_chain_id: string;
  /**
   * Transfer state:
   * * `TRANSFER_UNKNOWN` - Transfer state is not known.
   * * `TRANSFER_PENDING` - The send packet for the transfer has been committed and the transfer is pending.
   * * `TRANSFER_RECEIVED` - The transfer packet has been received by the destination chain. It can still fail and revert if it is part of a multi-hop PFM transfer.
   * * `TRANSFER_SUCCESS` - The transfer has been successfully completed and will not revert.
   * * `TRANSFER_FAILURE`- The transfer has failed.
   */
  state: TransferStateJson;
  packet_txs: PacketJson;
}

export interface EurekaTransferWrapperJson {
  /** An IBC Eureka transfer */
  eureka_transfer?: EurekaTransferJson;
}

/** A Layer Zero Transfer */
export interface LayerZeroTransferJson {
  /** Chain-id on which the transfer is initiated */
  from_chain_id: string;
  /** Chain-id on which the transfer is received */
  to_chain_id: string;
  /** Denom of the input asset of the transfer */
  denom_in: string;
  /** Denom of the output asset of the transfer */
  denom_out: string;
  source_oft_cntract_address: string;
  destination_endpoint_id: number;
  messaging_fee_asset: AssetJson;
  messaging_fee_amount: string;
  messaging_fee_amount_usd: string;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id: BridgeTypeJson;
}

export interface LayerZeroTransferInfoJson {
  /** Chain ID of the source chain */
  from_chain_id: string;
  /** Chain ID of the destination chain */
  to_chain_id: string;
  /**
   * LayerZero transfer state:
   * * `LAYER_ZERO_TRANSFER_UNKNOWN` - Unknown error
   * * `LAYER_ZERO_TRANSFER_SENT` - The transaction on the source chain has executed
   * * `LAYER_ZERO_TRANSFER_RECEIVED` - The transfer has been received at the destination chain
   * * `LAYER_ZERO_TRANSFER_FAILED` - The transfer has failed
   */
  state: LayerZeroTransferStateJson;
  txs: LayerZeroTransferTransactionsJson;
}

export interface LayerZeroTransferWrapperJson {
  /** A Layer Zero Transfer */
  layer_zero_transfer?: LayerZeroTransferJson;
}

export interface RecommendationRequestJson {
  /** Denom of the source asset */
  source_asset_denom?: string;
  /** Chain-id of the source asset */
  source_asset_chain_id?: string;
  /** Chain-id of the recommended destination asset */
  dest_chain_id?: string | null;
  /** Reason for recommendation (optional) */
  reason?: ReasonJson | null;
}

export interface CosmosModuleSupportJson {
  /** Whether the authz module is supported */
  authz?: boolean;
  /** Whether the feegrant module is supported */
  feegrant?: boolean;
}

export interface IbcCapabilitiesJson {
  /** Whether the packet forwarding middleware module is supported */
  cosmos_pfm?: boolean;
  /** Whether the ibc hooks module is supported */
  cosmos_ibc_hooks?: boolean;
  /** Whether the chain supports IBC memos */
  cosmos_memo?: boolean;
  /** Whether the autopilot module is supported */
  cosmos_autopilot?: boolean;
}

/**
 * Fee type:
 * * SMART_RELAY - Fees for Smart relaying services.'
 */
export enum FeeTypeJson {
  SMART_RELAY = "SMART_RELAY",
}

export interface FeeJson {
  /**
   * Fee type:
   * * SMART_RELAY - Fees for Smart relaying services.'
   */
  fee_type?: FeeTypeJson;
  /**
   * Bridge Type:
   * * `IBC` - IBC Bridge
   * * `AXELAR` - Axelar Bridge
   * * `CCTP` - CCTP Bridge
   * * `HYPERLANE` - Hyperlane Bridge
   * * `OPINIT` - Opinit Bridge
   * * `GO_FAST` - Go Fast Bridge
   * * `STARGATE` - Stargate Bridge
   * * `EUREKA` - IBC Eureka Bridge
   */
  bridge_id?: BridgeTypeJson;
  /** Amount of the fee asset to be paid */
  amount?: string;
  /** The value of the fee in USD */
  usd_amount?: string;
  origin_asset: AssetJson;
  /** Chain ID of the chain where fees are collected */
  chain_id?: string;
  /** The index of the transaction in the list of transactions required to execute the transfer where fees are paid */
  tx_index?: number;
  /** The index of the operation in the returned operations list which incurs the fee */
  operation_index?: number | null;
}

export interface ChainsRequestJson {
  /** Chain IDs to limit the response to, defaults to all chains if not provided */
  chain_ids?: string[];
  /**
   * Whether to include EVM chains in the response
   * @example false
   */
  include_evm?: boolean;
  /** Whether to include SVM chains in the response */
  include_svm?: boolean;
  /**
   * Whether to display only testnets in the response
   * @example false
   */
  only_testnets?: boolean;
}

export interface ChainsResponseJson {
  /** Array of supported chain-ids */
  chains?: ChainJson[];
}

export interface BalancesResponseJson {
  chains?: Record<string, BalanceResponseChainEntryJson>;
}

export interface BridgesResponseJson {
  /** Array of supported bridges */
  bridges?: BridgeJson[];
}

export interface VenuesRequestJson {
  /**
   * Whether to display only venues from testnets in the response
   * @example false
   */
  only_testnets?: boolean;
}

export interface VenuesResponseJson {
  /** Array of supported swap venues */
  venues?: SwapVenueJson[];
}

export interface AssetsRequestJson {
  /** Chain IDs to limit the response to, defaults to all chains if not provided */
  chain_ids?: string[];
  /** Whether to restrict assets to those native to their chain */
  native_only?: boolean;
  /** Whether to include assets without metadata (symbol, name, logo_uri, etc.) */
  include_no_metadata_assets?: boolean;
  /** Whether to include CW20 tokens */
  include_cw20_assets?: boolean;
  /** Whether to include EVM tokens */
  include_evm_assets?: boolean;
  /** Whether to include SVM tokens */
  include_svm_assets?: boolean;
  /**
   * Whether to display only assets from testnets in the response
   * @example false
   */
  only_testnets?: boolean;
}

export interface AssetsResponseJson {
  /** Map of chain-ids to array of assets supported on the chain */
  chain_to_assets_map?: Record<
    string,
    {
      assets?: AssetJson[];
    }
  >;
}

export interface AssetsFromSourceResponseJson {
  /** Array of assets that are reachable from the specified source asset */
  dest_assets?: Record<
    string,
    {
      assets?: AssetJson[];
    }
  >;
}

export type RouteResponseJson = RouteJson;

export interface MsgsResponseJson {
  msgs?: MsgJson[];
  txs?: TxJson[];
  /** Minimum possible output after all operations, including fees and slippage */
  min_amount_out?: string;
  /** Indicates fees incurred in the execution of the transfer */
  estimated_fees?: FeeJson[];
}

export interface MsgsDirectResponseJson {
  msgs?: MsgJson[];
  txs?: TxJson[];
  /** Minimum possible output after all operations, including fees and slippage */
  min_amount_out?: string;
  route?: RouteJson;
}

export interface AssetRecommendationsResponseJson {
  /** Array of recommendations for each entry in the `request` field. */
  recommendation_entries?: {
    recommendations?: AssetRecommendationJson[];
    error?: ApiErrorJson;
  }[];
}

export interface SubmitResponseJson {
  /** Hash of the transaction */
  tx_hash?: string;
  /** Link to the transaction on the relevant block explorer */
  explorer_link?: string;
}

export interface TrackResponseJson {
  /** Hash of the transaction */
  tx_hash: string;
  /** Link to the transaction on the relevant block explorer */
  explorer_link: string;
}

export interface StatusRequestJson {
  /**
   * Hex encoded hash of the transaction to query for
   * @example "EEC65138E6A7BDD047ED0D4BBA249A754F0BBBC7AA976568C4F35A32CD7FB8EB"
   */
  tx_hash: string;
  /**
   * Chain ID of the transaction
   * @example "cosmoshub-4"
   */
  chain_id: string;
}

export interface StatusResponseJson {
  /** Transfer status for all transfers initiated by the transaction in the order they were initiated. */
  transfers?: TransferStatusJson[];
  /** The overall state reflecting the end-to-end status of all transfers initiated by the original transaction. */
  state: TransactionStateJson;
  /**
   * **DEPRECATED.** This field provides a flat list of all transfer events. For a more structured and detailed status of each transfer leg, including its individual events, please use the 'transfers' array instead. This field may be removed in a future version.
   * @deprecated
   */
  transfer_sequence: TransferEventJson[];
  /** Details about the next transfer in the sequence that is preventing further progress, if any. */
  next_blocking_transfer?: {
    transfer_sequence_index?: number;
  } | null;
  /** Indicates location and denom of transfer asset release. */
  transfer_asset_release?: TransferAssetReleaseJson;
  /** Details about any error encountered during the transaction or its subsequent transfers. */
  error?: StatusErrorJson | null;
  /**
   * A high-level status indicator for the transaction's completion state.
   * @example "STATE_COMPLETED"
   */
  status?: string;
}

export interface IbcOriginAssetsResponseJson {
  origin_assets?: OptionalAssetJson[];
}

export interface FungibleAssetsBetweenChainsCreateResponseJson {
  assets_between_chains?: AssetBetweenChainsJson[];
}
