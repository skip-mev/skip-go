## 0.0.15

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
