import { SwapWidget, SwapWidgetProps } from './index';
import { SwapWidgetProvider, SwapWidgetProviderProps } from '../provider';

type WebComponentProps = SwapWidgetProps & SwapWidgetProviderProps;

const WidgetWithProvider = (props: WebComponentProps) => {
  const { toasterProps, endpointOptions, apiURL, ...swapWidgetProps } = props;
  return (
    <SwapWidgetProvider
      toasterProps={toasterProps}
      endpointOptions={endpointOptions}
      apiURL={apiURL}
    >
      <SwapWidget {...swapWidgetProps} />
    </SwapWidgetProvider>
  );
};

const WEB_COMPONENT_NAME = 'skip-widget';

let initialized = false;

export const initializeSwapWidget = () => {
  if (!initialized && typeof window !== 'undefined') {
    import('@r2wc/react-to-web-component').then(
      ({ default: ReactToWebComponent }) => {
        const WebComponent = ReactToWebComponent(WidgetWithProvider);

        if (!customElements.get(WEB_COMPONENT_NAME)) {
          customElements.define(WEB_COMPONENT_NAME, WebComponent);
        }
        initialized = true;
      }
    );
  }
};

type Stringify<T> = {
  [K in keyof T]?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [WEB_COMPONENT_NAME]: Stringify<WebComponentProps>;
    }
  }
}
