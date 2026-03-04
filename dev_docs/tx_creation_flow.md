# Transaction Creation Flow — Skip Go Client Library

## High-Level Overview

```mermaid
flowchart TD
    A[Client calls executeRoute] --> B[Create valid address list]
    B --> C[Fetch transaction messages from API]
    C --> D[Validate gas balances per chain]
    D --> E{Batch signing enabled?}
    E -- Yes --> F[Pre-sign all transactions]
    E -- No --> G[Sign each transaction on demand]
    F --> H[Execute transactions sequentially]
    G --> H
    H --> I[Submit signed tx to Skip API]
    I --> J[Track & poll transaction status]
    J --> K{More transactions in route?}
    K -- Yes --> H
    K -- No --> L[Route complete]
```

---

## Detailed Flow

### 1. Route Creation (Prerequisite)

Before transaction creation begins, the consumer obtains a `RouteResponse` by calling `route()`, which hits the `/v2/fungible/route` endpoint.

```mermaid
flowchart LR
    A[route] -->|POST /v2/fungible/route| B[RouteResponse]
    B -->|Contains| C[operations]
    B -->|Contains| D[requiredChainAddresses]
    B -->|Contains| E[estimatedAmountOut]
```

**File:** `packages/client/src/api/postRoute.ts`

---

### 2. executeRoute — Main Entry Point

**File:** `packages/client/src/public-functions/executeRoute.ts`

```mermaid
flowchart TD
    subgraph executeRoute
        A[Initialize route details] --> B[createValidAddressList]
        B --> C["messages() — fetch Tx[]"]
        C --> D[Append custom Cosmos msgs if any]
        D --> E[executeTransactions]
        E --> F[executeAndSubscribeToRouteStatus]
    end
```

| Step | Method | Purpose |
|------|--------|---------|
| 1 | `updateRouteDetails` | Creates route ID, sets status to `unconfirmed` |
| 2 | `createValidAddressList` | Validates user addresses match required chains |
| 3 | `messages` | Calls `/v2/fungible/msgs` to get chain-specific transactions |
| 4 | `appendCosmosMsgs` | Optional hook to inject additional Cosmos messages |
| 5 | `executeTransactions` | Orchestrates signing and submission |
| 6 | `executeAndSubscribeToRouteStatus` | Runs transactions and polls status |

---

### 3. Address Validation

**File:** `packages/client/src/utils/address.ts`

```mermaid
flowchart TD
    A[userAddresses + route.requiredChainAddresses] --> B{For each required chain}
    B --> C{Chain type?}
    C -- Cosmos --> D[Validate bech32 format]
    C -- EVM --> E[Validate hex address]
    C -- Solana --> F[Validate base58 address]
    D --> G[Ordered address list]
    E --> G
    F --> G
```

---

### 4. Message Generation

**File:** `packages/client/src/api/postMessages.ts`

```mermaid
flowchart LR
    A["messages()"] -->|POST /v2/fungible/msgs| B["MsgsResponse { txs: Tx[] }"]
    B --> C{Tx discriminated union}
    C --> D["CosmosTxWrapper { cosmosTx }"]
    C --> E["EvmTxWrapper { evmTx }"]
    C --> F["SvmTxWrapper { svmTx }"]
```

Each `Tx` contains the chain-specific payload:

| Chain | Wrapper | Key Fields |
|-------|---------|------------|
| Cosmos | `CosmosTxWrapper` | `chainId`, `msgs`, `signerAddress`, `fee`, `memo` |
| EVM | `EvmTxWrapper` | `chainId`, `to`, `data`, `value`, `requiredErc20Approvals` |
| Solana | `SvmTxWrapper` | `chainId`, `signerAddress`, `tx` (base64) |

---

### 5. Transaction Execution Orchestration

**File:** `packages/client/src/private-functions/executeTransactions.ts`

```mermaid
flowchart TD
    A[Receive Tx array] --> B[Map Tx to transactionDetails]
    B --> C[validateGasBalances]
    C --> D{batchSignTxs?}
    D -- Yes --> E[Pre-sign all Cosmos & SVM txs]
    D -- No --> F[Return executeTransaction fn]
    E --> F

    subgraph "executeTransaction(index)"
        G{Pre-signed?} -- Yes --> H[submitTransaction]
        G -- No --> I{Chain type?}
        I -- Cosmos --> J[executeCosmosTransaction]
        I -- EVM --> K[executeEvmTransaction]
        I -- Solana --> L[executeSvmTransaction]
        J --> H
        K --> M[Return tx hash]
        L --> H
    end

    F --> G
```

---

### 6. Gas Balance Validation

**File:** `packages/client/src/private-functions/validateGasBalances.ts`

```mermaid
flowchart TD
    A[validateGasBalances] --> B{For each Tx}
    B --> C{Chain type?}

    C -- Cosmos --> D[validateCosmosGasBalance]
    D --> D1[Simulate messages for gas estimate]
    D1 --> D2[Query fee asset balance]
    D2 --> D3[Return StdFee]

    C -- EVM --> E[validateEvmGasBalance]
    E --> E1[Estimate gas via simulation]
    E1 --> E2[Check native token balance]
    E2 --> E3[Verify ERC20 approvals]

    C -- Solana --> F[validateSvmGasBalance]
    F --> F1[Check SOL balance for fees]

    D3 --> G[onValidateGasBalance callback]
    E3 --> G
    F1 --> G
```

---

### 7. Chain-Specific Execution

#### 7a. Cosmos Transaction

**Files:**
- `packages/client/src/private-functions/cosmos/executeCosmosTransaction.ts`
- `packages/client/src/private-functions/cosmos/signCosmosTransaction.ts`

```mermaid
flowchart TD
    A[executeCosmosTransaction] --> B[signCosmosTransaction]
    B --> B1["getCosmosSigner(chainId)"]
    B1 --> B2[getSigningStargateClient]
    B2 --> B3[getAccountNumberAndSequence]
    B3 --> B4{Signer type?}
    B4 -- Direct --> B5[signDirect]
    B4 -- Amino --> B6[signAmino]
    B5 --> C[Base64-encoded signed tx]
    B6 --> C
    C --> D["submitTransaction (POST /v2/tx/submit)"]
    D --> E["{ txHash, explorerLink }"]
```

#### 7b. EVM Transaction

**File:** `packages/client/src/private-functions/evm/executeEvmTransaction.ts`

```mermaid
flowchart TD
    A[executeEvmTransaction] --> B{requiredErc20Approvals?}
    B -- Yes --> C[Check allowance for each token]
    C --> D{Sufficient allowance?}
    D -- No --> E["approve() tx"]
    E --> F[Wait for approval receipt]
    D -- Yes --> G[sendTransaction]
    F --> G
    B -- No --> G
    G --> H["walletClient.sendTransaction({ to, data, value })"]
    H --> I[waitForTransactionReceipt]
    I --> J["{ transactionHash }"]
```

#### 7c. Solana Transaction

**Files:**
- `packages/client/src/private-functions/svm/executeSvmTransaction.ts`
- `packages/client/src/private-functions/svm/signSvmTransaction.ts`

```mermaid
flowchart TD
    A[executeSvmTransaction] --> B[signSvmTransaction]
    B --> B1[Deserialize base64 tx]
    B1 --> B2{Fee payer provided?}
    B2 -- Yes --> B3[Sign with fee payer first]
    B2 -- No --> B4["Sign with user wallet adapter"]
    B3 --> B4
    B4 --> C[Serialized signed tx]
    C --> D["submitTransaction (POST /v2/tx/submit)"]
    C --> E["connection.sendRawTransaction (RPC)"]
    D --> F[Poll for confirmation]
    E --> F
    F --> G["{ txHash }"]
```

---

### 8. Route Status Subscription

**File:** `packages/client/src/public-functions/subscribeToRouteStatus.ts`

```mermaid
sequenceDiagram
    participant Client
    participant API as Skip API
    participant CB as Callbacks

    loop For each transaction in route
        Client->>Client: executeTransaction(index)
        Client->>API: trackTransaction(txHash, chainId)
        loop Poll until complete
            Client->>API: transactionStatus(txHash, chainId)
            API-->>Client: TransactionStatusResponse
            Client->>CB: onTransactionUpdated(status)
        end
        Client->>CB: onTransactionCompleted(tx)
    end
    Client->>CB: onRouteCompleted(route)
```

---

## Complete End-to-End Sequence

```mermaid
sequenceDiagram
    participant App
    participant Client as SkipClient
    participant API as Skip API
    participant Wallet
    participant Chain as Blockchain

    App->>Client: route(params)
    Client->>API: POST /v2/fungible/route
    API-->>Client: RouteResponse

    App->>Client: executeRoute(route, options)
    Client->>Client: createValidAddressList()

    Client->>API: POST /v2/fungible/msgs
    API-->>Client: MsgsResponse { txs: Tx[] }

    loop For each Tx
        Client->>Client: validateGasBalance(tx)
        Client->>Wallet: Sign transaction
        Wallet-->>Client: Signed tx

        alt Cosmos or Solana
            Client->>API: POST /v2/tx/submit
            API->>Chain: Broadcast
        else EVM
            Client->>Chain: sendTransaction (direct RPC)
        end

        Chain-->>Client: txHash

        Client->>API: POST /v2/tx/track
        loop Poll status
            Client->>API: GET /v2/tx/status
            API-->>Client: status update
        end
    end

    Client-->>App: Route complete
```

---

## Key Source Files

| File | Purpose |
|------|---------|
| `packages/client/src/public-functions/executeRoute.ts` | Main entry point for transaction execution |
| `packages/client/src/api/postRoute.ts` | Route fetching from API |
| `packages/client/src/api/postMessages.ts` | Transaction message generation |
| `packages/client/src/private-functions/executeTransactions.ts` | Transaction execution orchestration |
| `packages/client/src/private-functions/validateGasBalances.ts` | Gas validation dispatcher |
| `packages/client/src/private-functions/cosmos/executeCosmosTransaction.ts` | Cosmos signing and submission |
| `packages/client/src/private-functions/evm/executeEvmTransaction.ts` | EVM approval + submission |
| `packages/client/src/private-functions/svm/executeSvmTransaction.ts` | Solana signing and submission |
| `packages/client/src/public-functions/subscribeToRouteStatus.ts` | Transaction status polling |
| `packages/client/src/utils/address.ts` | Address validation utilities |
| `packages/client/src/types/swaggerTypes.ts` | Core API type definitions |
