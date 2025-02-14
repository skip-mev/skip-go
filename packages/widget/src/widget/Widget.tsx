import { ClientOnly, ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal } from "@/components/Modal";
import { cloneElement, ReactElement, ReactNode, useEffect } from "react";
import { PartialTheme } from "./theme";
import { Router } from "./Router";
import { ChainAffiliates, SkipClientOptions } from "@skip-go/client";
import { DefaultRouteConfig } from "./useInitDefaultRoute";
import { ChainFilter } from "@/state/swapPage";
import { RouteConfig } from "@skip-go/client";
import { registerModals } from "@/modals/registerModals";
import { WalletProviders } from "@/providers/WalletProviders";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInitWidget } from "./useInitWidget";
import { WalletConnect } from "@/state/wallets";
import { Callbacks } from "@/state/callbacks";

export type WidgetRouteConfig = Omit<RouteConfig, "swapVenues" | "swapVenue"> & {
  swapVenues?: NewSwapVenueRequest[];
  swapVenue?: NewSwapVenueRequest;
};

export type WidgetProps = {
  theme?: PartialTheme | "light" | "dark";
  brandColor?: string;
  onlyTestnet?: boolean;
  defaultRoute?: DefaultRouteConfig;
  settings?: {
    /**
     * Default slippage percentage (0-100) for CosmosSDK chain swaps.
     * @default 1
     */
    slippage?: number;
  };
  routeConfig?: WidgetRouteConfig;
  filter?: ChainFilter;
  walletConnect?: WalletConnect;
  /**
   * enables sentry session replays on the widget to help with troubleshooting errors
   * https://docs.sentry.io/product/explore/session-replay/web/
   */
  enableSentrySessionReplays?: boolean;
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
} & Pick<
  NewSkipClientOptions,
  | "apiUrl"
  | "chainIdsToAffiliates"
  | "endpointOptions"
  | "getCosmosSigner"
  | "getEVMSigner"
  | "getSVMSigner"
> &
  Callbacks;

type NewSwapVenueRequest = {
  name: string;
  chainId: string;
};

type NewSkipClientOptions = Omit<SkipClientOptions, "apiURL" | "chainIDsToAffiliates"> & {
  apiUrl?: string;
  chainIdsToAffiliates?: Record<string, ChainAffiliates>;
};

export type ShowSwapWidget = {
  button?: ReactElement;
} & WidgetProps;

export const queryClient = new QueryClient();

export const Widget = (props: WidgetProps) => {
  const { theme } = useInitWidget(props);
  return (
    <ShadowDomAndProviders theme={theme} shouldSetMainShadowRoot>
      <WalletProviders>
        <QueryClientProvider client={queryClient} key={"skip-widget"}>
          <NiceModal.Provider>
            <WidgetWrapper>
              <Router />
            </WidgetWrapper>
          </NiceModal.Provider>
        </QueryClientProvider>
      </WalletProviders>
    </ShadowDomAndProviders>
  );
};

export const WidgetWithoutNiceModalProvider = (props: WidgetProps) => {
  const { theme } = useInitWidget(props);
  return (
    <ShadowDomAndProviders theme={theme} shouldSetMainShadowRoot>
      <WalletProviders>
        <QueryClientProvider client={queryClient} key={"skip-widget"}>
          <WidgetWrapper>
            <Router />
          </WidgetWrapper>
        </QueryClientProvider>
      </WalletProviders>
    </ShadowDomAndProviders>
  );
};

export const ShowWidget = ({ button = <button>show widget</button>, ...props }: ShowSwapWidget) => {
  const modal = useModal(createModal(() => <WidgetWithoutNiceModalProvider {...props} />));

  const handleClick = () => {
    modal.show();
  };

  const Element = cloneElement(button, { onClick: handleClick });

  return <>{Element}</>;
};

const WidgetWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    registerModals();
  }, []);
  return (
    <WidgetContainer>
      <ClientOnly>
        {children}
        <div id="settings-drawer"></div>
      </ClientOnly>
    </WidgetContainer>
  );
};

const WidgetContainer = styled.div`
  width: 100%;
  position: relative;
`;
