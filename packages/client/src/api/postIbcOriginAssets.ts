import { api } from "../utils/generateApi";

export const ibcOriginAssets = api({
  methodName: "ibcOriginAssets",
  method: "post",
  path: "/v2/fungible/ibc_origin_assets",
  transformResponse: (response) => response.originAssets,
});
