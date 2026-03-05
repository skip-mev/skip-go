# Architecture Overview — Skip Go

## High-Level Architecture

```mermaid
flowchart TD
    subgraph Consumer["Consumer Application"]
        A["<skip-widget> or <Widget />"]
    end

    subgraph WidgetPkg["@skip-go/widget"]
        B[Widget Entry] --> C[ShadowDomAndProviders]
        C --> D[Chain Providers]
        D --> E[Router]
        E --> F[Pages]
        F --> G[Modals]
        B --> H[Jotai State]
        H --> I[TanStack Query]
    end

    subgraph ClientPkg["@skip-go/client"]
        J[API Layer] --> K[Skip REST API]
        L[Public Functions] --> J
        M[Private Functions] --> N[Chain RPCs]
        L --> M
    end

    A --> B
    I --> L
    F --> L
```

---

## Package Overview

| Package | npm | Purpose |
|---------|-----|---------|
| `@skip-go/widget` | `packages/widget` | React UI component for cross-chain swaps and transfers |
| `@skip-go/client` | `packages/client` | Headless SDK for interacting with the Skip Go API |

Both packages are published independently. The widget depends on the client.

### Supporting Apps

| App | Path | Purpose |
|-----|------|---------|
| Explorer | `apps/explorer` | Next.js demo app showcasing the widget |
| Next.js Example | `examples/nextjs` | Integration example for Next.js |
| Nuxt.js Example | `examples/nuxtjs` | Integration example for Nuxt.js |
| Client Example | `examples/client` | Headless client usage example |
| Raw HTML | `examples/raw-html.html` | Web component usage example |

---

## Widget Package Architecture

### Entry Points

| Entry | File | Output |
|-------|------|--------|
| React component | `src/index.tsx` | ESM library via Vite |
| Web component | `src/web-component.tsx` | Bundle via Webpack (`<skip-widget>`) |

### Initialization Flow

```mermaid
sequenceDiagram
    participant App as Consumer
    participant W as Widget
    participant Init as useInitWidget
    participant Client as @skip-go/client
    participant API as Skip API

    App->>W: <Widget props={...} />
    W->>W: Create jotaiStore + QueryClient
    W->>W: migrateOldLocalStorageValues()
    W->>Init: useInitWidget(props)
    Init->>Client: setClientOptions(apiUrl, endpoints, ...)
    Init->>Client: setApiOptions(apiUrl, apiKey, headers)
    Init->>W: Set atoms (theme, filters, callbacks, ...)
    W->>W: Mount provider tree
    W->>API: Fetch chains + assets (cached in IndexedDB)
```

### Provider Tree

The widget wraps all content in a layered provider tree:

```mermaid
flowchart TD
    A["Jotai Provider (jotaiStore)"] --> B["ShadowDomAndProviders (theme, Shadow DOM)"]
    B --> C["EVMProvider (wagmi)"]
    C --> D["QueryClientProvider (TanStack Query)"]
    D --> E["CosmosProvider (graz)"]
    E --> F["SolanaProvider (wallet-adapter)"]
    F --> G["NiceModal.Provider"]
    G --> H["WidgetWrapper (register modals, settings)"]
    H --> I["Router"]
```

### Routing

The widget uses atom-based routing — no URL router. `currentPageAtom` drives which page renders:

| Route | Page Component | Purpose |
|-------|---------------|---------|
| `SwapPage` | `SwapPage` | Asset selection, amount input, route preview |
| `SwapExecutionPage` | `SwapExecutionPage` | Transaction signing, status tracking |
| `TransactionHistoryPage` | `TransactionHistoryPage` | Past transaction list |

`errorWarningAtom` overrides all routes to show `ErrorWarningPage` when set.

Each page is wrapped in `Suspense` and `ErrorBoundary`.

---

## Client Package Architecture

### Layer Overview

```mermaid
flowchart LR
    subgraph Public["Public API"]
        A[executeRoute]
        B[route]
        C[chains / assets]
        D[subscribeToRouteStatus]
    end

    subgraph API["API Layer"]
        E["postRoute"]
        F["getChains / getAssets"]
        G["postMessages"]
        H["postSubmitTransaction"]
        I["postTransactionStatus"]
    end

    subgraph Private["Private Functions"]
        J[executeTransactions]
        K[cosmos/]
        L[evm/]
        M[svm/]
    end

    A --> G --> J
    A --> D --> I
    B --> E
    J --> K & L & M
    K & M --> H
```

### API Layer (`src/api/`)

Thin wrappers around Skip REST API endpoints. Each file exports a single function that calls `api()` from `generateApi.ts`.

| Function | Endpoint | Method |
|----------|----------|--------|
| `route` | `v2/fungible/route` | POST |
| `messages` | `v2/fungible/msgs` | POST |
| `chains` | `v2/info/chains` | GET |
| `assets` | `v2/fungible/assets` | GET |
| `balances` | `v2/info/balances` | POST |
| `submitTransaction` | `v2/tx/submit` | POST |
| `trackTransaction` | `v2/tx/track` | POST |
| `transactionStatus` | `v2/tx/status` | GET |

### Public Functions (`src/public-functions/`)

Higher-level operations that compose API calls with signing and execution logic.

| Function | Purpose |
|----------|---------|
| `executeRoute` | Full route execution: messages → sign → submit → track |
| `executeMultipleRoutes` | Execute multiple routes in sequence |
| `subscribeToRouteStatus` | Poll transaction status with callbacks |
| `getRouteWithGasOnReceive` | Compute gas-on-receive routes |
| `setClientOptions` | Configure endpoints and registries |
| `setApiOptions` | Configure API URL, key, headers |

### Private Functions (`src/private-functions/`)

Chain-specific signing and execution logic, not exported publicly.

| Directory | Functions |
|-----------|-----------|
| `cosmos/` | `signCosmosTransaction`, `executeCosmosTransaction`, `signCosmosMessageDirect`, `signCosmosMessageAmino` |
| `evm/` | `executeEvmTransaction`, `validateEvmGasBalance`, `validateEvmTokenApproval` |
| `svm/` | `executeSvmTransaction`, `signSvmTransaction`, `validateSvmGasBalance` |

---

## Data Flow: Swap Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant SwapPage
    participant Atoms as Jotai State
    participant Client as @skip-go/client
    participant API as Skip API
    participant Wallet
    participant Chain as Blockchain

    User->>SwapPage: Select assets, enter amount
    SwapPage->>Atoms: Update sourceAssetAtom, destinationAssetAtom
    Atoms->>Atoms: Debounce amount (250ms)
    Atoms->>Client: route(params)
    Client->>API: POST /v2/fungible/route
    API-->>Client: RouteResponse
    Client-->>Atoms: skipRouteAtom updated
    Atoms-->>SwapPage: Display route preview

    User->>SwapPage: Click Swap
    SwapPage->>Atoms: currentPageAtom = SwapExecutionPage

    User->>Wallet: Approve signing
    Atoms->>Client: executeRoute(route, addresses, signers)
    Client->>API: POST /v2/fungible/msgs
    API-->>Client: Transaction payloads

    loop For each transaction
        Client->>Wallet: Sign transaction
        Wallet-->>Client: Signed tx
        Client->>Chain: Broadcast
        Chain-->>Client: txHash
        Client->>API: Track + poll status
        API-->>Client: Status updates
        Client-->>Atoms: Update transaction state
    end

    Client-->>SwapPage: Route complete
```

---

## State Architecture

State is managed through Jotai atoms organized by domain:

| State File | Domain | Key Atoms |
|-----------|--------|-----------|
| `swapPage.ts` | Swap UI | `sourceAssetAtom`, `destinationAssetAtom`, debounced amounts |
| `route.ts` | Route data | `skipRouteAtom`, `routeConfigAtom` |
| `wallets.ts` | Wallets | `evmWalletAtom`, `cosmosWalletAtom`, `svmWalletAtom` |
| `swapExecutionPage.ts` | Execution | `swapExecutionStateAtom`, `chainAddressesAtom` |
| `history.ts` | History | `transactionHistoryAtom`, `currentTransactionAtom` |
| `skipClient.ts` | API data | `skipChainsAtom`, `skipAssetsAtom` |
| `errorWarning.ts` | Errors | `errorWarningAtom` |
| `callbacks.ts` | Events | `callbacksAtom` |

See [State Management](./state_management.md) for details.

---

## Exports

### Widget (`@skip-go/widget`)

```typescript
export { Widget } from "./widget/Widget";
export type { WidgetProps } from "./widget/Widget";
export { defaultTheme, lightTheme } from "./widget/theme";
export type { Theme } from "./widget/theme";
export { resetWidget, setAsset } from "./state/swapPage";
export { openAssetAndChainSelectorModal } from "./modals/AssetAndChainSelectorModal/...";
export { useGetAssetDetails } from "./hooks/useGetAssetDetails";
```

### Client (`@skip-go/client`)

The client exports all API functions, public functions, types, and utilities. Key exports:

- `route`, `messages`, `chains`, `assets`, `balances`
- `executeRoute`, `executeMultipleRoutes`, `subscribeToRouteStatus`
- `setClientOptions`, `setApiOptions`
- Types: `RouteRequest`, `ExecuteRouteOptions`, `SkipClientOptions`, `RouteDetails`, `TransactionDetails`

---

## Key Source Files

| File | Purpose |
|------|---------|
| `packages/widget/src/widget/Widget.tsx` | Widget root, provider tree, jotaiStore |
| `packages/widget/src/widget/Router.tsx` | Page routing, error boundaries |
| `packages/widget/src/widget/ShadowDomAndProviders.tsx` | Shadow DOM, theming |
| `packages/widget/src/widget/useInitWidget.ts` | Props → state initialization |
| `packages/widget/src/index.tsx` | Public exports |
| `packages/widget/src/web-component.tsx` | Web component registration |
| `packages/client/src/index.ts` | Client public exports |
| `packages/client/src/utils/generateApi.ts` | API client factory |
| `packages/client/src/state/apiState.ts` | API configuration singleton |
| `packages/client/src/state/clientState.ts` | Client-side caches |
