import { Chain } from "@graz-sh/types";
import { chainSchema } from "@graz-sh/types/zod";
import * as fs from "fs/promises";
import * as path from "path";

interface Args {
  registryPath: string;
  chainPath: string;
}

export async function parseChainJson({ registryPath, chainPath }: Args) {
  const jsonPath = path.resolve(registryPath, chainPath, "chain.json");

  const content = await fs.readFile(jsonPath, "utf-8");
  const data: Chain = await chainSchema.parseAsync(JSON.parse(content));

  return data;
}
