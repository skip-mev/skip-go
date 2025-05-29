import type { MessagesRequest } from "src/api/postMessages";

export const filterMessagesRequest = (request: MessagesRequest) => {
  const messagesRequest = {
    sourceAssetDenom: request.sourceAssetDenom,
    sourceAssetChainId: request.sourceAssetChainId,
    destAssetDenom: request.destAssetDenom,
    destAssetChainId: request.destAssetChainId,
    amountIn: request.amountIn,
    amountOut: request.amountOut,
    addressList: request.addressList,
    operations: request.operations,
    estimatedAmountOut: request.estimatedAmountOut,
    slippageTolerancePercent: request.slippageTolerancePercent,
    timeoutSeconds: request.timeoutSeconds,
    postRouteHandler: request.postRouteHandler,
    chainIdsToAffiliates: request.chainIdsToAffiliates,
    enableGasWarnings: request.enableGasWarnings,
    apiUrl: request.apiUrl,
    apiKey: request.apiKey,
    abortDuplicateRequests: request.abortDuplicateRequests,
  };

  return messagesRequest;
}