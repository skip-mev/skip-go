# SKIP GO WIDGET

The `@skip-go/widget` package is an npm package of react component that provide a full swap interface using [Skip API](https://skip.money/).

## Installation

```bash
npm install @skip-go/widget
```

## Quick Start Guide

1. Wrap your app or page with the `SwapWidgetProvider` component.

   ```tsx
   import { SwapWidgetProvider } from '@skip-go/widget';

   function App() {
     return (
       <SwapWidgetProvider>
         <YourApp />
       </SwapWidgetProvider>
     );
   }
   ```

2. Use the `SwapWidget` component to render the swap interface.

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

## Props

### SwapWidget

```tsx
interface SwapWidgetProps {
  colors?:{
    primary?: string; // Custom colors for the widget. Defaults to `#FF486E`.
  }
  defaultRoute?: { // Default route for the widget.
    amountIn?: number;
    amountOut?: number;
    srcChainID?: string;
    srcAssetDenom?: string;
    destChainID?: string;
    destAssetDenom?: string;
  };
  endpointOptions?: { // Endpoint options to override rpc/rest endpoints. Defaults to Skip proxied endpoints. Please reach out to us first if you want to be whitelisted.
    endpoints?: Record<string, EndpointOptions>;
    getRpcEndpointForChain?: (chainID: string) => Promise<string>;
    getRestEndpointForChain?: (chainID: string) => Promise<string>;
  };
  apiURL?: string // Custom API URL to override Skip API endpoint. Defaults to Skip proxied endpoints. Please reach out to us first if you want to be whitelisted.
  routeConfig?: {
    experimentalFeatures?: ["hyperlane"];
    allowMultiTx?: boolean;
    allowUnsafe?: boolean;
    bridges?: ("IBC" | "AXELAR" | "CCTP" | "HYPERLANE")[];
    swapVenues?: {
      name: string;
      chainID: string;
    }[];
  className?: string;
  style?: React.CSSProperties;
}
```

### SwapWidgetProvider

- `toasterProps` (Optional) - Props for the toaster component. [ToasterProps](https://react-hot-toast.com/docs/toast-options). Defaults to `{ position: 'top-right' }`.
