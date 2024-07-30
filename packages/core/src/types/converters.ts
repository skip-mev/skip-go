import {
  AxelarTransferInfo,
  AxelarTransferInfoJSON,
  AxelarTransferTransactions,
  AxelarTransferTransactionsJSON,
  CCTPTransferInfo,
  CCTPTransferInfoJSON,
  CCTPTransferTransactions,
  CCTPTransferTransactionsJSON,
  ChainTransaction,
  ChainTransactionJSON,
  ContractCallWithTokenTransactions,
  ContractCallWithTokenTransactionsJSON,
  HyperlaneTransferInfo,
  HyperlaneTransferInfoJSON,
  HyperlaneTransferTransactions,
  HyperlaneTransferTransactionsJSON,
  OPInitTransferInfo,
  OPInitTransferInfoJSON,
  OPInitTransferTransactions,
  OPInitTransferTransactionsJSON,
  NextBlockingTransfer,
  NextBlockingTransferJSON,
  Packet,
  PacketJSON,
  SendTokenTransactions,
  SendTokenTransactionsJSON,
  StatusRequest,
  StatusRequestJSON,
  SubmitTxRequest,
  SubmitTxRequestJSON,
  SubmitTxResponse,
  SubmitTxResponseJSON,
  TrackTxRequest,
  TrackTxRequestJSON,
  TrackTxResponse,
  TrackTxResponseJSON,
  TransferAssetRelease,
  TransferAssetReleaseJSON,
  TransferEvent,
  TransferEventJSON,
  TransferInfo,
  TransferInfoJSON,
  TransferStatus,
  TransferStatusJSON,
  TxStatusResponse,
  TxStatusResponseJSON,
} from './lifecycle';
import {
  Chain,
  ChainJSON,
  FeeAsset,
  FeeAssetJSON,
  IbcCapabilities,
  IbcCapabilitiesJSON,
} from './routing';
import {
  Affiliate,
  AffiliateJSON,
  Asset,
  AssetJSON,
  AssetOrError,
  AssetOrErrorJSON,
  AxelarTransfer,
  AxelarTransferJSON,
  BankSend,
  BankSendJSON,
  CCTPTransfer,
  CCTPTransferJSON,
  CosmWasmContractMsg,
  CosmWasmContractMsgJSON,
  CosmosMsg,
  CosmosMsgJSON,
  CosmosTx,
  CosmosTxJSON,
  DenomWithChainID,
  DenomWithChainIDJSON,
  ERC20Approval,
  ERC20ApprovalJSON,
  EvmTx,
  EvmTxJSON,
  HyperlaneTransfer,
  HyperlaneTransferJSON,
  OPInitTransfer,
  OPInitTransferJSON,
  IBCAddress,
  IBCAddressJSON,
  MultiChainMsg,
  MultiChainMsgJSON,
  OriginAssetsRequest,
  OriginAssetsRequestJSON,
  OriginAssetsResponse,
  OriginAssetsResponseJSON,
  PostHandler,
  PostHandlerJSON,
  SvmTx,
  SvmTxJSON,
  Swap,
  SwapExactCoinIn,
  SwapExactCoinInJSON,
  SwapExactCoinOut,
  SwapExactCoinOutJSON,
  SmartSwapExactCoinIn,
  SmartSwapExactCoinInJSON,
  SwapJSON,
  EvmSwap,
  EvmSwapJSON,
  SwapOperation,
  SwapOperationJSON,
  SwapRoute,
  SwapRouteJSON,
  SwapVenue,
  SwapVenueJSON,
  SwapVenueRequest,
  SwapVenueRequestJSON,
  Transfer,
  TransferJSON,
  SmartSwapOptions,
  SmartSwapOptionsJSON,
  ChainAffiliatesJSON,
  ChainAffiliates,
} from './shared';
import {
  AssetBetweenChains,
  AssetBetweenChainsJSON,
  AssetRecommendation,
  AssetRecommendationJSON,
  AssetRecommendationRequest,
  AssetRecommendationRequestJSON,
  AssetsBetweenChainsRequest,
  AssetsBetweenChainsRequestJSON,
  AssetsBetweenChainsResponse,
  AssetsBetweenChainsResponseJSON,
  AssetsFromSourceRequest,
  AssetsFromSourceRequestJSON,
  AssetsRequest,
  AssetsRequestJSON,
  Bridge,
  BridgeJSON,
  BridgesResponse,
  BridgesResponseJSON,
  EstimatedFee,
  EstimatedFeeJSON,
  Msg,
  MsgJSON,
  MsgsDirectRequest,
  MsgsDirectRequestJSON,
  MsgsRequest,
  MsgsRequestJSON,
  MsgsResponse,
  MsgsResponseJSON,
  Operation,
  OperationJSON,
  RecommendAssetsRequest,
  RecommendAssetsRequestJSON,
  RecommendAssetsResponse,
  RecommendAssetsResponseJSON,
  RecommendationEntry,
  RecommendationEntryJSON,
  RouteRequest,
  RouteRequestJSON,
  RouteResponse,
  RouteResponseJSON,
  Tx,
  TxJSON,
} from './unified';

export function affiliateFromJSON(affiliateJSON: AffiliateJSON): Affiliate {
  return {
    address: affiliateJSON.address,
    basisPointsFee: affiliateJSON.basis_points_fee,
  };
}

export function affiliateToJSON(affiliate: Affiliate): AffiliateJSON {
  return {
    address: affiliate.address,
    basis_points_fee: affiliate.basisPointsFee,
  };
}

export function assetFromJSON(assetJSON: AssetJSON): Asset {
  return {
    denom: assetJSON.denom,
    chainID: assetJSON.chain_id,
    originDenom: assetJSON.origin_denom,
    originChainID: assetJSON.origin_chain_id,
    trace: assetJSON.trace,
    isCW20: assetJSON.is_cw20,
    isEVM: assetJSON.is_evm,
    isSVM: assetJSON.is_svm,
    symbol: assetJSON.symbol,
    name: assetJSON.name,
    logoURI: assetJSON.logo_uri,
    decimals: assetJSON.decimals,
    tokenContract: assetJSON.token_contract,
    description: assetJSON.description,
    coingeckoID: assetJSON.coingecko_id,
    recommendedSymbol: assetJSON.recommended_symbol,
  };
}

export function assetToJSON(asset: Asset): AssetJSON {
  return {
    denom: asset.denom,
    chain_id: asset.chainID,
    origin_denom: asset.originDenom,
    origin_chain_id: asset.originChainID,
    trace: asset.trace,
    is_cw20: asset.isCW20,
    is_evm: asset.isEVM,
    is_svm: asset.isSVM,
    symbol: asset.symbol,
    name: asset.name,
    logo_uri: asset.logoURI,
    decimals: asset.decimals,
    token_contract: asset.tokenContract,
    description: asset.description,
    coingecko_id: asset.coingeckoID,
    recommended_symbol: asset.recommendedSymbol,
  };
}

export function assetRecommendationFromJSON(
  assetRecommendationJSON: AssetRecommendationJSON
): AssetRecommendation {
  return {
    asset: assetFromJSON(assetRecommendationJSON.asset),
    reason: assetRecommendationJSON.reason,
  };
}

export function assetRecommendationToJSON(
  assetRecommendation: AssetRecommendation
): AssetRecommendationJSON {
  return {
    asset: assetToJSON(assetRecommendation.asset),
    reason: assetRecommendation.reason,
  };
}

export function assetsFromSourceRequestFromJSON(
  assetsFromSourceRequestJSON: AssetsFromSourceRequestJSON
): AssetsFromSourceRequest {
  return {
    sourceAssetDenom: assetsFromSourceRequestJSON.source_asset_denom,
    sourceAssetChainID: assetsFromSourceRequestJSON.source_asset_chain_id,
    allowMultiTx: assetsFromSourceRequestJSON.allow_multi_tx,
    includeCW20Assets: assetsFromSourceRequestJSON.include_cw20_assets,
  };
}

export function assetsFromSourceRequestToJSON(
  assetsFromSourceRequest: AssetsFromSourceRequest
): AssetsFromSourceRequestJSON {
  return {
    source_asset_denom: assetsFromSourceRequest.sourceAssetDenom,
    source_asset_chain_id: assetsFromSourceRequest.sourceAssetChainID,
    allow_multi_tx: assetsFromSourceRequest.allowMultiTx,
    include_cw20_assets: assetsFromSourceRequest.includeCW20Assets,
  };
}

export function assetsRequestFromJSON(
  assetsRequestJSON: AssetsRequestJSON
): AssetsRequest {
  return {
    chainIDs: assetsRequestJSON.chain_ids,
    chainID: assetsRequestJSON.chain_id,
    nativeOnly: assetsRequestJSON.native_only,
    includeNoMetadataAssets: assetsRequestJSON.include_no_metadata_assets,
    includeCW20Assets: assetsRequestJSON.include_cw20_assets,
    includeEvmAssets: assetsRequestJSON.include_evm_assets,
    includeSvmAssets: assetsRequestJSON.include_svm_assets,
  };
}

export function assetsRequestToJSON(
  assetsRequest: AssetsRequest
): AssetsRequestJSON {
  return {
    chain_ids: assetsRequest.chainIDs,
    chain_id: assetsRequest.chainID,
    native_only: assetsRequest.nativeOnly,
    include_no_metadata_assets: assetsRequest.includeNoMetadataAssets,
    include_cw20_assets: assetsRequest.includeCW20Assets,
    include_evm_assets: assetsRequest.includeEvmAssets,
    include_svm_assets: assetsRequest.includeSvmAssets,
    only_testnets: assetsRequest.onlyTestnets,
  };
}

export function chainFromJSON(chainJSON: ChainJSON): Chain {
  return {
    chainName: chainJSON.chain_name,
    chainID: chainJSON.chain_id,
    pfmEnabled: chainJSON.pfm_enabled,
    cosmosSDKVersion: chainJSON.cosmos_sdk_version,
    modules: chainJSON.modules,
    cosmosModuleSupport: chainJSON.cosmos_module_support,
    supportsMemo: chainJSON.supports_memo,
    logoURI: chainJSON.logo_uri,
    bech32Prefix: chainJSON.bech32_prefix,
    feeAssets: chainJSON.fee_assets.map(feeAssetFromJSON),
    chainType: chainJSON.chain_type,
    ibcCapabilities: ibcCapabilitiesFromJSON(chainJSON.ibc_capabilities),
    isTestnet: chainJSON.is_testnet,
    prettyName: chainJSON.pretty_name,
  };
}

export function chainToJSON(chain: Chain): ChainJSON {
  return {
    chain_name: chain.chainName,
    chain_id: chain.chainID,
    pfm_enabled: chain.pfmEnabled,
    cosmos_sdk_version: chain.cosmosSDKVersion,
    modules: chain.modules,
    cosmos_module_support: chain.cosmosModuleSupport,
    supports_memo: chain.supportsMemo,
    logo_uri: chain.logoURI,
    bech32_prefix: chain.bech32Prefix,
    fee_assets: chain.feeAssets.map(feeAssetToJSON),
    chain_type: chain.chainType,
    ibc_capabilities: ibcCapabilitiesToJSON(chain.ibcCapabilities),
    is_testnet: chain.isTestnet,
    pretty_name: chain.prettyName,
  };
}

export function feeAssetFromJSON(feeAssetJSON: FeeAssetJSON): FeeAsset {
  return {
    denom: feeAssetJSON.denom,
    gasPrice: feeAssetJSON.gas_price,
  };
}

export function feeAssetToJSON(feeAsset: FeeAsset): FeeAssetJSON {
  return {
    denom: feeAsset.denom,
    gas_price: feeAsset.gasPrice,
  };
}

export function ibcCapabilitiesFromJSON(
  ibcCapabilitiesJSON: IbcCapabilitiesJSON
): IbcCapabilities {
  return {
    cosmosPfm: ibcCapabilitiesJSON.cosmos_pfm,
    cosmosIbcHooks: ibcCapabilitiesJSON.cosmos_ibc_hooks,
    cosmosMemo: ibcCapabilitiesJSON.cosmos_memo,
    cosmosAutopilot: ibcCapabilitiesJSON.cosmos_autopilot,
  };
}

export function ibcCapabilitiesToJSON(
  ibcCapabilities: IbcCapabilities
): IbcCapabilitiesJSON {
  return {
    cosmos_pfm: ibcCapabilities.cosmosPfm,
    cosmos_ibc_hooks: ibcCapabilities.cosmosIbcHooks,
    cosmos_memo: ibcCapabilities.cosmosMemo,
    cosmos_autopilot: ibcCapabilities.cosmosAutopilot,
  };
}

export function recommendAssetsRequestFromJSON(
  recommendAssetsRequestJSON: RecommendAssetsRequestJSON
): RecommendAssetsRequest {
  return {
    requests: recommendAssetsRequestJSON.requests.map(
      assetRecommendationRequestFromJSON
    ),
  };
}

export function recommendAssetsRequestToJSON(
  recommendAssetsRequest: RecommendAssetsRequest
): RecommendAssetsRequestJSON {
  return {
    requests: recommendAssetsRequest.requests.map(
      assetRecommendationRequestToJSON
    ),
  };
}

export function recommendAssetsResponseFromJSON(
  value: RecommendAssetsResponseJSON
): RecommendAssetsResponse {
  return {
    recommendations: value.recommendations.map(assetRecommendationFromJSON),
    recommendationEntries: value.recommendation_entries.map(
      recommendationEntryFromJSON
    ),
  };
}

export function recommendAssetsResponseToJSON(
  value: RecommendAssetsResponse
): RecommendAssetsResponseJSON {
  return {
    recommendations: value.recommendations.map(assetRecommendationToJSON),
    recommendation_entries: value.recommendationEntries.map(
      recommendationEntryToJSON
    ),
  };
}

export function recommendationEntryFromJSON(
  value: RecommendationEntryJSON
): RecommendationEntry {
  return {
    recommendations: value.recommendations.map(assetRecommendationFromJSON),
    error: value.error,
  };
}

export function recommendationEntryToJSON(
  value: RecommendationEntry
): RecommendationEntryJSON {
  return {
    recommendations: value.recommendations.map(assetRecommendationToJSON),
    error: value.error,
  };
}

export function estimatedFeeFromJSON(
  estimatedFeeJSON: EstimatedFeeJSON
): EstimatedFee {
  return {
    amount: estimatedFeeJSON.amount,
    bridgeID: estimatedFeeJSON.bridge_id,
    chainID: estimatedFeeJSON.chain_id,
    feeType: estimatedFeeJSON.fee_type,
    originAsset:
      estimatedFeeJSON.origin_asset &&
      assetFromJSON(estimatedFeeJSON.origin_asset),
    txIndex: estimatedFeeJSON.tx_index,
    usdAmount: estimatedFeeJSON.usd_amount,
    operationIndex: estimatedFeeJSON.operation_index,
  };
}

export function estimatedFeeToJSON(
  estimatedFee: EstimatedFee
): EstimatedFeeJSON {
  return {
    amount: estimatedFee.amount,
    bridge_id: estimatedFee.bridgeID,
    chain_id: estimatedFee.chainID,
    fee_type: estimatedFee.feeType,
    origin_asset:
      estimatedFee.originAsset && assetToJSON(estimatedFee.originAsset),
    tx_index: estimatedFee.txIndex,
    usd_amount: estimatedFee.usdAmount,
    operation_index: estimatedFee.operationIndex,
  };
}

export function swapVenueFromJSON(swapVenueJSON: SwapVenueJSON): SwapVenue {
  return {
    name: swapVenueJSON.name,
    chainID: swapVenueJSON.chain_id,
    logoUri: swapVenueJSON.logo_uri,
  };
}

export function swapVenueToJSON(swapVenue: SwapVenue): SwapVenueJSON {
  return {
    name: swapVenue.name,
    chain_id: swapVenue.chainID,
    logo_uri: swapVenue.logoUri,
  };
}

export function swapVenueRequestFromJSON(
  SwapVenueRequestJSON: SwapVenueRequestJSON
): SwapVenueRequest {
  return {
    name: SwapVenueRequestJSON.name,
    chainID: SwapVenueRequestJSON.chain_id,
  };
}

export function swapVenueRequestToJSON(
  swapVenueRequest: SwapVenueRequest
): SwapVenueRequestJSON {
  return {
    name: swapVenueRequest.name,
    chain_id: swapVenueRequest.chainID,
  };
}

export function routeRequestFromJSON(
  routeRequestJSON: RouteRequestJSON
): RouteRequest {
  const swapVenues = routeRequestJSON.swap_venues
    ? routeRequestJSON.swap_venues.map(swapVenueRequestFromJSON)
    : undefined;

  if (routeRequestJSON.amount_in !== undefined) {
    return {
      sourceAssetDenom: routeRequestJSON.source_asset_denom,
      sourceAssetChainID: routeRequestJSON.source_asset_chain_id,
      destAssetDenom: routeRequestJSON.dest_asset_denom,
      destAssetChainID: routeRequestJSON.dest_asset_chain_id,
      amountIn: routeRequestJSON.amount_in,

      cumulativeAffiliateFeeBPS: routeRequestJSON.cumulative_affiliate_fee_bps,
      swapVenue: routeRequestJSON.swap_venue
        ? swapVenueRequestFromJSON(routeRequestJSON.swap_venue)
        : undefined,
      swapVenues: swapVenues,
      allowUnsafe: routeRequestJSON.allow_unsafe,
      experimentalFeatures: routeRequestJSON.experimental_features,
      bridges: routeRequestJSON.bridges,
      allowMultiTx: routeRequestJSON.allow_multi_tx,
      smartRelay: routeRequestJSON.smart_relay,
      smartSwapOptions: routeRequestJSON.smart_swap_options
        ? smartSwapOptionsFromJSON(routeRequestJSON.smart_swap_options)
        : undefined,
      allowSwaps: routeRequestJSON.allow_swaps,
    };
  }

  return {
    sourceAssetDenom: routeRequestJSON.source_asset_denom,
    sourceAssetChainID: routeRequestJSON.source_asset_chain_id,
    destAssetDenom: routeRequestJSON.dest_asset_denom,
    destAssetChainID: routeRequestJSON.dest_asset_chain_id,
    amountOut: routeRequestJSON.amount_out,

    cumulativeAffiliateFeeBPS: routeRequestJSON.cumulative_affiliate_fee_bps,
    swapVenue: routeRequestJSON.swap_venue
      ? swapVenueRequestFromJSON(routeRequestJSON.swap_venue)
      : undefined,
    swapVenues: swapVenues,
    allowUnsafe: routeRequestJSON.allow_unsafe,
    experimentalFeatures: routeRequestJSON.experimental_features,
    bridges: routeRequestJSON.bridges,
    allowMultiTx: routeRequestJSON.allow_multi_tx,
    smartRelay: routeRequestJSON.smart_relay,
    smartSwapOptions: routeRequestJSON.smart_swap_options
      ? smartSwapOptionsFromJSON(routeRequestJSON.smart_swap_options)
      : undefined,
    allowSwaps: routeRequestJSON.allow_swaps,
  };
}

export function routeRequestToJSON(
  routeRequest: RouteRequest
): RouteRequestJSON {
  const swapVenues = routeRequest.swapVenues
    ? routeRequest.swapVenues.map(swapVenueRequestToJSON)
    : undefined;

  if (routeRequest.amountIn !== undefined) {
    return {
      source_asset_denom: routeRequest.sourceAssetDenom,
      source_asset_chain_id: routeRequest.sourceAssetChainID,
      dest_asset_denom: routeRequest.destAssetDenom,
      dest_asset_chain_id: routeRequest.destAssetChainID,
      amount_in: routeRequest.amountIn,

      cumulative_affiliate_fee_bps: routeRequest.cumulativeAffiliateFeeBPS,
      swap_venue: routeRequest.swapVenue
        ? swapVenueRequestToJSON(routeRequest.swapVenue)
        : undefined,
      swap_venues: swapVenues,
      allow_unsafe: routeRequest.allowUnsafe,
      experimental_features: routeRequest.experimentalFeatures,
      bridges: routeRequest.bridges,
      allow_multi_tx: routeRequest.allowMultiTx,
      smart_relay: routeRequest.smartRelay,
      smart_swap_options: routeRequest.smartSwapOptions
        ? smartSwapOptionsToJSON(routeRequest.smartSwapOptions)
        : undefined,
      allow_swaps: routeRequest.allowSwaps,
    };
  }

  return {
    source_asset_denom: routeRequest.sourceAssetDenom,
    source_asset_chain_id: routeRequest.sourceAssetChainID,
    dest_asset_denom: routeRequest.destAssetDenom,
    dest_asset_chain_id: routeRequest.destAssetChainID,
    amount_out: routeRequest.amountOut,

    cumulative_affiliate_fee_bps: routeRequest.cumulativeAffiliateFeeBPS,
    swap_venue: routeRequest.swapVenue
      ? swapVenueRequestToJSON(routeRequest.swapVenue)
      : undefined,
    swap_venues: swapVenues,
    allow_unsafe: routeRequest.allowUnsafe,
    experimental_features: routeRequest.experimentalFeatures,
    bridges: routeRequest.bridges,
    allow_multi_tx: routeRequest.allowMultiTx,
    smart_relay: routeRequest.smartRelay,
    smart_swap_options: routeRequest.smartSwapOptions
      ? smartSwapOptionsToJSON(routeRequest.smartSwapOptions)
      : undefined,
    allow_swaps: routeRequest.allowSwaps,
  };
}

export function transferFromJSON(transferJSON: TransferJSON): Transfer {
  return {
    port: transferJSON.port,
    channel: transferJSON.channel,
    fromChainID: transferJSON.from_chain_id,
    toChainID: transferJSON.to_chain_id,
    pfmEnabled: transferJSON.pfm_enabled,
    supportsMemo: transferJSON.supports_memo,

    denomIn: transferJSON.denom_in,
    denomOut: transferJSON.denom_out,

    feeAmount: transferJSON.fee_amount,
    usdFeeAmount: transferJSON.usd_fee_amount,
    feeAsset: transferJSON.fee_asset && assetFromJSON(transferJSON.fee_asset),

    bridgeID: transferJSON.bridge_id,

    destDenom: transferJSON.dest_denom,
    chainID: transferJSON.chain_id,
    smartRelay: transferJSON.smart_relay,
  };
}

export function transferToJSON(transfer: Transfer): TransferJSON {
  return {
    port: transfer.port,
    channel: transfer.channel,
    from_chain_id: transfer.fromChainID,
    to_chain_id: transfer.toChainID,
    pfm_enabled: transfer.pfmEnabled,
    supports_memo: transfer.supportsMemo,

    denom_in: transfer.denomIn,
    denom_out: transfer.denomOut,

    fee_amount: transfer.feeAmount,
    usd_fee_amount: transfer.usdFeeAmount,
    fee_asset: transfer.feeAsset && assetToJSON(transfer.feeAsset),

    bridge_id: transfer.bridgeID,

    dest_denom: transfer.destDenom,
    chain_id: transfer.chainID,
    smart_relay: transfer.smartRelay,
  };
}

export function swapOperationFromJSON(
  swapOperationJSON: SwapOperationJSON
): SwapOperation {
  return {
    pool: swapOperationJSON.pool,
    denomIn: swapOperationJSON.denom_in,
    denomOut: swapOperationJSON.denom_out,
    interface: swapOperationJSON.interface,
  };
}

export function swapOperationToJSON(
  swapOperation: SwapOperation
): SwapOperationJSON {
  return {
    pool: swapOperation.pool,
    denom_in: swapOperation.denomIn,
    denom_out: swapOperation.denomOut,
    interface: swapOperation.interface,
  };
}

export function swapRouteFromJSON(swapRouteJSON: SwapRouteJSON): SwapRoute {
  return {
    swapAmountIn: swapRouteJSON.swap_amount_in,
    denomIn: swapRouteJSON.denom_in,
    swapOperations: swapRouteJSON.swap_operations.map(swapOperationFromJSON),
  };
}

export function swapRouteToJSON(swapRoute: SwapRoute): SwapRouteJSON {
  return {
    swap_amount_in: swapRoute.swapAmountIn,
    denom_in: swapRoute.denomIn,
    swap_operations: swapRoute.swapOperations.map(swapOperationToJSON),
  };
}

export function swapExactCoinInFromJSON(
  swapExactCoinInJSON: SwapExactCoinInJSON
): SwapExactCoinIn {
  return {
    swapVenue: swapVenueFromJSON(swapExactCoinInJSON.swap_venue),
    swapOperations: swapExactCoinInJSON.swap_operations.map(
      swapOperationFromJSON
    ),
    swapAmountIn: swapExactCoinInJSON.swap_amount_in,
    priceImpactPercent: swapExactCoinInJSON.price_impact_percent,
  };
}

export function swapExactCoinInToJSON(
  swapExactCoinIn: SwapExactCoinIn
): SwapExactCoinInJSON {
  return {
    swap_venue: swapVenueToJSON(swapExactCoinIn.swapVenue),
    swap_operations: swapExactCoinIn.swapOperations.map(swapOperationToJSON),
    swap_amount_in: swapExactCoinIn.swapAmountIn,
    price_impact_percent: swapExactCoinIn.priceImpactPercent,
  };
}

export function smartSwapExactCoinInFromJSON(
  smartSwapExactCoinInJSON: SmartSwapExactCoinInJSON
): SmartSwapExactCoinIn {
  return {
    swapVenue: swapVenueFromJSON(smartSwapExactCoinInJSON.swap_venue),
    swapRoutes: smartSwapExactCoinInJSON.swap_routes.map(swapRouteFromJSON),
  };
}

export function smartSwapExactCoinInToJSON(
  smartSwapExactCoinIn: SmartSwapExactCoinIn
): SmartSwapExactCoinInJSON {
  return {
    swap_venue: swapVenueToJSON(smartSwapExactCoinIn.swapVenue),
    swap_routes: smartSwapExactCoinIn.swapRoutes.map(swapRouteToJSON),
  };
}

export function swapExactCoinOutFromJSON(
  swapExactCoinOutJSON: SwapExactCoinOutJSON
): SwapExactCoinOut {
  return {
    swapVenue: swapVenueFromJSON(swapExactCoinOutJSON.swap_venue),
    swapOperations: swapExactCoinOutJSON.swap_operations.map(
      swapOperationFromJSON
    ),
    swapAmountOut: swapExactCoinOutJSON.swap_amount_out,
    priceImpactPercent: swapExactCoinOutJSON.price_impact_percent,
  };
}

export function swapExactCoinOutToJSON(
  swapExactCoinOut: SwapExactCoinOut
): SwapExactCoinOutJSON {
  return {
    swap_venue: swapVenueToJSON(swapExactCoinOut.swapVenue),
    swap_operations: swapExactCoinOut.swapOperations.map(swapOperationToJSON),
    swap_amount_out: swapExactCoinOut.swapAmountOut,
    price_impact_percent: swapExactCoinOut.priceImpactPercent,
  };
}

export function swapFromJSON(swapJSON: SwapJSON): Swap {
  if ('swap_in' in swapJSON) {
    return {
      swapIn: swapExactCoinInFromJSON(swapJSON.swap_in),
      estimatedAffiliateFee: swapJSON.estimated_affiliate_fee,
      fromChainID: swapJSON.from_chain_id,
      chainID: swapJSON.chain_id,
      denomIn: swapJSON.denom_in,
      denomOut: swapJSON.denom_out,
      swapVenues: swapJSON.swap_venues.map(swapVenueFromJSON),
    };
  } else if ('smart_swap_in' in swapJSON) {
    return {
      smartSwapIn: smartSwapExactCoinInFromJSON(swapJSON.smart_swap_in),
      estimatedAffiliateFee: swapJSON.estimated_affiliate_fee,
      fromChainID: swapJSON.from_chain_id,
      chainID: swapJSON.chain_id,
      denomIn: swapJSON.denom_in,
      denomOut: swapJSON.denom_out,
      swapVenues: swapJSON.swap_venues.map(swapVenueFromJSON),
    };
  }

  return {
    swapOut: swapExactCoinOutFromJSON(swapJSON.swap_out),
    estimatedAffiliateFee: swapJSON.estimated_affiliate_fee,
    fromChainID: swapJSON.from_chain_id,
    chainID: swapJSON.chain_id,
    denomIn: swapJSON.denom_in,
    denomOut: swapJSON.denom_out,
    swapVenues: swapJSON.swap_venues.map(swapVenueFromJSON),
  };
}

export function swapToJSON(swap: Swap): SwapJSON {
  if ('swapIn' in swap) {
    return {
      swap_in: swapExactCoinInToJSON(swap.swapIn),
      estimated_affiliate_fee: swap.estimatedAffiliateFee,
      from_chain_id: swap.fromChainID,
      chain_id: swap.chainID,
      denom_in: swap.denomIn,
      denom_out: swap.denomOut,
      swap_venues: swap.swapVenues.map(swapVenueToJSON),
    };
  } else if ('smartSwapIn' in swap) {
    return {
      smart_swap_in: smartSwapExactCoinInToJSON(swap.smartSwapIn),
      estimated_affiliate_fee: swap.estimatedAffiliateFee,
      from_chain_id: swap.fromChainID,
      chain_id: swap.chainID,
      denom_in: swap.denomIn,
      denom_out: swap.denomOut,
      swap_venues: swap.swapVenues.map(swapVenueToJSON),
    };
  }

  return {
    swap_out: swapExactCoinOutToJSON(swap.swapOut),
    estimated_affiliate_fee: swap.estimatedAffiliateFee,
    from_chain_id: swap.fromChainID,
    chain_id: swap.chainID,
    denom_in: swap.denomIn,
    denom_out: swap.denomOut,
    swap_venues: swap.swapVenues.map(swapVenueToJSON),
  };
}

export function evmSwapFromJSON(evmSwapJSON: EvmSwapJSON): EvmSwap {
  return {
    inputToken: evmSwapJSON.input_token,
    amountIn: evmSwapJSON.amount_in,
    swapCalldata: evmSwapJSON.swap_calldata,
    amountOut: evmSwapJSON.amount_out,
    fromChainID: evmSwapJSON.from_chain_id,
    denomIn: evmSwapJSON.denom_in,
    denomOut: evmSwapJSON.denom_out,
    swapVenues: evmSwapJSON.swap_venues.map(swapVenueFromJSON),
  };
}

export function evmSwapToJSON(evmSwap: EvmSwap): EvmSwapJSON {
  return {
    input_token: evmSwap.inputToken,
    amount_in: evmSwap.amountIn,
    swap_calldata: evmSwap.swapCalldata,
    amount_out: evmSwap.amountOut,
    from_chain_id: evmSwap.fromChainID,
    denom_in: evmSwap.denomIn,
    denom_out: evmSwap.denomOut,
    swap_venues: evmSwap.swapVenues.map(swapVenueToJSON),
  };
}

export function operationFromJSON(operationJSON: OperationJSON): Operation {
  if ('transfer' in operationJSON) {
    return {
      transfer: transferFromJSON(operationJSON.transfer),
      txIndex: operationJSON.tx_index,
      amountIn: operationJSON.amount_in,
      amountOut: operationJSON.amount_out,
    };
  }

  if ('bank_send' in operationJSON) {
    return {
      bankSend: bankSendFromJSON(operationJSON.bank_send),
      txIndex: operationJSON.tx_index,
      amountIn: operationJSON.amount_in,
      amountOut: operationJSON.amount_out,
    };
  }

  if ('axelar_transfer' in operationJSON) {
    return {
      axelarTransfer: axelarTransferFromJSON(operationJSON.axelar_transfer),
      txIndex: operationJSON.tx_index,
      amountIn: operationJSON.amount_in,
      amountOut: operationJSON.amount_out,
    };
  }

  if ('cctp_transfer' in operationJSON) {
    return {
      cctpTransfer: cctpTransferFromJSON(operationJSON.cctp_transfer),
      txIndex: operationJSON.tx_index,
      amountIn: operationJSON.amount_in,
      amountOut: operationJSON.amount_out,
    };
  }

  if ('hyperlane_transfer' in operationJSON) {
    return {
      hyperlaneTransfer: hyperlaneTransferFromJSON(
        operationJSON.hyperlane_transfer
      ),
      txIndex: operationJSON.tx_index,
      amountIn: operationJSON.amount_in,
      amountOut: operationJSON.amount_out,
    };
  }

  if ('op_init_transfer' in operationJSON) {
    return {
      opInitTransfer: opInitTransferFromJSON(operationJSON.op_init_transfer),
      txIndex: operationJSON.tx_index,
      amountIn: operationJSON.amount_in,
      amountOut: operationJSON.amount_out,
    };
  }

  if ('swap' in operationJSON) {
    return {
      swap: swapFromJSON(operationJSON.swap),
      txIndex: operationJSON.tx_index,
      amountIn: operationJSON.amount_in,
      amountOut: operationJSON.amount_out,
    };
  }

  return {
    evmSwap: evmSwapFromJSON(operationJSON.evm_swap),
    txIndex: operationJSON.tx_index,
    amountIn: operationJSON.amount_in,
    amountOut: operationJSON.amount_out,
  };
}

export function operationToJSON(operation: Operation): OperationJSON {
  if ('transfer' in operation) {
    return {
      transfer: transferToJSON(operation.transfer),
      tx_index: operation.txIndex,
      amount_in: operation.amountIn,
      amount_out: operation.amountOut,
    };
  }

  if ('bankSend' in operation) {
    return {
      bank_send: bankSendToJSON(operation.bankSend),
      tx_index: operation.txIndex,
      amount_in: operation.amountIn,
      amount_out: operation.amountOut,
    };
  }

  if ('axelarTransfer' in operation) {
    return {
      axelar_transfer: axelarTransferToJSON(operation.axelarTransfer),
      tx_index: operation.txIndex,
      amount_in: operation.amountIn,
      amount_out: operation.amountOut,
    };
  }

  if ('cctpTransfer' in operation) {
    return {
      cctp_transfer: cctpTransferToJSON(operation.cctpTransfer),
      tx_index: operation.txIndex,
      amount_in: operation.amountIn,
      amount_out: operation.amountOut,
    };
  }

  if ('hyperlaneTransfer' in operation) {
    return {
      hyperlane_transfer: hyperlaneTransferToJSON(operation.hyperlaneTransfer),
      tx_index: operation.txIndex,
      amount_in: operation.amountIn,
      amount_out: operation.amountOut,
    };
  }

  if ('opInitTransfer' in operation) {
    return {
      op_init_transfer: opInitTransferToJSON(operation.opInitTransfer),
      tx_index: operation.txIndex,
      amount_in: operation.amountIn,
      amount_out: operation.amountOut,
    };
  }

  if ('swap' in operation) {
    return {
      swap: swapToJSON(operation.swap),
      tx_index: operation.txIndex,
      amount_in: operation.amountIn,
      amount_out: operation.amountOut,
    };
  }

  return {
    evm_swap: evmSwapToJSON(operation.evmSwap),
    tx_index: operation.txIndex,
    amount_in: operation.amountIn,
    amount_out: operation.amountOut,
  };
}

export function routeResponseFromJSON(
  routeResponseJSON: RouteResponseJSON
): RouteResponse {
  return {
    sourceAssetDenom: routeResponseJSON.source_asset_denom,
    sourceAssetChainID: routeResponseJSON.source_asset_chain_id,
    destAssetDenom: routeResponseJSON.dest_asset_denom,
    destAssetChainID: routeResponseJSON.dest_asset_chain_id,
    amountIn: routeResponseJSON.amount_in,
    amountOut: routeResponseJSON.amount_out,

    operations: routeResponseJSON.operations.map(operationFromJSON),
    chainIDs: routeResponseJSON.chain_ids,
    requiredChainAddresses: routeResponseJSON.required_chain_addresses,

    doesSwap: routeResponseJSON.does_swap,
    estimatedAmountOut: routeResponseJSON.estimated_amount_out,
    swapVenues: routeResponseJSON.swap_venues
      ? routeResponseJSON.swap_venues.map(swapVenueFromJSON)
      : undefined,

    txsRequired: routeResponseJSON.txs_required,

    usdAmountIn: routeResponseJSON.usd_amount_in,
    usdAmountOut: routeResponseJSON.usd_amount_out,
    swapPriceImpactPercent: routeResponseJSON.swap_price_impact_percent,

    warning: routeResponseJSON.warning,
    estimatedFees: routeResponseJSON.estimated_fees?.length
      ? routeResponseJSON.estimated_fees.map((i) => estimatedFeeFromJSON(i))
      : [],
    estimatedRouteDurationSeconds:
      routeResponseJSON.estimated_route_duration_seconds,
  };
}

export function routeResponseToJSON(
  routeResponse: RouteResponse
): RouteResponseJSON {
  return {
    source_asset_denom: routeResponse.sourceAssetDenom,
    source_asset_chain_id: routeResponse.sourceAssetChainID,
    dest_asset_denom: routeResponse.destAssetDenom,
    dest_asset_chain_id: routeResponse.destAssetChainID,
    amount_in: routeResponse.amountIn,
    amount_out: routeResponse.amountOut,

    operations: routeResponse.operations.map(operationToJSON),
    chain_ids: routeResponse.chainIDs,
    required_chain_addresses: routeResponse.requiredChainAddresses,

    does_swap: routeResponse.doesSwap,
    estimated_amount_out: routeResponse.estimatedAmountOut,
    swap_venues: routeResponse.swapVenues
      ? routeResponse.swapVenues.map(swapVenueToJSON)
      : undefined,

    txs_required: routeResponse.txsRequired,

    usd_amount_in: routeResponse.usdAmountIn,
    usd_amount_out: routeResponse.usdAmountOut,
    swap_price_impact_percent: routeResponse.swapPriceImpactPercent,

    warning: routeResponse.warning,
    estimated_fees: routeResponse.estimatedFees.map((i) =>
      estimatedFeeToJSON(i)
    ),
    estimated_route_duration_seconds:
      routeResponse.estimatedRouteDurationSeconds,
  };
}

export function cosmWasmContractMsgFromJSON(
  cosmWasmContractMsgJSON: CosmWasmContractMsgJSON
): CosmWasmContractMsg {
  return {
    contractAddress: cosmWasmContractMsgJSON.contract_address,
    msg: cosmWasmContractMsgJSON.msg,
  };
}

export function cosmWasmContractMsgToJSON(
  cosmWasmContractMsg: CosmWasmContractMsg
): CosmWasmContractMsgJSON {
  return {
    contract_address: cosmWasmContractMsg.contractAddress,
    msg: cosmWasmContractMsg.msg,
  };
}

export function postHandlerFromJSON(
  postHandlerJSON: PostHandlerJSON
): PostHandler {
  if ('wasm_msg' in postHandlerJSON) {
    return {
      wasmMsg: cosmWasmContractMsgFromJSON(postHandlerJSON.wasm_msg),
    };
  }

  return {
    autopilotMsg: postHandlerJSON.autopilot_msg,
  };
}

export function postHandlerToJSON(postHandler: PostHandler): PostHandlerJSON {
  if ('wasmMsg' in postHandler) {
    return {
      wasm_msg: cosmWasmContractMsgToJSON(postHandler.wasmMsg),
    };
  }

  return {
    autopilot_msg: postHandler.autopilotMsg,
  };
}

export function msgsRequestFromJSON(
  msgsRequestJSON: MsgsRequestJSON
): MsgsRequest {
  return {
    sourceAssetDenom: msgsRequestJSON.source_asset_denom,
    sourceAssetChainID: msgsRequestJSON.source_asset_chain_id,
    destAssetDenom: msgsRequestJSON.dest_asset_denom,
    destAssetChainID: msgsRequestJSON.dest_asset_chain_id,
    amountIn: msgsRequestJSON.amount_in,
    amountOut: msgsRequestJSON.amount_out,
    addressList: msgsRequestJSON.address_list,
    operations: msgsRequestJSON.operations.map(operationFromJSON),

    estimatedAmountOut: msgsRequestJSON.estimated_amount_out,
    slippageTolerancePercent: msgsRequestJSON.slippage_tolerance_percent,
    affiliates: msgsRequestJSON.affiliates?.map(affiliateFromJSON),
    chainIDsToAffiliates: msgsRequestJSON.chain_ids_to_affiliates
      ? chainIDsToAffiliatesMapFromJSON(msgsRequestJSON.chain_ids_to_affiliates)
      : undefined,
    postRouteHandler:
      msgsRequestJSON.post_route_handler &&
      postHandlerFromJSON(msgsRequestJSON.post_route_handler),
  };
}

export function msgsRequestToJSON(msgsRequest: MsgsRequest): MsgsRequestJSON {
  return {
    source_asset_denom: msgsRequest.sourceAssetDenom,
    source_asset_chain_id: msgsRequest.sourceAssetChainID,
    dest_asset_denom: msgsRequest.destAssetDenom,
    dest_asset_chain_id: msgsRequest.destAssetChainID,
    amount_in: msgsRequest.amountIn,
    amount_out: msgsRequest.amountOut,
    address_list: msgsRequest.addressList,
    operations: msgsRequest.operations.map(operationToJSON),

    estimated_amount_out: msgsRequest.estimatedAmountOut,
    slippage_tolerance_percent: msgsRequest.slippageTolerancePercent,
    affiliates: msgsRequest.affiliates?.map(affiliateToJSON),
    chain_ids_to_affiliates: msgsRequest.chainIDsToAffiliates
      ? chainIDsToAffiliatesMapToJSON(msgsRequest.chainIDsToAffiliates)
      : undefined,
    post_route_handler:
      msgsRequest.postRouteHandler &&
      postHandlerToJSON(msgsRequest.postRouteHandler),
  };
}

export function multiChainMsgFromJSON(
  multiChainMsgJSON: MultiChainMsgJSON
): MultiChainMsg {
  return {
    chainID: multiChainMsgJSON.chain_id,
    path: multiChainMsgJSON.path,
    msg: multiChainMsgJSON.msg,
    msgTypeURL: multiChainMsgJSON.msg_type_url,
  };
}

export function multiChainMsgToJSON(
  multiChainMsg: MultiChainMsg
): MultiChainMsgJSON {
  return {
    chain_id: multiChainMsg.chainID,
    path: multiChainMsg.path,
    msg: multiChainMsg.msg,
    msg_type_url: multiChainMsg.msgTypeURL,
  };
}

export function cosmosMsgFromJSON(cosmosMsgJSON: CosmosMsgJSON): CosmosMsg {
  return {
    msg: cosmosMsgJSON.msg,
    msgTypeURL: cosmosMsgJSON.msg_type_url,
  };
}

export function cosmosMsgToJSON(cosmosMsg: CosmosMsg): CosmosMsgJSON {
  return {
    msg: cosmosMsg.msg,
    msg_type_url: cosmosMsg.msgTypeURL,
  };
}

export function submitTxRequestFromJSON(
  submitTxRequestJSON: SubmitTxRequestJSON
): SubmitTxRequest {
  return {
    tx: submitTxRequestJSON.tx,
    chainID: submitTxRequestJSON.chain_id,
  };
}

export function submitTxRequestToJSON(
  submitTxRequest: SubmitTxRequest
): SubmitTxRequestJSON {
  return {
    tx: submitTxRequest.tx,
    chain_id: submitTxRequest.chainID,
  };
}

export function submitTxResponseFromJSON(
  submitTxResponseJSON: SubmitTxResponseJSON
): SubmitTxResponse {
  return {
    txHash: submitTxResponseJSON.tx_hash,
  };
}

export function submitTxResponseToJSON(
  submitTxResponse: SubmitTxResponse
): SubmitTxResponseJSON {
  return {
    tx_hash: submitTxResponse.txHash,
  };
}

export function trackTxRequestFromJSON(
  trackRequestJSON: TrackTxRequestJSON
): TrackTxRequest {
  return {
    txHash: trackRequestJSON.tx_hash,
    chainID: trackRequestJSON.chain_id,
  };
}

export function trackTxRequestToJSON(
  trackRequest: TrackTxRequest
): TrackTxRequestJSON {
  return {
    tx_hash: trackRequest.txHash,
    chain_id: trackRequest.chainID,
  };
}

export function trackTxResponseFromJSON(
  trackResponseJSON: TrackTxResponseJSON
): TrackTxResponse {
  return {
    txHash: trackResponseJSON.tx_hash,
    explorerLink: trackResponseJSON.explorer_link,
  };
}

export function trackTxResponseToJSON(
  trackResponse: TrackTxResponse
): TrackTxResponseJSON {
  return {
    tx_hash: trackResponse.txHash,
    explorer_link: trackResponse.explorerLink,
  };
}

export function txStatusRequestFromJSON(
  txStatusRequestJSON: StatusRequestJSON
): StatusRequest {
  return {
    txHash: txStatusRequestJSON.tx_hash,
    chainID: txStatusRequestJSON.chain_id,
  };
}

export function txStatusRequestToJSON(
  txStatusRequest: StatusRequest
): StatusRequestJSON {
  return {
    tx_hash: txStatusRequest.txHash,
    chain_id: txStatusRequest.chainID,
  };
}

export function chainTransactionFromJSON(
  chainTransactionJSON: ChainTransactionJSON
): ChainTransaction {
  return {
    txHash: chainTransactionJSON.tx_hash,
    chainID: chainTransactionJSON.chain_id,
    explorerLink: chainTransactionJSON.explorer_link,
  };
}

export function chainTransactionToJSON(
  chainTransaction: ChainTransaction
): ChainTransactionJSON {
  return {
    tx_hash: chainTransaction.txHash,
    chain_id: chainTransaction.chainID,
    explorer_link: chainTransaction.explorerLink,
  };
}

export function packetFromJSON(packetJSON: PacketJSON): Packet {
  return {
    sendTx: packetJSON.send_tx && chainTransactionFromJSON(packetJSON.send_tx),
    receiveTx:
      packetJSON.receive_tx && chainTransactionFromJSON(packetJSON.receive_tx),
    acknowledgeTx:
      packetJSON.acknowledge_tx &&
      chainTransactionFromJSON(packetJSON.acknowledge_tx),
    timeoutTx:
      packetJSON.timeout_tx && chainTransactionFromJSON(packetJSON.timeout_tx),

    error: packetJSON.error,
  };
}

export function packetToJSON(packet: Packet): PacketJSON {
  return {
    send_tx: packet.sendTx && chainTransactionToJSON(packet.sendTx),
    receive_tx: packet.receiveTx && chainTransactionToJSON(packet.receiveTx),
    acknowledge_tx:
      packet.acknowledgeTx && chainTransactionToJSON(packet.acknowledgeTx),
    timeout_tx: packet.timeoutTx && chainTransactionToJSON(packet.timeoutTx),

    error: packet.error,
  };
}

export function transferInfoFromJSON(
  transferInfoJSON: TransferInfoJSON
): TransferInfo {
  return {
    fromChainID: transferInfoJSON.from_chain_id,
    toChainID: transferInfoJSON.to_chain_id,
    state: transferInfoJSON.state,
    packetTXs:
      transferInfoJSON.packet_txs &&
      packetFromJSON(transferInfoJSON.packet_txs),
    srcChainID: transferInfoJSON.src_chain_id,
    dstChainID: transferInfoJSON.dst_chain_id,
  };
}

export function transferInfoToJSON(
  transferInfo: TransferInfo
): TransferInfoJSON {
  return {
    from_chain_id: transferInfo.fromChainID,
    to_chain_id: transferInfo.toChainID,
    state: transferInfo.state,
    packet_txs: transferInfo.packetTXs && packetToJSON(transferInfo.packetTXs),
    src_chain_id: transferInfo.srcChainID,
    dst_chain_id: transferInfo.dstChainID,
  };
}

export function nextBlockingTransferFromJSON(
  nextBlockingTransferJSON: NextBlockingTransferJSON
): NextBlockingTransfer {
  return {
    transferSequenceIndex: nextBlockingTransferJSON.transfer_sequence_index,
  };
}

export function nextBlockingTransferToJSON(
  nextBlockingTransfer: NextBlockingTransfer
): NextBlockingTransferJSON {
  return {
    transfer_sequence_index: nextBlockingTransfer.transferSequenceIndex,
  };
}

export function transferAssetReleaseFromJSON(
  transferAssetReleaseJSON: TransferAssetReleaseJSON
): TransferAssetRelease {
  return {
    chainID: transferAssetReleaseJSON.chain_id,
    denom: transferAssetReleaseJSON.denom,
    released: transferAssetReleaseJSON.released,
  };
}

export function transferAssetReleaseToJSON(
  transferAssetRelease: TransferAssetRelease
): TransferAssetReleaseJSON {
  return {
    chain_id: transferAssetRelease.chainID,
    denom: transferAssetRelease.denom,
    released: transferAssetRelease.released,
  };
}

export function txStatusResponseFromJSON(
  statusResponseJSON: TxStatusResponseJSON
): TxStatusResponse {
  return {
    status: statusResponseJSON.status,
    nextBlockingTransfer:
      statusResponseJSON.next_blocking_transfer &&
      nextBlockingTransferFromJSON(statusResponseJSON.next_blocking_transfer),
    transferSequence: statusResponseJSON.transfer_sequence.map(
      transferEventFromJSON
    ),
    transferAssetRelease:
      statusResponseJSON.transfer_asset_release &&
      transferAssetReleaseFromJSON(statusResponseJSON.transfer_asset_release),
    error: statusResponseJSON.error,
    state: statusResponseJSON.state,
    transfers: statusResponseJSON.transfers.map(transferStatusFromJSON),
  };
}

export function txStatusResponseToJSON(
  statusResponse: TxStatusResponse
): TxStatusResponseJSON {
  return {
    status: statusResponse.status,
    next_blocking_transfer:
      statusResponse.nextBlockingTransfer &&
      nextBlockingTransferToJSON(statusResponse.nextBlockingTransfer),
    transfer_sequence: statusResponse.transferSequence.map(transferEventToJSON),
    transfer_asset_release:
      statusResponse.transferAssetRelease &&
      transferAssetReleaseToJSON(statusResponse.transferAssetRelease),
    error: statusResponse.error,
    state: statusResponse.state,
    transfers: statusResponse.transfers.map(transferStatusToJSON),
  };
}

export function ibcAddressFromJSON(ibcAddressJSON: IBCAddressJSON): IBCAddress {
  return {
    address: ibcAddressJSON.address,
    chainID: ibcAddressJSON.chain_id,
  };
}

export function ibcAddressToJSON(ibcAddress: IBCAddress): IBCAddressJSON {
  return {
    address: ibcAddress.address,
    chain_id: ibcAddress.chainID,
  };
}

export function axelarTransferFromJSON(
  axelarTransferJSON: AxelarTransferJSON
): AxelarTransfer {
  return {
    fromChain: axelarTransferJSON.from_chain,
    fromChainID: axelarTransferJSON.from_chain_id,
    toChain: axelarTransferJSON.to_chain,
    toChainID: axelarTransferJSON.to_chain_id,
    asset: axelarTransferJSON.asset,
    shouldUnwrap: axelarTransferJSON.should_unwrap,

    denomIn: axelarTransferJSON.denom_in,
    denomOut: axelarTransferJSON.denom_out,

    feeAmount: axelarTransferJSON.fee_amount,
    usdFeeAmount: axelarTransferJSON.usd_fee_amount,
    feeAsset: assetFromJSON(axelarTransferJSON.fee_asset),

    isTestnet: axelarTransferJSON.is_testnet,

    ibcTransferToAxelar: axelarTransferJSON.ibc_transfer_to_axelar
      ? transferFromJSON(axelarTransferJSON.ibc_transfer_to_axelar)
      : undefined,

    bridgeID: axelarTransferJSON.bridge_id,
    smartRelay: axelarTransferJSON.smart_relay,
  };
}

export function axelarTransferToJSON(
  axelarTransfer: AxelarTransfer
): AxelarTransferJSON {
  return {
    from_chain: axelarTransfer.fromChain,
    from_chain_id: axelarTransfer.fromChainID,
    to_chain: axelarTransfer.toChain,
    to_chain_id: axelarTransfer.toChainID,
    asset: axelarTransfer.asset,
    should_unwrap: axelarTransfer.shouldUnwrap,

    denom_in: axelarTransfer.denomIn,
    denom_out: axelarTransfer.denomOut,

    fee_amount: axelarTransfer.feeAmount,
    fee_asset: assetToJSON(axelarTransfer.feeAsset),
    usd_fee_amount: axelarTransfer.usdFeeAmount,

    is_testnet: axelarTransfer.isTestnet,

    ibc_transfer_to_axelar: axelarTransfer.ibcTransferToAxelar
      ? transferToJSON(axelarTransfer.ibcTransferToAxelar)
      : undefined,

    bridge_id: axelarTransfer.bridgeID,
    smart_relay: axelarTransfer.smartRelay,
  };
}

export function bankSendFromJSON(value: BankSendJSON): BankSend {
  return {
    chainID: value.chain_id,
    denom: value.denom,
  };
}

export function bankSendToJSON(value: BankSend): BankSendJSON {
  return {
    chain_id: value.chainID,
    denom: value.denom,
  };
}

export function cctpTransferFromJSON(value: CCTPTransferJSON): CCTPTransfer {
  return {
    fromChainID: value.from_chain_id,
    toChainID: value.to_chain_id,
    burnToken: value.burn_token,
    bridgeID: value.bridge_id,
    denomIn: value.denom_in,
    denomOut: value.denom_out,
    smartRelay: value.smart_relay,
  };
}

export function cctpTransferToJSON(value: CCTPTransfer): CCTPTransferJSON {
  return {
    from_chain_id: value.fromChainID,
    to_chain_id: value.toChainID,
    burn_token: value.burnToken,
    bridge_id: value.bridgeID,
    denom_in: value.denomIn,
    denom_out: value.denomOut,
    smart_relay: value.smartRelay,
  };
}

export function hyperlaneTransferFromJSON(
  value: HyperlaneTransferJSON
): HyperlaneTransfer {
  return {
    fromChainID: value.from_chain_id,
    toChainID: value.to_chain_id,
    denomIn: value.denom_in,
    denomOut: value.denom_out,
    hyperlaneContractAddress: value.hyperlane_contract_address,
    feeAmount: value.fee_amount,
    usdFeeAmount: value.usd_fee_amount,
    feeAsset: assetFromJSON(value.fee_asset),
    bridgeID: value.bridge_id,
    smartRelay: value.smart_relay,
  };
}

export function hyperlaneTransferToJSON(
  value: HyperlaneTransfer
): HyperlaneTransferJSON {
  return {
    from_chain_id: value.fromChainID,
    to_chain_id: value.toChainID,
    denom_in: value.denomIn,
    denom_out: value.denomOut,
    hyperlane_contract_address: value.hyperlaneContractAddress,
    fee_amount: value.feeAmount,
    usd_fee_amount: value.usdFeeAmount,
    fee_asset: assetToJSON(value.feeAsset),
    bridge_id: value.bridgeID,
    smart_relay: value.smartRelay,
  };
}

export function opInitTransferFromJSON(
  value: OPInitTransferJSON
): OPInitTransfer {
  return {
    fromChainID: value.from_chain_id,
    toChainID: value.to_chain_id,
    denomIn: value.denom_in,
    denomOut: value.denom_out,
    opInitBridgeID: value.op_init_bridge_id,
    bridgeID: value.bridge_id,
    smartRelay: value.smart_relay,
  };
}

export function opInitTransferToJSON(
  value: OPInitTransfer
): OPInitTransferJSON {
  return {
    from_chain_id: value.fromChainID,
    to_chain_id: value.toChainID,
    denom_in: value.denomIn,
    denom_out: value.denomOut,
    op_init_bridge_id: value.opInitBridgeID,
    bridge_id: value.bridgeID,
    smart_relay: value.smartRelay,
  };
}

export function erc20ApprovalFromJSON(
  erc20ApprovalJSON: ERC20ApprovalJSON
): ERC20Approval {
  return {
    tokenContract: erc20ApprovalJSON.token_contract,
    spender: erc20ApprovalJSON.spender,
    amount: erc20ApprovalJSON.amount,
  };
}

export function erc20ApprovalToJSON(
  erc20Approval: ERC20Approval
): ERC20ApprovalJSON {
  return {
    token_contract: erc20Approval.tokenContract,
    spender: erc20Approval.spender,
    amount: erc20Approval.amount,
  };
}

export function svmTxFromJSON(svmTxJSON: SvmTxJSON): SvmTx {
  return {
    chainID: svmTxJSON.chain_id,
    tx: svmTxJSON.tx,
    signerAddress: svmTxJSON.signer_address,
  };
}

export function svmTxToJSON(svmTx: SvmTx): SvmTxJSON {
  return {
    chain_id: svmTx.chainID,
    tx: svmTx.tx,
    signer_address: svmTx.signerAddress,
  };
}

export function evmTxFromJSON(evmTxJSON: EvmTxJSON): EvmTx {
  return {
    chainID: evmTxJSON.chain_id,
    to: evmTxJSON.to,
    value: evmTxJSON.value,
    data: evmTxJSON.data,
    requiredERC20Approvals: evmTxJSON.required_erc20_approvals.map(
      erc20ApprovalFromJSON
    ),
    signerAddress: evmTxJSON.signer_address,
  };
}

export function evmTxToJSON(evmTx: EvmTx): EvmTxJSON {
  return {
    chain_id: evmTx.chainID,
    to: evmTx.to,
    value: evmTx.value,
    data: evmTx.data,
    required_erc20_approvals:
      evmTx.requiredERC20Approvals.map(erc20ApprovalToJSON),
    signer_address: evmTx.signerAddress,
  };
}

export function cosmosTxFromJSON(cosmosTxJSON: CosmosTxJSON): CosmosTx {
  return {
    chainID: cosmosTxJSON.chain_id,
    path: cosmosTxJSON.path,
    msgs: cosmosTxJSON.msgs.map(cosmosMsgFromJSON),
    signerAddress: cosmosTxJSON.signer_address,
  };
}

export function cosmosTxToJSON(cosmosTx: CosmosTx): CosmosTxJSON {
  return {
    chain_id: cosmosTx.chainID,
    path: cosmosTx.path,
    msgs: cosmosTx.msgs.map(cosmosMsgToJSON),
    signer_address: cosmosTx.signerAddress,
  };
}

export function txFromJSON(txJSON: TxJSON): Tx {
  if ('cosmos_tx' in txJSON) {
    return {
      cosmosTx: cosmosTxFromJSON(txJSON.cosmos_tx),
      operationsIndices: txJSON.operations_indices,
    };
  }
  if ('svm_tx' in txJSON) {
    return {
      svmTx: svmTxFromJSON(txJSON.svm_tx),
      operationsIndices: txJSON.operations_indices,
    };
  }

  return {
    evmTx: evmTxFromJSON(txJSON.evm_tx),
    operationsIndices: txJSON.operations_indices,
  };
}

export function txToJSON(tx: Tx): TxJSON {
  if ('cosmosTx' in tx) {
    return {
      cosmos_tx: cosmosTxToJSON(tx.cosmosTx),
      operations_indices: tx.operationsIndices,
    };
  }
  if ('svmTx' in tx) {
    return {
      svm_tx: svmTxToJSON(tx.svmTx),
      operations_indices: tx.operationsIndices,
    };
  }

  return {
    evm_tx: evmTxToJSON(tx.evmTx),
    operations_indices: tx.operationsIndices,
  };
}

export function msgFromJSON(msgJSON: MsgJSON): Msg {
  if ('multi_chain_msg' in msgJSON) {
    return {
      multiChainMsg: multiChainMsgFromJSON(msgJSON.multi_chain_msg),
    };
  }
  if ('svm_tx' in msgJSON) {
    return {
      svmTx: svmTxFromJSON(msgJSON.svm_tx),
    };
  }

  return {
    evmTx: evmTxFromJSON(msgJSON.evm_tx),
  };
}

export function msgToJSON(msg: Msg): MsgJSON {
  if ('multiChainMsg' in msg) {
    return {
      multi_chain_msg: multiChainMsgToJSON(msg.multiChainMsg),
    };
  }
  if ('svmTx' in msg) {
    return {
      svm_tx: svmTxToJSON(msg.svmTx),
    };
  }

  return {
    evm_tx: evmTxToJSON(msg.evmTx),
  };
}

export function messageResponseFromJSON(
  response: MsgsResponseJSON
): MsgsResponse {
  return {
    estimatedFees: response.estimated_fees?.map((fee) =>
      estimatedFeeFromJSON(fee)
    ),
    msgs: response.msgs.map((msg) => msgFromJSON(msg)),
    txs: response.txs?.map((tx) => txFromJSON(tx)),
    warning: response.warning,
  };
}

export function sendTokenTransactionsFromJSON(
  sendTokenTransactionsJSON: SendTokenTransactionsJSON
): SendTokenTransactions {
  return {
    sendTx: sendTokenTransactionsJSON.send_tx
      ? chainTransactionFromJSON(sendTokenTransactionsJSON.send_tx)
      : null,
    confirmTx: sendTokenTransactionsJSON.confirm_tx
      ? chainTransactionFromJSON(sendTokenTransactionsJSON.confirm_tx)
      : null,
    executeTx: sendTokenTransactionsJSON.execute_tx
      ? chainTransactionFromJSON(sendTokenTransactionsJSON.execute_tx)
      : null,
    error: sendTokenTransactionsJSON.error,
  };
}

export function sendTokenTransactionsToJSON(
  sendTokenTransactions: SendTokenTransactions
): SendTokenTransactionsJSON {
  return {
    send_tx: sendTokenTransactions.sendTx
      ? chainTransactionToJSON(sendTokenTransactions.sendTx)
      : null,
    confirm_tx: sendTokenTransactions.confirmTx
      ? chainTransactionToJSON(sendTokenTransactions.confirmTx)
      : null,
    execute_tx: sendTokenTransactions.executeTx
      ? chainTransactionToJSON(sendTokenTransactions.executeTx)
      : null,
    error: sendTokenTransactions.error,
  };
}

export function contractCallWithTokenTransactionsFromJSON(
  value: ContractCallWithTokenTransactionsJSON
): ContractCallWithTokenTransactions {
  return {
    sendTx: value.send_tx ? chainTransactionFromJSON(value.send_tx) : null,
    gasPaidTx: value.gas_paid_tx
      ? chainTransactionFromJSON(value.gas_paid_tx)
      : null,
    confirmTx: value.confirm_tx
      ? chainTransactionFromJSON(value.confirm_tx)
      : null,
    approveTx: value.approve_tx
      ? chainTransactionFromJSON(value.approve_tx)
      : null,
    executeTx: value.execute_tx
      ? chainTransactionFromJSON(value.execute_tx)
      : null,
    error: value.error,
  };
}

export function contractCallWithTokenTransactionsToJSON(
  value: ContractCallWithTokenTransactions
): ContractCallWithTokenTransactionsJSON {
  return {
    send_tx: value.sendTx ? chainTransactionToJSON(value.sendTx) : null,
    gas_paid_tx: value.gasPaidTx
      ? chainTransactionToJSON(value.gasPaidTx)
      : null,
    confirm_tx: value.confirmTx
      ? chainTransactionToJSON(value.confirmTx)
      : null,
    approve_tx: value.approveTx
      ? chainTransactionToJSON(value.approveTx)
      : null,
    execute_tx: value.executeTx
      ? chainTransactionToJSON(value.executeTx)
      : null,
    error: value.error,
  };
}

export function axelarTransferTransactionsFromJSON(
  value: AxelarTransferTransactionsJSON
): AxelarTransferTransactions {
  if ('contract_call_with_token_txs' in value) {
    return {
      contractCallWithTokenTxs: contractCallWithTokenTransactionsFromJSON(
        value.contract_call_with_token_txs
      ),
    };
  }

  return {
    sendTokenTxs: sendTokenTransactionsFromJSON(value.send_token_txs),
  };
}

export function axelarTransferTransactionsToJSON(
  value: AxelarTransferTransactions
): AxelarTransferTransactionsJSON {
  if ('contractCallWithTokenTxs' in value) {
    return {
      contract_call_with_token_txs: contractCallWithTokenTransactionsToJSON(
        value.contractCallWithTokenTxs
      ),
    };
  }

  return {
    send_token_txs: sendTokenTransactionsToJSON(value.sendTokenTxs),
  };
}

export function axelarTransferInfoFromJSON(
  value: AxelarTransferInfoJSON
): AxelarTransferInfo {
  return {
    fromChainID: value.from_chain_id,
    toChainID: value.to_chain_id,
    type: value.type,
    state: value.state,
    txs: value.txs && axelarTransferTransactionsFromJSON(value.txs),
    axelarScanLink: value.axelar_scan_link,
    srcChainID: value.src_chain_id,
    dstChainID: value.dst_chain_id,
  };
}

export function axelarTransferInfoToJSON(
  value: AxelarTransferInfo
): AxelarTransferInfoJSON {
  return {
    from_chain_id: value.fromChainID,
    to_chain_id: value.toChainID,
    type: value.type,
    state: value.state,
    txs: value.txs && axelarTransferTransactionsToJSON(value.txs),
    axelar_scan_link: value.axelarScanLink,
    src_chain_id: value.srcChainID,
    dst_chain_id: value.dstChainID,
  };
}

export function transferEventFromJSON(value: TransferEventJSON): TransferEvent {
  if ('ibc_transfer' in value) {
    return {
      ibcTransfer: transferInfoFromJSON(value.ibc_transfer),
    };
  }

  if ('cctp_transfer' in value) {
    return {
      cctpTransfer: cctpTransferInfoFromJSON(value.cctp_transfer),
    };
  }

  if ('hyperlane_transfer' in value) {
    return {
      hyperlaneTransfer: hyperlaneTransferInfoFromJSON(
        value.hyperlane_transfer
      ),
    };
  }

  if ('op_init_transfer' in value) {
    return {
      opInitTransfer: opInitTransferInfoFromJSON(value.op_init_transfer),
    };
  }

  return {
    axelarTransfer: axelarTransferInfoFromJSON(value.axelar_transfer),
  };
}

export function transferEventToJSON(value: TransferEvent): TransferEventJSON {
  if ('ibcTransfer' in value) {
    return {
      ibc_transfer: transferInfoToJSON(value.ibcTransfer),
    };
  }

  if ('cctpTransfer' in value) {
    return {
      cctp_transfer: cctpTransferInfoToJSON(value.cctpTransfer),
    };
  }

  if ('hyperlaneTransfer' in value) {
    return {
      hyperlane_transfer: hyperlaneTransferInfoToJSON(value.hyperlaneTransfer),
    };
  }

  if ('opInitTransfer' in value) {
    return {
      op_init_transfer: opInitTransferInfoToJSON(value.opInitTransfer),
    };
  }

  return {
    axelar_transfer: axelarTransferInfoToJSON(value.axelarTransfer),
  };
}

export function transferStatusFromJSON(
  value: TransferStatusJSON
): TransferStatus {
  return {
    transferSequence: value.transfer_sequence.map(transferEventFromJSON),
    transferAssetRelease:
      value.transfer_asset_release &&
      transferAssetReleaseFromJSON(value.transfer_asset_release),
    error: value.error,
    state: value.state,
    nextBlockingTransfer:
      value.next_blocking_transfer &&
      nextBlockingTransferFromJSON(value.next_blocking_transfer),
  };
}

export function transferStatusToJSON(
  value: TransferStatus
): TransferStatusJSON {
  return {
    transfer_sequence: value.transferSequence.map(transferEventToJSON),
    transfer_asset_release:
      value.transferAssetRelease &&
      transferAssetReleaseToJSON(value.transferAssetRelease),
    error: value.error,
    state: value.state,
    next_blocking_transfer:
      value.nextBlockingTransfer &&
      nextBlockingTransferToJSON(value.nextBlockingTransfer),
  };
}

export function denomWithChainIDFromJSON(
  value: DenomWithChainIDJSON
): DenomWithChainID {
  return {
    chainID: value.chain_id,
    denom: value.denom,
  };
}

export function denomWithChainIDToJSON(
  value: DenomWithChainID
): DenomWithChainIDJSON {
  return {
    chain_id: value.chainID,
    denom: value.denom,
  };
}

export function assetOrErrorFromJSON(value: AssetOrErrorJSON): AssetOrError {
  if ('asset' in value) {
    return { asset: assetFromJSON(value.asset) };
  }

  return { error: value.error };
}

export function assetOrErrorToJSON(value: AssetOrError): AssetOrErrorJSON {
  if ('asset' in value) {
    return { asset: assetToJSON(value.asset) };
  }

  return { error: value.error };
}

export function originAssetsRequestFromJSON(
  value: OriginAssetsRequestJSON
): OriginAssetsRequest {
  return {
    assets: value.assets.map(denomWithChainIDFromJSON),
  };
}

export function originAssetsRequestToJSON(
  value: OriginAssetsRequest
): OriginAssetsRequestJSON {
  return {
    assets: value.assets.map(denomWithChainIDToJSON),
  };
}

export function originAssetsResponseFromJSON(
  value: OriginAssetsResponseJSON
): OriginAssetsResponse {
  return {
    originAssets: value.origin_assets.map(assetOrErrorFromJSON),
  };
}

export function originAssetsResponseToJSON(
  value: OriginAssetsResponse
): OriginAssetsResponseJSON {
  return {
    origin_assets: value.originAssets.map(assetOrErrorToJSON),
  };
}

export function assetBetweenChainsFromJSON(
  value: AssetBetweenChainsJSON
): AssetBetweenChains {
  return {
    assetOnSource: assetFromJSON(value.asset_on_source),
    assetOnDest: assetFromJSON(value.asset_on_dest),
    txsRequired: value.txs_required,
    bridges: value.bridges,
  };
}

export function assetBetweenChainsToJSON(
  value: AssetBetweenChains
): AssetBetweenChainsJSON {
  return {
    asset_on_source: assetToJSON(value.assetOnSource),
    asset_on_dest: assetToJSON(value.assetOnDest),
    txs_required: value.txsRequired,
    bridges: value.bridges,
  };
}

export function assetsBetweenChainsRequestFromJSON(
  value: AssetsBetweenChainsRequestJSON
): AssetsBetweenChainsRequest {
  return {
    sourceChainID: value.source_chain_id,
    destChainID: value.dest_chain_id,
    includeNoMetadataAssets: value.include_no_metadata_assets,
    includeCW20Assets: value.include_cw20_assets,
    includeEvmAssets: value.include_evm_assets,
    allowMultiTx: value.allow_multi_tx,
  };
}

export function assetsBetweenChainsRequestToJSON(
  value: AssetsBetweenChainsRequest
): AssetsBetweenChainsRequestJSON {
  return {
    source_chain_id: value.sourceChainID,
    dest_chain_id: value.destChainID,
    include_no_metadata_assets: value.includeNoMetadataAssets,
    include_cw20_assets: value.includeCW20Assets,
    include_evm_assets: value.includeEvmAssets,
    allow_multi_tx: value.allowMultiTx,
  };
}

export function assetsBetweenChainsResponseFromJSON(
  value: AssetsBetweenChainsResponseJSON
): AssetsBetweenChainsResponse {
  return {
    assetsBetweenChains: value.assets_between_chains.map(
      assetBetweenChainsFromJSON
    ),
  };
}

export function assetRecommendationRequestFromJSON(
  value: AssetRecommendationRequestJSON
): AssetRecommendationRequest {
  return {
    sourceAssetDenom: value.source_asset_denom,
    sourceAssetChainID: value.source_asset_chain_id,
    destChainID: value.dest_chain_id,
    reason: value.reason,
  };
}

export function assetRecommendationRequestToJSON(
  value: AssetRecommendationRequest
): AssetRecommendationRequestJSON {
  return {
    source_asset_denom: value.sourceAssetDenom,
    source_asset_chain_id: value.sourceAssetChainID,
    dest_chain_id: value.destChainID,
    reason: value.reason,
  };
}

export function bridgesResponseFromJSON(
  value: BridgesResponseJSON
): BridgesResponse {
  return {
    bridges: value.bridges.map(bridgeFromJSON),
  };
}

export function bridgesResponseToJSON(
  value: BridgesResponse
): BridgesResponseJSON {
  return {
    bridges: value.bridges.map(bridgeToJSON),
  };
}

export function bridgeFromJSON(value: BridgeJSON): Bridge {
  return {
    id: value.id,
    name: value.name,
    logoURI: value.logo_uri,
  };
}

export function bridgeToJSON(value: Bridge): BridgeJSON {
  return {
    id: value.id,
    name: value.name,
    logo_uri: value.logoURI,
  };
}

export function cctpTransferTransactionsFromJSON(
  value: CCTPTransferTransactionsJSON
): CCTPTransferTransactions {
  return {
    sendTx: value.send_tx ? chainTransactionFromJSON(value.send_tx) : null,
    receiveTx: value.receive_tx
      ? chainTransactionFromJSON(value.receive_tx)
      : null,
  };
}

export function cctpTransferTransactionsToJSON(
  value: CCTPTransferTransactions
): CCTPTransferTransactionsJSON {
  return {
    send_tx: value.sendTx ? chainTransactionToJSON(value.sendTx) : null,
    receive_tx: value.receiveTx
      ? chainTransactionToJSON(value.receiveTx)
      : null,
  };
}

export function cctpTransferInfoFromJSON(
  value: CCTPTransferInfoJSON
): CCTPTransferInfo {
  return {
    fromChainID: value.from_chain_id,
    toChainID: value.to_chain_id,
    state: value.state,
    txs: value.txs && cctpTransferTransactionsFromJSON(value.txs),
    srcChainID: value.src_chain_id,
    dstChainID: value.dst_chain_id,
  };
}

export function cctpTransferInfoToJSON(
  value: CCTPTransferInfo
): CCTPTransferInfoJSON {
  return {
    from_chain_id: value.fromChainID,
    to_chain_id: value.toChainID,
    state: value.state,
    txs: value.txs && cctpTransferTransactionsToJSON(value.txs),
    src_chain_id: value.srcChainID,
    dst_chain_id: value.dstChainID,
  };
}

export function hyperlaneTransferTransactionsFromJSON(
  value: HyperlaneTransferTransactionsJSON
): HyperlaneTransferTransactions {
  return {
    sendTx: value.send_tx ? chainTransactionFromJSON(value.send_tx) : null,
    receiveTx: value.receive_tx
      ? chainTransactionFromJSON(value.receive_tx)
      : null,
  };
}

export function hyperlaneTransferTransactionsToJSON(
  value: HyperlaneTransferTransactions
): HyperlaneTransferTransactionsJSON {
  return {
    send_tx: value.sendTx ? chainTransactionToJSON(value.sendTx) : null,
    receive_tx: value.receiveTx
      ? chainTransactionToJSON(value.receiveTx)
      : null,
  };
}

export function hyperlaneTransferInfoFromJSON(
  value: HyperlaneTransferInfoJSON
): HyperlaneTransferInfo {
  return {
    fromChainID: value.from_chain_id,
    toChainID: value.to_chain_id,
    state: value.state,
    txs: value.txs && hyperlaneTransferTransactionsFromJSON(value.txs),
  };
}

export function hyperlaneTransferInfoToJSON(
  value: HyperlaneTransferInfo
): HyperlaneTransferInfoJSON {
  return {
    from_chain_id: value.fromChainID,
    to_chain_id: value.toChainID,
    state: value.state,
    txs: value.txs && hyperlaneTransferTransactionsToJSON(value.txs),
  };
}

export function opInitTransferTransactionsFromJSON(
  value: OPInitTransferTransactionsJSON
): OPInitTransferTransactions {
  return {
    sendTx: value.send_tx ? chainTransactionFromJSON(value.send_tx) : null,
    receiveTx: value.receive_tx
      ? chainTransactionFromJSON(value.receive_tx)
      : null,
  };
}

export function opInitTransferTransactionsToJSON(
  value: OPInitTransferTransactions
): OPInitTransferTransactionsJSON {
  return {
    send_tx: value.sendTx ? chainTransactionToJSON(value.sendTx) : null,
    receive_tx: value.receiveTx
      ? chainTransactionToJSON(value.receiveTx)
      : null,
  };
}

export function opInitTransferInfoFromJSON(
  value: OPInitTransferInfoJSON
): OPInitTransferInfo {
  return {
    fromChainID: value.from_chain_id,
    toChainID: value.to_chain_id,
    state: value.state,
    txs: value.txs && opInitTransferTransactionsFromJSON(value.txs),
  };
}

export function opInitTransferInfoToJSON(
  value: OPInitTransferInfo
): OPInitTransferInfoJSON {
  return {
    from_chain_id: value.fromChainID,
    to_chain_id: value.toChainID,
    state: value.state,
    txs: value.txs && opInitTransferTransactionsToJSON(value.txs),
  };
}

export function msgsDirectRequestFromJSON(
  msgDirectRequestJSON: MsgsDirectRequestJSON
): MsgsDirectRequest {
  return {
    sourceAssetDenom: msgDirectRequestJSON.source_asset_denom,
    sourceAssetChainID: msgDirectRequestJSON.source_asset_chain_id,
    destAssetDenom: msgDirectRequestJSON.dest_asset_denom,
    destAssetChainID: msgDirectRequestJSON.dest_asset_chain_id,
    amountIn: msgDirectRequestJSON.amount_in,
    amountOut: msgDirectRequestJSON.amount_out,
    chainIdsToAddresses: msgDirectRequestJSON.chain_ids_to_addresses,
    slippageTolerancePercent: msgDirectRequestJSON.slippage_tolerance_percent,
    affiliates: msgDirectRequestJSON.affiliates?.map(affiliateFromJSON),
    chainIDsToAffiliates: msgDirectRequestJSON.chain_ids_to_affiliates
      ? chainIDsToAffiliatesMapFromJSON(
          msgDirectRequestJSON.chain_ids_to_affiliates
        )
      : undefined,
    timeoutSeconds: msgDirectRequestJSON.timeout_seconds,
    postRouteHandler:
      msgDirectRequestJSON.post_route_handler &&
      postHandlerFromJSON(msgDirectRequestJSON.post_route_handler),
    swapVenue:
      msgDirectRequestJSON.swap_venue &&
      swapVenueFromJSON(msgDirectRequestJSON.swap_venue),
    swapVenues:
      msgDirectRequestJSON.swap_venues &&
      msgDirectRequestJSON.swap_venues.map(swapVenueFromJSON),
    smartRelay: msgDirectRequestJSON.smart_relay,
    smartSwapOptions: msgDirectRequestJSON.smart_swap_options
      ? smartSwapOptionsFromJSON(msgDirectRequestJSON.smart_swap_options)
      : undefined,
    allowSwaps: msgDirectRequestJSON.allow_swaps,
  };
}

export function msgsDirectRequestToJSON(
  msgDirectRequest: MsgsDirectRequest
): MsgsDirectRequestJSON {
  return {
    source_asset_denom: msgDirectRequest.sourceAssetDenom,
    source_asset_chain_id: msgDirectRequest.sourceAssetChainID,
    dest_asset_denom: msgDirectRequest.destAssetDenom,
    dest_asset_chain_id: msgDirectRequest.destAssetChainID,
    amount_in: msgDirectRequest.amountIn,
    amount_out: msgDirectRequest.amountOut,
    chain_ids_to_addresses: msgDirectRequest.chainIdsToAddresses,
    slippage_tolerance_percent: msgDirectRequest.slippageTolerancePercent,
    affiliates: msgDirectRequest.affiliates?.map(affiliateToJSON),
    chain_ids_to_affiliates: msgDirectRequest.chainIDsToAffiliates
      ? chainIDsToAffiliatesMapToJSON(msgDirectRequest.chainIDsToAffiliates)
      : undefined,
    allow_multi_tx: msgDirectRequest.allowMultiTx,
    allow_unsafe: msgDirectRequest.allowUnsafe,
    bridges: msgDirectRequest.bridges,
    timeout_seconds: msgDirectRequest.timeoutSeconds,
    experimental_features: msgDirectRequest.experimentalFeatures,
    swap_venue:
      msgDirectRequest.swapVenue && swapVenueToJSON(msgDirectRequest.swapVenue),
    swap_venues:
      msgDirectRequest.swapVenues &&
      msgDirectRequest.swapVenues.map(swapVenueToJSON),
    post_route_handler:
      msgDirectRequest.postRouteHandler &&
      postHandlerToJSON(msgDirectRequest.postRouteHandler),
    smart_relay: msgDirectRequest.smartRelay,
    smart_swap_options: msgDirectRequest.smartSwapOptions
      ? smartSwapOptionsToJSON(msgDirectRequest.smartSwapOptions)
      : undefined,
    allow_swaps: msgDirectRequest.allowSwaps,
  };
}

export function smartSwapOptionsFromJSON(
  smartSwapOptionsJSON: SmartSwapOptionsJSON
): SmartSwapOptions {
  return {
    splitRoutes: Boolean(smartSwapOptionsJSON.split_routes),
    evmSwaps: Boolean(smartSwapOptionsJSON.evm_swaps),
  };
}

export function smartSwapOptionsToJSON(
  smartSwapOptions: SmartSwapOptions
): SmartSwapOptionsJSON {
  return {
    split_routes: Boolean(smartSwapOptions.splitRoutes),
    evm_swaps: Boolean(smartSwapOptions.evmSwaps),
  };
}

export function chainIDsToAffiliatesMapFromJSON(
  value: Record<string, ChainAffiliatesJSON>
): Record<string, ChainAffiliates> {
  const result: Record<string, ChainAffiliates> = {};
  for (const key of Object.keys(value)) {
    result[key] = chainAffiliatesFromJSON(value[key]!);
  }
  return result;
}

export function chainIDsToAffiliatesMapToJSON(
  value: Record<string, ChainAffiliates>
): Record<string, ChainAffiliatesJSON> {
  const result: Record<string, ChainAffiliatesJSON> = {};
  for (const key of Object.keys(value)) {
    result[key] = chainAffiliatesToJSON(value[key]!);
  }
  return result;
}

export function chainAffiliatesFromJSON(
  value: ChainAffiliatesJSON
): ChainAffiliates {
  return {
    affiliates: value.affiliates.map(affiliateFromJSON),
  };
}

export function chainAffiliatesToJSON(
  value: ChainAffiliates
): ChainAffiliatesJSON {
  return {
    affiliates: value.affiliates.map(affiliateToJSON),
  };
}
