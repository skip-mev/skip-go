/* eslint-disable */

const fs = require('fs/promises');
const path = require('path');
const { Bech32Address } = require('@keplr-wallet/cosmos');
const outPath = path.resolve(__dirname, '../src/constants/cosmosChains');

const registries = [
  {
    packageName: 'chain-registry',
    registryPath: path.resolve(__dirname, '../../../node_modules/chain-registry'),
    isCamelCase: true,
  },
  {
    packageName: 'initia-registry',
    registryPath: path.resolve(__dirname, '../../../node_modules/@initia/initia-registry/main'),
    isCamelCase: false,
  }
];

async function collectMainnetChains({ registryPath, packageName, isCamelCase }) {
  const mainnetDir = path.join(registryPath, 'mainnet');
  const mainnetChains = await collectChainData(mainnetDir, packageName, 'mainnet', false, isCamelCase);
  return mainnetChains
}

async function collectTestnetChains({ registryPath, packageName, isCamelCase }) {
  const testnetDir = path.join(registryPath, 'testnet');
  const testnetChains = await collectChainData(testnetDir, packageName, 'testnet', false, isCamelCase);
  return testnetChains
}

async function collectExplorers({ registryPath, packageName, isCamelCase }) {
  const mainnetDir = path.join(registryPath, 'mainnet');
  const mainnetChains = await collectChainData(mainnetDir, packageName, 'mainnet', true, isCamelCase);
  const testnetDir = path.join(registryPath, 'testnet');
  const testnetChains = await collectChainData(testnetDir, packageName, 'testnet', true, isCamelCase);
  return mainnetChains.concat(testnetChains);
}

async function collectChainData(directory, packageName, networkType, isGetExplorers, isCamelCase) {
  const chains = [];
  try {
    const dirEntries = await fs.readdir(directory, { withFileTypes: true });

    for (const dirent of dirEntries) {
      if (dirent.isDirectory()) {
        const chainName = dirent.name;
        try {
          const chainJsPath = path.join(directory, chainName, 'chain.js');
          const chainModule = require(chainJsPath);
          const chainData = chainModule.default || chainModule;
          const chainArray = Array.isArray(chainData) ? chainData : [chainData];
          const chain = chainArray[0]
          if (isGetExplorers) {
            if (isCamelCase) {
              const extractedData = extractCamelCaseExplorerUrl(chain);
              chains.push(extractedData);
            } else {
              const extractedData = extractExplorerUrl(chain);
              chains.push(extractedData);
            }
          } else {
            const assetJsPath = path.join(directory, chainName, isCamelCase ? 'asset-list.js' :'assets.js');
            const assetModule = require(assetJsPath);
            const assetData = assetModule.default || assetModule;
            const assetArray = Array.isArray(assetData) ? assetData : [assetData];
            const asset = assetArray[0];
            if (isCamelCase) {
              const extractedData = extractCamelCaseProperties(chain, asset);
              console.log(`Extracted chain info for ${chainName} in ${packageName}:`, extractedData);
              chains.push(extractedData);
            } else {
              const extractedData = extractProperties(chain, asset);
              chains.push(extractedData);
            }
          }

        } catch (error) {
          console.warn(`Error generating chain info for ${chainName} in ${packageName}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${networkType} ${packageName} directory ${directory}:`, error.message);
  }
  console.log( `Collected ${chains.length} chains from ${directory}`);
  return chains;
}

function extractProperties(chain, asset) {
  const { assets } = asset
  const mainAsset = assets[0]
  /** @type{import("@keplr-wallet/types").Currency} */
  const stakeCurrency = {
    coinDenom: mainAsset.denom_units[mainAsset.denom_units.length - 1].denom,
    coinMinimalDenom: mainAsset.denom_units[0].denom,
    coinDecimals: mainAsset.denom_units[mainAsset.denom_units.length - 1].exponent,
  };

  const feeCurrencies = chain.fees?.fee_tokens.map((token) => {
    const isGasPriceStepAvailable = token.low_gas_price && token.average_gas_price && token.high_gas_price;
    const feeAsset = assets.find((asset) => asset.base === token.denom);
    if (isGasPriceStepAvailable) {
      return {
        coinDenom:
          feeAsset.denom_units[feeAsset.denom_units.length - 1]?.denom || token.denom,
        coinMinimalDenom:
          feeAsset.denom_units[0]?.denom || token.denom,
        coinDecimals: Number(feeAsset.denom_units[feeAsset.denom_units.length - 1]?.exponent),
        gasPriceStep: {
          low: Number(token.low_gas_price),
          average: Number(token.average_gas_price),
          high: Number(token.high_gas_price),
        },
      };
    }
    return {
      coinDenom:
        feeAsset?.denom_units[feeAsset.denom_units.length - 1]?.denom || token.denom,
      coinMinimalDenom:
        feeAsset?.denom_units[0]?.denom || token.denom,
      coinDecimals: Number(feeAsset.denom_units[feeAsset.denom_units.length - 1]?.exponent),
    };
  });

  if (!feeCurrencies) {
    throw new Error(`⚠️\t${chain.name} has no fee currencies, skipping codegen...`);
  }

  /** @type{import("@keplr-wallet/types").ChainInfo} */
  const chainInfo = {
    chainId: chain.chain_id,
    currencies: assets.map((asset) => ({
      coinDenom: asset.denom_units[asset.denom_units.length - 1].denom,
      coinMinimalDenom: asset.denom_units[0].denom,
      coinDecimals: asset.denom_units[asset.denom_units.length - 1].exponent,
    })),
    rest: chain.apis.rest[0].address,
    rpc: chain.apis.rpc[0].address,
    bech32Config: Bech32Address.defaultBech32Config(chain.bech32_prefix),
    chainName: chain.chain_name,
    feeCurrencies,
    stakeCurrency: stakeCurrency,
    bip44: {
      coinType: chain.slip44 ?? 0,
    },
  }

  return chainInfo;
}

function extractCamelCaseProperties(chain, asset) {
  const { assets } = asset
  const mainAsset = assets[0]
  /** @type{import("@keplr-wallet/types").Currency} */
  const stakeCurrency = {
    coinDenom: mainAsset.denomUnits[mainAsset.denomUnits.length - 1].denom,
    coinMinimalDenom: mainAsset.denomUnits[0].denom,
    coinDecimals: mainAsset.denomUnits[mainAsset.denomUnits.length - 1].exponent,
  };

  const feeCurrencies = chain.fees?.feeTokens.map((token) => {
    const isGasPriceStepAvailable = token.lowGasPrice && token.averageGasPrice && token.highGasPrice;
    const feeAsset = assets.find((asset) => asset.base === token.denom);
    if (isGasPriceStepAvailable) {
      return {
        coinDenom:
          feeAsset.denomUnits[feeAsset.denomUnits.length - 1]?.denom || token.denom,
        coinMinimalDenom:
          feeAsset.denomUnits[0]?.denom || token.denom,
        coinDecimals: Number(feeAsset.denomUnits[feeAsset.denomUnits.length - 1]?.exponent),
        gasPriceStep: {
          low: Number(token.lowGasPrice),
          average: Number(token.averageGasPrice),
          high: Number(token.highGasPrice),
        },
      };
    }
    return {
      coinDenom:
        feeAsset?.denomUnits[feeAsset.denomUnits.length - 1]?.denom || token.denom,
      coinMinimalDenom:
        feeAsset?.denomUnits[0]?.denom || token.denom,
      coinDecimals: Number(feeAsset.denomUnits[feeAsset.denomUnits.length - 1]?.exponent),
    };
  });

  if (!feeCurrencies) {
    throw new Error(`⚠️\t${chain.name} has no fee currencies, skipping codegen...`);
  }

  /** @type{import("@keplr-wallet/types").ChainInfo} */
  const chainInfo = {
    chainId: chain.chainId,
    currencies: assets.map((asset) => ({
      coinDenom: asset.denomUnits[asset.denomUnits.length - 1].denom,
      coinMinimalDenom: asset.denomUnits[0].denom,
      coinDecimals: asset.denomUnits[asset.denomUnits.length - 1].exponent,
    })),
    rest: chain.apis.rest[0].address,
    rpc: chain.apis.rpc[0].address,
    bech32Config: Bech32Address.defaultBech32Config(chain.bech32Prefix),
    chainName: chain.chainName,
    feeCurrencies,
    stakeCurrency: stakeCurrency,
    bip44: {
      coinType: chain.slip44 ?? 0,
    },
  }

  return chainInfo;
}

function extractExplorerUrl(chain) {
  return {
    chainId: chain.chain_id,
    explorers: chain.explorers
  }
}

function extractCamelCaseExplorerUrl(chain) {
  return {
    chainId: chain.chainId,
    explorers: chain.explorers
  }
}


async function codegen() {
  console.log('Generating mainnet chain info files...');
  let mainnetChains = [];
  for (const registry of registries) {
    const chains = await collectMainnetChains(registry);
    mainnetChains = mergeArrays(mainnetChains, chains);
  }
  const outputFilePath = path.resolve(outPath, 'mainnet.json');
  await fs.writeFile(outputFilePath, JSON.stringify(mainnetChains), 'utf-8');
  console.log(`Generated mainnet chains file at ${outputFilePath}`);

  console.log('Generating testnet chain info files...');
  let testnetChains = [];
  for (const registry of registries) {
    const chains = await collectTestnetChains(registry);
    testnetChains = mergeArrays(testnetChains, chains);
  }
  const testnetOutputFilePath = path.resolve(outPath, 'testnet.json');
  await fs.writeFile(testnetOutputFilePath, JSON.stringify(testnetChains), 'utf-8');
  console.log(`Generated testnet chains file at ${testnetOutputFilePath}`);

  console.log('Generating explorers files...');
  let explorers = [];
  for (const registry of registries) {
    const chains = await collectExplorers(registry);
    explorers = mergeArrays(explorers, chains);
  }
  const explorersOutputFilePath = path.resolve(outPath, 'explorers.json');
  await fs.writeFile(explorersOutputFilePath, JSON.stringify(explorers), 'utf-8');
  console.log(`Generated explorers file at ${explorersOutputFilePath}`);
}

const mergeArrays = (arr1, arr2) => {
  const merged = [...arr1, ...arr2];
  const map = new Map();

  merged.forEach((item) => {
    map.set(item.chainId, item); // second occurrence overwrites first
  });

  return Array.from(map.values());
};

void codegen();
