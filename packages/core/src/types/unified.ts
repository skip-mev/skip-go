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
  SvmTx,
  SmartSwapOptions,
  SmartSwapOptionsJSON,
  ChainAffiliatesJSON,
  ChainAffiliates,
} from './shared';

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
};

export type MsgsDirectResponseJSON = {
  msgs: MsgJSON[];
  txs: TxJSON[];
  route: RouteResponseJSON;
};

export type RouteRequestBase = {
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destAssetDenom: string;
  destAssetChainID: string;

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

export type RouteWarningType = 'LOW_INFO_WARNING' | 'BAD_PRICE_WARNING';

export type ExperimentalFeature = 'cctp' | 'hyperlane';

export type RouteWarning = {
  type: RouteWarningType;
  message: string;
};

export type FeeType = 'SMART_RELAY';

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

export type OperationJSON =
  | {
      transfer: TransferJSON;
      tx_index: number;
      amount_in: string;
      amount_out: string;
    }
  | {
      bank_send: BankSendJSON;
      tx_index: number;
      amount_in: string;
      amount_out: string;
    }
  | { swap: SwapJSON; tx_index: number; amount_in: string; amount_out: string }
  | {
      axelar_transfer: AxelarTransferJSON;
      tx_index: number;
      amount_in: string;
      amount_out: string;
    }
  | {
      cctp_transfer: CCTPTransferJSON;
      tx_index: number;
      amount_in: string;
      amount_out: string;
    }
  | {
      hyperlane_transfer: HyperlaneTransferJSON;
      tx_index: number;
      amount_in: string;
      amount_out: string;
    }
  | {
      evm_swap: EvmSwapJSON;
      tx_index: number;
      amount_in: string;
      amount_out: string;
    }
  | {
      op_init_transfer: OPInitTransferJSON;
      tx_index: number;
      amount_in: string;
      amount_out: string;
    };

export type Operation =
  | { transfer: Transfer; txIndex: number; amountIn: string; amountOut: string }
  | { bankSend: BankSend; txIndex: number; amountIn: string; amountOut: string }
  | { swap: Swap; txIndex: number; amountIn: string; amountOut: string }
  | {
      axelarTransfer: AxelarTransfer;
      txIndex: number;
      amountIn: string;
      amountOut: string;
    }
  | {
      cctpTransfer: CCTPTransfer;
      txIndex: number;
      amountIn: string;
      amountOut: string;
    }
  | {
      hyperlaneTransfer: HyperlaneTransfer;
      txIndex: number;
      amountIn: string;
      amountOut: string;
    }
  | {
      evmSwap: EvmSwap;
      txIndex: number;
      amountIn: string;
      amountOut: string;
    }
  | {
      opInitTransfer: OPInitTransfer;
      txIndex: number;
      amountIn: string;
      amountOut: string;
    };

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
};

export type MsgsDirectRequestJSON = {
  source_asset_denom: string;
  source_asset_chain_id: string;
  dest_asset_denom: string;
  dest_asset_chain_id: string;
  amount_in: string;
  amount_out: string;
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
};

export type MsgsDirectRequest = {
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destAssetDenom: string;
  destAssetChainID: string;
  amountIn: string;
  amountOut: string;
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
};

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
};

export type MsgsResponse = {
  /**
   * @deprecated Use `txs` instead
   */
  msgs: Msg[];
  estimatedFees: EstimatedFee[];
  txs: Tx[];
};

export type BridgeType = 'IBC' | 'AXELAR' | 'CCTP' | 'HYPERLANE' | 'OPINIT';

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
