import { api } from "../generateApi";

export const assetsFromSource = api({
  methodName: "getAssetsFromSource",
  path: "/v2/fungible/assets_from_source",
});
