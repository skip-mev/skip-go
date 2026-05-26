# Widget Configuration — Skip Go

## Overview

The `@skip-go/widget` package is available as a React component (`<Widget />`) and a web component (`<skip-widget>`). Both accept the same configuration options covering API settings, theming, filtering, callbacks, and wallet integration.

---

## React Component

```tsx
import { Widget } from "@skip-go/widget";

<Widget
  theme="dark"
  apiUrl="https://go.skip.build/api/skip"
  defaultRoute={{
    srcChainId: "cosmoshub-4",
    srcAssetDenom: "uatom",
    destChainId: "osmosis-1",
    destAssetDenom: "uosmo",
    amountIn: 10,
  }}
  onTransactionComplete={(tx) => console.log("Complete:", tx)}
/>
```

## Web Component

```html
<script async src="https://unpkg.com/@skip-go/widget-web-component/build/index.js" type="module"></script>
<skip-widget></skip-widget>

<script>
  const widget = document.querySelector("skip-widget");
  widget.theme = "light";
  widget.onRouteUpdated = (route) => console.log(route);
</script>
```

---

## WidgetProps Reference

### Core Configuration

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `rootId` | `string` | — | Adds `data-root-id` to all root elements (for styling/querying) |
| `onlyTestnet` | `boolean` | `false` | Use testnet chains only |
| `simulate` | `boolean` | `true` | Simulate transactions before signing |
| `batchSignTxs` | `boolean` | — | Pre-sign all Cosmos/SVM txs upfront |
| `disableShadowDom` | `boolean` | `false` | Disable Shadow DOM encapsulation |
| `enableAmplitudeAnalytics` | `boolean` | — | Enable usage analytics |
| `modalZIndex` | `number` | `10` | z-index for modals |

### API Configuration (`SkipClientOptions` + `SetApiOptionsProps`)

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `apiUrl` | `string` | `https://go.skip.build/api/skip` | Skip API base URL |
| `apiKey` | `string` | — | API key (sent as `Authorization` header) |
| `apiHeaders` | `HeadersInit` | — | Custom HTTP headers for API requests |
| `endpointOptions` | `EndpointOptions` | — | Custom RPC/REST endpoints per chain |
| `aminoTypes` | `AminoConverters` | — | Additional Amino type converters |
| `registryTypes` | `Iterable<[string, GeneratedType]>` | — | Additional protobuf registry types |
| `cacheDurationMs` | `number` | — | Cache duration for API responses |
| `chainIdsToAffiliates` | `Record<string, Affiliate[]>` | — | Affiliate fee configuration per chain |

### Default Route

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `defaultRoute` | `DefaultRouteConfig` | — | Pre-populate source/destination |

```typescript
type DefaultRouteConfig = {
  amountIn?: number;
  amountOut?: number;
  srcChainId?: string;
  srcAssetDenom?: string;
  destChainId?: string;
  destAssetDenom?: string;
  srcLocked?: boolean;   // Lock source selection
  destLocked?: boolean;  // Lock destination selection
};
```

### Route Configuration

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `routeConfig` | `WidgetRouteConfig` | See defaults below | Configure route behavior |

`WidgetRouteConfig` extends `RouteRequest` with `timeoutSeconds`:

| Field | Default | Purpose |
|-------|---------|---------|
| `experimentalFeatures` | `["stargate", "eureka", "layer_zero"]` | Enabled bridge protocols |
| `allowMultiTx` | `true` | Allow multi-transaction routes |
| `allowUnsafe` | `true` | Allow higher-risk routes |
| `goFast` | `true` | Enable fast execution path |
| `bridges` | — | Filter to specific bridge IDs |
| `swapVenues` | — | Filter to specific swap venues |
| `smartSwapOptions` | — | Configure split routes, EVM swaps |
| `timeoutSeconds` | — | Message timeout |

### Settings

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `settings` | `{ slippage?, useUnlimitedApproval? }` | `{ slippage: 1 }` | Swap settings |

| Field | Default | Purpose |
|-------|---------|---------|
| `slippage` | `1` | Default slippage percentage (0–100) for Cosmos swaps |
| `useUnlimitedApproval` | `false` | Set ERC-20 allowance to unlimited |

### Asset Filtering

| Prop | Type | Purpose |
|------|------|---------|
| `filter` | `ChainFilter` | Only show matching assets |
| `filterOut` | `ChainFilter` | Hide specific assets |
| `filterOutUnlessUserHasBalance` | `ChainFilter` | Hide unless user has balance |

```typescript
type ChainFilter = {
  source?: Record<string, string[] | undefined>;       // chainId → denom[]
  destination?: Record<string, string[] | undefined>;
};
```

**Example:**

```tsx
<Widget
  filter={{
    source: { "cosmoshub-4": ["uatom"], "osmosis-1": undefined },  // undefined = all denoms
    destination: { "osmosis-1": ["uosmo"] },
  }}
  filterOut={{
    destination: { "pacific-1": ["ibc/..."] },
  }}
/>
```

### Asset Display

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `assetSymbolsSortedToTop` | `string[]` | `["USDC", "USDT", "ETH", ...]` | Symbols shown first in asset list |
| `hideAssetsUnlessWalletTypeConnected` | `boolean` | `false` | Only show assets for connected wallet types |
| `ibcEurekaHighlightedAssets` | `Record<string, string[] \| undefined>` | `{}` | Highlight IBC Eureka assets |

### Wallet Configuration

| Prop | Type | Purpose |
|------|------|---------|
| `walletConnect` | `WalletConnect` | WalletConnect project ID and modal config |
| `connectedAddresses` | `Record<string, string>` | Pre-inject wallet addresses (chainId → address) |

```typescript
type WalletConnect = {
  options: { projectId: string; name: string } | null;
  walletConnectModal?: {
    themeVariables?: object;
    themeMode?: string;
    privacyPolicyUrl?: string;
    termsOfServiceUrl?: string;
  } | null;
};
```

### Signer Providers

| Prop | Type | Purpose |
|------|------|---------|
| `getCosmosSigner` | `(chainId: string) => Promise<OfflineSigner>` | Provide Cosmos signer |
| `getEvmSigner` | `(chainId: string) => Promise<WalletClient>` | Provide EVM signer |
| `getSvmSigner` | `() => Promise<Adapter>` | Provide Solana signer |

When signers are provided, the widget uses them instead of its built-in wallet providers.

---

## Callbacks

All callbacks are optional. They fire at key points in the swap lifecycle.

### Wallet Events

| Callback | Payload | When |
|----------|---------|------|
| `onWalletConnected` | `{ walletName, chainIdToAddressMap?, chainId?, address? }` | Wallet connects |
| `onWalletDisconnected` | `{ walletName, chainType? }` | Wallet disconnects |

### Transaction Events

| Callback | Payload | When |
|----------|---------|------|
| `onTransactionSignRequested` | `{ chainId, signerAddress?, txIndex }` | Before each signature request |
| `onTransactionBroadcasted` | `{ txHash, chainId, explorerLink, sourceAddress, destinationAddress, sourceAssetDenom, sourceAssetChainId, destAssetDenom, destAssetChainId }` | Transaction broadcast |
| `onTransactionComplete` | Same as `onTransactionBroadcasted` | Transaction confirmed |
| `onTransactionFailed` | `{ error: string }` | Transaction fails |

### Route Events

| Callback | Payload | When |
|----------|---------|------|
| `onRouteUpdated` | `{ srcChainId?, srcAssetDenom?, destChainId?, destAssetDenom?, amountIn?, amountOut?, requiredChainAddresses? }` | Route recalculated |
| `onSourceAssetUpdated` | `{ chainId?, denom? }` | Source asset changed |
| `onDestinationAssetUpdated` | `{ chainId?, denom? }` | Destination asset changed |
| `onSourceAndDestinationSwapped` | `{ srcChainId?, srcAssetDenom?, destChainId?, destAssetDenom?, amountIn?, amountOut? }` | User swaps source/destination |

---

## Theming

### Quick Start

```tsx
// Use built-in themes
<Widget theme="dark" />
<Widget theme="light" />

// Custom theme
<Widget theme={{
  brandColor: "#ff6600",
  primary: { background: { normal: "#1a1a1a" } },
}} />

// Override brand color
<Widget theme="dark" brandColor="#00ff00" />
```

### Theme Type

```typescript
type Theme = {
  brandColor: string;
  brandTextColor?: string;         // Auto-derived from brandColor if not set
  borderRadius?: WidgetBorderRadius;
  primary: {
    background: { normal: string };
    text: {
      normal: string;
      lowContrast: string;
      ultraLowContrast: string;
    };
    ghostButtonHover: string;
  };
  secondary: {
    background: {
      normal: string;
      transparent: string;
      hover: string;
    };
  };
  success: { background: string; text: string };
  warning: { background: string; text: string };
  error: { background: string; text: string };
};
```

### Border Radius

```typescript
type WidgetBorderRadius = {
  main?: string | number;           // Main container, buttons (default: "25px")
  selectionButton?: string | number; // Asset selectors, route prefs (default: "10px")
  ghostButton?: string | number;     // Max, History buttons (default: "30px")
  modalContainer?: string | number;  // Modal containers (default: "20px")
  rowItem?: string | number;        // List rows (default: "12px")
};
```

### Built-in Themes

| Theme | Background | Text | Brand Color |
|-------|-----------|------|-------------|
| `defaultTheme` (dark) | `#000000` | `#ffffff` | `#ff66ff` |
| `lightTheme` | `#ffffff` | `#000000` | `#ff66ff` |

Custom themes are deep-merged over `defaultTheme`, so you only need to specify overrides.

### Shadow DOM

By default, the widget renders inside a Shadow DOM to isolate styles. This prevents host page CSS from affecting the widget and vice versa.

- Styles are injected into the shadow root via `StyleSheetManager`
- Fonts are injected into `document.head` (shared with host page)
- Set `disableShadowDom: true` to disable (useful for SSR or when you want host CSS to apply)

---

## Imperative API

The widget exports functions for programmatic control:

### `resetWidget(options?)`

Reset the widget state:

```typescript
import { resetWidget } from "@skip-go/widget";

resetWidget();                                    // Full reset
resetWidget({ onlyClearInputValues: true });     // Clear amounts only
```

### `setAsset(options)`

Programmatically set source or destination asset:

```typescript
import { setAsset } from "@skip-go/widget";

setAsset({
  type: "source",        // "source" | "destination"
  chainId: "noble-1",
  denom: "uusdc",
  amount: 1,             // Optional
});
```

### `openAssetAndChainSelectorModal(options)`

Open the asset selector programmatically:

```typescript
import { openAssetAndChainSelectorModal } from "@skip-go/widget";

openAssetAndChainSelectorModal({
  context: "source",
  onSelect: (asset) => console.log("Selected:", asset),
});
```

---

## Exports Summary

```typescript
// Components
export { Widget } from "@skip-go/widget";
export type { WidgetProps } from "@skip-go/widget";

// Themes
export { defaultTheme, lightTheme } from "@skip-go/widget";
export type { Theme } from "@skip-go/widget";

// Imperative API
export { resetWidget, setAsset } from "@skip-go/widget";
export { openAssetAndChainSelectorModal } from "@skip-go/widget";

// Hooks
export { useGetAssetDetails } from "@skip-go/widget";
```

---

## Key Source Files

| File | Purpose |
|------|---------|
| `packages/widget/src/widget/Widget.tsx` | `Widget` component and `WidgetProps` type |
| `packages/widget/src/widget/theme.ts` | Theme types, defaults, light theme |
| `packages/widget/src/widget/useInitWidget.ts` | Props → state initialization |
| `packages/widget/src/widget/useInitDefaultRoute.ts` | Default route initialization |
| `packages/widget/src/widget/ShadowDomAndProviders.tsx` | Shadow DOM and theme provider |
| `packages/widget/src/state/callbacks.ts` | Callback types |
| `packages/widget/src/state/swapPage.ts` | `resetWidget`, `setAsset` |
| `packages/widget/src/web-component.tsx` | Web component registration |
| `packages/widget/src/index.tsx` | Public exports |
