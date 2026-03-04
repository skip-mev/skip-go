# Status Tracking — Skip Go Client Library through Widget

## High-Level Overview

```mermaid
flowchart TD
    A[Transaction broadcast] --> B[trackTransaction registers tx with API]
    B --> C[subscribeToRouteStatus starts 1s polling loop]
    C --> D[GET v2/tx/status returns TxStatusResponse]
    D --> E[updateRouteDetails computes RouteDetails]
    E --> F[onRouteStatusUpdated callback fires]
    F --> G[Widget: setTransactionHistoryAtom merges into state]
    G --> H[currentTransactionAtom derived for active tx]
    H --> I[useSwapExecutionState maps to SwapExecutionState enum]
    I --> J[UI components render status indicators]
    D -->|1s wait| D
```

---

## Detailed Flow

### 1. Registering a Transaction

After a transaction is broadcast, the client registers it with the Skip API so the backend can begin indexing it.

**Endpoint:** `POST v2/tx/track`

```mermaid
sequenceDiagram
    participant Client
    participant SkipAPI

    Client->>SkipAPI: POST v2/tx/track { chainId, txHash }
    SkipAPI-->>Client: { explorerLink }
```

`trackTransaction` in `packages/client/src/api/postTrackTransaction.ts` wraps this call with configurable polling/retry to handle cases where the API hasn't indexed the tx yet:

| Option | Default | Description |
|--------|---------|-------------|
| `maxRetries` | 10 | Maximum polling attempts |
| `retryInterval` | 1000ms | Base interval between retries |
| `backoffMultiplier` | 2.5 | Exponential backoff factor |

**Backoff formula:** `delay = retryInterval × (backoffMultiplier ^ attempt)`

---

### 2. Polling for Status

Once tracked, the client polls for status updates.

**Endpoint:** `GET v2/tx/status?chainId=...&txHash=...`

The response (`TxStatusResponse`) contains:

| Field | Type | Description |
|-------|------|-------------|
| `state` | `TransactionState` | Overall transaction state |
| `transfers` | `Transfer[]` | Per-transfer status with detailed state |
| `transferSequence` | `TransferEvent[]` | Ordered list of cross-chain transfer events |
| `transferAssetRelease` | `TransferAssetRelease` | Info about where/when assets are released |
| `error` | `StatusError` | Error details if failed |

#### Transaction States

```mermaid
flowchart LR
    A[STATE_SUBMITTED] --> B[STATE_PENDING]
    B --> C[STATE_COMPLETED_SUCCESS]
    B --> D[STATE_COMPLETED_ERROR]
    B --> E[STATE_PENDING_ERROR]
    B --> F[STATE_ABANDONED]
```

| State | Meaning |
|-------|---------|
| `STATE_SUBMITTED` | Submitted but not yet on-chain |
| `STATE_PENDING` | On-chain, transfers in progress |
| `STATE_COMPLETED_SUCCESS` | All transfers succeeded |
| `STATE_COMPLETED_ERROR` | A transfer failed |
| `STATE_PENDING_ERROR` | Will fail; error is propagating |
| `STATE_ABANDONED` | Tracking abandoned (>10min stall or >5min no block) |

---

### 3. Client-Level Abstractions

The client provides three levels of abstraction over raw status polling:

```mermaid
flowchart LR
    subgraph Low-Level
        A[transactionStatus]
    end
    subgraph Mid-Level
        B[waitForTransaction]
    end
    subgraph High-Level
        C[subscribeToRouteStatus]
    end

    A --> B --> C
```

#### `transactionStatus` — Single poll

Direct call to `GET v2/tx/status`. Returns `TxStatusResponse`.

**File:** `packages/client/src/api/postTransactionStatus.ts`

#### `waitForTransaction` — Poll until final

Loops with a fixed 1-second interval until a terminal state is reached. Supports cancellation.

**File:** `packages/client/src/public-functions/waitForTransaction.ts`

Terminal states: `STATE_COMPLETED_SUCCESS`, `STATE_COMPLETED_ERROR`, `STATE_ABANDONED`

```mermaid
flowchart TD
    A[waitForTransaction] --> B[trackTransaction - registers tx if no explorerLink]
    A --> C[Loop every 1s]
    C --> D["transactionStatus()"]
    D --> E[onStatusUpdated callback]
    E --> F{Result?}
    F -- success --> G[Return]
    F -- error/abandoned --> H[Throw]
    F -- pending --> I[Wait 1000ms]
    I --> D
```

#### `subscribeToRouteStatus` — Route-level tracking

Manages status for an entire route (multiple transactions) plus related routes (e.g., gas-on-receive fee routes). This is what the widget uses.

**File:** `packages/client/src/public-functions/subscribeToRouteStatus.ts`

Key behaviors:
- Polls each transaction's status every 1 second
- Computes `RouteDetails` from aggregated transaction statuses
- Tracks `transferEvents` (normalized cross-chain transfer data)
- Handles related routes (gas routes) and waits for all to reach final state
- Fires `onRouteStatusUpdated` callback only when status actually changes (JSON diff)
- Supports cancellation via returned `unsubscribe` function

---

### 4. RouteDetails — The Core Status Object

`RouteDetails` is the central data structure that flows from client to widget.

**File:** `packages/client/src/public-functions/subscribeToRouteStatus.ts`

```typescript
type RouteDetails = {
  id: string;
  timestamp: number;
  status: RouteStatus;
  route: SimpleRoute;
  txsRequired: number;
  txsSigned: number;
  transactionDetails: TransactionDetails[];
  transferEvents: ClientTransferEvent[];
  transferAssetRelease?: TransferAssetRelease;
  relatedRoutes?: Partial<RouteDetails>[];
  userAddresses: UserAddress[];
};
```

#### Route Status

`RouteStatus` is computed from the aggregated state of all transactions in the route:

| Status | Condition |
|--------|-----------|
| `"unconfirmed"` | Initial state, no transactions signed |
| `"validating"` | Validating gas balances |
| `"allowance"` | Waiting for ERC-20 approval |
| `"signing"` | Waiting for user signature |
| `"pending"` | Transactions broadcasting/in-flight |
| `"completed"` | All transactions succeeded |
| `"failed"` | All transactions failed |
| `"incomplete"` | Some succeeded, some failed or not started |

The computation logic in `updateRouteDetails`:

```mermaid
flowchart TD
    A{Explicitly set status?} -- Yes --> B[Use it]
    A -- No --> C{Some tx succeeded but not all started?}
    C -- Yes --> D["incomplete"]
    C -- No --> E{All settled?}
    E -- Yes --> F{None failed?}
    F -- Yes --> G["completed"]
    F -- No --> H{Some succeeded + some failed?}
    H -- Yes --> I["incomplete"]
    H -- No --> J["failed"]
    E -- No --> K[Keep current status]
```

#### Transfer Events

Each cross-chain hop produces a `ClientTransferEvent`:

```typescript
type ClientTransferEvent = {
  fromChainId: string;
  toChainId: string;
  state: TransferState | AxelarTransferState | ...;
  status: TransferEventStatus;  // simplified
  fromExplorerLink?: string;
  toExplorerLink?: string;
  fromTxHash?: string;
  toTxHash?: string;
  transferType: TransferType;
  durationInMs?: number;
};
```

`TransferEventStatus` simplifies bridge-specific states into:

| Status | Bridge States |
|--------|---------------|
| `"pending"` | `TRANSFER_PENDING`, `CCTP_TRANSFER_SENT`, `AXELAR_TRANSFER_PENDING_CONFIRMATION`, etc. |
| `"completed"` | `TRANSFER_SUCCESS`, `CCTP_TRANSFER_RECEIVED`, `AXELAR_TRANSFER_SUCCESS`, etc. |
| `"failed"` | All other states |

Supported bridge types: IBC, Axelar, CCTP, Hyperlane, OPInit, GoFast, Stargate, Eureka, LayerZero.

---

### 5. Widget Integration

#### State Layer

**File:** `packages/widget/src/state/history.ts`

```mermaid
flowchart TD
    A[onRouteStatusUpdated callback] --> B[setTransactionHistoryAtom]
    B --> C[transactionHistoryAtom - localStorage persisted]
    C --> D[currentTransactionAtom - derived by currentTransactionId]
    C --> E[sortedHistoryItemsAtom - for history page]
```

`transactionHistoryAtom` stores up to 400 `RouteDetails` items in localStorage, sorted by timestamp.

`setTransactionHistoryAtom` merges updates by `id` — if the route already exists it patches it, otherwise it appends and sets `currentTransactionId` (for main routes only, not related/gas routes).

`currentTransactionAtom` derives the active transaction by looking up `currentTransactionId` in the history array.

#### Subscription Hook

**File:** `packages/widget/src/hooks/useTxHistory.ts`

`useTxHistory` subscribes to status updates for a transaction and its related routes:

```mermaid
flowchart TD
    A["useTxHistory({ txHistoryItem })"] --> B["subscribeToRouteStatus(mainRoute)"]
    A --> C["subscribeToRouteStatus(relatedRoute[0])"]
    A --> D["subscribeToRouteStatus(relatedRoute[1])"]
    A --> E[...]
    B --> F[onRouteStatusUpdated → setTransactionHistoryAtom]
    C --> F
    D --> F
    E --> F
    F --> G[cleanup: unsubscribe all on unmount]
```

Each route (main + related) gets its own independent polling subscription. Deduplication is handled via a `subscribedIdsRef` set.

#### UI State Mapping

**File:** `packages/widget/src/pages/SwapExecutionPage/useSwapExecutionState.ts`

`useSwapExecutionState` maps `RouteStatus` → `SwapExecutionState` for the UI:

| `RouteStatus` | `SwapExecutionState` | UI Behavior |
|----------------|----------------------|-------------|
| `"failed"` | `pendingError` | Error page shown |
| `"completed"` | `confirmed` | Success state |
| `"pending"` | `pending` | Progress indicators |
| `"allowance"` | `approving` | Approval prompt |
| `"validating"` | `validatingGasBalance` | Gas validation |
| `"signing"` (single tx) | `waitingForSigning` | Signature prompt |
| `"signing"` (multi tx) | `signaturesRemaining` | Shows "N of M signed" |

Additional pre-execution states: `destinationAddressUnset`, `recoveryAddressUnset`, `ready`, `pendingGettingAddresses`, etc.

#### Visual Status Indicators

**File:** `packages/widget/src/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow.tsx`

Each operation row in the detailed view renders a status indicator:

| Transfer Event Status | Visual |
|----------------------|--------|
| `"completed"` | Green border |
| `"failed"` | Red border |
| `"pending"` | Animated rotating border |

The simple view (`SwapExecutionPageRouteSimple`) shows source/destination with collapsed status. The detailed view (`SwapExecutionPageRouteDetailed`) shows every operation individually.

---

### 6. Error Handling and Timeouts

#### Transaction Failure

**File:** `packages/widget/src/pages/SwapExecutionPage/useHandleTransactionFailed.tsx`

Monitors `currentTransaction.status` for `"failed"` or `"incomplete"`. When detected:
- Checks `transferAssetRelease` for information about where assets ended up
- Navigates to an error page with recovery options

#### Transaction Timeout

**File:** `packages/widget/src/pages/SwapExecutionPage/useHandleTransactionTimeout.tsx`

If a transaction stays in `"pending"` beyond `estimatedRouteDurationSeconds × 3`, the widget shows a timeout error page.

---

### 7. End-to-End Sequence

```mermaid
sequenceDiagram
    participant User
    participant Widget
    participant ClientLib as Client Library
    participant SkipAPI as Skip API

    User->>Widget: Confirms swap
    Widget->>ClientLib: executeRoute(route, addresses, callbacks)

    loop For each transaction in route
        ClientLib->>ClientLib: Sign transaction
        ClientLib->>SkipAPI: POST v2/tx/submit
        ClientLib->>SkipAPI: POST v2/tx/track { chainId, txHash }
        SkipAPI-->>ClientLib: { explorerLink }
        ClientLib->>Widget: onRouteStatusUpdated(status: "signing" → "pending")
        Widget->>Widget: setTransactionHistoryAtom(routeDetails)

        loop Every 1 second until terminal state
            ClientLib->>SkipAPI: GET v2/tx/status
            SkipAPI-->>ClientLib: TxStatusResponse
            ClientLib->>ClientLib: updateRouteDetails(compute new status)
            ClientLib->>Widget: onRouteStatusUpdated(routeDetails)
            Widget->>Widget: setTransactionHistoryAtom(routeDetails)
            Widget->>User: Update UI (progress, explorer links)
        end
    end

    ClientLib->>Widget: onRouteStatusUpdated(status: "completed")
    Widget->>User: Show success state
```

---

## Key Files Reference

| File | Layer | Purpose |
|------|-------|---------|
| `packages/client/src/api/postTrackTransaction.ts` | Client | Register tx for tracking |
| `packages/client/src/api/postTransactionStatus.ts` | Client | Poll tx status |
| `packages/client/src/public-functions/waitForTransaction.ts` | Client | Poll until terminal state |
| `packages/client/src/public-functions/subscribeToRouteStatus.ts` | Client | Route-level status management |
| `packages/client/src/utils/clientType.ts` | Client | Transfer event normalization, status simplification |
| `packages/widget/src/state/history.ts` | Widget/State | Transaction history atoms |
| `packages/widget/src/hooks/useTxHistory.ts` | Widget/Hook | Subscribe to status updates |
| `packages/widget/src/pages/SwapExecutionPage/useSwapExecutionState.ts` | Widget/UI | Map RouteStatus → SwapExecutionState |
| `packages/widget/src/pages/SwapExecutionPage/useHandleTransactionFailed.tsx` | Widget/UI | Handle failure states |
| `packages/widget/src/pages/SwapExecutionPage/useHandleTransactionTimeout.tsx` | Widget/UI | Handle timeout states |
| `packages/widget/src/pages/SwapExecutionPage/SwapExecutionPageRouteDetailedRow.tsx` | Widget/UI | Visual status indicators |
