import * as fs from "fs/promises";
import * as path from "path";

import { Variables } from "./_types";

interface Args {
  variables: Variables;
  destPath: string;
}

export async function writeEntrypoints({ variables: v, destPath }: Args) {
  await fs.mkdir(path.resolve(destPath), { recursive: true }).catch(() => void 0);

  const typesTs = `/* eslint-disable */
// @ts-nocheck
export const chainIds = ${JSON.stringify(v.chainIds)} as const;
export type ChainId = (typeof chainIds)[number] | (string & {});

export const chainNames = ${JSON.stringify(v.chainNames)} as const;
export type ChainName = (typeof chainNames)[number] | (string & {});

export const chainIdToName: Record<ChainId, ChainName> = ${JSON.stringify(v.chainIdToName)};
export const chainNameToId: Record<ChainName, ChainId> = ${JSON.stringify(v.chainNameToId)};
`;
  const typesTarget = path.resolve(destPath, "types.ts");
  await fs.writeFile(typesTarget, typesTs, "utf-8");

  const prettyTs = `/* eslint-disable */
// @ts-nocheck
import { ChainId } from "./types"

export const chainIdToPrettyName: Record<ChainId, string> = ${JSON.stringify(v.chainIdToPrettyName)};
`;
  const prettyTarget = path.resolve(destPath, "pretty.ts");
  await fs.writeFile(prettyTarget, prettyTs, "utf-8");

  const explorersTs = `/* eslint-disable */
// @ts-nocheck
import { Explorer } from "@graz-sh/types";
import { ChainId } from "./types"

export const explorersRecord: Record<ChainId, Explorer[]> = ${JSON.stringify(v.explorersRecord)};
`;
  const explorersTarget = path.resolve(destPath, "explorers.ts");
  await fs.writeFile(explorersTarget, explorersTs, "utf-8");

  const chainsTs = `/* eslint-disable */
// @ts-nocheck
import { Chain } from "@graz-sh/types";
import { ChainId } from "./types";

export const chainRecord: Record<ChainId, Chain> = ${JSON.stringify(v.chainRecord)};
`;
  const chainsTarget = path.resolve(destPath, "chains.ts");
  await fs.writeFile(chainsTarget, chainsTs, "utf-8");

  const assetsTs = `/* eslint-disable */
// @ts-nocheck
import { Asset, AssetList } from "@graz-sh/types";
import { ChainId } from "./types";

export const assetsRecord: Record<ChainId, Asset[]> = ${JSON.stringify(v.assetsRecord)};
`;

  const assetsTarget = path.resolve(destPath, "assets.ts");
  await fs.writeFile(assetsTarget, assetsTs, "utf-8");

  const chainInfosTs = `/* eslint-disable */
// @ts-nocheck
import { ChainInfo } from "@graz-sh/types";
import { ChainId } from "./types";

export const chainInfosRecord: Record<ChainId, ChainInfo> = ${JSON.stringify(v.chainInfosRecord)};
`;

  const chainInfosTarget = path.resolve(destPath, "chain-infos.ts");
  await fs.writeFile(chainInfosTarget, chainInfosTs, "utf-8");
}
