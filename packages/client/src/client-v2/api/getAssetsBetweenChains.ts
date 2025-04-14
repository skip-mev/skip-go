import { api } from "./generateApi";

export const {
  request: getAssetsBetweenChains,
  requestWithCancel: getAssetsBetweenChainsWithCancel,
} = api(
  "fungibleAssetsBetweenChainsCreate",
  "/v2/fungible/assets_between_chains",
);
