/* eslint-disable @typescript-eslint/consistent-type-definitions */

import toWebComponent from "@r2wc/react-to-web-component";
import { NewSkipClientOptions, Widget, WidgetProps } from "./widget/Widget";

const WEB_COMPONENT_NAME = "skip-widget";

type WebComponentProps = WidgetProps & NewSkipClientOptions;

type PropDescriptors = {
  [K in keyof WebComponentProps]: "function" | "boolean" | "json" | "string" | "number";
};

const widgetPropTypes: Required<PropDescriptors> = {
  rootId: "string",
  theme: "json",
  brandColor: "string",
  onlyTestnet: "boolean",
  defaultRoute: "json",
  settings: "json",
  routeConfig: "json",
  filter: "json",
  filterOut: "json",
  walletConnect: "json",
  enableSentrySessionReplays: "boolean",
  enableAmplitudeAnalytics: "boolean",
  connectedAddresses: "json",
  simulate: "boolean",
  disableShadowDom: "boolean",
  ibcEurekaHighlightedAssets: "json",
  assetSymbolsSortedToTop: "json",
  hideAssetsUnlessWalletTypeConnected: "boolean",
  apiUrl: "string",
  apiKey: "string",
  endpointOptions: "json",
  aminoTypes: "json",
  registryTypes: "json",
  chainIdsToAffiliates: "json",
  cacheDurationMs: "number",
  getCosmosSigner: "json",
  getEVMSigner: "json",
  getSVMSigner: "json",
  onWalletConnected: "function",
  onWalletDisconnected: "function",
  onTransactionBroadcasted: "function",
  onTransactionComplete: "function",
  onTransactionFailed: "function",
  onRouteUpdated: "function",
};

const WebComponent = toWebComponent(Widget, {
  props: widgetPropTypes,
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

declare global {
  interface SkipWidgetElement extends HTMLElement, WidgetProps {}

  interface HTMLElementTagNameMap {
    [WEB_COMPONENT_NAME]: SkipWidgetElement;
  }
}
