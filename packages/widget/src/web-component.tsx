/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-namespace */
import toWebComponent from "@r2wc/react-to-web-component";
import { Widget } from "./widget/Widget";

type WebComponentProps = {
  container?: {
    attributes?: Record<string, string>[];
  };
};

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (_err) {
    return false;
  }
  return true;
}

const camelize = (inputString: string) => {
  inputString = inputString.toLowerCase();
  return inputString.replace(/-./g, (x) => x[1].toUpperCase());
};

const WidgetWithProvider = (props: WebComponentProps) => {
  const attributeProps = Array.isArray(props.container?.attributes)
    ? props.container.attributes
    : [];

  const parsedFromAttributes = attributeProps.reduce(
    (acc, { name, value }) => {
      acc[camelize(name)] = isJsonString(value) ? JSON.parse(value) : value;
      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as Record<string, any>,
  );

  const { container, ...jsAssignedProps } = props;

  const realProps = {
    ...parsedFromAttributes,
    ...jsAssignedProps,
  };

  return <Widget {...realProps} />;
};

const WEB_COMPONENT_NAME = "skip-widget";

const WebComponent = toWebComponent(WidgetWithProvider, {
  props: {
    onRouteUpdated: "function",
  },
});

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
