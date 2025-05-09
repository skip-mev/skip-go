import {
  Affiliate,
  AffiliateJSON,
  ApiError,
  Asset,
  AssetJSON,
  AxelarTransfer,
  AxelarTransferJSON,
  BankSend,
  BankSendJSON,
  CCTPTransfer,
  CCTPTransferJSON,
  EvmTx,
  EvmTxJSON,
  HyperlaneTransfer,
  HyperlaneTransferJSON,
  OPInitTransfer,
  OPInitTransferJSON,
  MultiChainMsg,
  MultiChainMsgJSON,
  PostHandler,
  PostHandlerJSON,
  Reason,
  EvmSwap,
  EvmSwapJSON,
  Swap,
  SwapJSON,
  SwapVenue,
  SwapVenueJSON,
  SwapVenueRequest,
  SwapVenueRequestJSON,
  Transfer,
  TransferJSON,
  CosmosTxJSON,
  CosmosTx,
  SvmTxJSON,
  GoFastTransferJSON,
  GoFastTransfer,
  SvmTx,
  SmartSwapOptions,
  SmartSwapOptionsJSON,
  ChainAffiliatesJSON,
  ChainAffiliates,
  StargateTransferJSON,
  StargateTransfer,
  LayerZeroTransferJSON,
  LayerZeroTransfer,
  EurekaTransferJSON,
  EurekaTransfer,
} from "./shared";

export type AssetsRequestJSON = {
  chain_ids?: string[];
  native_only?: boolean;
  include_no_metadata_assets?: boolean;
  include_cw20_assets?: boolean;
  include_evm_assets?: boolean;
  include_svm_assets?: boolean;
  only_testnets?: boolean;
  /**
   * @deprecated Use `chain_ids` instead
   */
  chain_id?: string;
};

export type AssetsRequest = {
  chainIDs?: string[];
  nativeOnly?: boolean;
  includeNoMetadataAssets?: boolean;
  includeCW20Assets?: boolean;
  includeEvmAssets?: boolean;
  includeSvmAssets?: boolean;
  onlyTestnets?: boolean;
  /**
   * @deprecated Use `chainIDs` instead
   */
  chainID?: string;
};

export type AssetsFromSourceRequestJSON = {
  source_asset_denom: string;
  source_asset_chain_id: string;
  allow_multi_tx?: boolean;
  include_cw20_assets: boolean;
};

export type AssetsFromSourceRequest = {
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  allowMultiTx?: boolean;
  includeCW20Assets: boolean;
};

export type AssetRecommendation = {
  asset: Asset;
  reason: Reason;
};

export type AssetRecommendationJSON = {
  asset: AssetJSON;
  reason: Reason;
};

export type AssetRecommendationRequestJSON = {
  source_asset_denom: string;
  source_asset_chain_id: string;
  dest_chain_id: string;
  reason?: Reason;
};

export type AssetRecommendationRequest = {
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destChainID: string;
  reason?: Reason;
};

export type ChainsRequest = {
  includeEVM?: boolean;
  includeSVM?: boolean;
  onlyTestnets?: boolean;
  chainIDs?: string[];
};

export type ChainsRequestJSON = {
  include_evm?: boolean;
  include_svm?: boolean;
  only_testnets?: boolean;
  chain_ids?: string[];
};

export type RecommendAssetsRequestJSON = {
  requests: AssetRecommendationRequestJSON[];
};

export type RecommendAssetsRequest = {
  requests: AssetRecommendationRequest[];
};

export type RecommendAssetsResponseJSON = {
  recommendations: AssetRecommendationJSON[];
  recommendation_entries: RecommendationEntryJSON[];
};

export type RecommendAssetsResponse = {
  recommendations: AssetRecommendation[];
  recommendationEntries: RecommendationEntry[];
};

export type RecommendationEntryJSON = {
  recommendations: AssetRecommendationJSON[];
  error?: ApiError;
};

export type RecommendationEntry = {
  recommendations: AssetRecommendation[];
  error?: ApiError;
};

export type RouteRequestBaseJSON = {
  source_asset_denom: string;
  source_asset_chain_id: string;
  dest_asset_denom: string;
  dest_asset_chain_id: string;

  cumulative_affiliate_fee_bps?: string;
  swap_venue?: SwapVenueRequestJSON;
  swap_venues?: SwapVenueRequestJSON[];
  allow_unsafe?: boolean;
  experimental_features?: ExperimentalFeature[];
  bridges?: BridgeType[];
  allow_multi_tx?: boolean;
  smart_relay?: boolean;
  smart_swap_options?: SmartSwapOptionsJSON;
  allow_swaps?: boolean;
  go_fast?: boolean;
};

export type RouteRequestGivenInJSON = RouteRequestBaseJSON & {
  amount_in: string;
  amount_out?: never;
};

export type RouteRequestGivenOutJSON = RouteRequestBaseJSON & {
  amount_in?: never;
  amount_out: string;
};

export type RouteRequestJSON =
  | RouteRequestGivenInJSON
  | RouteRequestGivenOutJSON;

export type MsgsDirectResponse = {
  msgs: Msg[];
  txs: Tx[];
  route: RouteResponse;
  warning?: MsgsWarning;
};

export type MsgsDirectResponseJSON = {
  msgs: MsgJSON[];
  txs: TxJSON[];
  route: RouteResponseJSON;
  warning?: MsgsWarning;
};

export type RouteRequestBase = RouteConfig & {
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destAssetDenom: string;
  destAssetChainID: string;
};

export type RouteConfig = {
  cumulativeAffiliateFeeBPS?: string;
  swapVenue?: SwapVenueRequest;
  swapVenues?: SwapVenueRequest[];
  allowUnsafe?: boolean;
  experimentalFeatures?: ExperimentalFeature[];
  bridges?: BridgeType[];
  allowMultiTx?: boolean;
  smartRelay?: boolean;
  smartSwapOptions?: SmartSwapOptions;
  allowSwaps?: boolean;
  goFast?: boolean;
};

export type RouteRequestGivenIn = RouteRequestBase & {
  amountIn: string;
  amountOut?: never;
};

export type RouteRequestGivenOut = RouteRequestBase & {
  amountIn?: never;
  amountOut: string;
};

export type RouteRequest = RouteRequestGivenIn | RouteRequestGivenOut;

export type RouteWarningType = "LOW_INFO_WARNING" | "BAD_PRICE_WARNING";
export type MsgsWarningType =
  | "INSUFFICIENT_GAS_AT_DEST_EOA"
  | "INSUFFICIENT_GAS_AT_INTERMEDIATE";

export type ExperimentalFeature =
  | "cctp"
  | "hyperlane"
  | "stargate"
  | "eureka"
  | "layer_zero";

export type RouteWarning = {
  type: RouteWarningType;
  message: string;
};

export type MsgsWarning = {
  type: MsgsWarningType;
  message: string;
};

export enum FeeType {
  SMART_RELAY = "SMART_RELAY",
  BRIDGE = "BRIDGE",
}

export type EstimatedFee = {
  feeType: FeeType;
  bridgeID: BridgeType;
  amount: string;
  usdAmount: string;
  originAsset: Asset;
  chainID: string;
  txIndex: number;
  operationIndex?: number;
};

export type EstimatedFeeJSON = {
  fee_type: FeeType;
  bridge_id: BridgeType;
  amount: string;
  usd_amount: string;
  origin_asset: AssetJSON;
  chain_id: string;
  tx_index: number;
  operation_index?: number;
};
interface BaseOperationJSON {
  tx_index: number;
  amount_in: string;
  amount_out: string;
}

export type OperationJSON =
  | (BaseOperationJSON & { transfer: TransferJSON })
  | (BaseOperationJSON & { bank_send: BankSendJSON })
  | (BaseOperationJSON & { swap: SwapJSON })
  | (BaseOperationJSON & { axelar_transfer: AxelarTransferJSON })
  | (BaseOperationJSON & { cctp_transfer: CCTPTransferJSON })
  | (BaseOperationJSON & { hyperlane_transfer: HyperlaneTransferJSON })
  | (BaseOperationJSON & { evm_swap: EvmSwapJSON })
  | (BaseOperationJSON & { op_init_transfer: OPInitTransferJSON })
  | (BaseOperationJSON & { go_fast_transfer: GoFastTransferJSON })
  | (BaseOperationJSON & { stargate_transfer: StargateTransferJSON })
  | (BaseOperationJSON & { layer_zero_transfer: LayerZeroTransferJSON })
  | (BaseOperationJSON & { eureka_transfer: EurekaTransferJSON })
  | (BaseOperationJSON & { stargate_transfer: StargateTransferJSON });

interface BaseOperation {
  txIndex: number;
  amountIn: string;
  amountOut: string;
}

export type Operation =
  | (BaseOperation & { transfer: Transfer })
  | (BaseOperation & { bankSend: BankSend })
  | (BaseOperation & { swap: Swap })
  | (BaseOperation & { axelarTransfer: AxelarTransfer })
  | (BaseOperation & { cctpTransfer: CCTPTransfer })
  | (BaseOperation & { hyperlaneTransfer: HyperlaneTransfer })
  | (BaseOperation & { evmSwap: EvmSwap })
  | (BaseOperation & { opInitTransfer: OPInitTransfer })
  | (BaseOperation & { goFastTransfer: GoFastTransfer })
  | (BaseOperation & { stargateTransfer: StargateTransfer })
  | (BaseOperation & { layerZeroTransfer: LayerZeroTransfer })
  | (BaseOperation & { eurekaTransfer: EurekaTransfer })
  | (BaseOperation & { stargateTransfer: StargateTransfer });

export type RouteResponseJSON = {
  source_asset_denom: string;
  source_asset_chain_id: string;
  dest_asset_denom: string;
  dest_asset_chain_id: string;
  amount_in: string;
  amount_out: string;

  operations: OperationJSON[];
  chain_ids: string[];
  required_chain_addresses: string[];

  does_swap: boolean;
  estimated_amount_out?: string;
  swap_venues?: SwapVenueJSON[];

  txs_required: number;

  usd_amount_in?: string;
  usd_amount_out?: string;
  swap_price_impact_percent?: string;

  warning?: RouteWarning;
  estimated_fees: EstimatedFeeJSON[];
  estimated_route_duration_seconds: number;
};

export type RouteResponse = {
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destAssetDenom: string;
  destAssetChainID: string;
  amountIn: string;
  amountOut: string;

  operations: Operation[];
  chainIDs: string[];
  requiredChainAddresses: string[];

  doesSwap: boolean;
  estimatedAmountOut?: string;
  swapVenues?: SwapVenue[];

  txsRequired: number;

  usdAmountIn?: string;
  usdAmountOut?: string;
  swapPriceImpactPercent?: string;

  warning?: RouteWarning;
  estimatedFees: EstimatedFee[];
  estimatedRouteDurationSeconds: number;
};

export type MsgsRequestJSON = {
  source_asset_denom: string;
  source_asset_chain_id: string;
  dest_asset_denom: string;
  dest_asset_chain_id: string;
  amount_in: string;
  amount_out: string;
  address_list: string[];
  operations: OperationJSON[];

  estimated_amount_out?: string;
  slippage_tolerance_percent?: string;
  affiliates?: AffiliateJSON[];
  chain_ids_to_affiliates?: Record<string, ChainAffiliatesJSON>;
  post_route_handler?: PostHandlerJSON;

  enable_gas_warnings?: boolean;
  timeout_seconds?: string;
};

export type MsgsRequest = {
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destAssetDenom: string;
  destAssetChainID: string;
  amountIn: string;
  amountOut: string;
  /**
   * addresses should be in the same order with the `chainIDs` in the `route`
   */
  addressList: string[];
  operations: Operation[];

  estimatedAmountOut?: string;
  slippageTolerancePercent?: string;
  affiliates?: Affiliate[];
  chainIDsToAffiliates?: Record<string, ChainAffiliates>;

  postRouteHandler?: PostHandler;

  enableGasWarnings?: boolean;

  timeoutSeconds?: string;
};
export type MsgsDirectRequestBaseJSON = {
  source_asset_denom: string;
  source_asset_chain_id: string;
  dest_asset_denom: string;
  dest_asset_chain_id: string;
  chain_ids_to_addresses: {
    [key: string]: string;
  };
  swap_venue?: SwapVenueJSON;
  swap_venues?: SwapVenueJSON[];
  slippage_tolerance_percent?: string;
  timeout_seconds?: string;

  affiliates?: AffiliateJSON[];
  chain_ids_to_affiliates?: Record<string, ChainAffiliatesJSON>;

  post_route_handler?: PostHandlerJSON;

  allow_unsafe?: boolean;
  experimental_features?: ExperimentalFeature[];
  bridges?: BridgeType[];
  allow_multi_tx?: boolean;
  smart_relay?: boolean;
  smart_swap_options?: SmartSwapOptionsJSON;
  allow_swaps?: boolean;
  enable_gas_warnings?: boolean;
  go_fast?: boolean;
};

export type MsgsDirectRequestGivenInJSON = MsgsDirectRequestBaseJSON & {
  amount_in: string;
  amount_out?: never;
};

export type MsgsDirectRequestGivenOutJSON = MsgsDirectRequestBaseJSON & {
  amount_in?: never;
  amount_out: string;
};

export type MsgsDirectRequestJSON =
  | MsgsDirectRequestGivenInJSON
  | MsgsDirectRequestGivenOutJSON;

export type MsgsDirectRequestBase = {
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destAssetDenom: string;
  destAssetChainID: string;
  chainIdsToAddresses: {
    [key: string]: string;
  };
  swapVenue?: SwapVenue;
  swapVenues?: SwapVenue[];
  slippageTolerancePercent?: string;
  timeoutSeconds?: string;
  affiliates?: Affiliate[];
  chainIDsToAffiliates?: Record<string, ChainAffiliates>;

  postRouteHandler?: PostHandler;

  allowUnsafe?: boolean;
  experimentalFeatures?: ExperimentalFeature[];
  bridges?: BridgeType[];
  allowMultiTx?: boolean;
  smartRelay?: boolean;
  smartSwapOptions?: SmartSwapOptions;
  allowSwaps?: boolean;
  enableGasWarnings?: boolean;
  goFast?: boolean;
};

export type MsgsDirectRequestGivenIn = MsgsDirectRequestBase & {
  amountIn: string;
  amountOut?: never;
};

export type MsgsDirectRequestGivenOut = MsgsDirectRequestBase & {
  amountIn?: never;
  amountOut: string;
};

export type MsgsDirectRequest =
  | MsgsDirectRequestGivenIn
  | MsgsDirectRequestGivenOut;

export type MsgJSON =
  | { multi_chain_msg: MultiChainMsgJSON }
  | { evm_tx: EvmTxJSON }
  | { svm_tx: SvmTxJSON };

export type Msg =
  | { multiChainMsg: MultiChainMsg }
  | { evmTx: EvmTx }
  | { svmTx: SvmTx };

export type TxJSON =
  | { cosmos_tx: CosmosTxJSON; operations_indices: number[] }
  | { evm_tx: EvmTxJSON; operations_indices: number[] }
  | { svm_tx: SvmTxJSON; operations_indices: number[] };

export type Tx =
  | { cosmosTx: CosmosTx; operationsIndices: number[] }
  | { evmTx: EvmTx; operationsIndices: number[] }
  | { svmTx: SvmTx; operationsIndices: number[] };

export type MsgsResponseJSON = {
  msgs: MsgJSON[];
  estimated_fees: EstimatedFeeJSON[];
  txs: TxJSON[];
  warning?: MsgsWarning;
};

export type MsgsResponse = {
  /**
   * @deprecated Use `txs` instead
   */
  msgs: Msg[];
  estimatedFees: EstimatedFee[];
  txs: Tx[];
  warning?: MsgsWarning;
};

export type BridgeType =
  | "IBC"
  | "AXELAR"
  | "CCTP"
  | "HYPERLANE"
  | "OPINIT"
  | "GO_FAST"
  | "STARGATE"
  | "EUREKA"
  | "LAYER_ZERO";

export enum ChainType {
  Cosmos = "cosmos",
  EVM = "evm",
  SVM = "svm",
}

export type TxResult = {
  txHash: string;
  chainID: string;
};

export type AssetBetweenChainsJSON = {
  asset_on_source: AssetJSON;
  asset_on_dest: AssetJSON;
  txs_required: number;
  bridges: BridgeType[];
};

export type AssetBetweenChains = {
  assetOnSource: Asset;
  assetOnDest: Asset;
  txsRequired: number;
  bridges: BridgeType[];
};

export type AssetsBetweenChainsRequestJSON = {
  source_chain_id: string;
  dest_chain_id: string;

  include_no_metadata_assets?: boolean;
  include_cw20_assets?: boolean;
  include_evm_assets?: boolean;

  allow_multi_tx?: boolean;
};

export type AssetsBetweenChainsRequest = {
  sourceChainID: string;
  destChainID: string;

  includeNoMetadataAssets?: boolean;
  includeCW20Assets?: boolean;
  includeEvmAssets?: boolean;

  allowMultiTx?: boolean;
};

export type AssetsBetweenChainsResponseJSON = {
  assets_between_chains: AssetBetweenChainsJSON[];
};

export type AssetsBetweenChainsResponse = {
  assetsBetweenChains: AssetBetweenChains[];
};

export type BalanceRequestChainEntryJSON = {
  address: string;
  denoms?: string[];
};

export type BalanceRequestChainEntry = {
  address: string;
  denoms?: string[];
};

export type BalanceRequestJSON = {
  chains: { [chain: string]: BalanceRequestChainEntryJSON };
};

export type BalanceRequest = {
  chains: { [chain: string]: BalanceRequestChainEntry };
};

export type BalanceResponseDenomEntryJSON = {
  amount: string;
  decimals?: number;
  formatted_amount: string;
  price?: string;
  value_usd?: string;
  error?: ApiError;
};

export type BalanceResponseDenomEntry = {
  amount: string;
  decimals?: number;
  formattedAmount: string;
  price?: string;
  valueUSD?: string;
  error?: ApiError;
};

export type BalanceResponseChainEntryJSON = {
  denoms: { [denom: string]: BalanceResponseDenomEntryJSON };
};

export type BalanceResponseChainEntry = {
  denoms: { [denom: string]: BalanceResponseDenomEntry };
};

export type BalanceResponseJSON = {
  chains: { [chain: string]: BalanceResponseChainEntryJSON };
};

export type BalanceResponse = {
  chains: { [chain: string]: BalanceResponseChainEntry };
};

export type BridgesResponseJSON = {
  bridges: BridgeJSON[];
};

export type BridgesResponse = {
  bridges: Bridge[];
};

export type BridgeJSON = {
  id: BridgeType;
  name: string;
  logo_uri: string;
};

export type Bridge = {
  id: BridgeType;
  name: string;
  logoURI: string;
};
