import { api } from "../utils/generateApi";

export const recommendAssets = api({
  methodName: "getAssetRecommendations",
  method: "post",
  path: "/v2/fungible/recommend_assets",
  transformRequest(request) {
    return request.requests;
  },
  transformResponse(response) {
    return response.recommendationEntries;
  },
});
