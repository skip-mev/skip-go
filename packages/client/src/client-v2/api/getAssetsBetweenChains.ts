import { api } from "../generateApi";

export const assetsBetweenChains = api({
  methodName: "fungibleAssetsBetweenChainsCreate",
  path: "/v2/fungible/assets_between_chains",
});
