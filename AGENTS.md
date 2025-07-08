# Skip Go Development Guidelines

This document provides comprehensive guidelines for contributing to the Skip Go codebase, with a focus on code organization and wallet integration patterns.

## Table of Contents
1. [Code Organization and Conventions](#code-organization-and-conventions)
2. [Wallet Integration](#wallet-integration)
3. [Contribution Guidance](#contribution-guidance)
4. [Storage Patterns](#storage-patterns)
5. [Performance Optimization Patterns](#performance-optimization-patterns)
6. [Error Handling Patterns](#error-handling-patterns)
7. [API Integration Patterns](#api-integration-patterns)
8. [State Management Best Practices](#state-management-best-practices)
9. [UI/UX Enhancement Patterns](#uiux-enhancement-patterns)
10. [Development Tools](#development-tools)
11. [Code Refactoring Guidelines](#code-refactoring-guidelines)
12. [Pull Request Best Practices](#pull-request-best-practices)
13. [Changeset Requirements](#changeset-requirements)
14. [Testing Standards](#testing-standards)

## Code Organization and Conventions

### Project Structure
The codebase follows a modular architecture with clear separation of concerns:

```
packages/
├── widget/src/
│   ├── components/      # Reusable UI components
│   ├── constants/       # Application constants and configurations
│   ├── hooks/          # Custom React hooks for business logic
│   ├── icons/          # Icon components
│   ├── modals/         # Modal components
│   ├── pages/          # Page-level components
│   ├── providers/      # Context providers for different chain types
│   ├── state/          # State management using Jotai atoms
│   ├── utils/          # Utility functions organized by purpose
│   └── widget/         # Main widget entry points
└── client/             # API client and chain-specific logic
```

### File and Folder Organization
- **Feature-based grouping**: Related functionality is grouped together in logical directories
- **Single responsibility**: Each file has a single, clear purpose
- **Utility separation**: Utilities are organized by domain (e.g., `fees.ts`, `crypto.ts`, `date.ts`)

### Naming Conventions
- **Components**: PascalCase (e.g., `SwapPage.tsx`, `AssetInput.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCreateCosmosWallets.tsx`, `useGetBalance.ts`)
- **Constants**: SCREAMING_SNAKE_CASE for constants, camelCase for configuration objects
- **State atoms**: camelCase with `Atom` suffix (e.g., `cosmosWalletAtom`, `sourceAssetAtom`)

### Import Organization
```typescript
// 1. External dependencies
import { atom } from "jotai";
import { ChainType } from "@skip-go/client";

// 2. Internal absolute imports
import { mainnetChains } from "@/constants/chains";
import { useGetAccount } from "@/hooks/useGetAccount";

// 3. Relative imports
import { MinimalWallet } from "./types";
```

### State Management
The codebase uses Jotai for state management with a clear atom structure:
- Atoms are defined in the `state/` directory
- Each domain has its own state file (e.g., `wallets.ts`, `swapPage.ts`)
- Complex state logic is encapsulated in custom hooks

### Modular Design Patterns
- **Provider pattern**: Chain-specific providers wrap components with necessary context
- **Hook composition**: Complex functionality is built by composing smaller, focused hooks
- **Type safety**: TypeScript interfaces define clear contracts between modules

## Wallet Integration

### Architecture Overview
Wallet integration follows a modular adapter pattern that supports multiple blockchain types:

```
providers/
├── CosmosProvider.tsx    # Cosmos chain wallet provider
├── EVMProvider.tsx       # Ethereum/EVM wallet provider
└── SolanaProvider.tsx    # Solana wallet provider
```

### Wallet State Management
Centralized wallet state is managed through Jotai atoms:

```typescript
// Core wallet types
export type MinimalWallet = {
  walletName: string;
  walletPrettyName: string;
  walletChainType: ChainType;
  walletInfo: { logo?: string };
  connect: (chainId?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isWalletConnected: boolean;
  getAddress?: (props: AddressProps) => Promise<AddressResult>;
};
```

### Chain-Specific Wallet Hooks
Each chain type has dedicated hooks for wallet creation and management:
- `useCreateCosmosWallets.tsx` - Handles Cosmos ecosystem wallets
- `useCreateEvmWallets.tsx` - Manages EVM-compatible wallets
- `useCreateSolanaWallets.tsx` - Supports Solana wallet integration

### Wallet Connection Flow
1. **Provider Initialization**: Chain-specific providers wrap the application
2. **Wallet Discovery**: Available wallets are detected based on browser extensions
3. **Connection Management**: Hooks handle connection state and chain switching
4. **Address Resolution**: Unified interface for getting addresses across chain types

### Error Handling
- Asynchronous operations use try-catch blocks with specific error handling
- Wallet connection failures trigger appropriate user feedback
- Chain switching errors are handled gracefully with fallback options

### Testing Wallet Features
- Mock wallet providers for unit tests
- Integration tests verify wallet connection flows
- Edge cases like disconnection and chain switching are covered

## Contribution Guidance

### Navigating the Codebase
1. **Start with the entry point**: `packages/widget/src/widget/Widget.tsx`
2. **Follow the import trail**: Use imports to understand component relationships
3. **Check state definitions**: Look in `state/` for atom definitions
4. **Review hooks**: Custom hooks in `hooks/` contain core business logic

### Key Entry Points
- **Widget initialization**: `packages/widget/src/widget/`
- **Wallet integration**: `packages/widget/src/providers/`
- **State management**: `packages/widget/src/state/`
- **API client**: `packages/client/src/`

### Common Patterns

#### Hook Composition
```typescript
// Compose smaller hooks for complex functionality
const useWalletConnection = () => {
  const wallet = useAtomValue(walletAtom);
  const { disconnectAsync } = useDisconnect();
  const callbacks = useAtomValue(callbacksAtom);
  
  // Combine functionality
  return { wallet, disconnect: disconnectAsync, callbacks };
};
```

#### Provider Wrapping
```typescript
// Providers wrap components with necessary context
<CosmosProvider>
  <EVMProvider>
    <SolanaProvider>
      <App />
    </SolanaProvider>
  </EVMProvider>
</CosmosProvider>
```

#### State Updates
```typescript
// Use atoms for global state
const [sourceAsset, setSourceAsset] = useAtom(sourceAssetAtom);

// Read-only access
const chainType = useAtomValue(chainTypeAtom);

// Write-only access
const setWallet = useSetAtom(walletAtom);
```

### Code Quality Standards
1. **Type Safety**: Always provide TypeScript types for function parameters and returns
2. **Error Boundaries**: Wrap components that might fail with error boundaries
3. **Performance**: Use React.memo and useMemo for expensive computations
4. **Accessibility**: Include ARIA labels and keyboard navigation support

### Documentation Requirements
- **Complex Logic**: Add inline comments explaining non-obvious code
- **Public APIs**: Include JSDoc comments for exported functions
- **Type Definitions**: Document complex types with examples
- **Hook Usage**: Provide usage examples in hook file comments

### Storage Patterns

#### Local Storage Migration
When dealing with large data sets, consider migrating from localStorage to IndexedDB:

```typescript
// Custom storage atom without cross-tab sync for performance
export function atomWithStorageNoCrossTabSync<T>(storageKey: string, initialValue: T) {
  const defaultStorage: SyncStorage<T> = {
    getItem: (key) => {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    },
    setItem: (key, newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    removeItem: (key) => localStorage.removeItem(key),
  };
  return atomWithStorage<T>(storageKey, initialValue, defaultStorage, { getOnInit: true });
}
```

#### Storage Versioning
Implement versioning for stored data to handle schema changes:
- Add version numbers to storage keys (e.g., `transactionHistoryVersion`)
- Provide migration utilities in `utils/migrateOldLocalStorageValues.ts`
- Clear outdated data when schemas change

### Performance Optimization Patterns

#### UI Virtualization
For long lists (e.g., history pages), implement virtualization:
- Use virtual scrolling libraries for better performance
- Lazy load data as users scroll
- Implement proper loading states

#### Loading State Management
Prevent UI flickering and improve perceived performance:
```typescript
// Use suspense boundaries for async operations
<Suspense fallback={<LoadingComponent />}>
  <AsyncComponent />
</Suspense>

// Prevent state update loops with proper dependency tracking
const prevRouteRef = useRef(route);
if (prevRouteRef.current !== route) {
  // Update only when route actually changes
}
```

#### Shimmer Effects
Implement skeleton loading states with shimmer effects:
- Use `Skeleton` component with shimmer animation
- Provide realistic content dimensions during loading
- Maintain layout stability

### Error Handling Patterns

#### Graceful Timeout Handling
Implement timeouts before showing error states:
```typescript
// Show error only after reasonable wait time
const ERROR_DISPLAY_TIMEOUT = 15000; // 15 seconds

useEffect(() => {
  const timer = setTimeout(() => {
    if (hasError) {
      setShowError(true);
    }
  }, ERROR_DISPLAY_TIMEOUT);
  
  return () => clearTimeout(timer);
}, [hasError]);
```

#### Fallback Mechanisms
Always provide fallbacks for critical operations:
- Wallet connection fallbacks to default signers
- API polling with retry logic
- Cache fallbacks when network requests fail

### API Integration Patterns

#### Flexible API Configuration
Support custom headers and polling options:
```typescript
interface SkipApiOptions {
  apiHeaders?: Record<string, string>;
  trackTxPollingOptions?: {
    interval?: number;
    maxAttempts?: number;
  };
}
```

#### Selective Data Fetching
Optimize API calls by requesting only necessary fields:
```typescript
// Only pass specific fields to reduce payload
const { data } = await api.getRoute({
  sourceAssetDenom,
  sourceAssetChainId,
  destAssetDenom,
  destAssetChainId,
  // Only include necessary fields
});
```

### State Management Best Practices

#### Preventing Infinite Loops
Guard against infinite re-renders:
```typescript
// Use refs to track previous values
const prevValueRef = useRef(value);
if (prevValueRef.current !== value) {
  prevValueRef.current = value;
  // Perform update
}

// Wrap state updates in startTransition for React 18+
import { startTransition } from 'react';
startTransition(() => {
  setComplexState(newValue);
});
```

#### Transaction History Management
Implement robust history tracking:
- Use unique timestamps as IDs for history items
- Store pending transactions separately
- Version history data for compatibility
- Clear stale data periodically

### UI/UX Enhancement Patterns

#### Visual Feedback
Provide clear visual indicators:
- Show "< $0.01" for very small fee amounts
- Display "No fees" when applicable
- Add hover effects to interactive elements
- Use consistent loading animations

#### Callback System
Implement comprehensive callbacks for widget events:
```typescript
interface WidgetCallbacks {
  onSourceAssetUpdated?: (asset: Asset) => void;
  onDestinationAssetUpdated?: (asset: Asset) => void;
  onRouteUpdated?: (route: Route) => void;
  onTransactionBroadcasted?: (tx: Transaction) => void;
  onTransactionFailed?: (error: Error) => void;
  onTransactionComplete?: (tx: Transaction) => void;
}
```

### Development Tools

#### E2E Testing Enhancements
Capture screenshots on test failures:
```typescript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    await page.screenshot({ 
      path: `test-results/screenshots/${testInfo.title}.png` 
    });
  }
});
```

#### Build Variants
Support multiple build outputs:
- ES modules for modern bundlers
- CommonJS for Node.js compatibility
- Web components for framework-agnostic usage

### Code Refactoring Guidelines

#### Utility Organization
Move utilities to appropriate domain-specific files:
- Fee calculations → `utils/fees.ts`
- Route utilities → `utils/route.ts`
- Date formatting → `utils/date.ts`
- Number formatting → `utils/number.ts`

#### Component Extraction
Extract reusable logic into custom hooks:
- Complex state management
- API integration logic
- Side effect handling
- Cross-component communication

## Pull Request Best Practices

### PR Organization
- **Single Focus**: Each PR should address one specific issue or feature
- **Clear Titles**: Use descriptive PR titles that explain the change (e.g., "Fix flickering of select asset button")
- **Small Changes**: Break large features into smaller, reviewable PRs

### Common PR Patterns

#### Bug Fixes
When fixing bugs:
- Identify the root cause in the PR description
- Include steps to reproduce the issue
- Add tests to prevent regression
- Example: "Fix infinite setState loop" with clear explanation of the fix

#### Performance Improvements
For performance PRs:
- Include before/after metrics when possible
- Document the optimization approach
- Consider edge cases and fallbacks
- Example: "Implement virtualization for history page"

#### Refactoring
When refactoring code:
- Move related utilities to appropriate files
- Maintain backward compatibility
- Update all references
- Example: "Refactor fee utilities from route.ts to fees.ts"

#### Feature Additions
For new features:
- Add comprehensive documentation
- Include usage examples
- Implement proper error handling
- Provide callbacks for integration
- Example: "Add onSourceAssetUpdated callback"

### Version Management
- **Patch versions**: Bug fixes and minor improvements
- **Minor versions**: New features that are backward compatible
- **Major versions**: Breaking changes (rare, coordinate with team)

## Changeset Requirements

All PRs must include a changeset entry:

1. From the repository root run `npx changeset`
2. Select the packages that have changed
3. Choose the appropriate version bump (patch/minor/major)
4. Write a clear description of the changes
5. Commit the generated file inside `.changeset/` with your changes

### Changeset Best Practices
- Write user-facing descriptions
- Focus on what changed, not how
- Include migration notes for breaking changes
- Example: "Added setAsset function to programmatically update source/destination assets"

## Testing Standards

### General Testing Rules
1. **File Naming**: Name test files after the file being tested with `.test.ts` suffix
2. **Test Organization**: Group related tests using `describe` blocks
3. **Coverage**: Include tests for both success and error cases
4. **Isolation**: Tests should not depend on external services or state

### Widget Package Testing
```typescript
// Example test structure
import { describe, test, expect } from "@playwright/test";

describe("ComponentName", () => {
  test("should handle normal case", async () => {
    // Test implementation
  });
  
  test("should handle error case", async () => {
    // Test error handling
  });
});
```

### Integration Testing
- Test wallet connection flows end-to-end
- Verify cross-chain operations work correctly
- Ensure state updates propagate properly

### Best Practices
1. **Descriptive Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Structure tests with clear sections
3. **Mock External Dependencies**: Use mocks for wallet providers and API calls
4. **Test User Flows**: Focus on testing complete user workflows