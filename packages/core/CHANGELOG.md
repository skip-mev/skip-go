# @skip-go/core

## 0.4.3

### Patch Changes

- f17527e: add explorerLink to onTransactionTracked callback

## 0.4.2

### Patch Changes

- fe6981a: Add explorer link to tx track response

## 0.4.1

### Patch Changes

- ef2f513: Add estimated_route_duration_seconds to route response

## 0.4.0

### Minor Changes

- f286e6f: support new pretty_name field on /v2/info/chains response

## 0.3.1

### Patch Changes

- 5adcdc0: Update readme and naming for Skip Go

## 0.3.0

### Minor Changes

- c68b63d: Only use v2 endpoints of the Skip Go API

## 0.2.0

### Minor Changes

- b309549: Adds support for the op init transfer operation and lifecycle tracking objects

## 0.1.0

### Minor Changes

- 9142630: Allow multiple chain filtering for chains and assets requests

## 5.1.1

### Patch Changes

- f0c663d: fix testnet validate gas balance

## 5.1.0

### Minor Changes

- 05630c1: Add evm_swaps to smart_swap_options

## 5.0.5

### Patch Changes

- 3c47bf1: fix: onlyTestnets not working in assets

## 5.0.4

### Patch Changes

- a91e0e0: find gasTokenUsed on stride-1 even validateGasBalance off

## 5.0.3

### Patch Changes

- d1d0161: backward compatible addressList

## 5.0.2

### Patch Changes

- f17d415: allow stride to check tia balance for gas

## 5.0.1

### Patch Changes

- d226070: Updates address validate logic to check route.requiredChainAddresses instead of route.chainIDs

## 5.0.0

### Major Changes

- 26652d3: Added new field onlyTestnets to assets,chains,venues endpoints. Deprecates isTestnet field from chains endpoint.

## 4.2.0

### Minor Changes

- 484387a: Adds support for allow_swaps boolean flag in /route and /msgs_direct, allowing caller to specify to not have swaps in their route search

### Patch Changes

- c3a1a02: Add chain_ids_to_affiliates field to MsgsRequest and MsgsDirectRequest

## 4.1.1

### Patch Changes

- a88619c: format amount gas error

## 4.1.0

### Minor Changes

- 48d998b: - Updated API types to include signer addresses on CosmosTX, EvmTX, and SvmTx
  - Updated `getGasPrice` param to (chainID: string, chainType: "cosmos" | "evm" | "svm") => Promise<GasPrice | undefined>
  - Added `getFallbackGasAmount` param in `executeRoute`
  - Improved jsdoc
  - Updated `validateGasBalance`, `estimateGasForMessage`, `validateGasBalances` to an object args

## 4.0.1

### Patch Changes

- f558aa4: add missing ibcCapabilities from Chain type

## 4.0.0

### Major Changes

- 3c91d03: - Remove client_id
  - Add smart swap types
  - Add smart swap options
  - Add smart swap types and swap venues field to swap
  - Add apiKey param

## 3.0.2

### Patch Changes

- 2af8ccd: Add required chain addresses field to route response

## 3.0.1

### Patch Changes

- ccdb6ef: bump initia-registry

## 3.0.0

### Major Changes

- 8846e1a: userAddresses param type change in executeRoute

## 2.4.4

### Patch Changes

- b4fd9ed: add amountIn and amountOut in operations

## 2.4.3

### Patch Changes

- 59364ac: [API-2703] Add from_chain_id to swap

## 2.4.2

### Patch Changes

- 52f94b7: lock initia-registry deps

## 2.4.1

### Patch Changes

- 6af35dc: Don't use BigInt for amino types

## 2.4.0

### Minor Changes

- 9922837: Add swap_venue for backwards compatibility

## 2.3.0

### Minor Changes

- 9ab81a5: Change solana blockhash commitment level from finalized to confirmed for sendTransaction preflight checks and when checking for transaction inclusion

## 2.2.0

### Minor Changes

- 8b93aa7: Change swap_venue to swap_venues for Route and MsgsDirect requests

## 2.1.0

### Minor Changes

- a2f7ffa: Rename rapid_relay to smart_relay

## 2.0.5

### Patch Changes

- 8c4cafb: changes the access level of specific members and methods from private to protected

## 2.0.4

### Patch Changes

- 8e0de72: bump cosmjs version and chain registry

## 2.0.3

### Patch Changes

- 4903d27: executeSVMTransaction api submit after sign

## 2.0.2

### Patch Changes

- d162e7d: executeSVMTransaction wait finalized tx strategy

## 2.0.1

### Patch Changes

- 2203797: Use 'confirmed' preflight commitment when sending transactions

## 2.0.0

### Major Changes

- 519b34f: Support solana tx and rapid relay

### Patch Changes

- 519b34f: Add svmTx to execute route
- 519b34f: Add include testnets
- 519b34f: fix cctp message MsgDepositForBurnWithCaller
- 519b34f: Catch up to main
- 519b34f: solana signing
- 519b34f: fix cosmos_tx msgs signing
- 519b34f: track retry and backoff
- 519b34f: update svmTx type

## 2.0.0-rc.8

### Patch Changes

- fix cosmos_tx msgs signing

## 2.0.0-rc.7

### Patch Changes

- fix cctp message MsgDepositForBurnWithCaller

## 2.0.0-rc.6

### Patch Changes

- track retry and backoff

## 2.0.0-rc.5

### Patch Changes

- solana signing

## 2.0.0-rc.4

### Patch Changes

- update svmTx type

## 2.0.0-rc.3

### Patch Changes

- Add svmTx to execute route

## 2.0.0-rc.2

### Patch Changes

- Catch up to main

## 2.0.0-rc.1

### Patch Changes

- Add include testnets

## 2.0.0-rc.0

### Major Changes

- b9b139d: Add svm flags

## 2.0.0-2.0.0-rc.0.0

### Major Changes

- Add svm flags

## 1.4.0

### Minor Changes

- d9092f9: update viem version to 2.x

## 1.3.13

### Patch Changes

- c229ca5: Add released field to transfer_asset_release

## 1.3.12

### Patch Changes

- a60e293: adjust types SwapVenu and assetFromSource

## 1.3.11

### Patch Changes

- ddbf415: fix account not parsed by accountParser

## 1.3.10

### Patch Changes

- cddd3e8: Define and use correct hyperlane types for lifecycle tracking

## 1.3.9

### Patch Changes

- 3111d66: Add hyperlane transfer

## 1.3.8

### Patch Changes

- c6dd6dc: fix executeRoute undefined getGasPrice params, transactionStatus retryOptions

## 1.3.7

### Patch Changes

- 445a9c7: Add denom in and denom out to all operations
- 30f5613: Add types for Hyperlane support

## 1.3.6

### Patch Changes

- a11b433: add usdFeeAmount in axelarTransfer route operations

## 1.3.5

### Patch Changes

- 2429849: fix memo ledger error

## 1.3.4

### Patch Changes

- 76c37d4: fix cosmos ledger signing

## 1.3.3

### Patch Changes

- cc0b2bd: properly encode MsgExecuteContract for Injective

## 1.3.2

### Patch Changes

- a624a2a: Fix a bug in BaseAccount signing for dymension

## 1.3.1

### Patch Changes

- 3fe6bd0: Fixes bugs in signing for ethermint-like chains

## 1.3.0

### Minor Changes

- a61ce2e: Improve stargate account parser, proto signing, and bundling

## 1.2.15

### Patch Changes

- 1cba455: undo cosmjs upgrade
- ae1b120: Register EthAccount proto type

## 1.2.14

### Patch Changes

- e313807: When getting default gas token don't fail on no chain registry data

## 1.2.13

### Patch Changes

- 586a771: Set proper typeUrl on pubkey when it is an ethermint key

## 1.2.12

### Patch Changes

- 9b9cb70: Improve amino/registry types, handle stride account parsing

## 1.2.11

### Patch Changes

- 74643e9: added onTransactionTracked opts

## 1.2.10

### Patch Changes

- b361077: Add allow_multi_tx parameter to route request

## 1.2.9

### Patch Changes

- 491d16a: Add CCTP types to transaction tracking

## 1.2.8

### Patch Changes

- 7411597: Add bridges endpoint and route parameter

## 1.2.7

### Patch Changes

- bdb8183: Fix type error

## 1.2.6

### Patch Changes

- 505ff19: Fix type definitions from generated code

## 1.2.5

### Patch Changes

- fbc169c: Define valid values for experimental features array

## 1.2.4

### Patch Changes

- 803eb8b: rename unsafe to allow_unsafe
- 1ed5e7b: Add `getFeeForMessage`, `getRecommendedGasPrice`, and `getFeeInfoForChain` methods to SkipRouter
- 738dd7d: Update router to support CCTP bridging operations returned by the API

## 1.2.3

### Patch Changes

- c98fb7c: use timeout height instead of timestamp on amino signing

## 1.2.2

### Patch Changes

- 35aa11b: Expose gas methods in SkipRouter

## 1.2.1

### Patch Changes

- 77d97b4: Add 'unsafe' flag to route request

## 1.2.0

### Minor Changes

- e1ce04a: Update recommendAssets to handle multiple requests

## 1.1.3

### Patch Changes

- 579e28b: Add fee fields to Transfer field
- 67a9a04: Add assetsBetweenChains

## 1.1.2

### Patch Changes

- 959b51c: Simulate cosmos transactions to estimate gas
- 89b7472: Add ibcOriginAssets

## 1.1.1

### Patch Changes

- 3a89472: Add fields for price impact and usd amounts

## 1.1.0

### Minor Changes

- c0336ea: recommended asset field added to data models

### Patch Changes

- def7ec0: Handle multi-transfer

## 1.0.5

### Patch Changes

- 018ca30: update onTransactionCompleted callback to include chain id and hash

## 1.0.4

### Patch Changes

- bdd3773: Add description and coingecko id to asset types

## 1.0.3

### Patch Changes

- cd03ff5: Add fee asset field to AxelarTransfer

## 1.0.2

### Patch Changes

- f4f16e2: Utilize client_id parameter in API requests

## 1.0.1

### Patch Changes

- 1dc36fd: Raise gas estimate for MsgExecuteContract calls

## 1.0.0

### Major Changes

- 0b71558: - Adds support for EVM transactions.
  - Rename `getOfflineSigner` to `getCosmosSigner`.
  - Adds `getEVMSigner`.
  - Adds `onTransactionBroadcast` which is called when a transaction is broadcasted to the chain.

### Patch Changes

- b8ada23: Add changesets for proper releases
- 903b43d: - Updates lifecycle tracking types to include the explorer links now provided by the API
  - Renamed `onTransactionSuccess` to `onTransactionCompleted` because it's not only called on success
  - Pass full `TxStatusResponse` to `onTransactionCompleted` instead of abridged data.
