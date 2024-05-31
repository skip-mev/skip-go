import { Asset, AssetList, Chain } from "@graz-sh/types";
import { ChainId } from "./types";
export declare function getChain(chainId: ChainId): Chain;
export declare function getAssets(chainId: ChainId): Asset[];
export declare function getChains(): Chain[];
export declare function getAssetLists(): AssetList[];
export * from "./types";
