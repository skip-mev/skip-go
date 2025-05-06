import { api } from "../utils/generateApi";

export const recommendAssets = api({
  methodName: "getAssetRecommendations",
  method: "post",
  path: "/v2/fungible/recommend_assets",
  transformResponse(response) {
    return response.recommendationEntries;
  },
});
