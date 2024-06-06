import * as path from 'path';
import { getChainsPaths, getInitiaChainsPaths } from '../ast/get-chains-paths';
import { validateChainsPaths } from '../ast/validate-chains-paths';
import { parseChainPaths } from '../ast/parse-chain-paths';
import { writeEntrypoints } from '../ast/write-entrypoints';

async function codegen() {
  const registryPath = path.resolve('../../chain-registry');
  const initiaRegistryPath = path.resolve('../../initia-registry');
  const chainPaths = await getChainsPaths({
    registryPath,
  });
  console.log(registryPath);

  const initiaChainPaths = await getInitiaChainsPaths({
    registryPath: initiaRegistryPath,
  });

  const validChainPaths = await validateChainsPaths({
    registryPath,
    chainPaths,
  });

  const initiaValidChainPaths = await validateChainsPaths({
    registryPath: initiaRegistryPath,
    chainPaths: initiaChainPaths,
  });

  const variables = await parseChainPaths({
    registryPath,
    chainPaths: validChainPaths,
    initiaChainPaths: initiaValidChainPaths,
    initiaRegistryPath,
  });

  await writeEntrypoints({
    variables,
    destPath: 'src/chains/',
  });
}

void codegen();
