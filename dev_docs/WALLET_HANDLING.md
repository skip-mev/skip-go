# Wallet Handling in the Widget

This document explains how wallet connections are managed across the three supported chain ecosystems (Cosmos, EVM, Solana) in the Skip Go widget.

## Architecture Overview

The wallet system is built on three pillars:

1. **Providers** — chain-specific React context providers that supply wallet infrastructure
2. **Hooks** — create a unified `MinimalWallet` abstraction from each chain library
3. **State** — Jotai atoms that track which wallets are connected and their metadata

```
┌──────────────────────────────────────────────────────────┐
│                      Widget.tsx                           │
│                                                          │
│  EVMProvider (wagmi)                                     │
│    └─ CosmosProvider (graz)                              │
│         └─ SolanaProvider (@solana/wallet-adapter)       │
│              └─ App                                      │
│                   ├─ useCreateEvmWallets ──┐             │
│                   ├─ useCreateCosmosWallets ┼─► MinimalWallet[]  │
│                   └─ useCreateSolanaWallets ┘             │
│                                                          │
│              Jotai atoms                                 │
│              ├─ evmWalletAtom                            │
│              ├─ cosmosWalletAtom                         │
│              └─ svmWalletAtom                            │
└──────────────────────────────────────────────────────────┘
```

## The MinimalWallet Abstraction

Every wallet — regardless of chain type — is normalized into the `MinimalWallet` interface defined in `packages/widget/src/state/wallets.ts`:

```typescript
type MinimalWallet = {
  walletName: string;
  walletPrettyName: string;
  walletChainType: ChainType;          // "cosmos" | "evm" | "svm"
  walletInfo: { logo?: string };
  connect: (chainId?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isWalletConnected: boolean;
  isAvailable?: boolean;
  getAddress?: (props: {
    signRequired?: boolean;
    context?: "recovery" | "destination";
    praxWallet?: { index?: number; sourceChainID?: string };
  }) => Promise<{ address: string | undefined; logo?: string }>;
};
```

This is the widget's core abstraction for wallets. All UI components and hooks operate on `MinimalWallet` instances, never on chain-specific wallet types directly.

## Providers

Each chain ecosystem has a dedicated provider that wraps the widget tree.

### Cosmos — `CosmosProvider.tsx`
- **Library**: `graz` (`GrazProvider`)
- **Chains**: `mainnetChains` or `testnetChains` from constants, selected via `onlyTestnetsAtom`
- **WalletConnect**: Configured from `walletConnectAtom` (default project ID: `ff1b9e9bd6329cfb07642bd7f4d11a8c`)
- **Settings**: Auto-reconnect enabled, `preferNoSetFee: true`, `disableBalanceCheck: true`
- **Special**: Iframe support for DAODAO origins (`daodao.zone`)

### EVM — `EVMProvider.tsx`
- **Library**: `wagmi` (`WagmiProvider`)
- **Chains**: 30+ EVM chains configured in `constants/wagmi.ts` (Arbitrum, Base, Polygon, Optimism, etc.)
- **Config**: Accepts an optional custom `wagmiConfig` prop, falling back to the built-in default
- **Storage**: `localStorage` key `skip-go-widget-wagmi`
- **Settings**: Auto-reconnect on mount

### Solana — `SolanaProvider.tsx`
- **Library**: `@solana/wallet-adapter-react` (`WalletProvider`)
- **Wallets**: Ledger (base) + WalletConnect adapter loaded dynamically via React Query
- **Storage**: `localStorage` key `skip-go-widget-solana-wallet`
- **Settings**: Auto-connect enabled

### Provider Nesting Order

In `Widget.tsx`, the providers are nested as:

```
EVMProvider
  └─ QueryClientProvider
       └─ CosmosProvider
            └─ SolanaProvider
                 └─ NiceModal.Provider
                      └─ App
```

`QueryClientProvider` wraps Cosmos and Solana because the Solana provider uses React Query for dynamic wallet loading.

## Wallet Creation Hooks

Each chain ecosystem has a `useCreate*Wallets` hook that discovers available wallets from its provider and transforms them into `MinimalWallet[]`. All three hooks follow the same pattern:

1. Query the chain library for available wallets/connectors
2. Build a `MinimalWallet` for each one, wiring up `connect`, `disconnect`, and `getAddress`
3. Fire analytics events and `onWalletConnected`/`onWalletDisconnected` callbacks on state changes
4. Update the corresponding wallet atom (`cosmosWalletAtom`, `evmWalletAtom`, `svmWalletAtom`)

### `useCreateCosmosWallets` (hooks/useCreateCosmosWallets.tsx)

- **Discovery**: `getAvailableWallets()` from graz — returns Keplr, Leap, Cosmostation, XDEFI, Station, Vectis, WalletConnect, CosmiFrame, OKX
- **Penumbra**: Prax wallet handled as a special case
- **Chain IDs**: Tracks per-wallet "initial chain IDs" and "extra chain IDs" to connect. Extra chain IDs are persisted in `localStorage` via `extraCosmosChainIdsToConnectPerWalletAtom` so reconnection works across sessions.
- **Wallet connect**: Calls `graz`'s `connect()` with the appropriate chain IDs

### `useCreateEvmWallets` (hooks/useCreateEvmWallets.tsx)

- **Discovery**: `useConnectors()` from wagmi — returns all registered connectors
- **Chain switching**: If already connected but on a different chain, calls `switchChain` instead of a full reconnect
- **Sei special case**: For the Sei EVM chain, converts the EVM address to a Cosmos `sei1...` address using a precompile contract
- **WalletConnect metadata**: Extracts the peer session metadata to get the correct wallet logo

### `useCreateSolanaWallets` (hooks/useCreateSolanaWallets.tsx)

- **Discovery**: `useWallet()` from the Solana adapter — returns all registered adapters
- **Availability**: Checks `adapter.readyState` for `"Installed"` or `"Loadable"`
- **Connection**: Calls `wallet.adapter.connect()` for Solana wallets or `select(adapter.name)` + `connect()` for others

## State Management

### Per-Chain Wallet Atoms (`state/wallets.ts`)

Three atoms track which wallet is connected for each ecosystem:

```
evmWalletAtom    → { id, walletName, chainType, logo }
cosmosWalletAtom → { id, walletName, chainType, logo }
svmWalletAtom    → { id, walletName, chainType, logo }
```

These are aggregated by the read-only `walletsAtom`:

```typescript
walletsAtom = { evm, cosmos, svm }
```

### Keeping State in Sync — `useKeepWalletStateSynced`

The `useKeepWalletStateSynced` hook runs as an effect and monitors the actual connection state from each chain library (`graz`, `wagmi`, `@solana/wallet-adapter`). When a connection or disconnection is detected, it updates the corresponding Jotai atom. This is the single source of truth reconciliation — the atoms always reflect what the underlying libraries report.

### Connected Addresses Atom

`connectedAddressesAtom` is a `Record<string, string | undefined>` mapping `chainId → address`. This is used for **injected addresses** — addresses that the widget consumer provides programmatically rather than through a wallet connection. When set, these take priority over wallet-derived addresses.

### WalletConnect State

- `walletConnectAtom` — stores the WalletConnect project ID and app name
- `walletConnectDeepLinkByChainTypeAtom` — persisted in `localStorage`, stores deeplink and recent wallet data per chain type so mobile WalletConnect reconnection works

### Signer Getters

`getConnectedSignersAtom` stores `SignerGetters` — functions that retrieve chain-specific signers (Amino, Direct, EVM, SVM) used during transaction signing. These are populated by `useInitWidget` and consumed during swap execution.

## Account Resolution — `useGetAccount`

`useGetAccount` returns a `getAccount(chainId)` function that resolves the currently connected account for any chain:

1. **Injected addresses first** — checks `connectedAddressesAtom`
2. **Chain-specific lookup**:
   - Cosmos: reads from `graz`'s `useAccount()` data using the chain ID as key
   - EVM: reads from `wagmi`'s `useAccount()`, matching on numeric chain ID
   - Solana: reads from the Solana adapter's connected wallet

Returns `{ address, chainType, wallet: { name, prettyName, logo } }`.

## Auto Address Resolution — `useAutoSetAddress`

When a swap route is computed, the widget needs addresses for every chain in `route.requiredChainAddresses`. The `useAutoSetAddress` hook automates this:

1. For each required chain, determine its `chainType`
2. If an injected address exists → use it directly
3. Otherwise, find the connected wallet for that chain type, call `getAddress({ signRequired })`, and store the result
4. If no address can be resolved (wallet not connected, user rejected, etc.) → open a `SetAddressModal` for manual entry
5. Re-runs when wallets change (user connects/disconnects/switches)

The `signRequired` flag is derived from the route operations — chains that require transaction signing need an actual wallet connection, not just an address.

## UI Components

### Wallet Selector Modal (`WalletSelectorModal`)

Opened when the user needs to connect a wallet for a specific chain. Shows available wallets filtered by chain type, with:
- Wallet icons and names
- Connection state indicators
- Loading spinner during connection
- Error states with retry

Triggered from:
- The "Connect Wallet" button on the swap page
- Clicking an ecosystem row in the connected wallet modal
- Auto address resolution when a wallet is needed

### Connected Wallet Modal (`ConnectedWalletModal`)

Shows all three ecosystem connections at once using `EcosystemConnectors`:
- Each row (`ConnectEcoRow`) shows the wallet logo, truncated address, copy button, and disconnect action
- Clicking a row opens `WalletSelectorModal` for that ecosystem
- Unconnected ecosystems show a "Connect" prompt

### Wallet List Renderer (`RenderWalletList`)

Reusable component used by `WalletSelectorModal`:
- Virtualized list for performance
- Animated border spinner during connection attempts
- Filters out unavailable wallets (unless only one wallet exists)
- Supports both `MinimalWallet` entries and `ManualWalletEntry` entries (for custom items like "Enter address manually")

### Connected Wallet Content (`ConnectedWalletContent`)

Displayed in the swap page header when a source wallet is connected. Shows wallet logo, balance with loading state, and a "Max" button. Clicking opens `ConnectedWalletModal`.

## Widget Consumer Callbacks

The widget exposes two wallet-related callbacks via the `Callbacks` type:

```typescript
onWalletConnected?: (props: {
  walletName: string;
  chainIdToAddressMap?: Record<string, string>;
  chainId?: string;
  address?: string;
}) => void;

onWalletDisconnected?: (props: {
  walletName: string;
  chainType?: ChainType;
}) => void;
```

These are fired from inside each `useCreate*Wallets` hook whenever a wallet connects or disconnects, giving the host application visibility into wallet state changes.

## Connection Flow (End-to-End)

Here is the full lifecycle of a wallet connection:

```
User clicks "Connect Wallet"
  │
  ├─ Source asset has chainId?
  │    Yes → Open WalletSelectorModal for that chain
  │    No  → Open ConnectedWalletModal (pick ecosystem first)
  │
  ▼
WalletSelectorModal
  │ Shows MinimalWallet[] from useWalletList(chainId)
  │
  ▼
User picks a wallet
  │ RenderWalletList calls wallet.connect(chainId)
  │
  ├─ Chain library handles the actual connection
  │   (graz / wagmi / @solana/wallet-adapter)
  │
  ├─ useKeepWalletStateSynced detects the change
  │   → Updates cosmosWalletAtom / evmWalletAtom / svmWalletAtom
  │
  ├─ useCreate*Wallets fires onWalletConnected callback
  │
  ├─ useGetAccount can now resolve addresses for connected chains
  │
  └─ Modal closes
       │
       ▼
  Swap route computed → useAutoSetAddress runs
       │
       ├─ For each requiredChainAddress:
       │    Find matching MinimalWallet → call getAddress()
       │    Store in chainAddressesAtom
       │
       └─ If address can't be resolved → open SetAddressModal
```

## Sei Special Case

Sei (`pacific-1`) is unique because it supports both Cosmos and EVM wallets. The `useWalletList` hook returns wallets from both ecosystems when the chain ID is Sei's. In `useCreateEvmWallets`, when the target chain is Sei EVM, the hook converts the EVM address to a `sei1...` Cosmos address using a Sei precompile contract call.

## Injected Wallets and Addresses

The widget supports two forms of external wallet injection:

1. **`connectedAddressesAtom`**: A `Record<chainId, address>` that the widget consumer can populate. These addresses bypass wallet connection entirely and are used as-is. `useGetAccount` and `useAutoSetAddress` both check this atom first.

2. **Custom wagmi config**: The `EVMProvider` accepts an optional `wagmiConfig` prop, allowing the host app to provide its own wagmi configuration with custom connectors, chains, and transports.
