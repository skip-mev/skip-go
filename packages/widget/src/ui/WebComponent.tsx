import { SwapWidget, SwapWidgetProps } from './index';
import { SwapWidgetProvider, SwapWidgetProviderProps } from '../provider';

type WebComponentProps = SwapWidgetProps & SwapWidgetProviderProps;

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const camelize = (inputString: string) =>
  inputString.replace(/-./g, (x) => x[1].toUpperCase());

const WidgetWithProvider = (props: WebComponentProps) => {
  // @ts-ignore
  const parsedProps = Array.from(props.container.attributes).map(
    ({ name, value }: any) => {
      return { key: name, value };
    }
  );

  const realProps = parsedProps.reduce((accumulator, initialValue) => {
    const { key, value } = initialValue;

    accumulator[camelize(key)] = isJsonString(value)
      ? JSON.parse(value)
      : value;
    return accumulator;
  }, {});

  const { toasterProps, endpointOptions, apiURL, ...swapWidgetProps } =
    realProps as WebComponentProps;
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
