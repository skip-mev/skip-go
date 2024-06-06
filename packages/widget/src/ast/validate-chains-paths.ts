import * as fs from "fs/promises";
import pMap, { pMapSkip } from "p-map";
import * as path from "path";

import { concurrency } from "./_constants";

interface Args {
  registryPath: string;
  chainPaths: string[];
}

export async function validateChainsPaths({ registryPath, chainPaths }: Args) {
  const filesToCheck = ["chain.json"];

  const checkFiles = async (chainPath: string) => {
    try {
      await Promise.all(
        filesToCheck.map((file) => {
          return fs.lstat(path.resolve(registryPath, chainPath, file));
        }),
      );
      return chainPath;
    } catch (error) {
      return pMapSkip;
    }
  };

  const validChainPaths = await pMap(chainPaths, checkFiles, { concurrency });

  return validChainPaths;
}
