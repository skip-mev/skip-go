import { AssetList } from "@graz-sh/types";
import { assetListSchema } from "@graz-sh/types/zod";
import * as fs from "fs/promises";
import * as path from "path";

interface Args {
  registryPath: string;
  chainPath: string;
}

export async function parseAssetListJson({ registryPath, chainPath }: Args) {
  const jsonPath = path.resolve(registryPath, chainPath, "assetlist.json");

  let data: AssetList;
  try {
    const content = await fs.readFile(jsonPath, "utf-8");
    data = await assetListSchema.parseAsync(JSON.parse(content));
  } catch (error) {
    data = {
      chain_name: chainPath,
      assets: [],
    };
  }

  return data;
}
