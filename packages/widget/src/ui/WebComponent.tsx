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

const WEB_COMPONENT_NAME = 'skip-widget';

let initialized = false;

export const initializeSwapWidget = () => {
  if (!initialized && typeof window !== 'undefined') {
    import('@r2wc/react-to-web-component').then(({ default: ReactToWebComponent }) => {
      const WebComponent = ReactToWebComponent(WidgetWithProvider, {
        props: {
          colors: 'json',
          defaultRoute: 'json',
        }
      });

      if (!customElements.get(WEB_COMPONENT_NAME)) {
        customElements.define(WEB_COMPONENT_NAME, WebComponent);
      }
      initialized = true;
    });
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [WEB_COMPONENT_NAME]: SwapWidgetWebComponentProps;
    }
  }
}