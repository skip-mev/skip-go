/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-namespace */
import toWebComponent from "@r2wc/react-to-web-component";
import { Widget, WidgetProps } from "./Widget";

type WebComponentProps = {
  container: {
    attributes: Record<string, string>[]
  }
}

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const propMap = {
  "api-url": "apiURL",
};

const camelize = (inputString: string) => {
  inputString = inputString.toLowerCase();
  return inputString.replace(/-./g, (x) => x[1].toUpperCase());
};

const WidgetWithProvider = (props: WebComponentProps) => {
  const parsedProps = Array.from(props.container.attributes).map(
    ({ name, value }) => {
      return { key: name, value };
    }
  );

  const realProps = parsedProps.reduce((accumulator, initialValue) => {
    const { key, value } = initialValue;

    accumulator[camelize(key)] = isJsonString(value)
      ? JSON.parse(value)
      : value;
    return accumulator;
  }, {} as Record<string, string>);

  return <Widget {...realProps} />;
};


const WEB_COMPONENT_NAME = "skip-widget";

const WebComponent = toWebComponent(WidgetWithProvider);

function initializeSkipWidget() {
  if (!customElements.get(WEB_COMPONENT_NAME)) {
    customElements.define(WEB_COMPONENT_NAME, WebComponent);
  }

  // Upgrade any existing skip-widget elements
  document.querySelectorAll(WEB_COMPONENT_NAME).forEach((el) => {
    customElements.upgrade(el);
  });
}

initializeSkipWidget();

export default WebComponent;

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