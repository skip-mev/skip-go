# Adding Chains to Skip Go

This guide covers the full process for adding new Cosmos and EVM chains to the Skip Go widget and client library. Adding a chain touches multiple packages and requires regeneration steps — it is not a single-file change.

## Overview

Chain data flows through several layers:

```
chain-registry / initia-registry (npm packages)
        │
        ▼
┌──────────────────────────────────────┐
│  packages/client (codegen script)    │  ← RPC endpoints, fee tokens, key algos
│  packages/widget (generate-chains)   │  ← Keplr-compatible ChainInfo for wallets
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│  Skip API  (v2/info/chains)          │  ← Routing, assets, chain metadata
└──────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────┐
│  Widget UI / Consumer apps           │  ← Uses all of the above
└──────────────────────────────────────┘
```

**Key principle**: The Skip API (`v2/info/chains`) is the source of truth for which chains are available for routing. The local chain data in `packages/client` and `packages/widget` provides wallet-level configuration (RPC endpoints, fee tokens, signing parameters) that the API does not supply.

---

## Adding a Cosmos Chain

### Case 1: Chain exists in `chain-registry` or `@initia/initia-registry`

Most Cosmos chains are already present in the [chain-registry](https://github.com/cosmos/chain-registry) or [initia-registry](https://github.com/initia-labs/initia-registry). If your chain is listed there, it will be picked up automatically during code generation.

**Steps:**

1. **Update the registry packages** (from repo root):

   ```bash
   # Updates both chain-registry and @initia/initia-registry to latest
   cd packages/client && yarn update-registries
   cd packages/widget && yarn update-registries
   ```

   This runs `yarn up @initia/initia-registry chain-registry` in each package.

2. **Regenerate client chain data:**

   ```bash
   cd packages/client
   yarn codegen
   ```

   This runs `scripts/codegen.cjs`, which:
   - Reads `chain-registry` and `@initia/initia-registry` from `node_modules`
   - Extracts `chainId`, `fees`, `apis.rpc`, `keyAlgos`, and `extraCodecs`
   - Writes `src/codegen/chains.json`

3. **Regenerate widget chain data:**

   ```bash
   cd packages/widget
   yarn generate-chains
   ```

   This runs `scripts/generate-chains.cjs`, which:
   - Reads the same registries
   - Extracts Keplr-compatible `ChainInfo` (currencies, fee currencies, bech32 config, RPC/REST endpoints)
   - Writes `src/constants/cosmosChains/mainnet.json`, `testnet.json`, and `explorers.json`

4. **Build and publish** — see [Release Process](#release-process) below.

### Case 2: Chain does NOT exist in any registry

If the chain is not yet in a public registry, you must add it manually in two places:

#### A. Client library (`packages/client/src/chains.ts`)

Add a `Chain` object (using `@chain-registry/types`) to the `additionalChains` array:

```typescript
const myNewChain: Chain = {
  chainId: "mychain-1",
  chainName: "mychain",
  chainType: "cosmos",
  apis: {
    rpc: [{ address: "https://rpc.mychain.example" }],
    rest: [{ address: "https://rest.mychain.example" }],
  },
  fees: {
    feeTokens: [
      {
        denom: "umytoken",
        fixedMinGasPrice: 0.025,
        lowGasPrice: 0.025,
        averageGasPrice: 0.03,
        highGasPrice: 0.04,
      },
    ],
  },
};

const additionalChains = [
  SOLANA_CHAIN,
  lombardTestnet,
  lombardMainnet,
  myNewChain,          // ← add here
] as Chain[];
```

This gives the client library RPC/REST endpoints and fee token info for signing.

#### B. Widget (`packages/widget/src/constants/chains.ts`)

Add a Keplr-compatible `ChainInfo` object and include it in `mainnetChains` or `testnetChains`:

```typescript
const myNewChain: ChainInfo = {
  chainName: "My Chain",
  chainId: "mychain-1",
  rpc: "https://rpc.mychain.example",
  rest: "https://rest.mychain.example",
  bip44: { coinType: 118 },
  currencies: [
    { coinDenom: "MYT", coinMinimalDenom: "umytoken", coinDecimals: 6 },
  ],
  feeCurrencies: [
    { coinDenom: "MYT", coinMinimalDenom: "umytoken", coinDecimals: 6 },
  ],
  stakeCurrency: {
    coinDenom: "MYT", coinMinimalDenom: "umytoken", coinDecimals: 6,
  },
  bech32Config: {
    bech32PrefixAccAddr: "mychain",
    bech32PrefixAccPub: "mychainpub",
    bech32PrefixValAddr: "mychainvaloper",
    bech32PrefixValPub: "mychainvaloperpub",
    bech32PrefixConsAddr: "mychainvalcons",
    bech32PrefixConsPub: "mychainvalconspub",
  },
};

// Add to the appropriate array:
export const mainnetChains = [
  ...(_mainnetChains as unknown as ChainInfo[]),
  lombardMainnet,
  myNewChain,          // ← add here
];
```

This allows Keplr and other Cosmos wallets to suggest the chain to users.

---

## Adding an EVM Chain

EVM chains require configuration in two places within the widget, and one in the client:

### 1. Widget wagmi config (`packages/widget/src/constants/wagmi.ts`)

This configures the wallet connection layer (wagmi/viem).

**If the chain is already in `wagmi/chains`** (most popular EVM chains are):

```typescript
// Add the import
import { mychain } from "wagmi/chains";

// Add to the chains array in createConfig
export const config: Config = createConfig({
  chains: [
    // ... existing chains ...
    mychain,           // ← add here
  ],
  transports: {
    // ... existing transports ...
    [mychain.id]: http(),  // ← add transport here
  },
  // ...
});
```

**If the chain is NOT in `wagmi/chains`**, define it with `defineChain`:

```typescript
import { defineChain } from "viem";

export const myCustomChain = defineChain({
  id: 12345,
  name: "My Custom Chain",
  nativeCurrency: {
    name: "MYC",
    symbol: "MYC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mychain.example"],
    },
  },
  blockExplorers: {
    default: {
      name: "MyChain Explorer",
      url: "https://explorer.mychain.example",
    },
  },
  testnet: false,
});
```

Then add it to both the `chains` array and the `transports` object in `createConfig`.

### 2. Client EVM chains (`packages/client/src/constants/evmChains.ts`)

Mirror the same chain in the client's EVM chain list:

```typescript
import { mychain } from "viem/chains";
// or import { myCustomChain } from "./myCustomChain";

export const evmChains = [
  // ... existing chains ...
  mychain,             // ← add here
];
```

### 3. Consumer wagmi config (optional)

The widget's `EVMProvider` accepts an optional `wagmiConfig` prop. If a consumer app provides its own wagmi config, they will also need to add the chain there. This is outside the scope of this repository.

---

## Release Process

Adding a chain is a cross-package change. All affected packages must be rebuilt, versioned, and published for the change to take effect in consumer applications.

### 1. Build the client library

```bash
cd packages/client
yarn build
```

### 2. Build the widget

The widget build automatically runs `generate-chains` as part of its build script:

```bash
cd packages/widget
yarn build    # runs: yarn generate-chains && vite build
```

### 3. Create a changeset

From the repository root:

```bash
npx changeset
```

- Select the packages that changed (`@skip-go/client`, `@skip-go/widget`, or both)
- Choose the appropriate version bump:
  - **patch** for adding a chain that already exists in the registry
  - **minor** for adding a brand-new chain with manual configuration
- Write a description (e.g., "Added support for MyChain")

### 4. Consumer apps must bump the widget version

After the new versions of `@skip-go/client` and/or `@skip-go/widget` are published to npm, any consumer application (e.g., the Next.js example in `examples/nextjs/`) must:

1. Update their `@skip-go/widget` (and/or `@skip-go/client`) dependency to the newly published version
2. Rebuild and redeploy

The chain will not appear in a consumer app until it updates to the new widget/client version.

---

## Quick Reference

| What to do | Cosmos (in registry) | Cosmos (manual) | EVM (in wagmi/chains) | EVM (custom) |
|---|---|---|---|---|
| Update registry packages | Yes | No | No | No |
| `packages/client/scripts/codegen.cjs` (auto) | Yes | No | No | No |
| `packages/client/src/chains.ts` (manual) | No | Yes | No | No |
| `packages/client/src/constants/evmChains.ts` | No | No | Yes | Yes |
| `packages/widget/scripts/generate-chains.cjs` (auto) | Yes | No | No | No |
| `packages/widget/src/constants/chains.ts` (manual) | No | Yes | No | No |
| `packages/widget/src/constants/wagmi.ts` | No | No | Yes | Yes |
| Create changeset | Yes | Yes | Yes | Yes |
| Consumer app bumps widget version | Yes | Yes | Yes | Yes |

## Files at a Glance

| File | Purpose |
|---|---|
| `packages/client/scripts/codegen.cjs` | Generates `chains.json` from chain-registry + initia-registry (Cosmos) |
| `packages/client/src/chains.ts` | Merges generated chains with manually added chains (Solana, Lombard, etc.) |
| `packages/client/src/constants/evmChains.ts` | Static list of EVM chains from viem for signing |
| `packages/widget/scripts/generate-chains.cjs` | Generates Keplr-compatible chain configs for wallet integration |
| `packages/widget/src/constants/chains.ts` | Merges generated Cosmos chains with manually added chains |
| `packages/widget/src/constants/wagmi.ts` | Wagmi config with EVM chain list for wallet connection |
| `packages/widget/src/constants/cosmosChains/*.json` | Generated output (mainnet, testnet, explorers) — do not edit manually |
