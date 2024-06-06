import { Asset, AssetList, Chain, ChainInfo, Explorer } from "@graz-sh/types";
import { chainToChainInfo } from "@graz-sh/types/convert";
import pMap from "p-map";

import { concurrency } from "./_constants";
import { Variables } from "./_types";
import { parseAssetListJson } from "./parse-asset-list-json";
import { parseChainJson } from "./parse-chain-json";

interface Args {
  registryPath: string;
  chainPaths: string[];
  initiaRegistryPath: string;
  initiaChainPaths: string[];
}

export async function parseChainPaths({
  registryPath,
  chainPaths,
  initiaChainPaths,
  initiaRegistryPath,
}: Args): Promise<Variables> {
  const chains: Chain[] = [];
  const assetlists: AssetList[] = [];

  const chainIds: string[] = [];
  const chainNames: string[] = [];

  const chainIdToName: Record<string, string> = {};
  const chainIdToPrettyName: Record<string, string> = {};
  const chainNameToId: Record<string, string> = {};
  const chainRecord: Record<string, Chain> = {};
  const assetsRecord: Record<string, Asset[]> = {};
  const explorersRecord: Record<string, Explorer[]> = {};
  const chainInfosRecord: Record<string, ChainInfo> = {};

  async function loadChainPath(_registryPath: string, chainPath: string) {
    const [assetlist, chain] = await Promise.all([
      parseAssetListJson({ registryPath: _registryPath, chainPath }),
      parseChainJson({ registryPath: _registryPath, chainPath }),
    ]);

    chains.push(chain);
    assetlists.push(assetlist);

    chainIds.push(chain.chain_id);
    chainNames.push(chain.chain_name);

    chainIdToName[chain.chain_id] = chain.chain_name;
    chainIdToPrettyName[chain.chain_id] = chain.pretty_name;

    chainNameToId[chain.chain_name] = chain.chain_id;

    chainRecord[chain.chain_id] = chain;
    assetsRecord[chain.chain_id] = assetlist.assets;
    explorersRecord[chain.chain_id] = chain.explorers || [];
    if (assetlist.assets.length > 0)
      chainInfosRecord[chain.chain_id] = chainToChainInfo({
        chain,
        assetlist,
      });
  }

  await pMap(chainPaths, (i) => loadChainPath(registryPath, i), { concurrency });
  await pMap(initiaChainPaths, (i) => loadChainPath(initiaRegistryPath, i), { concurrency });

  return {
    chains,
    assetlists,
    chainIds,
    chainNames,
    chainIdToName,
    chainIdToPrettyName,
    chainNameToId,
    chainRecord,
    assetsRecord,
    explorersRecord,
    chainInfosRecord,
  };
}
