import { Asset } from "../../types/swaggerTypes";
import { ClientState } from "../state";
import { api } from "./generateApi";

export const { request: getAssets, requestWithCancel: getAssetsWithCancel } =
  api("getAssets", "/v2/fungible/assets", (res, options) => {
    if (
      options.includeEvmAssets &&
      options.includeSvmAssets &&
      options.includeCw20Assets
    ) {
      ClientState.skipAssets = res.chainToAssetsMap as Record<string, Asset[]>;
    }
  });
