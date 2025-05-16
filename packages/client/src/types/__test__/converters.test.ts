import {
  affiliateFromJSON,
  affiliateToJSON,
  assetFromJSON,
  assetRecommendationFromJSON,
  assetRecommendationToJSON,
  assetsFromSourceRequestFromJSON,
  assetsFromSourceRequestToJSON,
  assetsRequestFromJSON,
  assetsRequestToJSON,
  assetToJSON,
  chainFromJSON,
  chainToJSON,
  chainTransactionFromJSON,
  chainTransactionToJSON,
  contractCallWithTokenTransactionsFromJSON,
  contractCallWithTokenTransactionsToJSON,
  cosmWasmContractMsgFromJSON,
  cosmWasmContractMsgToJSON,
  denomWithChainIDFromJSON,
  denomWithChainIDToJSON,
  feeAssetFromJSON,
  feeAssetToJSON,
  ibcAddressFromJSON,
  ibcAddressToJSON,
  ibcCapabilitiesFromJSON,
  ibcCapabilitiesToJSON,
  msgsRequestFromJSON,
  msgsRequestToJSON,
  multiChainMsgFromJSON,
  multiChainMsgToJSON,
  nextBlockingTransferFromJSON,
  nextBlockingTransferToJSON,
  operationFromJSON,
  operationToJSON,
  packetFromJSON,
  packetToJSON,
  postHandlerFromJSON,
  postHandlerToJSON,
  recommendAssetsRequestFromJSON,
  recommendAssetsRequestToJSON,
  routeRequestFromJSON,
  routeRequestToJSON,
  routeResponseFromJSON,
  routeResponseToJSON,
  sendTokenTransactionsFromJSON,
  sendTokenTransactionsToJSON,
  submitTxRequestFromJSON,
  submitTxRequestToJSON,
  submitTxResponseFromJSON,
  submitTxResponseToJSON,
  swapExactCoinInFromJSON,
  swapExactCoinInToJSON,
  swapExactCoinOutFromJSON,
  swapExactCoinOutToJSON,
  swapFromJSON,
  swapOperationFromJSON,
  swapOperationToJSON,
  swapToJSON,
  swapVenueFromJSON,
  swapVenueToJSON,
  trackTxRequestFromJSON,
  trackTxRequestToJSON,
  trackTxResponseFromJSON,
  trackTxResponseToJSON,
  transferAssetReleaseFromJSON,
  transferAssetReleaseToJSON,
  transferFromJSON,
  transferInfoFromJSON,
  transferInfoToJSON,
  transferToJSON,
  txStatusRequestFromJSON,
  txStatusRequestToJSON,
  txStatusResponseFromJSON,
  txStatusResponseToJSON,
} from "../converters";
import {
  ChainTransaction,
  ChainTransactionJSON,
  ContractCallWithTokenTransactions,
  ContractCallWithTokenTransactionsJSON,
  NextBlockingTransferJSON,
  Packet,
  PacketJSON,
  SendTokenTransactions,
  SendTokenTransactionsJSON,
  StatusRequestJSON,
  SubmitTxRequestJSON,
  SubmitTxResponseJSON,
  TrackTxRequestJSON,
  TrackTxResponse,
  TrackTxResponseJSON,
  TransferAssetReleaseJSON,
  TransferInfo,
  TransferInfoJSON,
  TxStatusResponse,
  TxStatusResponseJSON,
} from "../lifecycle";
import {
  Chain,
  ChainJSON,
  FeeAssetJSON,
  IbcCapabilities,
  IbcCapabilitiesJSON,
} from "../routing";
import {
  AffiliateJSON,
  Asset,
  AssetJSON,
  DenomWithChainID,
  DenomWithChainIDJSON,
  IBCAddress,
  IBCAddressJSON,
  MultiChainMsgJSON,
  PostHandler,
  PostHandlerJSON,
  SwapExactCoinInJSON,
  TransferJSON,
} from "../shared";
import {
  AssetRecommendation,
  AssetRecommendationJSON,
  AssetsFromSourceRequest,
  AssetsFromSourceRequestJSON,
  BridgeType,
  ChainType,
  MsgsRequest,
  MsgsRequestJSON,
  RecommendAssetsRequest,
  RecommendAssetsRequestJSON,
  RouteResponse,
  RouteResponseJSON,
} from "../unified";

test("affiliateFromJSON", () => {
  const affiliateJSON: AffiliateJSON = {
    address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    basis_points_fee: "100",
  };

  expect(affiliateFromJSON(affiliateJSON)).toEqual({
    address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    basisPointsFee: "100",
  });
});

test("affiliateToJSON", () => {
  const affiliate = {
    address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    basisPointsFee: "100",
  };

  expect(affiliateToJSON(affiliate)).toEqual({
    address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    basis_points_fee: "100",
  });
});

test("assetFromJSON", () => {
  const assetJSON: AssetJSON = {
    denom: "uosmo",
    chain_id: "osmosis-1",
    origin_denom: "uosmo",
    origin_chain_id: "osmosis-1",
    is_cw20: false,
    is_evm: false,
    is_svm: false,
    trace: "",
    symbol: "OSMO",
    name: "OSMO",
    logo_uri:
      "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
    decimals: 6,
    token_contract: "token-contract-value",
    description: "description-value",
    coingecko_id: "coingecko-id-value",
    recommended_symbol: "OSMO",
  };

  expect(assetFromJSON(assetJSON)).toEqual({
    denom: "uosmo",
    chainID: "osmosis-1",
    originDenom: "uosmo",
    originChainID: "osmosis-1",
    isCW20: false,
    isEVM: false,
    isSVM: false,
    trace: "",
    symbol: "OSMO",
    name: "OSMO",
    logoURI:
      "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
    decimals: 6,
    tokenContract: "token-contract-value",
    description: "description-value",
    coingeckoID: "coingecko-id-value",
    recommendedSymbol: "OSMO",
  });
});

test("assetToJSON", () => {
  const asset: Asset = {
    denom: "uosmo",
    chainID: "osmosis-1",
    originDenom: "uosmo",
    originChainID: "osmosis-1",
    trace: "",
    isCW20: false,
    isEVM: false,
    isSVM: false,
    symbol: "OSMO",
    name: "OSMO",
    logoURI:
      "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
    decimals: 6,
    tokenContract: "token-contract-value",
    description: "description-value",
    coingeckoID: "coingecko-id-value",
    recommendedSymbol: "OSMO",
  };

  expect(assetToJSON(asset)).toEqual({
    denom: "uosmo",
    chain_id: "osmosis-1",
    origin_denom: "uosmo",
    origin_chain_id: "osmosis-1",
    is_cw20: false,
    is_evm: false,
    is_svm: false,
    trace: "",
    symbol: "OSMO",
    name: "OSMO",
    logo_uri:
      "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
    decimals: 6,
    token_contract: "token-contract-value",
    description: "description-value",
    coingecko_id: "coingecko-id-value",
    recommended_symbol: "OSMO",
  });
});

test("assetRecommendationFromJSON", () => {
  const assetRecommendationJSON: AssetRecommendationJSON = {
    asset: {
      denom: "uosmo",
      chain_id: "osmosis-1",
      origin_denom: "uosmo",
      origin_chain_id: "osmosis-1",
      trace: "",
      is_cw20: false,
      is_evm: false,
      is_svm: false,
      symbol: "OSMO",
      name: "OSMO",
      logo_uri:
        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
      decimals: 6,
      token_contract: "token-contract-value",
      description: "description-value",
      coingecko_id: "coingecko-id-value",
      recommended_symbol: "OSMO",
    },
    reason: "MOST_LIQUID",
  };

  expect(assetRecommendationFromJSON(assetRecommendationJSON)).toEqual({
    asset: {
      denom: "uosmo",
      chainID: "osmosis-1",
      originDenom: "uosmo",
      originChainID: "osmosis-1",
      trace: "",
      isCW20: false,
      isEVM: false,
      isSVM: false,
      symbol: "OSMO",
      name: "OSMO",
      logoURI:
        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
      decimals: 6,
      tokenContract: "token-contract-value",
      description: "description-value",
      coingeckoID: "coingecko-id-value",
      recommendedSymbol: "OSMO",
    },
    reason: "MOST_LIQUID",
  });
});

test("assetRecommendationToJSON", () => {
  const assetRecommendation: AssetRecommendation = {
    asset: {
      denom: "uosmo",
      chainID: "osmosis-1",
      originDenom: "uosmo",
      originChainID: "osmosis-1",
      trace: "",
      isCW20: false,
      isEVM: false,
      isSVM: false,
      symbol: "OSMO",
      name: "OSMO",
      logoURI:
        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
      decimals: 6,
      tokenContract: "token-contract-value",
      description: "description-value",
      coingeckoID: "coingecko-id-value",
      recommendedSymbol: "OSMO",
    },
    reason: "MOST_LIQUID",
  };

  expect(assetRecommendationToJSON(assetRecommendation)).toEqual({
    asset: {
      denom: "uosmo",
      chain_id: "osmosis-1",
      origin_denom: "uosmo",
      origin_chain_id: "osmosis-1",
      is_cw20: false,
      is_evm: false,
      is_svm: false,
      trace: "",
      symbol: "OSMO",
      name: "OSMO",
      logo_uri:
        "https://raw.githubusercontent.com/cosmostation/chainlist/main/chain/osmosis/asset/osmo.png",
      decimals: 6,
      token_contract: "token-contract-value",
      description: "description-value",
      coingecko_id: "coingecko-id-value",
      recommended_symbol: "OSMO",
    },
    reason: "MOST_LIQUID",
  });
});

test("assetsFromSourceRequestFromJSON", () => {
  const assetsFromSourceRequestJSON: AssetsFromSourceRequestJSON = {
    source_asset_denom: "uosmo",
    source_asset_chain_id: "osmosis-1",
    allow_multi_tx: true,
    include_cw20_assets: true,
  };

  const expected: AssetsFromSourceRequest = {
    sourceAssetDenom: "uosmo",
    sourceAssetChainID: "osmosis-1",
    allowMultiTx: true,
    includeCW20Assets: true,
  };

  expect(assetsFromSourceRequestFromJSON(assetsFromSourceRequestJSON)).toEqual(
    expected,
  );
});

test("assetsFromSourceRequestToJSON", () => {
  const assetsFromSourceRequest: AssetsFromSourceRequest = {
    sourceAssetDenom: "uosmo",
    sourceAssetChainID: "osmosis-1",
    allowMultiTx: true,
    includeCW20Assets: true,
  };

  const expected: AssetsFromSourceRequestJSON = {
    source_asset_denom: "uosmo",
    source_asset_chain_id: "osmosis-1",
    allow_multi_tx: true,
    include_cw20_assets: true,
  };

  expect(assetsFromSourceRequestToJSON(assetsFromSourceRequest)).toEqual(
    expected,
  );
});

test("assetsRequestFromJSON", () => {
  const assetsRequestJSON = {
    chain_id: "osmosis-1",
    native_only: true,
    include_no_metadata_assets: true,
  };

  expect(assetsRequestFromJSON(assetsRequestJSON)).toEqual({
    chainID: "osmosis-1",
    nativeOnly: true,
    includeNoMetadataAssets: true,
  });
});

test("assetsRequestToJSON", () => {
  const assetsRequest = {
    chainID: "osmosis-1",
    nativeOnly: true,
    includeNoMetadataAssets: true,
  };

  expect(assetsRequestToJSON(assetsRequest)).toEqual({
    chain_id: "osmosis-1",
    native_only: true,
    include_no_metadata_assets: true,
  });
});

test("chainFromJSON", () => {
  const chainJSON: ChainJSON = {
    chain_name: "osmosis",
    chain_id: "osmosis-1",
    chain_type: ChainType.Cosmos,
    pfm_enabled: true,
    is_testnet: false,
    cosmos_sdk_version: "v0.47.3",
    pretty_name: "Osmosis",
    modules: {
      "github.com/cosmos/ibc-go": {
        path: "github.com/cosmos/ibc-go/v4",
        version: "v4.3.1",
        sum: "h1:xbg0CaCdxK3lvgGvSaI91ROOLd7s30UqEcexH6Ba4Ys=",
      },
      "github.com/osmosis-labs/osmosis/x/ibc-hooks": {
        path: "github.com/osmosis-labs/osmosis/x/ibc-hooks",
        version: "v0.0.7",
        sum: "h1:rd5guXn/SF6i66PO5rlGaDK0AT81kCpiLixyQ5EJ6Yg=",
      },
      "github.com/strangelove-ventures/packet-forward-middleware": {
        path: "github.com/strangelove-ventures/packet-forward-middleware/v4",
        version: "v4.0.5",
        sum: "h1:KKUqeGhVBK38+1LwThC8IeIcsJZ6COX5kvhiJroFqCM=",
      },
    },
    cosmos_module_support: {
      authz: true,
      feegrant: false,
    },
    supports_memo: true,
    logo_uri:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
    bech32_prefix: "osmo",
    ibc_capabilities: {
      cosmos_pfm: true,
      cosmos_ibc_hooks: true,
      cosmos_memo: true,
      cosmos_autopilot: false,
    },
    fee_assets: [
      {
        denom: "uosmo",
        gas_price: {
          low: "0.0025",
          average: "0.025",
          high: "0.04",
        },
      },
    ],
  };

  expect(chainFromJSON(chainJSON)).toEqual({
    chainName: "osmosis",
    chainID: "osmosis-1",
    pfmEnabled: true,
    cosmosSDKVersion: "v0.47.3",
    chainType: "cosmos",
    isTestnet: false,
    prettyName: "Osmosis",
    modules: {
      "github.com/cosmos/ibc-go": {
        path: "github.com/cosmos/ibc-go/v4",
        version: "v4.3.1",
        sum: "h1:xbg0CaCdxK3lvgGvSaI91ROOLd7s30UqEcexH6Ba4Ys=",
      },
      "github.com/osmosis-labs/osmosis/x/ibc-hooks": {
        path: "github.com/osmosis-labs/osmosis/x/ibc-hooks",
        version: "v0.0.7",
        sum: "h1:rd5guXn/SF6i66PO5rlGaDK0AT81kCpiLixyQ5EJ6Yg=",
      },
      "github.com/strangelove-ventures/packet-forward-middleware": {
        path: "github.com/strangelove-ventures/packet-forward-middleware/v4",
        version: "v4.0.5",
        sum: "h1:KKUqeGhVBK38+1LwThC8IeIcsJZ6COX5kvhiJroFqCM=",
      },
    },
    cosmosModuleSupport: {
      authz: true,
      feegrant: false,
    },
    supportsMemo: true,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
    bech32Prefix: "osmo",
    ibcCapabilities: {
      cosmosPfm: true,
      cosmosIbcHooks: true,
      cosmosMemo: true,
      cosmosAutopilot: false,
    },
    feeAssets: [
      {
        denom: "uosmo",
        gasPrice: {
          low: "0.0025",
          average: "0.025",
          high: "0.04",
        },
      },
    ],
  } as Chain);
});

test("chainToJSON", () => {
  const chain: Chain = {
    chainName: "osmosis",
    chainID: "osmosis-1",
    pfmEnabled: true,
    isTestnet: false,
    cosmosSDKVersion: "v0.47.3",
    chainType: ChainType.Cosmos,
    prettyName: "Osmosis",
    modules: {
      "github.com/cosmos/ibc-go": {
        path: "github.com/cosmos/ibc-go/v4",
        version: "v4.3.1",
        sum: "h1:xbg0CaCdxK3lvgGvSaI91ROOLd7s30UqEcexH6Ba4Ys=",
      },
      "github.com/osmosis-labs/osmosis/x/ibc-hooks": {
        path: "github.com/osmosis-labs/osmosis/x/ibc-hooks",
        version: "v0.0.7",
        sum: "h1:rd5guXn/SF6i66PO5rlGaDK0AT81kCpiLixyQ5EJ6Yg=",
      },
      "github.com/strangelove-ventures/packet-forward-middleware": {
        path: "github.com/strangelove-ventures/packet-forward-middleware/v4",
        version: "v4.0.5",
        sum: "h1:KKUqeGhVBK38+1LwThC8IeIcsJZ6COX5kvhiJroFqCM=",
      },
    },
    cosmosModuleSupport: {
      authz: true,
      feegrant: false,
    },
    supportsMemo: true,
    logoURI:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
    bech32Prefix: "osmo",
    ibcCapabilities: {
      cosmosPfm: true,
      cosmosIbcHooks: true,
      cosmosMemo: true,
      cosmosAutopilot: false,
    },
    feeAssets: [
      {
        denom: "uosmo",
        gasPrice: {
          low: "0.0025",
          average: "0.025",
          high: "0.04",
        },
      },
    ],
  };

  expect(chainToJSON(chain)).toEqual({
    chain_name: "osmosis",
    chain_id: "osmosis-1",
    pfm_enabled: true,
    is_testnet: false,
    cosmos_sdk_version: "v0.47.3",
    chain_type: "cosmos",
    pretty_name: "Osmosis",
    modules: {
      "github.com/cosmos/ibc-go": {
        path: "github.com/cosmos/ibc-go/v4",
        version: "v4.3.1",
        sum: "h1:xbg0CaCdxK3lvgGvSaI91ROOLd7s30UqEcexH6Ba4Ys=",
      },
      "github.com/osmosis-labs/osmosis/x/ibc-hooks": {
        path: "github.com/osmosis-labs/osmosis/x/ibc-hooks",
        version: "v0.0.7",
        sum: "h1:rd5guXn/SF6i66PO5rlGaDK0AT81kCpiLixyQ5EJ6Yg=",
      },
      "github.com/strangelove-ventures/packet-forward-middleware": {
        path: "github.com/strangelove-ventures/packet-forward-middleware/v4",
        version: "v4.0.5",
        sum: "h1:KKUqeGhVBK38+1LwThC8IeIcsJZ6COX5kvhiJroFqCM=",
      },
    },
    cosmos_module_support: {
      authz: true,
      feegrant: false,
    },
    supports_memo: true,
    logo_uri:
      "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
    bech32_prefix: "osmo",
    ibc_capabilities: {
      cosmos_pfm: true,
      cosmos_ibc_hooks: true,
      cosmos_memo: true,
      cosmos_autopilot: false,
    },
    fee_assets: [
      {
        denom: "uosmo",
        gas_price: {
          low: "0.0025",
          average: "0.025",
          high: "0.04",
        },
      },
    ],
  } as ChainJSON);
});

test("feeAssetFromJSON", () => {
  const feeAssetJSON: FeeAssetJSON = {
    denom: "uosmo",
    gas_price: {
      low: "0.0025",
      average: "0.025",
      high: "0.04",
    },
  };

  expect(feeAssetFromJSON(feeAssetJSON)).toEqual({
    denom: "uosmo",
    gasPrice: {
      low: "0.0025",
      average: "0.025",
      high: "0.04",
    },
  });
});

test("feeAssetToJSON", () => {
  const feeAsset = {
    denom: "uosmo",
    gasPrice: {
      low: "0.0025",
      average: "0.025",
      high: "0.04",
    },
  };

  expect(feeAssetToJSON(feeAsset)).toEqual({
    denom: "uosmo",
    gas_price: {
      low: "0.0025",
      average: "0.025",
      high: "0.04",
    },
  });
});

test("ibcCapabilitiesFromJSON", () => {
  const ibcCapabilitiesJSON: IbcCapabilitiesJSON = {
    cosmos_pfm: true,
    cosmos_ibc_hooks: true,
    cosmos_memo: true,
    cosmos_autopilot: false,
  };

  expect(ibcCapabilitiesFromJSON(ibcCapabilitiesJSON)).toEqual({
    cosmosPfm: true,
    cosmosIbcHooks: true,
    cosmosMemo: true,
    cosmosAutopilot: false,
  } as IbcCapabilities);
});

test("ibcCapabilitiesToJSON", () => {
  const ibcCapabilities: IbcCapabilities = {
    cosmosPfm: true,
    cosmosIbcHooks: true,
    cosmosMemo: true,
    cosmosAutopilot: false,
  };

  expect(ibcCapabilitiesToJSON(ibcCapabilities)).toEqual({
    cosmos_pfm: true,
    cosmos_ibc_hooks: true,
    cosmos_memo: true,
    cosmos_autopilot: false,
  } as IbcCapabilitiesJSON);
});

test("recommendAssetsRequestFromJSON", () => {
  const recommendAssetsRequestJSON: RecommendAssetsRequestJSON = {
    requests: [
      {
        source_asset_denom: "uosmo",
        source_asset_chain_id: "osmosis-1",
        dest_chain_id: "neutron-1",
        reason: "MOST_LIQUID",
      },
    ],
  };

  expect(recommendAssetsRequestFromJSON(recommendAssetsRequestJSON)).toEqual({
    requests: [
      {
        sourceAssetDenom: "uosmo",
        sourceAssetChainID: "osmosis-1",
        destChainID: "neutron-1",
        reason: "MOST_LIQUID",
      },
    ],
  });
});

test("recommendAssetsRequestToJSON", () => {
  const recommendAssetsRequest: RecommendAssetsRequest = {
    requests: [
      {
        sourceAssetDenom: "uosmo",
        sourceAssetChainID: "osmosis-1",
        destChainID: "neutron-1",
        reason: "MOST_LIQUID",
      },
    ],
  };

  expect(recommendAssetsRequestToJSON(recommendAssetsRequest)).toEqual({
    requests: [
      {
        source_asset_denom: "uosmo",
        source_asset_chain_id: "osmosis-1",
        dest_chain_id: "neutron-1",
        reason: "MOST_LIQUID",
      },
    ],
  });
});

test("swapVenueFromJSON", () => {
  const swapVenueJSON = {
    name: "neutron-astroport",
    chain_id: "neutron-1",
    logo_uri:
      "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
  };

  expect(swapVenueFromJSON(swapVenueJSON)).toEqual({
    name: "neutron-astroport",
    chainID: "neutron-1",
    logoUri:
      "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
  });
});

test("swapVenueToJSON", () => {
  const swapVenue = {
    name: "neutron-astroport",
    chainID: "neutron-1",
    logoUri:
      "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
  };

  expect(swapVenueToJSON(swapVenue)).toEqual({
    name: "neutron-astroport",
    chain_id: "neutron-1",
    logo_uri:
      "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
  });
});

test("routeRequestFromJSON - given amount in", () => {
  const routeRequestJSON = {
    source_asset_chain_id: "osmosis-1",
    source_asset_denom: "uosmo",
    dest_asset_chain_id: "cosmoshub-4",
    dest_asset_denom: "uatom",
    amount_in: "1000000",

    cumulative_affiliate_fee_bps: "100",
    swap_venue: {
      name: "neutron-astroport",
      chain_id: "neutron-1",
    },
    swap_venues: [
      {
        name: "neutron-astroport",
        chain_id: "neutron-1",
      },
      {
        name: "osmosis-poolmanager",
        chain_id: "osmosis-1",
      },
    ],
  };

  expect(routeRequestFromJSON(routeRequestJSON)).toEqual({
    sourceAssetChainID: "osmosis-1",
    sourceAssetDenom: "uosmo",
    destAssetChainID: "cosmoshub-4",
    destAssetDenom: "uatom",
    amountIn: "1000000",
    cumulativeAffiliateFeeBPS: "100",
    swapVenue: {
      name: "neutron-astroport",
      chainID: "neutron-1",
    },
    swapVenues: [
      {
        name: "neutron-astroport",
        chainID: "neutron-1",
      },
      {
        name: "osmosis-poolmanager",
        chainID: "osmosis-1",
      },
    ],
  });
});

test("routeRequestFromJSON - given amount out", () => {
  const routeRequestJSON = {
    source_asset_chain_id: "osmosis-1",
    source_asset_denom: "uosmo",
    dest_asset_chain_id: "cosmoshub-4",
    dest_asset_denom: "uatom",
    amount_out: "1000000",

    cumulative_affiliate_fee_bps: "100",
    swap_venue: {
      name: "neutron-astroport",
      chain_id: "neutron-1",
    },
    swap_venues: [
      {
        name: "neutron-astroport",
        chain_id: "neutron-1",
      },
      {
        name: "osmosis-poolmanager",
        chain_id: "osmosis-1",
      },
    ],
  };

  expect(routeRequestFromJSON(routeRequestJSON)).toEqual({
    sourceAssetChainID: "osmosis-1",
    sourceAssetDenom: "uosmo",
    destAssetChainID: "cosmoshub-4",
    destAssetDenom: "uatom",
    amountOut: "1000000",

    cumulativeAffiliateFeeBPS: "100",
    swapVenue: {
      name: "neutron-astroport",
      chainID: "neutron-1",
    },
    swapVenues: [
      {
        name: "neutron-astroport",
        chainID: "neutron-1",
      },
      {
        name: "osmosis-poolmanager",
        chainID: "osmosis-1",
      },
    ],
  });
});

test("routeRequestToJSON - given amount in", () => {
  const routeRequest = {
    sourceAssetChainID: "osmosis-1",
    sourceAssetDenom: "uosmo",
    destAssetChainID: "cosmoshub-4",
    destAssetDenom: "uatom",
    amountIn: "1000000",

    cumulativeAffiliateFeeBPS: "100",
    swapVenue: {
      name: "neutron-astroport",
      chainID: "neutron-1",
    },
    swapVenues: [
      {
        name: "neutron-astroport",
        chainID: "neutron-1",
      },
      {
        name: "osmosis-poolmanager",
        chainID: "osmosis-1",
      },
    ],
  };

  expect(routeRequestToJSON(routeRequest)).toEqual({
    source_asset_chain_id: "osmosis-1",
    source_asset_denom: "uosmo",
    dest_asset_chain_id: "cosmoshub-4",
    dest_asset_denom: "uatom",
    amount_in: "1000000",

    cumulative_affiliate_fee_bps: "100",
    swap_venue: {
      name: "neutron-astroport",
      chain_id: "neutron-1",
    },
    swap_venues: [
      {
        name: "neutron-astroport",
        chain_id: "neutron-1",
      },
      {
        name: "osmosis-poolmanager",
        chain_id: "osmosis-1",
      },
    ],
  });
});

test("routeRequestToJSON - given amount out", () => {
  const routeRequest = {
    sourceAssetChainID: "osmosis-1",
    sourceAssetDenom: "uosmo",
    destAssetChainID: "cosmoshub-4",
    destAssetDenom: "uatom",
    amountOut: "1000000",

    cumulativeAffiliateFeeBPS: "100",
    swapVenue: {
      name: "neutron-astroport",
      chainID: "neutron-1",
    },
    swapVenues: [
      {
        name: "neutron-astroport",
        chainID: "neutron-1",
      },
      {
        name: "osmosis-poolmanager",
        chainID: "osmosis-1",
      },
    ],
  };

  expect(routeRequestToJSON(routeRequest)).toEqual({
    source_asset_chain_id: "osmosis-1",
    source_asset_denom: "uosmo",
    dest_asset_chain_id: "cosmoshub-4",
    dest_asset_denom: "uatom",
    amount_out: "1000000",

    cumulative_affiliate_fee_bps: "100",
    swap_venue: {
      name: "neutron-astroport",
      chain_id: "neutron-1",
    },
    swap_venues: [
      {
        name: "neutron-astroport",
        chain_id: "neutron-1",
      },
      {
        name: "osmosis-poolmanager",
        chain_id: "osmosis-1",
      },
    ],
  });
});

test("transferFromJSON", () => {
  const transferJSON: TransferJSON = {
    port: "transfer",
    channel: "channel-0",
    chain_id: "osmosis-1",
    pfm_enabled: true,
    dest_denom: "uatom",
    supports_memo: true,
    bridge_id: "IBC",
    denom_in: "uosmo",
    denom_out: "uatom",
    from_chain_id: "osmosis-1",
    to_chain_id: "cosmoshub-4",
    smart_relay: true,
  };

  expect(transferFromJSON(transferJSON)).toEqual({
    port: "transfer",
    channel: "channel-0",
    chainID: "osmosis-1",
    pfmEnabled: true,
    destDenom: "uatom",
    supportsMemo: true,
    bridgeID: "IBC",
    denomIn: "uosmo",
    denomOut: "uatom",
    fromChainID: "osmosis-1",
    toChainID: "cosmoshub-4",
    smartRelay: true,
  });
});

test("transferToJSON", () => {
  const transfer = {
    port: "transfer",
    channel: "channel-0",
    chainID: "osmosis-1",
    pfmEnabled: true,
    destDenom: "uatom",
    supportsMemo: true,
    bridgeID: "IBC" as BridgeType,
    denomIn: "uosmo",
    denomOut: "uatom",
    fromChainID: "osmosis-1",
    toChainID: "cosmoshub-4",
    smartRelay: false,
  };

  expect(transferToJSON(transfer)).toEqual({
    port: "transfer",
    channel: "channel-0",
    chain_id: "osmosis-1",
    pfm_enabled: true,
    dest_denom: "uatom",
    supports_memo: true,
    bridge_id: "IBC",
    denom_in: "uosmo",
    denom_out: "uatom",
    from_chain_id: "osmosis-1",
    to_chain_id: "cosmoshub-4",
    smart_relay: false,
  });
});

test("swapOperationFromJSON", () => {
  const swapOperationJSON = {
    pool: "pool-0",
    denom_in: "uosmo",
    denom_out: "uatom",
  };

  expect(swapOperationFromJSON(swapOperationJSON)).toEqual({
    pool: "pool-0",
    denomIn: "uosmo",
    denomOut: "uatom",
  });
});

test("swapOperationToJSON", () => {
  const swapOperation = {
    pool: "pool-0",
    denomIn: "uosmo",
    denomOut: "uatom",
  };

  expect(swapOperationToJSON(swapOperation)).toEqual({
    pool: "pool-0",
    denom_in: "uosmo",
    denom_out: "uatom",
  });
});

test("swapExactCoinInFromJSON", () => {
  const swapExactCoinInJSON: SwapExactCoinInJSON = {
    swap_venue: {
      name: "neutron-astroport",
      chain_id: "neutron-1",
      logo_uri:
        "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
    },
    swap_operations: [
      {
        pool: "pool-0",
        denom_in: "uosmo",
        denom_out: "uatom",
      },
    ],
    swap_amount_in: "1000000",
    estimated_amount_out: "2000000",
  };

  expect(swapExactCoinInFromJSON(swapExactCoinInJSON)).toEqual({
    swapVenue: {
      name: "neutron-astroport",
      chainID: "neutron-1",
      logoUri:
        "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
    },
    swapOperations: [
      {
        pool: "pool-0",
        denomIn: "uosmo",
        denomOut: "uatom",
      },
    ],
    swapAmountIn: "1000000",
    estimatedAmountOut: "2000000",
  });
});

test("swapExactCoinInToJSON", () => {
  const swapExactCoinIn = {
    swapVenue: {
      name: "neutron-astroport",
      chainID: "neutron-1",
      logoUri:
        "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
    },
    swapOperations: [
      {
        pool: "pool-0",
        denomIn: "uosmo",
        denomOut: "uatom",
      },
    ],
    swapAmountIn: "1000000",
    estimatedAmountOut: "2000000",
  };

  expect(swapExactCoinInToJSON(swapExactCoinIn)).toEqual({
    swap_venue: {
      name: "neutron-astroport",
      chain_id: "neutron-1",
      logo_uri:
        "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
    },
    swap_operations: [
      {
        pool: "pool-0",
        denom_in: "uosmo",
        denom_out: "uatom",
      },
    ],
    swap_amount_in: "1000000",
    estimated_amount_out: "2000000",
  });
});

test("swapExactCoinOutFromJSON", () => {
  const swapExactCoinOutJSON = {
    swap_venue: {
      name: "neutron-astroport",
      chain_id: "neutron-1",
      logo_uri:
        "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
    },
    swap_operations: [
      {
        pool: "pool-0",
        denom_in: "uosmo",
        denom_out: "uatom",
      },
    ],
    swap_amount_out: "1000000",
  };

  expect(swapExactCoinOutFromJSON(swapExactCoinOutJSON)).toEqual({
    swapVenue: {
      name: "neutron-astroport",
      chainID: "neutron-1",
      logoUri:
        "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
    },
    swapOperations: [
      {
        pool: "pool-0",
        denomIn: "uosmo",
        denomOut: "uatom",
      },
    ],
    swapAmountOut: "1000000",
  });
});

test("swapExactCoinOutToJSON", () => {
  const swapExactCoinOut = {
    swapVenue: {
      name: "neutron-astroport",
      chainID: "neutron-1",
      logoUri:
        "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
    },
    swapOperations: [
      {
        pool: "pool-0",
        denomIn: "uosmo",
        denomOut: "uatom",
      },
    ],
    swapAmountOut: "1000000",
  };

  expect(swapExactCoinOutToJSON(swapExactCoinOut)).toEqual({
    swap_venue: {
      name: "neutron-astroport",
      chain_id: "neutron-1",
      logo_uri:
        "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
    },
    swap_operations: [
      {
        pool: "pool-0",
        denom_in: "uosmo",
        denom_out: "uatom",
      },
    ],
    swap_amount_out: "1000000",
  });
});

test("swapFromJSON - swap in", () => {
  const swapJSON = {
    swap_in: {
      swap_venue: {
        name: "neutron-astroport",
        chain_id: "neutron-1",
        logo_uri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
      swap_operations: [
        {
          pool: "pool-0",
          denom_in: "uosmo",
          denom_out: "uatom",
        },
      ],
      swap_amount_in: "1000000",
      estimated_amount_out: "2000000",
    },
    estimated_affiliate_fee: "1000000",
    chain_id: "neutron-1",
    from_chain_id: "neutron-1",
    denom_in: "uosmo",
    denom_out: "uatom",
    swap_venues: [
      {
        name: "neutron-astroport",
        chain_id: "neutron-1",
        logo_uri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
    ],
  };

  expect(swapFromJSON(swapJSON)).toEqual({
    swapIn: {
      swapVenue: {
        name: "neutron-astroport",
        chainID: "neutron-1",
        logoUri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
      swapOperations: [
        {
          pool: "pool-0",
          denomIn: "uosmo",
          denomOut: "uatom",
        },
      ],
      swapAmountIn: "1000000",
      estimatedAmountOut: "2000000",
    },
    estimatedAffiliateFee: "1000000",
    chainID: "neutron-1",
    fromChainID: "neutron-1",
    denomIn: "uosmo",
    denomOut: "uatom",
    swapVenues: [
      {
        name: "neutron-astroport",
        chainID: "neutron-1",
        logoUri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
    ],
  });
});

test("swapFromJSON - swap out", () => {
  const swapJSON = {
    swap_out: {
      swap_venue: {
        name: "neutron-astroport",
        chain_id: "neutron-1",
        logo_uri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
      swap_operations: [
        {
          pool: "pool-0",
          denom_in: "uosmo",
          denom_out: "uatom",
        },
      ],
      swap_amount_out: "1000000",
    },
    chain_id: "neutron-1",
    from_chain_id: "neutron-1",
    denom_in: "uosmo",
    denom_out: "uatom",
    estimated_affiliate_fee: "1000000",
    swap_venues: [
      {
        name: "neutron-astroport",
        chain_id: "neutron-1",
        logo_uri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
    ],
  };

  expect(swapFromJSON(swapJSON)).toEqual({
    swapOut: {
      swapVenue: {
        name: "neutron-astroport",
        chainID: "neutron-1",
        logoUri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
      swapOperations: [
        {
          pool: "pool-0",
          denomIn: "uosmo",
          denomOut: "uatom",
        },
      ],
      swapAmountOut: "1000000",
    },
    chainID: "neutron-1",
    fromChainID: "neutron-1",
    denomIn: "uosmo",
    denomOut: "uatom",
    estimatedAffiliateFee: "1000000",
    swapVenues: [
      {
        name: "neutron-astroport",
        chainID: "neutron-1",
        logoUri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
    ],
  });
});

test("swapToJSON - swap in", () => {
  const swap = {
    swapIn: {
      swapVenue: {
        name: "neutron-astroport",
        chainID: "neutron-1",
        logoUri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
      swapOperations: [
        {
          pool: "pool-0",
          denomIn: "uosmo",
          denomOut: "uatom",
        },
      ],
      swapAmountIn: "1000000",
      estimatedAmountOut: "2000000",
    },
    chainID: "neutron-1",
    fromChainID: "neutron-1",
    denomIn: "uosmo",
    denomOut: "uatom",
    estimatedAffiliateFee: "1000000",
    swapVenues: [
      {
        name: "neutron-astroport",
        chainID: "neutron-1",
        logoUri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
    ],
  };

  expect(swapToJSON(swap)).toEqual({
    swap_in: {
      swap_venue: {
        name: "neutron-astroport",
        chain_id: "neutron-1",
        logo_uri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
      swap_operations: [
        {
          pool: "pool-0",
          denom_in: "uosmo",
          denom_out: "uatom",
        },
      ],
      swap_amount_in: "1000000",
      estimated_amount_out: "2000000",
    },
    chain_id: "neutron-1",
    from_chain_id: "neutron-1",
    denom_in: "uosmo",
    denom_out: "uatom",
    estimated_affiliate_fee: "1000000",
    swap_venues: [
      {
        name: "neutron-astroport",
        chain_id: "neutron-1",
        logo_uri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
    ],
  });
});

test("swapToJSON - swap out", () => {
  const swap = {
    swapOut: {
      swapVenue: {
        name: "neutron-astroport",
        chainID: "neutron-1",
        logoUri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
      swapOperations: [
        {
          pool: "pool-0",
          denomIn: "uosmo",
          denomOut: "uatom",
        },
      ],
      swapAmountOut: "1000000",
    },
    chainID: "neutron-1",
    fromChainID: "neutron-1",
    denomIn: "uosmo",
    denomOut: "uatom",
    estimatedAffiliateFee: "1000000",
    swapVenues: [
      {
        name: "neutron-astroport",
        chainID: "neutron-1",
        logoUri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
    ],
  };

  expect(swapToJSON(swap)).toEqual({
    swap_out: {
      swap_venue: {
        name: "neutron-astroport",
        chain_id: "neutron-1",
        logo_uri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
      swap_operations: [
        {
          pool: "pool-0",
          denom_in: "uosmo",
          denom_out: "uatom",
        },
      ],
      swap_amount_out: "1000000",
    },
    chain_id: "neutron-1",
    from_chain_id: "neutron-1",
    denom_in: "uosmo",
    denom_out: "uatom",
    estimated_affiliate_fee: "1000000",
    swap_venues: [
      {
        name: "neutron-astroport",
        chain_id: "neutron-1",
        logo_uri:
          "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
      },
    ],
  });
});

test("operationFromJSON - transfer", () => {
  const operationJSON = {
    transfer: {
      port: "transfer",
      channel: "channel-0",
      chain_id: "osmosis-1",
      pfm_enabled: true,
      dest_denom: "uatom",
      supports_memo: true,
      bridge_id: "IBC" as BridgeType,
      from_chain_id: "osmosis-1",
      to_chain_id: "cosmoshub-4",
      denom_in: "uosmo",
      denom_out: "uatom",
      smart_relay: false,
    },
    tx_index: 0,
    amount_in: "100000",
    amount_out: "100000",
  };

  expect(operationFromJSON(operationJSON)).toEqual({
    transfer: {
      port: "transfer",
      channel: "channel-0",
      chainID: "osmosis-1",
      pfmEnabled: true,
      destDenom: "uatom",
      supportsMemo: true,
      bridgeID: "IBC",
      fromChainID: "osmosis-1",
      toChainID: "cosmoshub-4",
      denomIn: "uosmo",
      denomOut: "uatom",
      smartRelay: false,
    },
    txIndex: 0,
    amountIn: "100000",
    amountOut: "100000",
  });
});

test("operationFromJSON - swap", () => {
  const operationJSON = {
    swap: {
      swap_in: {
        swap_venue: {
          name: "neutron-astroport",
          chain_id: "neutron-1",
          logo_uri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
        },
        swap_operations: [
          {
            pool: "pool-0",
            denom_in: "uosmo",
            denom_out: "uatom",
          },
        ],
        swap_amount_in: "1000000",
        estimated_amount_out: "1000000",
      },
      chain_id: "neutron-1",
      from_chain_id: "neutron-1",
      denom_in: "uosmo",
      denom_out: "uatom",
      estimated_affiliate_fee: "1000000",
      swap_venues: [
        {
          name: "neutron-astroport",
          chain_id: "neutron-1",
          logo_uri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
        },
      ],
    },
    tx_index: 0,
    amount_in: "100000",
    amount_out: "100000",
  };

  expect(operationFromJSON(operationJSON)).toEqual({
    swap: {
      swapIn: {
        swapVenue: {
          name: "neutron-astroport",
          chainID: "neutron-1",
          logoUri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
        },
        swapOperations: [
          {
            pool: "pool-0",
            denomIn: "uosmo",
            denomOut: "uatom",
          },
        ],
        swapAmountIn: "1000000",
        estimatedAmountOut: "1000000",
      },
      chainID: "neutron-1",
      fromChainID: "neutron-1",
      denomIn: "uosmo",
      denomOut: "uatom",
      estimatedAffiliateFee: "1000000",
      swapVenues: [
        {
          name: "neutron-astroport",
          chainID: "neutron-1",
          logoUri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
        },
      ],
    },
    txIndex: 0,
    amountIn: "100000",
    amountOut: "100000",
  });
});

test("operationToJSON - transfer", () => {
  const operation = {
    transfer: {
      port: "transfer",
      channel: "channel-0",
      chainID: "osmosis-1",
      pfmEnabled: true,
      destDenom: "uatom",
      supportsMemo: true,
      bridgeID: "IBC" as BridgeType,
      fromChainID: "osmosis-1",
      toChainID: "cosmoshub-4",
      denomIn: "uosmo",
      denomOut: "uatom",
      smartRelay: false,
    },
    txIndex: 0,
    amountIn: "100000",
    amountOut: "100000",
  };

  expect(operationToJSON(operation)).toEqual({
    transfer: {
      port: "transfer",
      channel: "channel-0",
      chain_id: "osmosis-1",
      pfm_enabled: true,
      dest_denom: "uatom",
      supports_memo: true,
      bridge_id: "IBC" as BridgeType,
      from_chain_id: "osmosis-1",
      to_chain_id: "cosmoshub-4",
      denom_in: "uosmo",
      denom_out: "uatom",
      smart_relay: false,
    },
    tx_index: 0,
    amount_in: "100000",
    amount_out: "100000",
  });
});

test("operationToJSON - swap", () => {
  const operation = {
    swap: {
      swapIn: {
        swapVenue: {
          name: "neutron-astroport",
          chainID: "neutron-1",
          logoUri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
        },
        swapOperations: [
          {
            pool: "pool-0",
            denomIn: "uosmo",
            denomOut: "uatom",
          },
        ],
        swapAmountIn: "1000000",
        estimatedAmountOut: "1000000",
      },
      chainID: "neutron-1",
      fromChainID: "neutron-1",
      denomIn: "uosmo",
      denomOut: "uatom",
      estimatedAffiliateFee: "1000000",
      swapVenues: [
        {
          name: "neutron-astroport",
          chainID: "neutron-1",
          logoUri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
        },
      ],
    },
    txIndex: 0,
    amountIn: "100000",
    amountOut: "100000",
  };

  expect(operationToJSON(operation)).toEqual({
    swap: {
      swap_in: {
        swap_venue: {
          name: "neutron-astroport",
          chain_id: "neutron-1",
          logo_uri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
        },
        swap_operations: [
          {
            pool: "pool-0",
            denom_in: "uosmo",
            denom_out: "uatom",
          },
        ],
        swap_amount_in: "1000000",
        estimated_amount_out: "1000000",
      },
      chain_id: "neutron-1",
      from_chain_id: "neutron-1",
      denom_in: "uosmo",
      denom_out: "uatom",
      estimated_affiliate_fee: "1000000",
      swap_venues: [
        {
          name: "neutron-astroport",
          chain_id: "neutron-1",
          logo_uri:
            "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
        },
      ],
    },
    tx_index: 0,
    amount_in: "100000",
    amount_out: "100000",
  });
});

test("routeResponseFromJSON", () => {
  const routeResponseJSON: RouteResponseJSON = {
    source_asset_denom: "uosmo",
    source_asset_chain_id: "osmosis-1",
    dest_asset_denom: "uatom",
    dest_asset_chain_id: "cosmoshub-4",
    amount_in: "1000000",
    amount_out: "54906",
    operations: [
      {
        swap: {
          swap_in: {
            swap_venue: {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
            swap_operations: [
              {
                pool: "pool-0",
                denom_in: "uosmo",
                denom_out: "uatom",
              },
            ],
            swap_amount_in: "1000000",
            estimated_amount_out: "1000000",
          },
          estimated_affiliate_fee: "1000000",
          chain_id: "neutron-1",
          from_chain_id: "neutron-1",
          denom_in: "uosmo",
          denom_out: "uatom",
          swap_venues: [
            {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
          ],
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
      {
        transfer: {
          port: "transfer",
          channel: "channel-0",
          chain_id: "osmosis-1",
          pfm_enabled: true,
          dest_denom: "uatom",
          supports_memo: true,
          smart_relay: false,
          bridge_id: "IBC",
          denom_in: "uosmo",
          denom_out: "uatom",
          from_chain_id: "osmosis-1",
          to_chain_id: "cosmoshub-4",
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
    ],
    chain_ids: ["osmosis-1", "cosmoshub-4"],
    required_chain_addresses: ["osmosis-1", "cosmoshub-4"],
    does_swap: true,
    estimated_amount_out: "54906",
    swap_venues: [
      {
        name: "osmosis-poolmanager",
        chain_id: "osmosis-1",
        logo_uri:
          "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
      },
    ],
    txs_required: 1,
    estimated_fees: [],
    estimated_route_duration_seconds: 60,
  };

  expect(routeResponseFromJSON(routeResponseJSON)).toEqual({
    sourceAssetDenom: "uosmo",
    sourceAssetChainID: "osmosis-1",
    destAssetDenom: "uatom",
    destAssetChainID: "cosmoshub-4",
    amountIn: "1000000",
    amountOut: "54906",
    operations: [
      {
        swap: {
          swapIn: {
            swapVenue: {
              name: "neutron-astroport",
              chainID: "neutron-1",
              logoUri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
            swapOperations: [
              {
                pool: "pool-0",
                denomIn: "uosmo",
                denomOut: "uatom",
              },
            ],
            swapAmountIn: "1000000",
            estimatedAmountOut: "1000000",
          },
          estimatedAffiliateFee: "1000000",
          chainID: "neutron-1",
          fromChainID: "neutron-1",
          denomIn: "uosmo",
          denomOut: "uatom",
          swapVenues: [
            {
              name: "neutron-astroport",
              chainID: "neutron-1",
              logoUri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
          ],
        },
        txIndex: 0,
        amountIn: "100000",
        amountOut: "100000",
      },
      {
        transfer: {
          port: "transfer",
          channel: "channel-0",
          chainID: "osmosis-1",
          pfmEnabled: true,
          destDenom: "uatom",
          supportsMemo: true,
          smartRelay: false,
          bridgeID: "IBC",
          denomIn: "uosmo",
          denomOut: "uatom",
          fromChainID: "osmosis-1",
          toChainID: "cosmoshub-4",
        },
        txIndex: 0,
        amountIn: "100000",
        amountOut: "100000",
      },
    ],
    chainIDs: ["osmosis-1", "cosmoshub-4"],
    requiredChainAddresses: ["osmosis-1", "cosmoshub-4"],
    doesSwap: true,
    estimatedAmountOut: "54906",
    swapVenues: [
      {
        name: "osmosis-poolmanager",
        chainID: "osmosis-1",
        logoUri:
          "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
      },
    ],
    estimatedFees: [],
    txsRequired: 1,
    estimatedRouteDurationSeconds: 60,
  });
});

test("routeResponseToJSON", () => {
  const routeResponse: RouteResponse = {
    sourceAssetDenom: "uosmo",
    sourceAssetChainID: "osmosis-1",
    destAssetDenom: "uatom",
    destAssetChainID: "cosmoshub-4",
    amountIn: "1000000",
    amountOut: "54906",
    operations: [
      {
        swap: {
          swapIn: {
            swapVenue: {
              name: "neutron-astroport",
              chainID: "neutron-1",
              logoUri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
            swapOperations: [
              {
                pool: "pool-0",
                denomIn: "uosmo",
                denomOut: "uatom",
              },
            ],
            swapAmountIn: "1000000",
            estimatedAmountOut: "1000000",
          },
          estimatedAffiliateFee: "1000000",
          chainID: "neutron-1",
          fromChainID: "neutron-1",
          denomIn: "uosmo",
          denomOut: "uatom",
          swapVenues: [
            {
              name: "neutron-astroport",
              chainID: "neutron-1",
              logoUri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
          ],
        },
        txIndex: 0,
        amountIn: "100000",
        amountOut: "100000",
      },
      {
        transfer: {
          port: "transfer",
          channel: "channel-0",
          chainID: "osmosis-1",
          pfmEnabled: true,
          destDenom: "uatom",
          supportsMemo: true,
          smartRelay: false,
          bridgeID: "IBC",
          denomIn: "uosmo",
          denomOut: "uatom",
          fromChainID: "osmosis-1",
          toChainID: "cosmoshub-4",
        },
        txIndex: 0,
        amountIn: "100000",
        amountOut: "100000",
      },
    ],
    chainIDs: ["osmosis-1", "cosmoshub-4"],
    requiredChainAddresses: ["osmosis-1", "cosmoshub-4"],
    doesSwap: true,
    estimatedAmountOut: "54906",
    swapVenues: [
      {
        name: "osmosis-poolmanager",
        chainID: "osmosis-1",
        logoUri:
          "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
      },
    ],
    estimatedFees: [],
    txsRequired: 1,
    estimatedRouteDurationSeconds: 60,
  };

  expect(routeResponseToJSON(routeResponse)).toEqual({
    source_asset_denom: "uosmo",
    source_asset_chain_id: "osmosis-1",
    dest_asset_denom: "uatom",
    dest_asset_chain_id: "cosmoshub-4",
    amount_in: "1000000",
    amount_out: "54906",
    operations: [
      {
        swap: {
          swap_in: {
            swap_venue: {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
            swap_operations: [
              {
                pool: "pool-0",
                denom_in: "uosmo",
                denom_out: "uatom",
              },
            ],
            swap_amount_in: "1000000",
            estimated_amount_out: "1000000",
          },
          estimated_affiliate_fee: "1000000",
          chain_id: "neutron-1",
          from_chain_id: "neutron-1",
          denom_in: "uosmo",
          denom_out: "uatom",
          swap_venues: [
            {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
          ],
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
      {
        transfer: {
          port: "transfer",
          channel: "channel-0",
          chain_id: "osmosis-1",
          pfm_enabled: true,
          dest_denom: "uatom",
          supports_memo: true,
          smart_relay: false,
          bridge_id: "IBC",
          denom_in: "uosmo",
          denom_out: "uatom",
          from_chain_id: "osmosis-1",
          to_chain_id: "cosmoshub-4",
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
    ],
    chain_ids: ["osmosis-1", "cosmoshub-4"],
    required_chain_addresses: ["osmosis-1", "cosmoshub-4"],
    does_swap: true,
    estimated_amount_out: "54906",
    swap_venues: [
      {
        name: "osmosis-poolmanager",
        chain_id: "osmosis-1",
        logo_uri:
          "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
      },
    ],
    txs_required: 1,
    estimated_fees: [],
    estimated_route_duration_seconds: 60,
  });
});

test("cosmWasmContractMsgFromJSON", () => {
  const cosmWasmContractMsgJSON = {
    contract_address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    msg: "cosmwasm message",
  };

  expect(cosmWasmContractMsgFromJSON(cosmWasmContractMsgJSON)).toEqual({
    contractAddress: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    msg: "cosmwasm message",
  });
});

test("cosmWasmContractMsgToJSON", () => {
  const cosmWasmContractMsg = {
    contractAddress: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    msg: "cosmwasm message",
  };

  expect(cosmWasmContractMsgToJSON(cosmWasmContractMsg)).toEqual({
    contract_address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    msg: "cosmwasm message",
  });
});

test("postHandlerFromJSON - wasm msg", () => {
  const postHandlerJSON = {
    wasm_msg: {
      contract_address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      msg: "cosmwasm message",
    },
  };

  expect(postHandlerFromJSON(postHandlerJSON)).toEqual({
    wasmMsg: {
      contractAddress: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      msg: "cosmwasm message",
    },
  });
});

test("postHandlerFromJSON - autopilot msg", () => {
  const postHandlerJSON: PostHandlerJSON = {
    autopilot_msg: {
      receiver: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      action: "LIQUID_STAKE",
    },
  };

  expect(postHandlerFromJSON(postHandlerJSON)).toEqual({
    autopilotMsg: {
      receiver: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      action: "LIQUID_STAKE",
    },
  });
});

test("postHandlerToJSON - wasm msg", () => {
  const postHandler = {
    wasmMsg: {
      contractAddress: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      msg: "cosmwasm message",
    },
  };

  expect(postHandlerToJSON(postHandler)).toEqual({
    wasm_msg: {
      contract_address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      msg: "cosmwasm message",
    },
  });
});

test("postHandlerToJSON - autopilot msg", () => {
  const postHandler: PostHandler = {
    autopilotMsg: {
      receiver: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      action: "LIQUID_STAKE",
    },
  };

  expect(postHandlerToJSON(postHandler)).toEqual({
    autopilot_msg: {
      receiver: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      action: "LIQUID_STAKE",
    },
  });
});

test("msgsRequestFromJSON", () => {
  const msgsRequestJSON: MsgsRequestJSON = {
    source_asset_denom: "uosmo",
    source_asset_chain_id: "osmosis-1",
    dest_asset_denom: "uatom",
    dest_asset_chain_id: "cosmoshub-4",
    amount_in: "1000000",
    amount_out: "54906",
    address_list: [
      "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    ],
    operations: [
      {
        swap: {
          swap_in: {
            swap_venue: {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
            swap_operations: [
              {
                pool: "pool-0",
                denom_in: "uosmo",
                denom_out: "uatom",
              },
            ],
            swap_amount_in: "1000000",
            estimated_amount_out: "1000000",
          },
          estimated_affiliate_fee: "1000000",
          chain_id: "neutron-1",
          from_chain_id: "neutron-1",
          denom_in: "uosmo",
          denom_out: "uatom",
          swap_venues: [
            {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
          ],
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
      {
        transfer: {
          port: "transfer",
          channel: "channel-0",
          chain_id: "osmosis-1",
          pfm_enabled: true,
          dest_denom: "uatom",
          supports_memo: true,
          smart_relay: false,
          bridge_id: "IBC",
          denom_in: "uosmo",
          denom_out: "uatom",
          from_chain_id: "osmosis-1",
          to_chain_id: "cosmoshub-4",
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
    ],

    estimated_amount_out: "54906",
    slippage_tolerance_percent: "0.01",
    affiliates: [
      {
        address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
        basis_points_fee: "100",
      },
    ],
    post_route_handler: {
      wasm_msg: {
        contract_address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
        msg: "cosmwasm message",
      },
    },
    enable_gas_warnings: true,
  };

  const msgsRequest: MsgsRequest = {
    sourceAssetDenom: "uosmo",
    sourceAssetChainID: "osmosis-1",
    destAssetDenom: "uatom",
    destAssetChainID: "cosmoshub-4",
    amountIn: "1000000",
    amountOut: "54906",
    addressList: [
      "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    ],
    operations: [
      {
        swap: {
          swapIn: {
            swapVenue: {
              name: "neutron-astroport",
              chainID: "neutron-1",
              logoUri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
            swapOperations: [
              {
                pool: "pool-0",
                denomIn: "uosmo",
                denomOut: "uatom",
              },
            ],
            swapAmountIn: "1000000",
            estimatedAmountOut: "1000000",
          },
          estimatedAffiliateFee: "1000000",
          chainID: "neutron-1",
          fromChainID: "neutron-1",
          denomIn: "uosmo",
          denomOut: "uatom",
          swapVenues: [
            {
              name: "neutron-astroport",
              chainID: "neutron-1",
              logoUri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
          ],
        },
        txIndex: 0,
        amountIn: "100000",
        amountOut: "100000",
      },
      {
        transfer: {
          port: "transfer",
          channel: "channel-0",
          chainID: "osmosis-1",
          pfmEnabled: true,
          destDenom: "uatom",
          supportsMemo: true,
          smartRelay: false,
          bridgeID: "IBC",
          denomIn: "uosmo",
          denomOut: "uatom",
          fromChainID: "osmosis-1",
          toChainID: "cosmoshub-4",
        },
        txIndex: 0,
        amountIn: "100000",
        amountOut: "100000",
      },
    ],
    estimatedAmountOut: "54906",
    slippageTolerancePercent: "0.01",
    affiliates: [
      {
        address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
        basisPointsFee: "100",
      },
    ],
    postRouteHandler: {
      wasmMsg: {
        contractAddress: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
        msg: "cosmwasm message",
      },
    },
    enableGasWarnings: true,
  };

  expect(msgsRequestFromJSON(msgsRequestJSON)).toEqual(msgsRequest);
});

test("msgsRequestToJSON", () => {
  const msgsRequest: MsgsRequest = {
    sourceAssetDenom: "uosmo",
    sourceAssetChainID: "osmosis-1",
    destAssetDenom: "uatom",
    destAssetChainID: "cosmoshub-4",
    amountIn: "1000000",
    amountOut: "54906",
    addressList: [
      "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    ],
    operations: [
      {
        swap: {
          swapIn: {
            swapVenue: {
              name: "neutron-astroport",
              chainID: "neutron-1",
              logoUri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
            swapOperations: [
              {
                pool: "pool-0",
                denomIn: "uosmo",
                denomOut: "uatom",
              },
            ],
            swapAmountIn: "1000000",
            estimatedAmountOut: "1000000",
          },
          estimatedAffiliateFee: "1000000",
          chainID: "neutron-1",
          fromChainID: "neutron-1",
          denomIn: "uosmo",
          denomOut: "uatom",
          swapVenues: [
            {
              name: "neutron-astroport",
              chainID: "neutron-1",
              logoUri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
          ],
        },
        txIndex: 0,
        amountIn: "100000",
        amountOut: "100000",
      },
      {
        transfer: {
          port: "transfer",
          channel: "channel-0",
          chainID: "osmosis-1",
          pfmEnabled: true,
          destDenom: "uatom",
          supportsMemo: true,
          smartRelay: false,
          bridgeID: "IBC",
          denomIn: "uosmo",
          denomOut: "uatom",
          fromChainID: "osmosis-1",
          toChainID: "cosmoshub-4",
        },
        txIndex: 0,
        amountIn: "100000",
        amountOut: "100000",
      },
    ],

    estimatedAmountOut: "54906",
    slippageTolerancePercent: "0.01",
    affiliates: [
      {
        address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
        basisPointsFee: "100",
      },
    ],
    postRouteHandler: {
      wasmMsg: {
        contractAddress: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
        msg: "cosmwasm message",
      },
    },
    enableGasWarnings: true,
  };

  const mesgsRequestJSON: MsgsRequestJSON = {
    source_asset_denom: "uosmo",
    source_asset_chain_id: "osmosis-1",
    dest_asset_denom: "uatom",
    dest_asset_chain_id: "cosmoshub-4",
    amount_in: "1000000",
    amount_out: "54906",
    address_list: [
      "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
      "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
    ],
    operations: [
      {
        swap: {
          swap_in: {
            swap_venue: {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
            swap_operations: [
              {
                pool: "pool-0",
                denom_in: "uosmo",
                denom_out: "uatom",
              },
            ],
            swap_amount_in: "1000000",
            estimated_amount_out: "1000000",
          },
          estimated_affiliate_fee: "1000000",
          chain_id: "neutron-1",
          from_chain_id: "neutron-1",
          denom_in: "uosmo",
          denom_out: "uatom",
          swap_venues: [
            {
              name: "neutron-astroport",
              chain_id: "neutron-1",
              logo_uri:
                "https://raw.githubusercontent.com/skip-mev/skip-api-registry/main/swap-venues/astroport/logo.svg",
            },
          ],
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
      {
        transfer: {
          port: "transfer",
          channel: "channel-0",
          chain_id: "osmosis-1",
          pfm_enabled: true,
          dest_denom: "uatom",
          supports_memo: true,
          smart_relay: false,
          bridge_id: "IBC",
          denom_in: "uosmo",
          denom_out: "uatom",
          from_chain_id: "osmosis-1",
          to_chain_id: "cosmoshub-4",
        },
        tx_index: 0,
        amount_in: "100000",
        amount_out: "100000",
      },
    ],

    estimated_amount_out: "54906",
    slippage_tolerance_percent: "0.01",
    affiliates: [
      {
        address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
        basis_points_fee: "100",
      },
    ],
    post_route_handler: {
      wasm_msg: {
        contract_address: "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5",
        msg: "cosmwasm message",
      },
    },
    enable_gas_warnings: true,
  };

  expect(msgsRequestToJSON(msgsRequest)).toEqual(mesgsRequestJSON);
});

test("multiChainMsgFromJSON", () => {
  const multiChainMsgJSON: MultiChainMsgJSON = {
    chain_id: "osmosis-1",
    path: ["osmosis-1", "cosmoshub-4"],
    msg: "message",
    msg_type_url: "/cosmos.bank.v1beta1.MsgSend",
  };

  expect(multiChainMsgFromJSON(multiChainMsgJSON)).toEqual({
    chainID: "osmosis-1",
    path: ["osmosis-1", "cosmoshub-4"],
    msg: "message",
    msgTypeURL: "/cosmos.bank.v1beta1.MsgSend",
  });
});

test("multiChainMsgToJSON", () => {
  const multiChainMsg = {
    chainID: "osmosis-1",
    path: ["osmosis-1", "cosmoshub-4"],
    msg: "message",
    msgTypeURL: "/cosmos.bank.v1beta1.MsgSend",
  };

  expect(multiChainMsgToJSON(multiChainMsg)).toEqual({
    chain_id: "osmosis-1",
    path: ["osmosis-1", "cosmoshub-4"],
    msg: "message",
    msg_type_url: "/cosmos.bank.v1beta1.MsgSend",
  });
});

test("submitTxRequestFromJSON", () => {
  const submitTxRequestJSON: SubmitTxRequestJSON = {
    tx: "txbytes123",
    chain_id: "osmosis-1",
  };

  expect(submitTxRequestFromJSON(submitTxRequestJSON)).toEqual({
    tx: "txbytes123",
    chainID: "osmosis-1",
  });
});

test("submitTxRequestToJSON", () => {
  const submitTxRequest = {
    tx: "txbytes123",
    chainID: "osmosis-1",
  };

  expect(submitTxRequestToJSON(submitTxRequest)).toEqual({
    tx: "txbytes123",
    chain_id: "osmosis-1",
  });
});

test("submitTxResponseFromJSON", () => {
  const submitTxResponseJSON: SubmitTxResponseJSON = {
    tx_hash: "txid123",
  };

  expect(submitTxResponseFromJSON(submitTxResponseJSON)).toEqual({
    txHash: "txid123",
  });
});

test("submitTxResponseToJSON", () => {
  const submitTxResponse = {
    txHash: "txid123",
  };

  expect(submitTxResponseToJSON(submitTxResponse)).toEqual({
    tx_hash: "txid123",
  });
});

test("trackTxRequestFromJSON", () => {
  const trackRequestJSON: TrackTxRequestJSON = {
    tx_hash: "txid123",
    chain_id: "osmosis-1",
  };

  expect(trackTxRequestFromJSON(trackRequestJSON)).toEqual({
    txHash: "txid123",
    chainID: "osmosis-1",
  });
});

test("trackTxRequestToJSON", () => {
  const trackRequest = {
    txHash: "txid123",
    chainID: "osmosis-1",
  };

  expect(trackTxRequestToJSON(trackRequest)).toEqual({
    tx_hash: "txid123",
    chain_id: "osmosis-1",
  });
});

test("trackTxResponseFromJSON", () => {
  const trackResponseJSON: TrackTxResponseJSON = {
    tx_hash: "txid123",
    explorer_link: "https://osmosis.zone/tx/txid123",
  };

  expect(trackTxResponseFromJSON(trackResponseJSON)).toEqual({
    txHash: "txid123",
    explorerLink: "https://osmosis.zone/tx/txid123",
  });
});

test("trackTxResponseToJSON", () => {
  const trackResponse: TrackTxResponse = {
    txHash: "txid123",
    explorerLink: "https://osmosis.zone/tx/txid123",
  };

  const expected: TrackTxResponseJSON = {
    tx_hash: "txid123",
    explorer_link: "https://osmosis.zone/tx/txid123",
  };

  expect(trackTxResponseToJSON(trackResponse)).toEqual(expected);
});

test("txStatusRequestFromJSON", () => {
  const txStatusJSON: StatusRequestJSON = {
    tx_hash: "txid123",
    chain_id: "osmosis-1",
  };

  expect(txStatusRequestFromJSON(txStatusJSON)).toEqual({
    txHash: "txid123",
    chainID: "osmosis-1",
  });
});

test("txStatusRequestToJSON", () => {
  const txStatus = {
    txHash: "txid123",
    chainID: "osmosis-1",
  };

  expect(txStatusRequestToJSON(txStatus)).toEqual({
    tx_hash: "txid123",
    chain_id: "osmosis-1",
  });
});

test("chainTransactionFromJSON", () => {
  const chainTransactionJSON: ChainTransactionJSON = {
    tx_hash: "txid123",
    chain_id: "osmosis-1",
    explorer_link: "https://osmosis.zone/tx/txid123",
    on_chain_at: "2025-05-15T19:38:30Z"
  };

  expect(chainTransactionFromJSON(chainTransactionJSON)).toEqual({
    txHash: "txid123",
    chainID: "osmosis-1",
    explorerLink: "https://osmosis.zone/tx/txid123",
    onChainAt: new Date("2025-05-15T19:38:30Z"),
  });
});

test("chainTransactionToJSON", () => {
  const chainTransaction: ChainTransaction = {
    txHash: "txid123",
    chainID: "osmosis-1",
    explorerLink: "https://osmosis.zone/tx/txid123",
    onChainAt: new Date("2025-05-15T19:38:30Z"),
  };

  expect(chainTransactionToJSON(chainTransaction)).toEqual({
    tx_hash: "txid123",
    chain_id: "osmosis-1",
    explorer_link: "https://osmosis.zone/tx/txid123",
    on_chain_at: "2025-05-15T19:38:30Z"
  });
});

test("packetFromJSON", () => {
  const packetJSON: PacketJSON = {
    send_tx: {
      chain_id: "axelar-dojo-1",
      tx_hash:
        "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
      explorer_link:
        "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    receive_tx: {
      chain_id: "osmosis-1",
      tx_hash:
        "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
      explorer_link:
        "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    acknowledge_tx: {
      chain_id: "axelar-dojo-1",
      tx_hash:
        "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
      explorer_link:
        "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    timeout_tx: null,
    error: null,
  };

  expect(packetFromJSON(packetJSON)).toEqual({
    sendTx: {
      chainID: "axelar-dojo-1",
      txHash:
        "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
      explorerLink:
        "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    receiveTx: {
      chainID: "osmosis-1",
      txHash:
        "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
      explorerLink:
        "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    acknowledgeTx: {
      chainID: "axelar-dojo-1",
      txHash:
        "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
      explorerLink:
        "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    timeoutTx: null,
    error: null,
  });
});

test("packetToJSON", () => {
  const packet: Packet = {
    sendTx: {
      chainID: "axelar-dojo-1",
      txHash:
        "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
      explorerLink:
        "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    receiveTx: {
      chainID: "osmosis-1",
      txHash:
        "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
      explorerLink:
        "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    acknowledgeTx: {
      chainID: "axelar-dojo-1",
      txHash:
        "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
      explorerLink:
        "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    timeoutTx: null,
    error: null,
  };

  expect(packetToJSON(packet)).toEqual({
    send_tx: {
      chain_id: "axelar-dojo-1",
      tx_hash:
        "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
      explorer_link:
        "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    receive_tx: {
      chain_id: "osmosis-1",
      tx_hash:
        "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
      explorer_link:
        "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    acknowledge_tx: {
      chain_id: "axelar-dojo-1",
      tx_hash:
        "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
      explorer_link:
        "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    timeout_tx: null,
    error: null,
  });
});

test("transferInfoFromJSON", () => {
  const transferInfoJSON: TransferInfoJSON = {
    from_chain_id: "axelar-dojo-1",
    to_chain_id: "osmosis-1",
    src_chain_id: "axelar-dojo-1",
    dst_chain_id: "osmosis-1",
    state: "TRANSFER_SUCCESS",
    packet_txs: {
      send_tx: {
        chain_id: "axelar-dojo-1",
        tx_hash:
          "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        explorer_link:
          "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        on_chain_at: "2025-05-15T19:38:30Z"
      },
      receive_tx: {
        chain_id: "osmosis-1",
        tx_hash:
          "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        explorer_link:
          "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        on_chain_at: "2025-05-15T19:38:30Z"
      },
      acknowledge_tx: {
        chain_id: "axelar-dojo-1",
        tx_hash:
          "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        explorer_link:
          "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        on_chain_at: "2025-05-15T19:38:30Z"
      },
      timeout_tx: null,
      error: null,
    },
  };

  expect(transferInfoFromJSON(transferInfoJSON)).toEqual({
    fromChainID: "axelar-dojo-1",
    toChainID: "osmosis-1",
    srcChainID: "axelar-dojo-1",
    dstChainID: "osmosis-1",
    state: "TRANSFER_SUCCESS",
    packetTXs: {
      sendTx: {
        chainID: "axelar-dojo-1",
        txHash:
          "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        explorerLink:
          "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      receiveTx: {
        chainID: "osmosis-1",
        txHash:
          "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        explorerLink:
          "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      acknowledgeTx: {
        chainID: "axelar-dojo-1",
        txHash:
          "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        explorerLink:
          "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      timeoutTx: null,
      error: null,
    },
    packetTxs: {
      sendTx: {
        chainID: "axelar-dojo-1",
        txHash:
          "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        explorerLink:
          "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      receiveTx: {
        chainID: "osmosis-1",
        txHash:
          "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        explorerLink:
          "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      acknowledgeTx: {
        chainID: "axelar-dojo-1",
        txHash:
          "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        explorerLink:
          "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      timeoutTx: null,
      error: null,
    },
  });
});

test("transferInfoToJSON", () => {
  const transferInfo: TransferInfo = {
    fromChainID: "axelar-dojo-1",
    toChainID: "osmosis-1",
    srcChainID: "axelar-dojo-1",
    dstChainID: "osmosis-1",
    state: "TRANSFER_SUCCESS",
    packetTXs: {
      sendTx: {
        chainID: "axelar-dojo-1",
        txHash:
          "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        explorerLink:
          "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      receiveTx: {
        chainID: "osmosis-1",
        txHash:
          "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        explorerLink:
          "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      acknowledgeTx: {
        chainID: "axelar-dojo-1",
        txHash:
          "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        explorerLink:
          "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      timeoutTx: null,
      error: null,
    },
    packetTxs: {
      sendTx: {
        chainID: "axelar-dojo-1",
        txHash:
          "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        explorerLink:
          "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      receiveTx: {
        chainID: "osmosis-1",
        txHash:
          "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        explorerLink:
          "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      acknowledgeTx: {
        chainID: "axelar-dojo-1",
        txHash:
          "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        explorerLink:
          "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        onChainAt: new Date("2025-05-15T19:38:30Z"),
      },
      timeoutTx: null,
      error: null,
    },
  };

  expect(transferInfoToJSON(transferInfo)).toEqual({
    from_chain_id: "axelar-dojo-1",
    to_chain_id: "osmosis-1",
    src_chain_id: "axelar-dojo-1",
    dst_chain_id: "osmosis-1",
    state: "TRANSFER_SUCCESS",
    packet_txs: {
      send_tx: {
        chain_id: "axelar-dojo-1",
        tx_hash:
          "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        explorer_link:
          "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
        on_chain_at: "2025-05-15T19:38:30Z"
      },
      receive_tx: {
        chain_id: "osmosis-1",
        tx_hash:
          "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        explorer_link:
          "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
        on_chain_at: "2025-05-15T19:38:30Z"
      },
      acknowledge_tx: {
        chain_id: "axelar-dojo-1",
        tx_hash:
          "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        explorer_link:
          "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
        on_chain_at: "2025-05-15T19:38:30Z"
      },
      timeout_tx: null,
      error: null,
    },
  });
});

test("nextBlockingTransferFromJSON", () => {
  const nextBlockingTransferJSON: NextBlockingTransferJSON = {
    transfer_sequence_index: 1,
  };

  expect(nextBlockingTransferFromJSON(nextBlockingTransferJSON)).toEqual({
    transferSequenceIndex: 1,
  });
});

test("nextBlockingTransferToJSON", () => {
  const nextBlockingTransfer = {
    transferSequenceIndex: 1,
  };

  expect(nextBlockingTransferToJSON(nextBlockingTransfer)).toEqual({
    transfer_sequence_index: 1,
  });
});

test("transferAssetReleaseFromJSON", () => {
  const transferAssetReleaseJSON: TransferAssetReleaseJSON = {
    chain_id: "osmosis-1",
    denom: "uosmo",
    amount: "999",
    released: true,
  };

  expect(transferAssetReleaseFromJSON(transferAssetReleaseJSON)).toEqual({
    chainID: "osmosis-1",
    denom: "uosmo",
    amount: "999",
    released: true,
  });
});

test("transferAssetReleaseToJSON", () => {
  const transferAssetRelease = {
    chainID: "osmosis-1",
    denom: "uosmo",
    amount: "999",
    released: true,
  };

  expect(transferAssetReleaseToJSON(transferAssetRelease)).toEqual({
    chain_id: "osmosis-1",
    denom: "uosmo",
    amount: "999",
    released: true,
  });
});

test("txStatusResponseFromJSON", () => {
  const statusResponseJSON: TxStatusResponseJSON = {
    status: "STATE_COMPLETED",
    transfer_sequence: [
      {
        ibc_transfer: {
          from_chain_id: "axelar-dojo-1",
          to_chain_id: "osmosis-1",
          src_chain_id: "axelar-dojo-1",
          dst_chain_id: "osmosis-1",
          state: "TRANSFER_SUCCESS",
          packet_txs: {
            send_tx: {
              chain_id: "axelar-dojo-1",
              tx_hash:
                "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              explorer_link:
                "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            receive_tx: {
              chain_id: "osmosis-1",
              tx_hash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorer_link:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            acknowledge_tx: {
              chain_id: "axelar-dojo-1",
              tx_hash:
                "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              explorer_link:
                "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            timeout_tx: null,
            error: null,
          },
        },
      },
      {
        ibc_transfer: {
          from_chain_id: "osmosis-1",
          to_chain_id: "cosmoshub-4",
          src_chain_id: "osmosis-1",
          dst_chain_id: "cosmoshub-4",
          state: "TRANSFER_SUCCESS",
          packet_txs: {
            send_tx: {
              chain_id: "osmosis-1",
              tx_hash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorer_link:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            receive_tx: {
              chain_id: "cosmoshub-4",
              tx_hash:
                "913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              explorer_link:
                "https://cosmos.bigdipper.live/transactions/913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            acknowledge_tx: {
              chain_id: "osmosis-1",
              tx_hash:
                "1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              explorer_link:
                "https://osmosis.zone/tx/1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            timeout_tx: null,
            error: null,
          },
        },
      },
    ],
    next_blocking_transfer: null,
    transfer_asset_release: {
      chain_id: "cosmoshub-4",
      denom: "uatom",
      amount: "999",
      released: true,
    },
    error: null,
    state: "STATE_COMPLETED_SUCCESS",
    transfers: [
      {
        state: "STATE_COMPLETED_SUCCESS",
        transfer_sequence: [
          {
            ibc_transfer: {
              from_chain_id: "src-chain",
              to_chain_id: "dest-chain",
              src_chain_id: "src-chain",
              dst_chain_id: "dest-chain",
              state: "TRANSFER_SUCCESS",
              packet_txs: {
                send_tx: null,
                receive_tx: null,
                acknowledge_tx: null,
                timeout_tx: null,
                error: null,
              },
            },
          },
        ],
        next_blocking_transfer: {
          transfer_sequence_index: 1,
        },
        transfer_asset_release: {
          chain_id: "cosmoshub-4",
          denom: "uatom",
          amount: "999",
          released: true,
        },
        error: null,
      },
    ],
  };

  expect(txStatusResponseFromJSON(statusResponseJSON)).toEqual({
    status: "STATE_COMPLETED",
    transferSequence: [
      {
        ibcTransfer: {
          fromChainID: "axelar-dojo-1",
          toChainID: "osmosis-1",
          srcChainID: "axelar-dojo-1",
          dstChainID: "osmosis-1",
          state: "TRANSFER_SUCCESS",
          packetTXs: {
            sendTx: {
              chainID: "axelar-dojo-1",
              txHash:
                "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              explorerLink:
                "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            receiveTx: {
              chainID: "osmosis-1",
              txHash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorerLink:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            acknowledgeTx: {
              chainID: "axelar-dojo-1",
              txHash:
                "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              explorerLink:
                "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            timeoutTx: null,
            error: null,
          },
          packetTxs: {
            sendTx: {
              chainID: "axelar-dojo-1",
              txHash:
                "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              explorerLink:
                "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            receiveTx: {
              chainID: "osmosis-1",
              txHash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorerLink:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
            },
            acknowledgeTx: {
              chainID: "axelar-dojo-1",
              txHash:
                "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              explorerLink:
                "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
            },
            timeoutTx: null,
            error: null,
          },
        },
      },
      {
        ibcTransfer: {
          fromChainID: "osmosis-1",
          toChainID: "cosmoshub-4",
          srcChainID: "osmosis-1",
          dstChainID: "cosmoshub-4",
          state: "TRANSFER_SUCCESS",
          packetTXs: {
            sendTx: {
              chainID: "osmosis-1",
              txHash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorerLink:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
            },
            receiveTx: {
              chainID: "cosmoshub-4",
              txHash:
                "913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              explorerLink:
                "https://cosmos.bigdipper.live/transactions/913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
            },
            acknowledgeTx: {
              chainID: "osmosis-1",
              txHash:
                "1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              explorerLink:
                "https://osmosis.zone/tx/1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
            },
            timeoutTx: null,
            error: null,
          },
          packetTxs: {
            sendTx: {
              chainID: "osmosis-1",
              txHash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorerLink:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
            },
            receiveTx: {
              chainID: "cosmoshub-4",
              txHash:
                "913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              explorerLink:
                "https://cosmos.bigdipper.live/transactions/913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
            },
            acknowledgeTx: {
              chainID: "osmosis-1",
              txHash:
                "1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              explorerLink:
                "https://osmosis.zone/tx/1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
            },
            timeoutTx: null,
            error: null,
          },
        },
      },
    ],
    nextBlockingTransfer: null,
    transferAssetRelease: {
      chainID: "cosmoshub-4",
      denom: "uatom",
      amount: "999",
      released: true,
    },
    error: null,
    state: "STATE_COMPLETED_SUCCESS",
    transfers: [
      {
        state: "STATE_COMPLETED_SUCCESS",
        transferSequence: [
          {
            ibcTransfer: {
              fromChainID: "src-chain",
              toChainID: "dest-chain",
              srcChainID: "src-chain",
              dstChainID: "dest-chain",
              state: "TRANSFER_SUCCESS",
              packetTXs: {
                sendTx: null,
                receiveTx: null,
                acknowledgeTx: null,
                timeoutTx: null,
                error: null,
              },
              packetTxs: {
                sendTx: null,
                receiveTx: null,
                acknowledgeTx: null,
                timeoutTx: null,
                error: null,
              },
            },
          },
        ],
        nextBlockingTransfer: {
          transferSequenceIndex: 1,
        },
        transferAssetRelease: {
          chainID: "cosmoshub-4",
          denom: "uatom",
          amount: "999",
          released: true,
        },
        error: null,
      },
    ],
  });
});

test("txStatusResponseToJSON", () => {
  const statusResponse: TxStatusResponse = {
    status: "STATE_COMPLETED",
    transferSequence: [
      {
        ibcTransfer: {
          fromChainID: "axelar-dojo-1",
          toChainID: "osmosis-1",
          srcChainID: "axelar-dojo-1",
          dstChainID: "osmosis-1",
          state: "TRANSFER_SUCCESS",
          packetTxs: {
            sendTx: {
              chainID: "axelar-dojo-1",
              txHash:
                "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              explorerLink:
                "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            receiveTx: {
              chainID: "osmosis-1",
              txHash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorerLink:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            acknowledgeTx: {
              chainID: "axelar-dojo-1",
              txHash:
                "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              explorerLink:
                "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            timeoutTx: null,
            error: null,
          },
          packetTXs: {
            sendTx: {
              chainID: "axelar-dojo-1",
              txHash:
                "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              explorerLink:
                "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            receiveTx: {
              chainID: "osmosis-1",
              txHash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorerLink:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            acknowledgeTx: {
              chainID: "axelar-dojo-1",
              txHash:
                "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              explorerLink:
                "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            timeoutTx: null,
            error: null,
          },
        },
      },
      {
        ibcTransfer: {
          fromChainID: "osmosis-1",
          toChainID: "cosmoshub-4",
          srcChainID: "osmosis-1",
          dstChainID: "cosmoshub-4",
          state: "TRANSFER_SUCCESS",
          packetTXs: {
            sendTx: {
              chainID: "osmosis-1",
              txHash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorerLink:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            receiveTx: {
              chainID: "cosmoshub-4",
              txHash:
                "913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              explorerLink:
                "https://cosmos.bigdipper.live/transactions/913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            acknowledgeTx: {
              chainID: "osmosis-1",
              txHash:
                "1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              explorerLink:
                "https://osmosis.zone/tx/1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            timeoutTx: null,
            error: null,
          },
          packetTxs: {
            sendTx: {
              chainID: "osmosis-1",
              txHash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorerLink:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            receiveTx: {
              chainID: "cosmoshub-4",
              txHash:
                "913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              explorerLink:
                "https://cosmos.bigdipper.live/transactions/913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            acknowledgeTx: {
              chainID: "osmosis-1",
              txHash:
                "1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              explorerLink:
                "https://osmosis.zone/tx/1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              onChainAt: new Date("2025-05-15T19:38:30Z"),
            },
            timeoutTx: null,
            error: null,
          },
        },
      },
    ],
    nextBlockingTransfer: null,
    transferAssetRelease: {
      chainID: "cosmoshub-4",
      denom: "uatom",
      amount: "999",
      released: true,
    },
    error: null,
    state: "STATE_COMPLETED_SUCCESS",
    transfers: [
      {
        state: "STATE_COMPLETED_SUCCESS",
        transferSequence: [
          {
            ibcTransfer: {
              fromChainID: "src-chain",
              toChainID: "dest-chain",
              srcChainID: "src-chain",
              dstChainID: "dest-chain",
              state: "TRANSFER_SUCCESS",
              packetTXs: {
                sendTx: null,
                receiveTx: null,
                acknowledgeTx: null,
                timeoutTx: null,
                error: null,
              },
              packetTxs: {
                sendTx: null,
                receiveTx: null,
                acknowledgeTx: null,
                timeoutTx: null,
                error: null,
              },
            },
          },
        ],
        nextBlockingTransfer: {
          transferSequenceIndex: 1,
        },
        transferAssetRelease: {
          chainID: "cosmoshub-4",
          denom: "uatom",
          amount: "999",
          released: true,
        },
        error: null,
      },
    ],
  };

  expect(txStatusResponseToJSON(statusResponse)).toEqual({
    status: "STATE_COMPLETED",
    transfer_sequence: [
      {
        ibc_transfer: {
          from_chain_id: "axelar-dojo-1",
          to_chain_id: "osmosis-1",
          src_chain_id: "axelar-dojo-1",
          dst_chain_id: "osmosis-1",
          state: "TRANSFER_SUCCESS",
          packet_txs: {
            send_tx: {
              chain_id: "axelar-dojo-1",
              tx_hash:
                "AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              explorer_link:
                "https://axelar-testnet.mintscan.io/txs/AAEA76709215A808AF6D7FC2B8FBB8746BC1F196E46FFAE84B79C6F6CD0A79C9",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            receive_tx: {
              chain_id: "osmosis-1",
              tx_hash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorer_link:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            acknowledge_tx: {
              chain_id: "axelar-dojo-1",
              tx_hash:
                "C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              explorer_link:
                "https://axelar-testnet.mintscan.io/txs/C9A36F94A5B2CA9C7ABF20402561E46FD8B80EBAC4F0D5B7C01F978E34285CCA",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            timeout_tx: null,
            error: null,
          },
        },
      },
      {
        ibc_transfer: {
          from_chain_id: "osmosis-1",
          to_chain_id: "cosmoshub-4",
          src_chain_id: "osmosis-1",
          dst_chain_id: "cosmoshub-4",
          state: "TRANSFER_SUCCESS",
          packet_txs: {
            send_tx: {
              chain_id: "osmosis-1",
              tx_hash:
                "082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              explorer_link:
                "https://osmosis.zone/tx/082A6C8024998EC277C2B90BFDDB323CCA506C24A6730C658B9B6DC653198E3D",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            receive_tx: {
              chain_id: "cosmoshub-4",
              tx_hash:
                "913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              explorer_link:
                "https://cosmos.bigdipper.live/transactions/913E2542EBFEF2E885C19DD9C4F8ECB6ADAFFE59D60BB108FAD94FBABF9C5671",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            acknowledge_tx: {
              chain_id: "osmosis-1",
              tx_hash:
                "1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              explorer_link:
                "https://osmosis.zone/tx/1EDB2886E6FD59D6B9C096FBADB1A52585745694F4DFEE3A3CD3FF0153307EBC",
              on_chain_at: "2025-05-15T19:38:30Z"
            },
            timeout_tx: null,
            error: null,
          },
        },
      },
    ],
    next_blocking_transfer: null,
    transfer_asset_release: {
      chain_id: "cosmoshub-4",
      denom: "uatom",
      amount: "999",
      released: true,
    },
    error: null,
    state: "STATE_COMPLETED_SUCCESS",
    transfers: [
      {
        state: "STATE_COMPLETED_SUCCESS",
        transfer_sequence: [
          {
            ibc_transfer: {
              from_chain_id: "src-chain",
              to_chain_id: "dest-chain",
              src_chain_id: "src-chain",
              dst_chain_id: "dest-chain",
              state: "TRANSFER_SUCCESS",
              packet_txs: {
                send_tx: null,
                receive_tx: null,
                acknowledge_tx: null,
                timeout_tx: null,
                error: null,
              },
            },
          },
        ],
        next_blocking_transfer: {
          transfer_sequence_index: 1,
        },
        transfer_asset_release: {
          chain_id: "cosmoshub-4",
          denom: "uatom",
          amount: "999",
          released: true,
        },
        error: null,
      },
    ],
  });
});

test("ibcAddressFromJSON", () => {
  const input: IBCAddressJSON = {
    address: "cosmos1hsk6jryyqjfhp5dhc55tc9jtckygx0eph6dd02",
    chain_id: "cosmoshub-4",
  };

  const expected: IBCAddress = {
    address: "cosmos1hsk6jryyqjfhp5dhc55tc9jtckygx0eph6dd02",
    chainID: "cosmoshub-4",
  };

  expect(ibcAddressFromJSON(input)).toEqual(expected);
});

test("ibcAddressToJSON", () => {
  const input: IBCAddress = {
    address: "cosmos1hsk6jryyqjfhp5dhc55tc9jtckygx0eph6dd02",
    chainID: "cosmoshub-4",
  };

  const expected: IBCAddressJSON = {
    address: "cosmos1hsk6jryyqjfhp5dhc55tc9jtckygx0eph6dd02",
    chain_id: "cosmoshub-4",
  };

  expect(ibcAddressToJSON(input)).toEqual(expected);
});

test("sendTokenTransactionsFromJSON", () => {
  const input: SendTokenTransactionsJSON = {
    send_tx: {
      chain_id: "osmosis-1",
      tx_hash:
        "B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      explorer_link:
        "https://osmosis.zone/tx/B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    confirm_tx: {
      chain_id: "osmosis-1",
      tx_hash:
        "B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      explorer_link:
        "https://osmosis.zone/tx/B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    execute_tx: {
      chain_id: "43114",
      tx_hash:
        "0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      explorer_link:
        "https://www.mintscan.io/terra/tx/0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    error: {
      message: "transaction failed",
      type: "SEND_TOKEN_EXECUTION_ERROR",
    },
  };

  const expected: SendTokenTransactions = {
    sendTx: {
      chainID: "osmosis-1",
      txHash:
        "B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      explorerLink:
        "https://osmosis.zone/tx/B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    confirmTx: {
      chainID: "osmosis-1",
      txHash:
        "B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      explorerLink:
        "https://osmosis.zone/tx/B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    executeTx: {
      chainID: "43114",
      txHash:
        "0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      explorerLink:
        "https://www.mintscan.io/terra/tx/0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    error: {
      message: "transaction failed",
      type: "SEND_TOKEN_EXECUTION_ERROR",
    },
  };

  expect(sendTokenTransactionsFromJSON(input)).toEqual(expected);
});

test("sendTokenTransactionsToJSON", () => {
  const input: SendTokenTransactions = {
    sendTx: {
      chainID: "osmosis-1",
      txHash:
        "B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      explorerLink:
        "https://osmosis.zone/tx/B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    confirmTx: {
      chainID: "osmosis-1",
      txHash:
        "B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      explorerLink:
        "https://osmosis.zone/tx/B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    executeTx: {
      chainID: "43114",
      txHash:
        "0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      explorerLink:
        "https://www.mintscan.io/terra/tx/0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    error: {
      message: "transaction failed",
      type: "SEND_TOKEN_EXECUTION_ERROR",
    },
  };

  const expected: SendTokenTransactionsJSON = {
    send_tx: {
      chain_id: "osmosis-1",
      tx_hash:
        "B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      explorer_link:
        "https://osmosis.zone/tx/B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    confirm_tx: {
      chain_id: "osmosis-1",
      tx_hash:
        "B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      explorer_link:
        "https://osmosis.zone/tx/B6A0176A1D9F72D9445D9865B365E40735F060972931C6A99E89DCC8B736CE07",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    execute_tx: {
      chain_id: "43114",
      tx_hash:
        "0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      explorer_link:
        "https://www.mintscan.io/terra/tx/0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    error: {
      message: "transaction failed",
      type: "SEND_TOKEN_EXECUTION_ERROR",
    },
  };

  expect(sendTokenTransactionsToJSON(input)).toEqual(expected);
});

test("contractCallWithTokenTransactionsFromJSON", () => {
  const input: ContractCallWithTokenTransactionsJSON = {
    send_tx: {
      chain_id: "osmosis-1",
      tx_hash: "tx-a",
      explorer_link: "https://osmosis.zone/tx/tx-a",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    gas_paid_tx: {
      chain_id: "osmosis-1",
      tx_hash: "tx-b",
      explorer_link: "https://osmosis.zone/tx/tx-b",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    confirm_tx: {
      chain_id: "osmosis-1",
      tx_hash: "tx-c",
      explorer_link: "https://osmosis.zone/tx/tx-c",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    approve_tx: {
      chain_id: "osmosis-1",
      tx_hash: "tx-d",
      explorer_link: "https://osmosis.zone/tx/tx-d",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    execute_tx: {
      chain_id: "43114",
      tx_hash:
        "0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      explorer_link:
        "https://www.mintscan.io/terra/tx/0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    error: {
      message: "transaction failed",
      type: "CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR",
    },
  };

  const expected: ContractCallWithTokenTransactions = {
    sendTx: {
      chainID: "osmosis-1",
      txHash: "tx-a",
      explorerLink: "https://osmosis.zone/tx/tx-a",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    gasPaidTx: {
      chainID: "osmosis-1",
      txHash: "tx-b",
      explorerLink: "https://osmosis.zone/tx/tx-b",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    confirmTx: {
      chainID: "osmosis-1",
      txHash: "tx-c",
      explorerLink: "https://osmosis.zone/tx/tx-c",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    approveTx: {
      chainID: "osmosis-1",
      txHash: "tx-d",
      explorerLink: "https://osmosis.zone/tx/tx-d",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    executeTx: {
      chainID: "43114",
      txHash:
        "0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      explorerLink:
        "https://www.mintscan.io/terra/tx/0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    error: {
      message: "transaction failed",
      type: "CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR",
    },
  };

  expect(contractCallWithTokenTransactionsFromJSON(input)).toEqual(expected);
});

test("contractCallWithTokenTransactionsToJSON", () => {
  const input: ContractCallWithTokenTransactions = {
    sendTx: {
      chainID: "osmosis-1",
      txHash: "tx-a",
      explorerLink: "https://osmosis.zone/tx/tx-a",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    gasPaidTx: {
      chainID: "osmosis-1",
      txHash: "tx-b",
      explorerLink: "https://osmosis.zone/tx/tx-b",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    confirmTx: {
      chainID: "osmosis-1",
      txHash: "tx-c",
      explorerLink: "https://osmosis.zone/tx/tx-c",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    approveTx: {
      chainID: "osmosis-1",
      txHash: "tx-d",
      explorerLink: "https://osmosis.zone/tx/tx-d",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    executeTx: {
      chainID: "43114",
      txHash:
        "0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      explorerLink:
        "https://www.mintscan.io/terra/tx/0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      onChainAt: new Date("2025-05-15T19:38:30Z"),
    },
    error: {
      message: "transaction failed",
      type: "CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR",
    },
  };

  const expected: ContractCallWithTokenTransactionsJSON = {
    send_tx: {
      chain_id: "osmosis-1",
      tx_hash: "tx-a",
      explorer_link: "https://osmosis.zone/tx/tx-a",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    gas_paid_tx: {
      chain_id: "osmosis-1",
      tx_hash: "tx-b",
      explorer_link: "https://osmosis.zone/tx/tx-b",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    confirm_tx: {
      chain_id: "osmosis-1",
      tx_hash: "tx-c",
      explorer_link: "https://osmosis.zone/tx/tx-c",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    approve_tx: {
      chain_id: "osmosis-1",
      tx_hash: "tx-d",
      explorer_link: "https://osmosis.zone/tx/tx-d",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    execute_tx: {
      chain_id: "43114",
      tx_hash:
        "0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      explorer_link:
        "https://www.mintscan.io/terra/tx/0xc78b62283ae813ad58e5c1d4023007459070f67c00fa949aa1af8288337ad421",
      on_chain_at: "2025-05-15T19:38:30Z"
    },
    error: {
      message: "transaction failed",
      type: "CONTRACT_CALL_WITH_TOKEN_EXECUTION_ERROR",
    },
  };

  expect(contractCallWithTokenTransactionsToJSON(input)).toEqual(expected);
});

test("denomWithChainIDFromJSON", () => {
  const input: DenomWithChainIDJSON = {
    chain_id: "osmosis-1",
    denom: "uosmo",
  };

  const expected: DenomWithChainID = {
    chainID: "osmosis-1",
    denom: "uosmo",
  };

  expect(denomWithChainIDFromJSON(input)).toEqual(expected);
});

test("denomWithChainIDToJSON", () => {
  const input: DenomWithChainID = {
    chainID: "osmosis-1",
    denom: "uosmo",
  };

  const expected: DenomWithChainIDJSON = {
    chain_id: "osmosis-1",
    denom: "uosmo",
  };

  expect(denomWithChainIDToJSON(input)).toEqual(expected);
});
