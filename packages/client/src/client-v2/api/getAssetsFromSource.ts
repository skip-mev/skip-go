import { api } from "./generateApi";

export const {
  request: getAssetsFromSource,
  requestWithCancel: getAssetsFromSourceWithCancel,
} = api("getAssetsFromSource", "/v2/fungible/assets_from_source");
