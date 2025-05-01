import { api } from "../utils/generateApi";

export const assetsFromSource = api({
  methodName: "getAssetsFromSource",
  method: "post",
  path: "/v2/fungible/assets_from_source",
  transformResponse(response) {
    return response.destAssets;
  },
});
