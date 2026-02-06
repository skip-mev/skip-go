## 0.0.15

## 3.14.21

### Patch Changes

- 45bef4c: remove omniflix-1 from initial chain id

## 3.14.20

### Patch Changes

- 12f2603: add explorer loading state

## 3.14.19

### Patch Changes

- 6aafa55: fix webcomponent

## 3.14.18

### Patch Changes

- ae6abc9: update deps and support cosmos mevm
- Updated dependencies [ae6abc9]
  - @skip-go/client@1.5.11

## 3.14.17

### Patch Changes

- 69fda94: override asset image
- Updated dependencies [69fda94]
  - @skip-go/client@1.5.10

## 3.14.16

### Patch Changes

- 20c9059: Add blocking acknowledgement warning for manual address entry on cross-chain swaps. Users must explicitly acknowledge the risk before entering a manual address when performing cross-chain transactions to prevent accidental fund loss to centralized exchange addresses.

## 3.14.15

### Patch Changes

- 92f4c14: Hide edit destination button for EVM same-chain swaps. EVM DEX contracts return tokens to msg.sender, so editing the destination address has no effect on same-chain swaps.

## 3.14.14

### Patch Changes

- db163fa: Fix formatDisplayAmount bug throwing an error when a number in the billions was passed to it

## 3.14.13

### Patch Changes

- 229522f: fix broken link, fix dependency security issues
- Updated dependencies [229522f]
  - @skip-go/client@1.5.9

## 3.14.12

### Patch Changes

- a266ea2: update registries
- cabf9f4: fix abbreviate formatting
- 2c0ec19: Limit the number of history items to 400
- 8e5fdc9: Add modalZIndex Prop to specify custom z-index on all modals
- Updated dependencies [a266ea2]
  - @skip-go/client@1.5.8

## 3.14.11

### Patch Changes

- 0c598dd: Update keplr icon
- e55abae: Fix showing error even if statusData is undefined
- a66d014: Fix showing error even if statusData is undefined
- Updated dependencies [8dfa5c6]
  - @skip-go/client@1.5.7

## 3.14.10

### Patch Changes

- 58e6688: Fix passing affiliates to widget/client library via setClientOptions
- f854996: Remove routePreference selector entirely if goFast:false is passed
- 55c337b: Show extra message on mobile for bad price warning
- Updated dependencies [58e6688]
  - @skip-go/client@1.5.6

## 3.14.9

### Patch Changes

- cd93838: Update gasFeeTokenAmount for EVM to also check for 0x denoms

## 3.14.8

### Patch Changes

- c860b8a: Fix display of operation type in detailed view
- bbbeda4: Fix formatDisplayAmount logic
- e7030f0: Add caching assets, chains, bridges, venues for faster subsequent pageload on slower internet speeds
- 5611da4: Remove gas station logic
- f84c866: Map LAYER_ZERO_TRANSFER_WAITING_FOR_COMPOSE transferState as "pending"
- Updated dependencies [c8ad02e]
- Updated dependencies [5611da4]
- Updated dependencies [f84c866]
  - @skip-go/client@1.5.5

## 3.14.7

### Patch Changes

- 0ca46bb: Fix tooltips to be wrapped by ShadowDomAndProviders now that they use react portal

## 3.14.6

### Patch Changes

- d6c4457: Update filterNeutronSwapFee to no longer check swap venue
- 05c1e7f: fix fee decimal display for usd amounts of 0
- e26ddbe: Truncate sender and receiver addresses in transaction history details.
- Updated dependencies [39d2448]
- Updated dependencies [d6c4457]
  - @skip-go/client@1.5.4

## 3.14.5

### Patch Changes

- 676a76b: update registries
- 451aa75: don't show gas on receive if same chain and address
- 048f144: prioritize chainIds filtering for gasOnReceive
- d3ec136: rename feeRoute to gasRoute
- 145f274: fix banksend tooltip
- c1cab03: Stop using SVGProps<SVGSVGElement> for the sake of react 19 compatibility
- 81d3a11: fix inconsistent main and original route
- 55f7438: Add HIGH_LOSS_ERROR to Swagger API spec
- 6682a4c: Check userAgent instead of screen size to determine whether to disable 2tx routes
- 37241e9: get chains and assets fron client lib state
- 693b1c2: Switch SolanaProvider to use React Query for wallet list.
- 87b86a1: fix destinationFeeAssets not using the actual asset decimals
- Updated dependencies [676a76b]
- Updated dependencies [d3ec136]
- Updated dependencies [4cc4b68]
- Updated dependencies [55f7438]
- Updated dependencies [37241e9]
- Updated dependencies [b1660f8]
- Updated dependencies [4920ae0]
  - @skip-go/client@1.5.3

## 3.14.4

### Patch Changes

- c515ff4: hot fix gas on receive amountIn

## 3.14.3

### Patch Changes

- bf3b837: Deprioritize asset images from wormhole
- b3f72d4: Use proxy api for amplitude
- 9016a64: fix missing multi tx route indicator
- Updated dependencies [71fb39a]
  - @skip-go/client@1.5.2

## 3.14.2

### Patch Changes

- 8630eea: update registries
- b8f024f: fix callback
- Updated dependencies [8630eea]
- Updated dependencies [b8f024f]
- Updated dependencies [419982d]
  - @skip-go/client@1.5.1

## 3.14.1

### Patch Changes

- fdd2929: add isFeeRouteAvailable for track
- bc9983e: numbers and switch component fix

## 3.14.0

### Minor Changes

- 3bf601a: Gas on receive & executeMultipleRoutes

### Patch Changes

- 8d6226f: Reduce number of session replays by beginning after confirm button is clicked
- 317ef74: Enable passing apiKey from widget to client library
- 276d1b5: Avoid showing loading animation instead of wallet icon for manual address input
- e4a77b0: Add showing sender and receiver address to history items
- 0722525: Revert changes in #1460, fix hydration error by avoiding nested buttons
- 3223cdf: Add spacing between signature required and and row above in detailed swap view
- ad28b78: Add tracking in amplitude for the destination wallet source
- fea44ef: Limit automatic input value updates to five decimal places after route changes.
- Updated dependencies [fc76c0f]
- Updated dependencies [3bf601a]
  - @skip-go/client@1.5.0

## 3.13.0

### Minor Changes

- d9ae5ec: Refactored route status management to be handled by the client library in onRouteUpdated callback passed to executeRoute and subscribeToRouteStatus

### Patch Changes

- 45c8b0e: Remove sentry
- 4c3b591: cleanup injective dependencies
- 6deedeb: Assume status for a route is finalized if top level status is complete, failed or incomplete and dont ever fetch from api in those cases
- aa6bf9e: Never show no fees in red
- 21ec4ff: show swap settings if route error or no route
- 591e462: Fix bug with history page causing scrolling to be overwritten by expanded history item being scrolled into view after initially opening the item
- e508561: Add mapping 5 and 12 error codes to "no route found" on the widget
- 8f8ae09: bump graz 0.3.3
- Updated dependencies [d9ae5ec]
- Updated dependencies [5c85386]
- Updated dependencies [4c3b591]
- Updated dependencies [b1441b2]
- Updated dependencies [e508561]
  - @skip-go/client@1.4.0

## 3.12.11

### Patch Changes

- f00f585: Add showing "< $0.01 in fees" and "no fees"
- 97b6f32: fix stuck getting addresses on connectedAddress

## 3.12.10

### Patch Changes

- 3bc90be: fix injective and evmos direct signing
- Updated dependencies [3bc90be]
  - @skip-go/client@1.3.7

## 3.12.9

### Patch Changes

- bf26d8e: fix cannot sign on fresh address
- 84d3267: fix client side error when filter denoms null
- ce8f9a4: Prioritize exact asset symbol matches in the search modal.
- Updated dependencies [bf26d8e]
  - @skip-go/client@1.3.6

## 3.12.8

### Patch Changes

- fabdf0b: Track general unexpected error event in amplitude.
- a96b623: fix chains endpoint
- Updated dependencies [a96b623]
  - @skip-go/client@1.3.5

## 3.12.7

### Patch Changes

- Updated dependencies [f2852b6]
  - @skip-go/client@1.3.4

## 3.12.6

### Patch Changes

- 069bed8: Move fee display from footer to destination input and show warning when output value is 90% or less of input.
- Updated dependencies [5e2f94c]
- Updated dependencies [cadc8cc]
  - @skip-go/client@1.3.3

## 3.12.5

### Patch Changes

- c3838d0: Add LAYER_ZERO_TRANSFER_WAITING_FOR_COMPOSE state map to pending

## 3.12.4

### Patch Changes

- 43663de: Enable auto-reconnect for cosmos
- 9beee7c: Refactor fees code to get data from estimated_fees, Include missing bridge types
- ce78bcf: Fix flickering of select asset button when changing assets
- Updated dependencies [c7bc3b8]
  - @skip-go/client@1.3.2

## 3.12.3

### Patch Changes

- 9396ecb: Fix react error 426 by wrapping page transition with startTransition and ensuring setCurrentPage is the last step

## 3.12.2

### Patch Changes

- fd0e0dd: Revert indexedDb back to localStorage, add transactionHistoryVersion
- fd0e0dd: added onTransactionSignRequested callback
- Updated dependencies [fd0e0dd]
- Updated dependencies [fd0e0dd]
  - @skip-go/client@1.3.1

## 3.12.1

### Patch Changes

- add29a3: update confirming to confirming in walet
- 5e4b704: update types
- ded5434: auto detect solana wallets
- 415ab64: pill button and slippage input border radius
- da13834: Fix typescript errors and UnexpectedErrorPageTimeout
- f32de07: update registries
- 6589b7b: Add consistent 1.5 line height on error and warning page descriptions.
- 1202564: update hover background on chevron icon
- 4bf11ac: Store history in indexedDB instead of localStorage
- Updated dependencies [5e4b704]
- Updated dependencies [f32de07]
- Updated dependencies [78d4061]
  - @skip-go/client@1.3.0

## 3.12.0

### Minor Changes

- b212844: Add borderRadius theme prop and apply it to SwapPageAssetChainInput and MainButton.

### Patch Changes

- 5c0f84e: Add tests for removeTrailingZeros utility.
- 355110a: Add hover effect to the back arrow in the wallet selector modal.
- 01630cf: Add autocropping padding from images, Add shimmer animation when loading images
- bf84dff: add borderRadius theme configuration
- eb8471b: Use timestamp as unique id for transactionHistoryItem
- 50554f5: remove trailing zeros from output route amount
- 95a6314: bump registries
- 4ccf15b: Increase line height for the subtext on the incomplete price data warning page to match other warning pages.
- 1c906d4: add apiHeaders in webcomponent types
- 1a16dc1: Refactored useUpdateAmountWhenRouteChanges to only run if route differes from prevRoute
- Updated dependencies [95a6314]
  - @skip-go/client@1.2.3

## 3.11.2

### Patch Changes

- 203ac07: wallet disable balance check
- Updated dependencies [bb09717]
  - @skip-go/client@1.2.2

## 3.11.1

### Patch Changes

- Updated dependencies [f138746]
  - @skip-go/client@1.2.1

## 3.11.0

### Minor Changes

- 71979b6: batchSignTxs added to sign all txs upfront

### Patch Changes

- 32f5f7b: Save list of extra chainIds connected per wallet so that we automatically connect to those chains in the future, clear list if theres an error when connecting (in case chain was removed from wallet)
- b338a30: Update widget to allow getCosmosSigner/getEvmSigner to fallback to default if no signer is found for given chainId
- 871bec1: Added setAsset that enables setting the source/destination asset manually and onSource/DestinationAssetUpdated callbacks
- 0dd5d25: change error page explorer link to skip explorer
- df56981: Add fallback to checking lastHistoryItem isSettled for isFetchingLastTransactionStatusAtom
- 38200ac: Fix infinite setState caused by erroneously setting amount to formattedDisplayAmount
- 6a6bb61: Fix overallStatus logic
- cde6a0c: Fix set destination address to allow manual address entry if the last operation has sign required but fromChainId !== destinationChainId
- 9cc8751: fix error text line height in bad price warning
- 24b17d6: Fix infinite spinner if last tx item is 2tx route with only 1 tx in transactionDetails, Add deleting history items that have no chainId and txHash in transactionDetails
- a14f13d: default sessions replays to on
- Updated dependencies [c502e19]
- Updated dependencies [71979b6]
- Updated dependencies [cc391ab]
- Updated dependencies [dffca8c]
- Updated dependencies [fbc22f6]
- Updated dependencies [0aab36a]
  - @skip-go/client@1.2.0

## 3.10.11

### Patch Changes

- Updated dependencies [4e97e19]
  - @skip-go/client@1.1.9

## 3.10.10

### Patch Changes

- Updated dependencies [de97a32]
  - @skip-go/client@1.1.8

## 3.10.9

### Patch Changes

- Updated dependencies [92cef82]
  - @skip-go/client@1.1.7

## 3.10.8

### Patch Changes

- a806d4e: Add link to skip explorer in history page and swapExecutionPage
- 6345144: track widget explorer clicks
- 022c87e: Add tests for crypto utilities.
- 2442302: Fix incorrect chainType when setting Cosmos wallet state.
- 7c8c9de: Prevent users to leave the page before all txs signed
- 974ceb3: Add Spinner icon on SwapPage to show if there's an ongoing tx
- 78be428: Fix asset icon potentially missing when using filters and invert source/destination button
- a34f4bb: Add negative margin hack for vertical alignment on asset symbols on windows
- 6c2500d: Add 15s timeout before expecting transfer asset release in case of failure
- Updated dependencies [de1ea69]
- Updated dependencies [d554763]
- Updated dependencies [7f71bb0]
- Updated dependencies [7610467]
- Updated dependencies [5156647]
  - @skip-go/client@1.1.6

## 3.10.7

### Patch Changes

- e549963: Fix error #525 in web-component

## 3.10.6

### Patch Changes

- Updated dependencies [b74f50d]
  - @skip-go/client@1.1.5

## 3.10.5

### Patch Changes

- 07fc190: bump registries and fix route response type
- Updated dependencies [07fc190]
  - @skip-go/client@1.1.4

## 3.10.4

### Patch Changes

- 49fd0da: Add tests for getClientOperations in clientType utility.
- 2075ee9: Add tests for utils number functions
- e6cdb46: Cache Playwright browser binaries and skip reinstall when already cached.
- 3f8fce1: Fix mobile date formatting by zero-padding hours, minutes, month, and day.
- cba7980: Fix window existence check in useIsMobileScreenSize hook to avoid runtime errors when `window` is undefined.
- e6cdb46: Improve widget tests workflow to cache dependencies and Playwright browsers for faster execution.
- Updated dependencies [fc09b51]
- Updated dependencies [d71e6b0]
  - @skip-go/client@1.1.3

## 3.10.3

### Patch Changes

- df9e97c: reduce number of session replays to connected wallet sessions
- df9e97c: fix history page asset styling and display amount updates
- df9e97c: separate error and warning
- df9e97c: Fix using incorrect method on localStorage to remove an item
- df9e97c: track two tx routes in amplitude
- df9e97c: bump solana walletconnect deps
- df9e97c: Add fix for modal animation jank on windows
- Updated dependencies [df9e97c]
- Updated dependencies [df9e97c]
- Updated dependencies [df9e97c]
- Updated dependencies [df9e97c]
  - @skip-go/client@1.1.2

## 3.10.2

### Patch Changes

- cf920fe: update registries
- 1e9f832: remove unused packages
- 78281ec: Use virtualization on history page
- Updated dependencies [5e42be2]
- Updated dependencies [9bdd303]
- Updated dependencies [cf920fe]
- Updated dependencies [11c3c79]
  - @skip-go/client@1.1.1

## 3.10.1

### Patch Changes

- 6c1ff69: bump graz 0.3.2

## 3.10.0

### Minor Changes

- df62bf0: bump cosmjs package

### Patch Changes

- be7c302: only session record on valid user id
- c609cd4: fix decimals display for grouped assets
- c8315f2: asset logo consistency
- Updated dependencies [376583c]
- Updated dependencies [df62bf0]
- Updated dependencies [4458538]
  - @skip-go/client@1.1.0

## 3.9.7

### Patch Changes

- d5aa812: refetch route on swap settings changed
- 041a12a: minor improvements to amplitude analytics
- 9849401: Temporarily remove fadeout animation from selecting asset

## 3.9.6

### Patch Changes

- Updated dependencies [a009e22]
  - @skip-go/client@1.0.6

## 3.9.5

### Patch Changes

- Updated dependencies [fd69bee]
  - @skip-go/client@1.0.5

## 3.9.4

### Patch Changes

- Updated dependencies [9b1f4fe]
  - @skip-go/client@1.0.4

## 3.9.3

### Patch Changes

- Updated dependencies [d0e0de4]
  - @skip-go/client@1.0.3

## 3.9.2

### Patch Changes

- Updated dependencies [b22c07b]
  - @skip-go/client@1.0.2

## 3.9.1

### Patch Changes

- Updated dependencies [aba3e58]
  - @skip-go/client@1.0.1

## 3.9.0

### Minor Changes

- 4007e19: Update widget to use client v1.0.0

### Patch Changes

- 30d7b1f: only record sentry replay on valid user id
- be8dda4: update registries
- Updated dependencies [4007e19]
- Updated dependencies [be8dda4]
  - @skip-go/client@1.0.0

## 3.8.9

### Patch Changes

- fa63d79: bump graz
- 5b3b9bc: fix max button cosmos amount
- 2d5c7ce: Update useGasFeeTokenAmount for EVM
- b5d0b31: update registries
- c64a70a: improve number formatting and decrowd settings bar by removing powered by skip go text
- 2c1967a: Hide signature required for operation once signed
- 22200c8: Fix showing formattedAmount instead of balance.amount in Asset/Chain selector modal
- Updated dependencies [b5d0b31]
  - @skip-go/client@0.17.2

## 3.8.8

### Patch Changes

- 00b842a: improve asset display amount code
- 31c67f4: Fix prop warning in dev
- 441a597: enable amplitude session replays
- 4ca2bb4: add validate evm token approval
- c928a3c: update registries
- Updated dependencies [4ca2bb4]
- Updated dependencies [c928a3c]
  - @skip-go/client@0.17.1

## 3.8.7

### Patch Changes

- 7e7f1b1: fix swap page footer layout
- 162f202: update registries
- cf49d23: improve asset display in history page
- 4f4db90: Fix clearing validating when returning from user rejected request, Fix no longer showing user rejected request unless currently on swap execution page
- 41655dd: update low contrast text color
- 23899c2: add initia to ledger warning
- 1b601ec: support layer zero
- a1744b8: Add onSourceAndDestinationSwapped callback
- c946693: improve gaping in footer
- Updated dependencies [162f202]
- Updated dependencies [3f58bf3]
- Updated dependencies [f5bc62c]
- Updated dependencies [d2804a0]
- Updated dependencies [1b601ec]
  - @skip-go/client@0.17.0

## 3.8.6

### Patch Changes

- 854c59a: Fix useTxHistory returning completed if lastTxSuccess, instead should only return completed if isSettled and isSuccess are true
- 2b2a6e7: refactor fee computation and fee display

## 3.8.5

### Patch Changes

- 72ca16b: fix initia pubkey issue
- Updated dependencies [72ca16b]
  - @skip-go/client@0.16.34

## 3.8.4

### Patch Changes

- d82a6e3: update registries
- Updated dependencies [d82a6e3]
  - @skip-go/client@0.16.33

## 3.8.3

### Patch Changes

- 363cceb: fix gas result error
- d4b83b0: add initia testnet
- Updated dependencies [363cceb]
  - @skip-go/client@0.16.32

## 3.8.2

### Patch Changes

- daeb41e: improve insufficient balance button text if gas balance issue
- aca9648: fix rendundant simulation
- a0582fc: update registries
- Updated dependencies [aca9648]
- Updated dependencies [a0582fc]
  - @skip-go/client@0.16.31

## 3.8.1

### Patch Changes

- e309043: Update History page design and reduce API calls

## 3.8.0

### Minor Changes

- b2bff47: fixed bug in displaying bad price warnings

### Patch Changes

- 58c5faf: Show connect wallet before showing please select a source asset
- 4105295: update registries
- 773175c: always fetch balance for gas validation
- b184242: Update web-component to allow passing props via javascript properties
- Updated dependencies [4105295]
- Updated dependencies [773175c]
  - @skip-go/client@0.16.30

## 3.7.3

### Patch Changes

- ac50805: Add filterOutUnlessUserHasBalance prop
- dedd423: evm gas simulation at the start of the tx
- Updated dependencies [dedd423]
  - @skip-go/client@0.16.29

## 3.7.2

### Patch Changes

- 78f9a6a: update style

## 3.7.1

### Patch Changes

- a7ba428: Fix "Set second signing address" showing incorrectly
- 9515ad5: expose openAssetAndChainSelectorModal
- 39235a6: Fix ConnectEcoRow to show sourceAsset address or defaultAddress or firstAddress found in cosmosAccounts, and add fallback connecting to defaultChainId
- f26c654: Stop animation after it completes to fix modal flickering
- afd9530: add initia pubkey to account parser
- 8fce4a3: Fix sorting with eurekaHighlightedAssets
- Updated dependencies [afd9530]
  - @skip-go/client@0.16.28

## 3.7.0

### Minor Changes

- 2939b01: modify ibcEurekaHighlightedAssetsAtom interface

### Patch Changes

- a83f22f: Fix balances payload
- 8815787: not changing routes when wallet connected

## 3.6.8

### Patch Changes

- 59f5f76: highlight all eureka asset
- 6b5dfa1: fix filter

## 3.6.7

### Patch Changes

- 777a11d: show gas station provision message if gas station tx
- e77efac: Use rAF timers to handle closeModal to avoid flickering
- 04cf861: copy change to tooltip to route preference settings
- 0e33fe7: fix evm gas simulation
- 94f5424: fix error font sizes
- c73fa16: Update default decimal places to 8
- Updated dependencies [0d2e0c3]
- Updated dependencies [0e33fe7]
  - @skip-go/client@0.16.27

## 3.6.6

### Patch Changes

- ad43417: expose Theme type
- d13c452: update registries
- Updated dependencies [d13c452]
  - @skip-go/client@0.16.26

## 3.6.5

### Patch Changes

- 1cb8972: fix filterOut filtering

## 3.6.4

### Patch Changes

- c5f48e7: Add arrow maskedVersion prop, Fix WalletSelectorModal back button logic
- 30df1d3: increase POL max amount
- 7a399d5: update registries
- df29c5d: update testnetChains to include lombardTestnet
- ebdca25: Add filterOut prop
- 76b8015: Prevent IBC Eureka from dropping to newline on mobile
- Updated dependencies [7a399d5]
  - @skip-go/client@0.16.25

## 3.6.3

### Patch Changes

- fcc815a: Dont attempt to connect wallet if already connected when signRequired is passed to getAddress

## 3.6.2

### Patch Changes

- 7da5d2e: update testnetChains to include lombardTestnet

## 3.6.1

### Patch Changes

- 580fda7: Reduce Keplr initial chain connect list
- a4f3617: Fix evm disconnect, fix useSwitchChainIfNeeded

## 3.6.0

### Minor Changes

- 6ec520a: allow connecting to any ecosystem wallet regardless of selected chain

### Patch Changes

- 6ec520a: Add ibcEurekaHighlightedAssets and assetSymbolsSortedToTop props
- 6ec520a: update number of signatures remaining message to update instantly once tx is signed
- 6ec520a: Add eth sepolia to gas validation bypass
- 6ec520a: Add logging widget version onload
- Updated dependencies [6ec520a]
  - @skip-go/client@0.16.24

## 3.5.1

### Patch Changes

- 12035c1: disable gas validation on gas station chains
- 1fe4217: Enable eureka in client library by default
- d6632de: Fix ConnectedWalletModal for testnet
- 7416025: fix evm get address and add lombard testnet
- 8fa8306: Update fontSize and fontFamily of manual address input
- 75c18eb: add lombard bech32 config
- 51f89dc: fix evm getAddress not switching chain
- Updated dependencies [12035c1]
- Updated dependencies [7416025]
  - @skip-go/client@0.16.23

## 3.5.0

### Minor Changes

- 2a116b4: - Added automatic text resizing for large numbers in input fields to prevent overflow

### Patch Changes

- 8e3a140: Fix issue with infinitely calling connectRequiredChains
- 9515033: Update default timeout for waitForVariable to be 10seconds
- 7ef5613: Remove mars-1 from chainIds to connect
- 28269a2: Disable manual address for signRequired chains, and update set recovery address to say set intermediary address
- 9b642eb: modify evm gas balance error message
- 17f6fb3: evm and svm gas balance validation
- 3c027ae: Add rootId to WidgetContainer and Modals
- b2fb0ab: fix asset evm validation
- Updated dependencies [9515033]
- Updated dependencies [ab7ebdf]
- Updated dependencies [9b642eb]
- Updated dependencies [17f6fb3]
- Updated dependencies [b2fb0ab]
  - @skip-go/client@0.16.22

## 3.4.8

### Patch Changes

- 74fb9fd: Remove mars-1 from chainIds to connect

## 3.4.7

### Patch Changes

- 1e510c5: update registries
- Updated dependencies [1e510c5]
  - @skip-go/client@0.16.21

## 3.4.6

### Patch Changes

- Updated dependencies [8bd8d07]
  - @skip-go/client@0.16.20

## 3.4.5

### Patch Changes

- aebae07: Left align address text in detailed view

## 3.4.4

### Patch Changes

- beb1fd9: update useGetAssetDetails to use case-insensitive search
- 25566c5: Styling updates to detailed route view
- 22bc453: Always set useAutoSetAddress loading false if overallStatus !== "unconfirmed"
- df95b5a: validate transactionhistory storage entries
- 8d73a42: fix balance not updated when there is no addresses
- 0836961: Simplify loading states, fix loading spinners sometimes being out of sync
- 286fc80: Delay initial api calls until onlyTestnet is defined to avoid double fetching if onlyTestnet is passed
- a0c977c: Add address copied feedback to simple view
- 7965323: Fix destination address shown in detailed view

## 3.4.3

### Patch Changes

- Updated dependencies [c709da5]
  - @skip-go/client@0.16.19

## 3.4.2

### Patch Changes

- bf12e02: fix wallet address shows incorrectly while executing route
- 8308e9c: Add eureka types
- 38c1a8c: Improve executeRoute performance
- efb3cba: Fix mobile styling flickering
- ac9a85f: Add ability to disable shadowDOM
- 112db78: add transaction reverted error page
- c600209: update dependencies
- 30525ce: No longer lock scrollbar when opening drawer
- Updated dependencies [fb7887e]
- Updated dependencies [8308e9c]
- Updated dependencies [38c1a8c]
- Updated dependencies [c600209]
  - @skip-go/client@0.16.18

## 3.4.1

### Patch Changes

- 68ebc8d: fix last tx complete show not completed
- 45c3c33: update registries
- 15aebde: Fix edge case with locked assets
- b788119: Update remove opacity from disabled main button
- 4260d98: add analytics
- Updated dependencies [45c3c33]
  - @skip-go/client@0.16.17

## 3.4.0

### Minor Changes

- 6d33daf: Add reset widget back

### Patch Changes

- 8aa63c0: transaction tracking watch for state
- 6b1e1cb: Update atomWithStorage so localStorage values are fetched immediately
- 831d24a: add low information trade warning
- Updated dependencies [8aa63c0]
  - @skip-go/client@0.16.16

## 3.3.11

### Patch Changes

- 45df099: revert reset widget functionality

## 3.3.10

### Patch Changes

- 3b30c70: history page: add transfer asset release
- 133a3fa: Export resetWidget function to enable resetting widget state at any time arbitrarily
- a5e3017: update registries
- 8191a9b: Add timeoutSeconds to routeConfig to customize IBC transfer timeout
- 35752af: Fix injected wallets
- 20adf5e: Add locked to defaultRouteConfig to allow preventing editing of src or dest assets
- Updated dependencies [a5e3017]
- Updated dependencies [8191a9b]
  - @skip-go/client@0.16.15

## 3.3.9

### Patch Changes

- b3306ef: Fix tx history showing all explorer links
- 283ff43: Fix solana signers
- 77f8781: fix incorrect address displayed
- 8584f49: Fix blinking confirm button
- fafc730: Bring back manually setting wallet state when connecting

## 3.3.8

### Patch Changes

- f98435f: change currentCosmosId to be based on the first cosmosAccount

## 3.3.7

### Patch Changes

- c07aee3: disable swapfooter when route === undefined
- 2e3f7ed: Add reusable Tooltip component, Add copy to clipboard UI feedback
- 4fd1a1b: fix route details icon coloring for dark mode
- 5d234ce: add useUnlimitedApproval default to false in client and widget
- 1a9ebed: Remove agoric from initialChainIds to connect
- 2289c4b: Reduce gap between Asset/Chain row items
- 642439b: Bring back wallet connection pending animation
- 0ac0b74: Fix solana wallet detection in useKeepWalletStateSynced
- a3d6433: titan chain ethermint pubkey
- a7c2728: add loading state in useAutoSetAddress
- 983802e: Refactor isLoading as isFetching && isPending to support tanstackQuery v4
- ee4f29f: Refactor useCreate(Cosmos/Evm/Svm)Wallets hooks
- e255f41: Always show spinner on if source(or previous operation) has completed
- c981e6d: connect more chainIds when wallet type is wallet connect
- 9abebe6: fix getAddressWithoutConnectingWallet logic
- 9c84691: go fast warning page for first tx and minor styling changes
- 7bda9e1: only show manual entry if same chain type in evm and svm
- e39a6b2: Make estimated time count down
- f31a18e: Add ability to select asset/chain by pressing enter when only one option is left
- f4cc413: Add 3 tags to sentry
- 2a90d05: Always update sourceWallet if it's undefined when connecting wallet
- fb9b5e0: fix ability for recovery addresses to be auto updated when wallet is changed
- 37bc145: Add onRouteUpdated callback
- Updated dependencies [18a00bc]
- Updated dependencies [5d234ce]
- Updated dependencies [a3d6433]
  - @skip-go/client@0.16.14

## 3.3.6

### Patch Changes

- 4b3e488: Fix stride encode/decode logic
- Updated dependencies [4b3e488]
  - @skip-go/client@0.16.13

## 3.3.5

### Patch Changes

- 947ee9d: fix validation address issue
- Updated dependencies [947ee9d]
  - @skip-go/client@0.16.12

## 3.3.4

### Patch Changes

- d306a00: hotfix noble to penumbra address

## 3.3.3

### Patch Changes

- 667c41a: support noble intermediary chain to penumbra

## 3.3.2

### Patch Changes

- 04fe86d: penumbra wallet address fixes
- Updated dependencies [04fe86d]
  - @skip-go/client@0.16.11

## 3.3.1

### Patch Changes

- Updated dependencies [0b4e15d]
  - @skip-go/client@0.16.10

## 3.3.0

### Minor Changes

- add5269: Transition util + hover states

### Patch Changes

- add5269: fix bug with evm recovery address not working on mobile
- add5269: Update StylesheetManager to wait and target shadowRoot for stylesheet injection
- add5269: Autofocus input the same way on mobile
- add5269: Fix ability to connect keplr mobile app with in-app browser
- add5269: Restore scroll position on modal close
- add5269: Fix autoSetAddress for evm on mobile
- add5269: Disable compression for sentry replays
- add5269: Use same keplr logo for evm as cosmos
- add5269: Ensure priceChangePercentage is negative before pushing to TradeWarning Error
- Updated dependencies [add5269]
- Updated dependencies [add5269]
- Updated dependencies [add5269]
- Updated dependencies [add5269]
- Updated dependencies [add5269]
- Updated dependencies [add5269]
- Updated dependencies [add5269]
- Updated dependencies [add5269]
  - @skip-go/client@0.16.9

## 3.2.1

### Patch Changes

- 0ca751c: fix bug with evm recovery address not working on mobile
- 0ca751c: various mobile ui fixes
- 0ca751c: Autofocus input the same way on mobile
- 0ca751c: Fix modal scrolling issues
- 0ca751c: update registries
- 0ca751c: Restore scroll position on modal close
- 0ca751c: Fix autoSetAddress for evm on mobile
- 0ca751c: Use same keplr logo for evm as cosmos
- 0ca751c: Ensure priceChangePercentage is negative before pushing to TradeWarning Error
- Updated dependencies [0ca751c]
- Updated dependencies [0ca751c]
- Updated dependencies [0ca751c]
- Updated dependencies [0ca751c]
- Updated dependencies [0ca751c]
- Updated dependencies [0ca751c]
  - @skip-go/client@0.16.8

## 3.2.0

### Minor Changes

- 4434c09: graz is not a peer dependencies

### Patch Changes

- 2500502: fix mobile route config override bug
- c410d7d: Fix initialization of undefined source/dest amount
- 432c0d6: Remove importsNotUsedAsValues (export type) from build to fix issues with envs that don't recognize export type syntax
- a04c9cd: Use smaller font for error messages
- a44a8cf: fix image url issue in input search and error button text size

## 3.1.13

### Patch Changes

- f78397a: update registries
- 7040482: Update theme colors to use background instead of background-color to support gradients
- 5e04b74: Update mobile Asset/Chain selector modal to avoid word wrapping with small screen widths
- afcbdc3: Add enableSentrySessionReplays prop, add widget version as a tag
- 749eea4: Simplify search to use substring search
- 23ae20c: Turn on 100% session sample rate (if enableSentrySessionReplays = true)
- bc0309a: Fix bug with pulsing 0 input onload
- 1b84bb5: Fix infinite balance spinner if using tanstack/query v4
- 22c5cc1: enable mobile wallets for getting the address
- b64cf84: only single tx routes on mobile
- 1479374: Fix disabled button text color
- 48ea9f7: Add more data to tx callbacks
- Updated dependencies [f78397a]
- Updated dependencies [36a6930]
- Updated dependencies [4492ab5]
  - @skip-go/client@0.16.7

## 3.1.12

### Patch Changes

- 57c333f: fix apiUrl not updated

## 3.1.11

### Patch Changes

- 9e60d75: Avoid throwing an error if gasPrice avg/high/low prices are not valid numbers
- Updated dependencies [9e60d75]
  - @skip-go/client@0.16.6

## 3.1.10

### Patch Changes

- ad9b1e6: Proxy sentry requests to /api/sentry
- 70d4811: Settings wheel size increased and opacity fix, plus settings bar css fixes

## 3.1.9

### Patch Changes

- a008f2b: add chainIdsToAffiliate to msgs and msgsDirect
- Updated dependencies [a008f2b]
  - @skip-go/client@0.16.5

## 3.1.8

### Patch Changes

- f88389b: Prevent non-error/fatal level events from being sent to sentry
- e5c31f2: Disable sentry globalHandlers and browserApiErrors default integrations
- 6d1f93d: Fix connect wallet styling, fix history page to have default min-height
- 8d2685e: Mobile styling updates
- 4789d60: Start loading green circle immediately after signing
- 60291ff: fix default route
- bd75f93: only manual address on mobile
- 7709f59: single walletconnect instance
- 905a8e0: refactor source status
- 5bed02d: filter 0.2 ntrn swap fees
- 26f9185: fix history truncation
- a33b066: mobile: disconnect before connect
- 2780661: Mobile styling updates
- 69d7656: Fix set recovery address not working if chainid isnt supported by wallet
- 4609c5d: hide okx wallet on evm
- a05fdce: add solana walletconnect

## 3.1.7

### Patch Changes

- 9965900: Fix handling of transaction failed status
- 9965900: add network details to sentry
- 9965900: fix okx wallet override
- 9965900: Add Smarter asset image loading

## 3.1.6

### Patch Changes

- 7f3ede7: Convert globalStyles to stylesheet before passing to react-shadow-scope
- 7f3ede7: Fix routePreference bug
- 7f3ede7: Add sentry integration (session replay, error tracking)
- 7f3ede7: Fix okxWallet eco connection
- 7f3ede7: enable evm walletconnect for desktop
- 7f3ede7: add stargate to experimental features
- 7f3ede7: Track error in sentry if the transaction fails
- Updated dependencies [7f3ede7]
- Updated dependencies [7f3ede7]
- Updated dependencies [7f3ede7]
  - @skip-go/client@0.16.4

## 3.1.5

### Patch Changes

- 0622dcd: Convert globalStyles to stylesheet before passing to react-shadow-scope
- Updated dependencies [0622dcd]
- Updated dependencies [0622dcd]
  - @skip-go/client@0.16.3

## 3.1.4

### Patch Changes

- c7d3743: fix edit desintation address

## 3.1.3

### Patch Changes

- Updated dependencies [8a1ae46]
  - @skip-go/client@0.16.2

## 3.1.2

### Patch Changes

- 40a9229: show warning if ends in ibc transfer
- ea59c36: Update post tx button to Go again
- 7caf0cb: filter cosmos wallets for is available items
- 2cff22b: remove evm wallet connect
- 9628165: update registries
- afb37b6: fix build
- Updated dependencies [fa9b9c9]
- Updated dependencies [9628165]
- Updated dependencies [afb37b6]
  - @skip-go/client@0.16.1

## 3.1.1

### Patch Changes

- bc373bd: fix keplr in app browser issue

## 3.1.0

### Minor Changes

- dacf973: evm mobile wallet support

### Patch Changes

- dacf973: ability to pass signer and account
- dacf973: fix balance loading display state
- dacf973: fix loading indicator
- dacf973: Add callback functions for wallet connect/disconnect and transaction broadcasted / completed / failed
- dacf973: exclude assets programatically
- dacf973: add daodao iframe wallet
- Updated dependencies [dacf973]
- Updated dependencies [dacf973]
  - @skip-go/client@0.16.0

## 3.0.25

### Patch Changes

- 6e9f9cc: bump chain registry versions
- Updated dependencies [6e9f9cc]
  - @skip-go/client@0.15.6

## 3.0.24

### Patch Changes

- Updated dependencies [31f05d1]
  - @skip-go/client@0.15.5

## 3.0.23

### Patch Changes

- 90d7ca9: update default gas amounts and improve code readability
- 90d7ca9: remove continue option in ledger warning
- 90d7ca9: improve ChainType enum usage
- 90d7ca9: fix failure on warning
- 90d7ca9: update fallback gas amount logic
- 90d7ca9: ledger warning for ethermint based chains
- 90d7ca9: allow set destination on 2 sig routes
- 90d7ca9: update registries
- Updated dependencies [90d7ca9]
- Updated dependencies [90d7ca9]
- Updated dependencies [90d7ca9]
- Updated dependencies [90d7ca9]
  - @skip-go/client@0.15.4

## 3.0.22

### Patch Changes

- 187d91d: fix autoset address override manual address

## 3.0.21

### Patch Changes

- 94573e0: Refactor SwapExecutionPage to use route data for asset denoms
- b67ca86: prevent gas price scientific notation
- e0bc1a7: update registries
- f14bd83: update registries
- Updated dependencies [b67ca86]
- Updated dependencies [e0bc1a7]
- Updated dependencies [f14bd83]
  - @skip-go/client@0.15.3

## 3.0.20

### Patch Changes

- efc6388: Fix no route fetched when inverting swap before entering input/output amount
- ad0f03d: bump solana web3js version
- 7f81190: Remove extra margin in settings drawer
- ba6a4dc: improve balance display
- f053d5b: search by asset name
- 1c6dfab: fix no results modal height
- 7cc25f2: fix android not opening wallet when signing
- 9068af7: autoset address initially when already connected
- Updated dependencies [ad0f03d]
  - @skip-go/client@0.15.2

## 3.0.19

### Patch Changes

- fd0554c: support testnet
- Updated dependencies [fd0554c]
- Updated dependencies [1d80759]
  - @skip-go/client@0.15.1

## 3.0.18

### Patch Changes

- 8f21a1d: Fix not being able to type decimal on mobile
- 39552a3: Externalize react/jsx-runtime to support react19
- fc908b0: cosmos mobile wallet support and walletconnect
- Updated dependencies [fc908b0]
  - @skip-go/client@0.15.0

## 3.0.17

### Patch Changes

- 23939e6: fix destination/recovery address not auto filled
- 7cc8da5: increase transaction timeout cushion
- a5fe75b: fix balance decimals display
- Updated dependencies [b0319d5]
  - @skip-go/client@0.14.8

## 3.0.16

### Patch Changes

- c9def8a: fix transaction history modal height
- cae55fe: fix recovery wallet override destination address
- 4a48064: rendering bugfixes
- fc7374d: more responsive button text user feedback to wallet actions
- 10dcd41: Keep previous balance data to avoid reloading
- 59b165a: improve and simplify button text
- ef165f1: adjust slippage options and default to 1 percent
- Updated dependencies [fc7374d]
  - @skip-go/client@0.14.7

## 3.0.15

### Patch Changes

- 10762ad: asset image placeholder for no image assets
- 17c99d3: pulse loading animation button
- 698c8d2: removed widget fixed width and padding
- 15481a6: asset selector height fixed
- 79288a9: fix loading animation

## 3.0.14

### Patch Changes

- 1001c0b: add go fast specific styles
- 06dff77: gas amount set by chain id
- cc8c27a: fix chainId typescript error
- 1042690: fix ledger initial connect
- Updated dependencies [23edd2f]
  - @skip-go/client@0.14.6

## 3.0.13

### Patch Changes

- 8a34cf5: improve cosmos chains balance validation
- 1284623: fix history item stuck loading
- 970fc82: fix client side error undefined asset in cw20 hook
- b9f17e6: fix timeout page freeze
- 08925c0: source amount validation based on fee assets

## 3.0.12

### Patch Changes

- b9d30fe: update registries
- 51f538e: ui fixes
- 381e22f: cw20 balance
- Updated dependencies [b9d30fe]
  - @skip-go/client@0.14.5

## 3.0.11

### Patch Changes

- d2ad384: Add multi-transaction acknowledgement warning
- 9c456c4: fix fonts
- 4f97d18: fix carbon gas insufficient
- 4d03b96: Add mobile styling for history and swap settings
- ca179fd: update chains and noble cctp modules
- 95c7596: only track transfer tx (not approval) and dont call status until track has completed
- 1c38025: approving allowance callback
- Updated dependencies [4f97d18]
- Updated dependencies [ca179fd]
- Updated dependencies [1c38025]
  - @skip-go/client@0.14.4

## 3.0.10

### Patch Changes

- 67281cc: Fix light mode modals being black

## 3.0.9

### Patch Changes

- 2932a9e: Update styling for mobile support

## 3.0.8

### Patch Changes

- cb443b8: Fix SetAddressModal not closing after connection

## 3.0.7

### Patch Changes

- d01248c: support go fast operation type
- 7f90caf: Modals refactored, close existing modal when opening a second one
- Updated dependencies [d01248c]
  - @skip-go/client@0.14.3

## 3.0.6

### Patch Changes

- 6fa8cb2: fix route config prop

## 3.0.5

### Patch Changes

- 3e1d39a: widget RouteConfig adjustment
- Updated dependencies [3e1d39a]
  - @skip-go/client@0.14.2

## 3.0.4

### Patch Changes

- 28c097f: fix null coin decimals
- Updated dependencies [4248305]
  - @skip-go/client@0.14.1

## 3.0.3

### Patch Changes

- a16478e: bundle size reduced
- 9424290: Update chainIdsToAffiliates prop to be proper camelCase
- 991596a: Update fonts

## 3.0.2

### Patch Changes

- 3fe0cb4: fix explorer link in transaction details

## 3.0.1

### Patch Changes

- 8a3c3a3: prevent undefined or null slippage

## 3.0.0

### Major Changes

- c3be461: Fresh UI/UX

### Patch Changes

- Updated dependencies [b114667]
  - @skip-go/client@0.9.3

## 0.0.14

### Patch Changes

- Updated dependencies [4d51d49]
  - @skip-go/client@0.9.2

## 0.0.13

### Patch Changes

- Updated dependencies [950e8ee]
  - @skip-go/client@0.9.1

## 0.0.12

### Patch Changes

- Updated dependencies [ceda056]
  - @skip-go/client@0.9.0

## 0.0.11

### Patch Changes

- Updated dependencies [f8ebffe]
  - @skip-go/client@0.8.2

## 0.0.10

### Patch Changes

- Updated dependencies [218728e]
  - @skip-go/client@0.8.1

## 0.0.9

### Patch Changes

- Updated dependencies [89a201c]
  - @skip-go/client@0.8.0

## 0.0.8

### Patch Changes

- Updated dependencies [87727c5]
  - @skip-go/client@0.7.0

## 0.0.7

### Patch Changes

- Updated dependencies [a5890d7]
  - @skip-go/client@0.6.0

## 0.0.6

### Patch Changes

- Updated dependencies [7c9146c]
  - @skip-go/client@0.5.2

## 0.0.5

### Patch Changes

- Updated dependencies [c7961e6]
  - @skip-go/core@0.5.1

## 0.0.4

### Patch Changes

- Updated dependencies [03f5e1e]
  - @skip-go/core@0.5.0

## 0.0.3

### Patch Changes

- Updated dependencies [0828086]
  - @skip-go/core@0.4.6

## 0.0.2

### Patch Changes

- Updated dependencies [76f85a7]
  - @skip-go/core@0.4.5

## 0.0.1

### Patch Changes

- Updated dependencies [5ef01aa]
  - @skip-go/core@0.4.4
