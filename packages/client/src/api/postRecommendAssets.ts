import { RecommendationRequest } from "src/types/swaggerTypes";
import { api } from "../utils/generateApi";

export const recommendAssets = (request: RecommendationRequest | RecommendationRequest[]) =>
  api({
    methodName: "getAssetRecommendations",
    method: "post",
    path: "/v2/fungible/recommend_assets",
    transformResponse(response) {
      return response.recommendationEntries;
    },
  })({ requests: Array.isArray(request) ? request : [request] });