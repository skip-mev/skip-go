import { api } from "./generateApi";

export const {
  request: getAssetsFromSource,
  requestWithCancel: getAssetsFromSourceWithCancel,
} = api({
  methodName: "getAssetsFromSource",
  path: "/v2/fungible/assets_from_source",
});
