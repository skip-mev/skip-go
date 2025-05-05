import { api, ApiRequest } from "../utils/generateApi";

export const ibcOriginAssets = (request: ApiRequest<"getOriginAssets">["assets"]) =>
  api({
    methodName: "getOriginAssets",
    method: "post",
    path: "/v2/fungible/ibc_origin_assets",
    transformResponse: (response) => response.originAssets,
  })({ assets: request });