## 0.0.15

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
