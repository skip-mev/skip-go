import { api } from "../utils/generateApi";

export const recommendAssets = api({
  methodName: "assetRecommendations",
  method: "post",
  path: "/v2/fungible/recommend_assets",
  transformResponse(response) {
    return response.recommendationEntries;
  },
});
