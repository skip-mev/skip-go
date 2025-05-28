import { api } from "../utils/generateApi";
import type { ApiRequest, ApiResponse } from "../utils/generateApi";

export const messages = async (request: MessagesRequest) => {
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
  };

  return api({
    methodName: "msgs",
    method: "post",
    path: "/v2/fungible/msgs",
  })(messagesRequest);
};

export type MessagesRequest = ApiRequest<"msgs">;
export type MessagesResponse = ApiResponse<"msgs">;
