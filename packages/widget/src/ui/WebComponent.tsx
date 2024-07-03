import { SwapWidget, SwapWidgetProps } from './index';
import { SwapWidgetProvider } from '../provider';

type Stringify<T> = {
  [K in keyof T]: string;
};

type SwapWidgetWebComponentProps = Stringify<SwapWidgetProps> & {
  children?: any;
};

const WidgetWithProvider = (props: SwapWidgetProps) => {
  return (
    <SwapWidgetProvider>
      <SwapWidget {...props} />
    </SwapWidgetProvider>
  );
};

const WEB_COMPONENT_NAME = 'skip-widget';

let initialized = false;

export const initializeSwapWidget = () => {
  if (!initialized && typeof window !== 'undefined') {
    import('@r2wc/react-to-web-component').then(
      ({ default: ReactToWebComponent }) => {
        const WebComponent = ReactToWebComponent(WidgetWithProvider, {
          props: {
            colors: 'json',
            className: 'string',
            style: 'string',
            settings: 'json',
            onlyTestnet: 'json',
            defaultRoute: 'json',
            routeConfig: 'json',
          },
        });

        if (!customElements.get(WEB_COMPONENT_NAME)) {
          customElements.define(WEB_COMPONENT_NAME, WebComponent);
        }
        initialized = true;
      }
    );
  }
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [WEB_COMPONENT_NAME]: SwapWidgetWebComponentProps;
    }
  }
}
