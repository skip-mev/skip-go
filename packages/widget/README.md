# Skip Go Widget

The `@skip-go/widget` package is an npm package providing a React component for a full swap interface using the [Skip Go API](https://skip.build/).

### Polyfilling Node core modules

If you encounter an error like "Buffer is not defined" when importing and using @skip-go/widget, it may be necessary to polyfill Node.js modules because Skip Go Widget relies on them.

Here are some polyfill plugins for common environments:

- [Webpack](https://www.npmjs.com/package/node-polyfill-webpack-plugin),
- [Rollup](https://www.npmjs.com/package/rollup-plugin-polyfill-node),
- [Vite](https://www.npmjs.com/package/vite-plugin-node-polyfills),
- [ESBuild](https://www.npmjs.com/package/esbuild-plugins-node-modules-polyfill)

### Wrap the widget with a fixed container

It is recommended to wrap the widget with a container element that has a fixed size. This helps to prevent layout shifting as the widget uses shadow-dom (which currently needs to be rendered client-side)

## Installation

To install the package, run the following command:

```bash
npm install @skip-go/widget
```

## React Component usage

import the `SwapWidget` from `'@skip-go/widget'` to render the swap interface:

```tsx
import { SwapWidget } from '@skip-go/widget';

const SwapPage = () => {
  return (
    <div
      style={{
        width: '450px',
        height: '820px',
      }}
    >
      <SwapWidget
        colors={{
          primary: '#FF4FFF',
        }}
      />
    </div>
  );
};
```

### SwapWidget props

The `SwapWidget` component accepts the following props:

````tsx
interface SwapWidgetProps {
  defaultRoute?: {
    // Default route for the widget.
    amountIn?: number;
    amountOut?: number;
    srcChainID?: string;
    srcAssetDenom?: string;
    destChainID?: string;
    destAssetDenom?: string;
  };
  routeConfig?: {
    experimentalFeatures?: ['hyperlane'];
    allowMultiTx?: boolean;
    allowUnsafe?: boolean;
    bridges?: ('IBC' | 'AXELAR' | 'CCTP' | 'HYPERLANE')[];
    swapVenues?: {
      name: string;
      chainID: string;
    }[];
  };
  /**
   * Filter chains and assets in selection
   *
   * Record<chainID, assetDenoms>
   * if assetDenoms is undefined, all assets are allowed
   * @example
   * ```ts
   * {
   * source: {
   *   'noble-1': undefined,
   * },
   * destination: {
   *   'cosmoshub-4': [
   *     'uatom',
   *     'ibc/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86',
   *   ],
   *   'agoric-3': [
   *     'ibc/FE98AAD68F02F03565E9FA39A5E627946699B2B07115889ED812D8BA639576A9',
   *   ],
   *   'osmosis-1': undefined,
   * }
   * ```
   */
  filter?: {
    source?: Record<string, string[] | undefined>;
    destination?: Record<string, string[] | undefined>;
  };
  className?: string;
  style?: React.CSSProperties;
  settings?: {
    customGasAmount?: number; // custom gas amount for validation defaults to 200_000
    slippage?: number; //percentage of slippage 0-100. defaults to 3
  };
  onlyTestnet?: boolean; // Only show testnet chains
  toasterProps?: {
    // Refer to [ToasterProps](https://react-hot-toast.com/docs/toast-options) for more details. Defaults to `{ position: 'top-right' }`
    position?: ToastPosition;
    toastOptions?: DefaultToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
    children?: (toast: Toast) => JSX.Element;
  };
  endpointOptions?: {
    // Endpoint options to override endpoints. Defaults to Skip proxied endpoints. Please reach out to us first if you want to be whitelisted.
    endpoints?: Record<string, EndpointOptions>;
    getRpcEndpointForChain?: (chainID: string) => Promise<string>;
    getRestEndpointForChain?: (chainID: string) => Promise<string>;
  };
  apiURL?: string; // Custom API URL to override Skip API endpoint. Defaults to Skip proxied endpoints. Please reach out to us first if you want to be whitelisted.
  theme?: {
    backgroundColor: string; // background color
    textColor: string; // text color
    borderColor: string; // border color
    brandColor: string; // color used for confirmation buttons
    highlightColor: string; // color used when hovering over buttons, and in select chain/asset dropdown
  };
}
````

# Experimental features (still in development)

## Web Component usage

The web component is created with the `@r2wc/react-to-web-component` library.

In order to register the web-component, you must first call the `initializeSwapWidget` function:

```tsx
import { initializeSwapWidget } from '@skip-go/widget';

initializeSwapWidget();
```

et voilà! you can now use the `swap-widget` web-component as `<swap-widget></swap-widget>`

The props for the web component are the same as `SwapWidgetProps` except that all props
are passed to the web-component via attributes in kebab-case as strings or stringified objects ie.

```tsx
<div
  style={{
    width: '450px',
    height: '820px',
  }}
>
  <SwapWidget
    className="test-class"
    onlyTestnet={true}
    colors={{
      primary: '#FF4FFF',
    }}
    defaultRoute={{
      srcChainID: 'osmosis-1',
      srcAssetDenom:
        'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
    }}
  />
</div>
```

becomes

```tsx
<div style="width:450px;height:820px;">
  <swap-widget
    class-name="test-class"
    onlyTestnet="true"
    colors='{"primary":"#FF4FFF"}'
    default-route={JSON.stringify({
      srcChainID: 'osmosis-1',
      srcAssetDenom:
        'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
    })}
  ></swap-widget>
</div>
```
