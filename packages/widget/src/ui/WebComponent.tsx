import { SwapWidget, SwapWidgetProps } from "./index";
import { SwapWidgetProvider } from "../provider";

type SwapWidgetWebComponentProps = {
  colors: string,
  defaultRoute: string,
}

const WidgetWithProvider = (props: SwapWidgetProps) => {
  return (
    <SwapWidgetProvider>
      <SwapWidget {...props} />
    </SwapWidgetProvider>
  )
};

if (typeof window !== 'undefined') {
  import('@r2wc/react-to-web-component').then(({ default: ReactToWebComponent }) => {
    const WebComponent = ReactToWebComponent(WidgetWithProvider, {
      props: {
        colors: 'json',
        defaultRoute: 'json',
      }
    });
    customElements.define('swap-widget', WebComponent);
    console.log('defined custom web component');
  });
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['swap-widget']: SwapWidgetWebComponentProps;
    }
  }
}
