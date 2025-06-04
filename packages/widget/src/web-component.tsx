/* eslint-disable @typescript-eslint/consistent-type-definitions */

import toWebComponent from "@r2wc/react-to-web-component";
import { Widget, WidgetProps } from "./widget/Widget";
import { SkipClientOptions } from "@skip-go/client";

const WEB_COMPONENT_NAME = "skip-widget";

type WebComponentProps = WidgetProps & SkipClientOptions;

type PropDescriptors = {
  [K in keyof WebComponentProps]: "any";
};

const widgetPropTypes: Required<PropDescriptors> = {
  rootId: "any",
  theme: "any",
  brandColor: "any",
  onlyTestnet: "any",
  defaultRoute: "any",
  settings: "any",
  routeConfig: "any",
  filter: "any",
  filterOut: "any",
  filterOutUnlessUserHasBalance: "any",
  walletConnect: "any",
  enableSentrySessionReplays: "any",
  enableAmplitudeAnalytics: "any",
  connectedAddresses: "any",
  simulate: "any",
  disableShadowDom: "any",
  ibcEurekaHighlightedAssets: "any",
  assetSymbolsSortedToTop: "any",
  hideAssetsUnlessWalletTypeConnected: "any",
  apiUrl: "any",
  apiKey: "any",
  endpointOptions: "any",
  aminoTypes: "any",
  registryTypes: "any",
  chainIdsToAffiliates: "any",
  cacheDurationMs: "any",
  getCosmosSigner: "any",
  getEvmSigner: "any",
  getSvmSigner: "any",
  onWalletConnected: "any",
  onWalletDisconnected: "any",
  onTransactionBroadcasted: "any",
  onTransactionComplete: "any",
  onTransactionFailed: "any",
  onRouteUpdated: "any",
  onSourceAndDestinationSwapped: "any",
  batchSignTxs: "any",
  onDestinationAssetUpdated: "any",
  onSourceAssetUpdated: "any",
};

const WebComponent = toWebComponent(Widget, {
  // @ts-expect-error any is not one of the valid types but it works
  props: widgetPropTypes,
});

function initializeSkipWidget() {
  if (!customElements.get(WEB_COMPONENT_NAME)) {
    customElements.define(WEB_COMPONENT_NAME, WebComponent);
  }

  // Upgrade any existing skip-widget elements
  document.querySelectorAll(WEB_COMPONENT_NAME).forEach((el) => customElements.upgrade(el as Node));
}

initializeSkipWidget();

export default WebComponent;

declare global {
  interface HTMLElementTagNameMap {
    [WEB_COMPONENT_NAME]: WidgetProps;
  }
}
