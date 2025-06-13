import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import React, { ReactElement, ReactNode, useEffect } from "react";
import { PartialTheme } from "./theme";
import { Router } from "./Router";
import {
  MessagesRequest,
  RouteRequest,
  SetApiOptionsProps,
  SignerGetters,
  SkipClientOptions,
} from "@skip-go/client";
import { DefaultRouteConfig } from "./useInitDefaultRoute";
import { registerModals } from "@/modals/registerModals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInitWidget } from "./useInitWidget";
import { WalletConnect } from "@/state/wallets";
import { Callbacks } from "@/state/callbacks";
import { createStore, Provider, useAtomValue, useSetAtom } from "jotai";
import { settingsDrawerAtom } from "@/state/settingsDrawer";
import { rootIdAtom } from "@/state/skipClient";
import packageJson from "../../package.json";
import { IbcEurekaHighlightedAssets } from "@/state/ibcEurekaHighlightedAssets";
import { ChainFilter } from "@/state/filters";
import { migrateHistoryFromLocalStorageToIndexedDB } from "@/utils/migrateOldLocalStorageValues";
import { EVMProvider } from "@/providers/EVMProvider";
import { CosmosProvider } from "@/providers/CosmosProvider";

export type WidgetRouteConfig = RouteRequest & Pick<MessagesRequest, "timeoutSeconds">;

export type WidgetProps = {
  /**
   * If specified, add a `data-root-id` attribute to all root elements of the widget, including portals.
   * This can be used to style or document.querySelector specific parts of the widget.
   */
  rootId?: string;
  theme?: PartialTheme | "light" | "dark";
  brandColor?: string;
  /**
   * Customize the corner roundness of widget components
   * @default 25
   */
  onlyTestnet?: boolean;
  defaultRoute?: DefaultRouteConfig;
  settings?: {
    /**
     * Default slippage percentage (0-100) for CosmosSDK chain swaps.
     * @default 1
     */
    slippage?: number;
    /**
     * Set allowance amount to max if EVM transaction requires allowance approval
     */
    useUnlimitedApproval?: boolean;
  };
  routeConfig?: WidgetRouteConfig;
  filter?: ChainFilter;
  filterOut?: ChainFilter;
  filterOutUnlessUserHasBalance?: ChainFilter;
  walletConnect?: WalletConnect;
  /**
   * enables sentry session replays on the widget to help with troubleshooting errors
   * https://docs.sentry.io/product/explore/session-replay/web/
   */
  enableSentrySessionReplays?: boolean;
  /**
   * Enable Amplitude analytics for the widget to improve user experience.
   */
  enableAmplitudeAnalytics?: boolean;
  /**
   * Map of connected wallet addresses, allowing your app to pass pre-connected addresses to the widget.
   * This feature enables the widget to display a specific address as connected for a given chain.
   *
   * If a chain ID is mapped to an address, the widget will automatically use it as the connected address for that chain.
   *
   * @example
   * ```tsx
   * <Widget connectedAddresses={{ "cosmoshub-4": "cosmos1...", "1": "0x..." }} />
   * ```
   */
  connectedAddresses?: Record<string, string | undefined>;
  /**
   * Allow widget to simulate transactions before executing the route to validating gas and balances.
   * @default true
   */
  simulate?: boolean;
  disableShadowDom?: boolean;
  ibcEurekaHighlightedAssets?: IbcEurekaHighlightedAssets;
  assetSymbolsSortedToTop?: string[];
  hideAssetsUnlessWalletTypeConnected?: boolean;
  batchSignTxs?: boolean;
} & SkipClientOptions &
  Callbacks &
  SignerGetters &
  SetApiOptionsProps;

export type ShowSwapWidget = {
  button?: ReactElement;
} & WidgetProps;

export const queryClient = new QueryClient();

export const jotaiStore: ReturnType<typeof createStore> = createStore();

migrateHistoryFromLocalStorageToIndexedDB();

export const Widget = (props: WidgetProps) => {
  return (
    <Provider store={jotaiStore}>
      <WidgetWithinProvider props={props} />
    </Provider>
  );
};

export const WidgetWithinProvider = ({ props }: { props: WidgetProps }) => {
  const { theme } = useInitWidget(props);
  const setRootId = useSetAtom(rootIdAtom);
  setRootId(props.rootId);

  return (
    <ShadowDomAndProviders theme={theme}>
      <EVMProvider>
        <QueryClientProvider client={queryClient} key={"skip-widget"}>
          <CosmosProvider>
            <NiceModal.Provider>
              <WidgetWrapper>
                <Router />
              </WidgetWrapper>
            </NiceModal.Provider>
          </CosmosProvider>
        </QueryClientProvider>
      </EVMProvider>
    </ShadowDomAndProviders>
  );
};

const WidgetWrapper = ({ children }: { children: ReactNode }) => {
  const setSettingsDrawerContainer = useSetAtom(settingsDrawerAtom);
  const rootId = useAtomValue(rootIdAtom);

  useEffect(() => {
    registerModals();
    // eslint-disable-next-line no-console
    console.info(`Loaded skip-go widget version ${packageJson.version}`);
  }, []);

  const onSettingsDrawerContainerLoaded = (element: HTMLDivElement) => {
    setSettingsDrawerContainer(element);
  };

  return (
    <WidgetContainer data-root-id={rootId}>
      {children}
      <div ref={onSettingsDrawerContainerLoaded}></div>
    </WidgetContainer>
  );
};

const WidgetContainer = styled.div`
  width: 100%;
  position: relative;

  div,
  p {
    box-sizing: border-box;
  }

  * {
    font-family: "ABCDiatype", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
`;
