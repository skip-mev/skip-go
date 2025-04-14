import { api } from "./generateApi";

export const {
  request: getAssetsBetweenChains,
  requestWithCancel: getAssetsBetweenChainsWithCancel,
} = api({
  methodName: "fungibleAssetsBetweenChainsCreate",
  path: "/v2/fungible/assets_between_chains",
});
