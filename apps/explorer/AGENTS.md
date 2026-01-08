# Skip Go Explorer - Agent Guide

This document provides comprehensive guidelines for working with the Skip Go Explorer codebase.

---

## 1. Project Overview

### What does this project do?

Skip Go Explorer is a **cross-chain transaction explorer** built with Next.js. It allows users to:
- Track cross-chain transactions across multiple blockchain ecosystems
- View detailed transaction status and transfer events
- Visualize transaction routing through different chains
- Monitor asset releases and transfers in real-time
- Debug transactions with raw data inspection

### Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15.4 (App Router) |
| Runtime | React 19.1 |
| Language | TypeScript 5 |
| State Management | Jotai 2.13 + Jotai-TanStack-Query 0.11 |
| Data Fetching | TanStack Query (React Query) 5.84 |
| Styling | styled-components (from widget package) |
| URL State | nuqs 2.4 |
| API Client | @skip-go/client (workspace monorepo package) |
| Error Boundaries | react-error-boundary 6.0 |
| Utilities | @uidotdev/usehooks 2.4 |

### Main Applications/Services

This is a **single-page application (SPA)** that serves as a transaction explorer interface for Skip Protocol's cross-chain infrastructure.

---

## 2. Project Structure

```
apps/explorer/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Main transaction explorer page
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── template.tsx              # Client-side providers wrapper
│   │   └── globals.css               # Global styles
│   ├── components/                   # UI components
│   │   ├── Badge.tsx                 # Status badges
│   │   ├── Bridge.tsx                # Bridge visualization
│   │   ├── ChainSelector.tsx         # Chain selection dropdown
│   │   ├── ErrorCard.tsx             # Error display
│   │   ├── Navbar.tsx                # Navigation bar
│   │   ├── QueryProvider.tsx         # React Query provider
│   │   ├── SearchButton.tsx          # Search trigger
│   │   ├── SuccessfulTransactionCard.tsx  # Success state
│   │   ├── TokenDetails.tsx          # Token information display
│   │   ├── TransactionDetails.tsx    # Transaction metadata
│   │   ├── TransferEventCard.tsx     # Individual transfer event
│   │   ├── TxHashInput.tsx           # Transaction hash input
│   │   └── modals/
│   │       ├── SearchModal.tsx       # Mobile search modal
│   │       └── ViewRawDataModal.tsx  # Raw JSON viewer
│   ├── constants/
│   │   ├── chainIdsSortedToTop.ts    # Chain priority sorting
│   │   └── modal.tsx                 # Modal identifiers
│   ├── hooks/                        # Custom React hooks
│   │   ├── useGetTransferAssetReleaseAsset.ts
│   │   ├── useOverallStatusLabelAndColor.ts
│   │   ├── useTheme.ts               # Theme detection
│   │   └── useTransactionHistoryItemFromUrlParams.ts
│   ├── icons/                        # SVG icon components
│   │   ├── BridgeIcon.tsx
│   │   ├── ClockIcon.tsx
│   │   ├── CoinsIcon.tsx
│   │   ├── RightArrowIcon.tsx
│   │   ├── SearchIcon.tsx
│   │   └── TopRightArrowIcon.tsx
│   ├── jotai.ts                      # Jotai re-exports
│   ├── mixins/
│   │   └── styledScrollbar.ts        # Scrollbar styling
│   ├── types/
│   │   └── theme.d.ts                # Theme type definitions
│   └── utils/
│       ├── denomUtils.ts             # Denomination transformations
│       └── skipClientConfig.ts       # Skip API client setup
├── public/                           # Static assets
│   ├── logo.svg                      # Dark theme logo
│   ├── logo-light.svg                # Light theme logo
│   ├── dark-bg.svg                   # Dark background
│   ├── light-bg.svg                  # Light background
│   └── skip-*.png                    # Favicons & manifest icons
├── declarations.d.ts                 # TypeScript declarations
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies & scripts
└── tsconfig.json                     # TypeScript configuration
```

### Key Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration, webpack aliases, remote image patterns |
| `tsconfig.json` | TypeScript compiler options, path aliases to widget package |
| `eslint.config.mjs` | Linting rules for Next.js and TypeScript |
| `package.json` | Dependencies, scripts, workspace references |

### Entry Points

1. **Application Entry**: `src/app/layout.tsx` - Root layout with metadata
2. **Main Page**: `src/app/page.tsx` - Transaction explorer UI
3. **Client Providers**: `src/app/template.tsx` - Jotai, React Query, NiceModal providers
4. **API Client**: `src/utils/skipClientConfig.ts` - Skip client initialization

---

## 3. Build Commands

All commands should be run from the **monorepo root** or from the `apps/explorer` directory:

| Command | Description | Location |
|---------|-------------|----------|
| `yarn dev` | Start development server (http://localhost:3000) | `apps/explorer` |
| `yarn build` | Build production bundle | `apps/explorer` |
| `yarn start` | Start production server | `apps/explorer` |
| `yarn lint` | Run ESLint checks | `apps/explorer` |

### Monorepo Commands (from root)

```bash
# Install all dependencies
yarn install

# Build all packages
yarn build

# Build only explorer
yarn workspace explorer build
```

---

## 4. Architecture

### Application Architecture Pattern

**Modular Single-Page Application (SPA)** with Next.js App Router

### Layer Organization

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (App Router Pages & Components)    │
├─────────────────────────────────────┤
│      State Management Layer         │
│    (Jotai Atoms + React Query)      │
├─────────────────────────────────────┤
│      Business Logic Layer           │
│    (Custom Hooks + Utilities)       │
├─────────────────────────────────────┤
│      Data Access Layer              │
│    (@skip-go/client package)        │
└─────────────────────────────────────┘
```

### Module/Package Structure

The explorer is part of a **monorepo** and heavily reuses components from the `@skip-go/widget` package:

```
Shared from Widget Package:
- @/components/*      (Layout, Button, Typography, Modal, Container, etc.)
- @/hooks/*           (useIsMobileScreenSize, useClipboard, etc.)
- @/icons/*           (Icon components)
- @/state/*           (Jotai atoms)
- @/styled-components (styled-components setup)
- @/utils/*           (Utility functions)
- @/modals/*          (AssetAndChainSelectorModal)
- @/nice-modal        (Modal management)
- @/jotai             (Jotai with TanStack Query)
```

### Key Design Patterns Used

#### 1. **Container/Presentational Pattern**
Components are split into smart (container) and presentational components.

```typescript
// Container component (page.tsx)
export default function Home() {
  const [txHash, setTxHash] = useState<string>();
  const [transferEvents, setTransferEvents] = useState<ClientTransferEvent[]>([]);
  // ... business logic
  return <TransferEventCard {...props} />;
}

// Presentational component (TransferEventCard.tsx)
export const TransferEventCard = ({ chainId, status, step }: TransferEventCardProps) => {
  // ... UI rendering only
}
```

#### 2. **Hook Composition Pattern**
Complex logic is extracted into custom hooks:

```typescript
// Custom hook
export const useTransactionHistoryItemFromUrlParams = () => {
  const [data] = useQueryState("data");
  const skipAssets = useAtomValue(skipAssetsAtom);
  // ... logic
  return { sourceAsset, destAsset, userAddresses, operations };
};

// Usage in component
const { sourceAsset, destAsset } = useTransactionHistoryItemFromUrlParams();
```

#### 3. **Atomic State Management**
Jotai atoms provide granular, reactive state:

```typescript
// Atom definition
export const skipClientConfigAtom = atom(defaultSkipClientConfig);

// Read-only access
const config = useAtomValue(skipClientConfigAtom);

// Write access
const setConfig = useSetAtom(skipClientConfigAtom);
```

#### 4. **Provider Wrapper Pattern**
Multiple providers wrap the app in `template.tsx`:

```typescript
<ClientOnly>
  <QueryProvider>
    <Provider store={jotaiStore}>
      <NiceModal.Provider>
        <Wrapper>{children}</Wrapper>
      </NiceModal.Provider>
    </Provider>
  </QueryProvider>
</ClientOnly>
```

#### 5. **Modal Registry Pattern**
Modals are registered once and shown imperatively:

```typescript
// Register
NiceModal.register(ExplorerModals.ViewRawDataModal, ViewRawDataModal);

// Show
NiceModal.show(ExplorerModals.ViewRawDataModal, { data: jsonData });
```

---

## 5. Database

**N/A** - This application does not use a database. All data is fetched from the Skip API.

---

## 6. APIs

### API Style
**REST API** - The application consumes the Skip Protocol REST API.

### Where are API definitions?

API interactions are handled by the `@skip-go/client` package (workspace dependency).

Key functions used from `@skip-go/client`:

| Function | Purpose |
|----------|---------|
| `waitForTransactionWithCancel()` | Poll transaction status with cancellation |
| `trackTransaction()` | Start tracking a new transaction |
| `transactionStatus()` | Get current transaction status |
| `getTransferEventsFromTxStatusResponse()` | Extract transfer events |

### API Configuration

```typescript
// src/utils/skipClientConfig.ts
import { setApiOptions } from "@skip-go/client";

export function initializeSkipClient() {
  setApiOptions({
    apiUrl: "https://api.skip.build",
    // apiKey: process.env.NEXT_PUBLIC_SKIP_API_KEY, // Optional
  });
}
```

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v2/tx/retry_track` | POST | Reindex abandoned transactions |
| `/v2/tx/status` | GET | Get transaction status (via client) |
| `/v2/tx/track` | POST | Start tracking transaction (via client) |

---

## 7. Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SKIP_API_KEY` | No | API key for Skip API (optional) | None |
| `NODE_ENV` | No | Environment mode | `development` |

**Note**: Currently, no environment variables are strictly required. The app uses the public Skip API endpoint.

### Config File Locations

| File | Format | Purpose |
|------|--------|---------|
| `next.config.ts` | TypeScript | Next.js webpack config, image domains |
| `tsconfig.json` | JSON | TypeScript compiler options |
| `eslint.config.mjs` | ES Module | Linting rules |

### Next.js Configuration Highlights

```typescript
// next.config.ts
{
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // Allow any HTTPS image
      { protocol: 'http', hostname: '**' }   // Allow any HTTP image
    ]
  },
  webpack: (config) => {
    // Aliases to widget package
    config.resolve.alias['@/components'] = '../../packages/widget/src/components';
    // ... more aliases
  }
}
```

---

## 8. Dependencies

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@skip-go/client` | workspace | API client for Skip Protocol |
| `next` | 15.4.10 | React framework with App Router |
| `react` | 19.1.2 | UI library |
| `jotai` | 2.13.1 | Atomic state management |
| `jotai-tanstack-query` | 0.11.0 | Jotai integration with React Query |
| `@tanstack/react-query` | 5.84.2 | Data fetching and caching |
| `nuqs` | 2.4.3 | Type-safe URL state management |
| `react-error-boundary` | 6.0.0 | Error boundary component |
| `@uidotdev/usehooks` | 2.4.1 | Utility hooks (useLocalStorage, useIsClient) |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5 | Type checking |
| `eslint` | 9 | Linting |
| `eslint-config-next` | 15.4.5 | Next.js ESLint rules |
| `@types/react` | 19 | React type definitions |
| `@types/node` | 20 | Node.js type definitions |

---

## 9. Testing Conventions

### Current State
**No test files exist in the explorer application.**

### Recommended Testing Setup (Future)

Based on the monorepo's testing standards:

#### Test File Naming
- **Unit tests**: `ComponentName.test.tsx`
- **Integration tests**: `feature.integration.test.tsx`

#### Test Organization
```typescript
import { describe, test, expect } from "@playwright/test";

describe("TransactionExplorer", () => {
  test("should display transaction details when valid hash provided", async () => {
    // Arrange
    // Act
    // Assert
  });

  test("should show error when transaction not found", async () => {
    // Test error handling
  });
});
```

#### Test Frameworks (Recommended)
- **E2E**: Playwright
- **Unit/Integration**: Jest + React Testing Library
- **Mocking**: MSW (Mock Service Worker) for API calls

---

## 10. Logging Conventions

### Current Logging Approach

#### Console Logging
```typescript
// Error logging
try {
  const jsonString = atob(data);
  return JSON.parse(jsonString);
} catch (error) {
  if (error instanceof Error) {
    console.error("Failed to decode URL parameter:", error.message);
  } else {
    console.error("Failed to decode URL parameter:", String(error));
  }
  return null;
}
```

#### Error Handling
```typescript
// API error handling
onError: async (error) => {
  const errorWithCodeAndDetails = error as ErrorWithCodeAndDetails;
  const notFound = error.message === "tx not found";
  const abandoned = error.message === "Tracking for the transaction has been abandoned";

  if (notFound) {
    await trackTransaction({ txHash, chainId });
  } else if (abandoned) {
    await onReindex(txHash, chainId);
  }

  setErrorDetails({
    errorMessage: ErrorMessages.TRANSACTION_ERROR,
    error: errorWithCodeAndDetails,
  });
}
```

### Logging Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| `console.error()` | Exceptions, failed operations | API errors, parsing failures |
| `console.warn()` | Not currently used | Deprecations, non-critical issues |
| `console.log()` | Not currently used in production | Debug information |

### Best Practices

✅ **CORRECT**: Type-safe error handling
```typescript
if (error instanceof Error) {
  console.error("Failed to decode URL parameter:", error.message);
} else {
  console.error("Failed to decode URL parameter:", String(error));
}
```

❌ **WRONG**: Generic error logging
```typescript
catch (error) {
  console.error(error); // No context
}
```

---

## 11. Code Conventions

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `TransferEventCard.tsx` |
| Hooks | camelCase with `use` prefix | `useTransactionHistoryItemFromUrlParams.ts` |
| Utilities | camelCase | `denomUtils.ts` |
| Constants | camelCase file | `modal.tsx` |
| Types | PascalCase | `theme.d.ts` |

### Component Structure

```typescript
// ✅ CORRECT: Exports first, styled components at bottom
export const TransferEventCard = ({ chainId, status }: Props) => {
  const theme = useTheme();
  const data = useAtomValue(dataAtom);

  return (
    <Container>
      {/* JSX */}
    </Container>
  );
};

// Styled components at bottom of file
const Container = styled.div`
  padding: 16px;
`;
```

### Import Organization

```typescript
// ✅ CORRECT: Organized imports
// 1. React/Next.js
import React, { useCallback, useState } from "react";
import Image from "next/image";

// 2. External libraries
import { useAtomValue } from "@/jotai";

// 3. Internal - shared package
import { Column, Row } from "@/components/Layout";
import { Text } from "@/components/Typography";

// 4. Internal - local
import { Badge } from "./Badge";
import { useTheme } from "../hooks/useTheme";
```

### State Management

```typescript
// ✅ CORRECT: Read-only atom access
const chains = useAtomValue(skipChainsAtom);

// ✅ CORRECT: Write-only atom access
const setConfig = useSetAtom(skipClientConfigAtom);

// ✅ CORRECT: Read-write atom access
const [txHash, setTxHash] = useAtom(txHashAtom);

// ❌ WRONG: Don't use useState for global state
const [chains, setChains] = useState([]);
```

### TypeScript Patterns

```typescript
// ✅ CORRECT: Explicit prop types
export type TransferEventCardProps = {
  chainId: string;
  explorerLink: string;
  transferType: TransferType | string;
  status?: TransferEventStatus;
  state?: TransactionState;
  step: Step;
  index: number;
  onReindex?: () => void;
};

// ✅ CORRECT: Type narrowing
if (error instanceof Error) {
  console.error(error.message);
}

// ❌ WRONG: Any types
const handleError = (error: any) => { /* ... */ };
```

### Async/Await Patterns

```typescript
// ✅ CORRECT: Async with proper error handling
const onReindex = useCallback(async (_txHash?: string, _chainId?: string) => {
  try {
    await fetch('https://api.skip.build/v2/tx/retry_track', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tx_hash: _txHash ?? txHash,
        chain_id: _chainId ?? chainId,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}, [txHash, chainId]);

// ❌ WRONG: Missing error handling
const onReindex = async () => {
  await fetch(url); // No try/catch
};
```

### Conditional Rendering

```typescript
// ✅ CORRECT: Early returns
if (!data) return null;

// ✅ CORRECT: Conditional expression
{showTokenDetails && <TokenDetails />}

// ✅ CORRECT: Ternary for alternatives
{isLoading ? <Spinner /> : <Content />}

// ❌ WRONG: Nested ternaries
{isLoading ? <Spinner /> : isError ? <Error /> : isSuccess ? <Content /> : null}
```

---

## 12. Common Mistakes to Avoid

### State Management Anti-patterns

❌ **WRONG**: Mutating state directly
```typescript
transferEvents.push(newEvent);
setTransferEvents(transferEvents);
```

✅ **CORRECT**: Immutable updates
```typescript
setTransferEvents((prev) => [...prev, newEvent]);
```

### URL State Management

❌ **WRONG**: Losing URL parameters on navigation
```typescript
router.push('/'); // Clears all query params
```

✅ **CORRECT**: Use nuqs for type-safe URL state
```typescript
const [txHash, setTxHash] = useQueryState("tx_hash", parseAsString);
setTxHash(newHash); // Updates URL automatically
```

### Effect Dependencies

❌ **WRONG**: Disabling exhaustive-deps without reason
```typescript
useEffect(() => {
  fetchData(txHash);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Missing txHash dependency
```

✅ **CORRECT**: Include all dependencies or use proper cleanup
```typescript
useEffect(() => {
  if (txHash) {
    fetchData(txHash);
  }
}, [txHash]); // Proper dependencies
```

### Memory Leaks

❌ **WRONG**: Not canceling async operations
```typescript
useEffect(() => {
  pollTransaction();
}, []);
```

✅ **CORRECT**: Cleanup on unmount
```typescript
useEffect(() => {
  const { promise, cancel } = waitForTransactionWithCancel({ txHash, chainId });

  return () => {
    cancel(); // Cleanup
  };
}, [txHash, chainId]);
```

### Image Optimization

❌ **WRONG**: Using regular img tags
```typescript
<img src={chain.logoUri} alt="logo" />
```

✅ **CORRECT**: Use Next.js Image component
```typescript
<Image
  src={chain.logoUri}
  alt="logo"
  width={40}
  height={40}
/>
```

### Modal Management

❌ **WRONG**: Local modal state
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
```

✅ **CORRECT**: Use NiceModal for imperative control
```typescript
NiceModal.show(ExplorerModals.ViewRawDataModal, { data });
```

### Type Assertions

❌ **WRONG**: Unsafe type casting
```typescript
const error = err as ErrorWithCodeAndDetails;
error.code; // Might not exist
```

✅ **CORRECT**: Type guards
```typescript
const isErrorWithCode = (error: unknown): error is ErrorWithCodeAndDetails => {
  return error !== null && typeof error === 'object' && 'code' in error;
};

if (isErrorWithCode(error)) {
  error.code; // Safe
}
```

---

## 13. Webpack Aliases

The explorer heavily relies on webpack aliases to import from the widget package:

```typescript
// Configured in next.config.ts and tsconfig.json
import { Column } from "@/components/Layout";         // → ../../packages/widget/src/components/Layout
import { useAtomValue } from "@/jotai";               // → ../../packages/widget/src/jotai
import { skipChainsAtom } from "@/state/skipClient";  // → ../../packages/widget/src/state/skipClient
```

### Available Aliases

| Alias | Target |
|-------|--------|
| `@/*` | `./src/*` (local files) |
| `@/components/*` | `../../packages/widget/src/components/*` |
| `@/utils/*` | `../../packages/widget/src/utils/*` |
| `@/hooks/*` | `../../packages/widget/src/hooks/*` |
| `@/modals/*` | `../../packages/widget/src/modals/*` |
| `@/icons/*` | `../../packages/widget/src/icons/*` |
| `@/state/*` | `../../packages/widget/src/state/*` |
| `@/styled-components` | `../../packages/widget/src/styled-components` |
| `@/nice-modal` | `../../packages/widget/src/nice-modal` |
| `@/jotai` | `../../packages/widget/src/jotai` |

---

## 14. Development Workflow

### Starting Development

```bash
# From monorepo root
yarn install
yarn dev  # Starts all apps in monorepo

# Or specifically for explorer
cd apps/explorer
yarn dev
```

### Making Changes

1. **Local-first changes**: Put explorer-specific code in `src/` directories
2. **Shared changes**: If modifying widget components, changes affect both packages
3. **Type checking**: Run `yarn build` to ensure no TypeScript errors

### Adding New Features

1. **New Page**: Add to `src/app/` (App Router)
2. **New Component**: Add to `src/components/`
3. **New Hook**: Add to `src/hooks/`
4. **New Utility**: Add to `src/utils/`
5. **State**: Consider if it should be in widget package or local

### Debugging

#### React DevTools
- Install React DevTools browser extension
- Inspect Jotai atoms with Jotai DevTools

#### URL State Debugging
```typescript
// URL params are type-safe and synced
const [txHash] = useQueryState("tx_hash", parseAsString);
console.log("Current tx hash:", txHash);
```

#### API Debugging
```typescript
// View raw API responses
NiceModal.show(ExplorerModals.ViewRawDataModal, {
  data: JSON.stringify(apiResponse, null, 2),
});
```

---

## 15. Performance Considerations

### Image Optimization
- Always use `next/image` for logos and icons
- Remote images are configured in `next.config.ts`

### State Updates
```typescript
// ✅ CORRECT: Batch state updates
setTransactionStatuses((prev) => {
  const newStatuses = [...prev];
  newStatuses[index] = status;
  return newStatuses;
});

// ❌ WRONG: Multiple separate updates
setTransactionStatuses(newStatuses);
setTransferEvents(newEvents);
setStatusResponse(newResponse); // Causes multiple re-renders
```

### Memoization
```typescript
// ✅ CORRECT: Memoize expensive computations
const transfersToShow = useMemo(() => {
  const transfers = [];
  transferEvents.forEach((event, index) => {
    // ... expensive logic
  });
  return transfers;
}, [transferEvents, operations, transactionStatusResponse]);
```

### Virtualization
For large lists, consider virtual scrolling (not currently implemented).

---

## 16. Deployment

### Build Process

```bash
# Production build
yarn build

# Output: .next/ directory
```

### Environment-specific Builds

The app automatically adapts based on `NODE_ENV`:
- **Development**: `yarn dev`
- **Production**: `yarn build && yarn start`

### Deployment Checklist

- [ ] Run `yarn build` successfully
- [ ] Check for TypeScript errors
- [ ] Run `yarn lint`
- [ ] Test on production build locally
- [ ] Verify remote images load correctly
- [ ] Test URL sharing (data parameter)

---

## 17. Troubleshooting

### Common Issues

#### Issue: Module not found errors
**Solution**: Ensure widget package is built
```bash
cd packages/widget
yarn build
```

#### Issue: Type errors from widget package
**Solution**: Rebuild widget package types
```bash
cd packages/widget
yarn build
```

#### Issue: Images not loading
**Solution**: Check `next.config.ts` remote patterns allow the domain

#### Issue: URL parameters not persisting
**Solution**: Use `nuqs` hooks, not manual `router.push()`

#### Issue: State not updating across components
**Solution**: Ensure using Jotai atoms, not local state

---

## 18. Related Documentation

- [Skip Protocol API Docs](https://docs.skip.build/)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Jotai Documentation](https://jotai.org/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Widget Package Guidelines](../../packages/widget/README.md)
- [Monorepo Root AGENTS.md](../../AGENTS.md)

---

## Quick Reference Card

### Most Common Tasks

| Task | Command/Pattern |
|------|----------------|
| Start dev server | `yarn dev` |
| Build for production | `yarn build` |
| Add new component | Create in `src/components/`, export types |
| Fetch API data | Use `@skip-go/client` functions |
| Global state | Use `useAtomValue(atom)` |
| URL state | Use `useQueryState("key", parser)` |
| Show modal | `NiceModal.show(ExplorerModals.ModalName, props)` |
| Style component | Use `styled()` from `@/styled-components` |
| Get theme | `const theme = useTheme()` |
| Handle errors | Wrap in `try/catch`, log with context |

---

**Last Updated**: January 2026
**Maintainers**: Skip Protocol Team
**Questions**: Discord - https://discord.gg/interchain
