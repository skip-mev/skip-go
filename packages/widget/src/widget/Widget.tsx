import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal } from "@/components/Modal";
import { cloneElement, ReactElement, useLayoutEffect, useMemo } from "react";
import { defaultTheme, lightTheme, PartialTheme, Theme } from "./theme";
import { Router } from "./Router";
import { useSetAtom } from "jotai";
import {
  skipClientConfigAtom,
  themeAtom,
  defaultSkipClientConfig,
  onlyTestnetsAtom,
} from "@/state/skipClient";
import {
  ChainAffiliates,
  SkipClientOptions,
} from "@skip-go/client";
import { DefaultRouteConfig, useInitDefaultRoute } from "./useInitDefaultRoute";
import {
  ChainFilter,
  chainFilterAtom,
  defaultSwapSettings,
  swapSettingsAtom,
} from "@/state/swapPage";
import { routeConfigAtom } from "@/state/route";
import { RouteConfig } from "@skip-go/client";
import { registerModals } from "@/modals/registerModals";

export type WidgetRouteConfig =
  Omit<RouteConfig, "swapVenues" | "swapVenue"> & {
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
     * @default 3
     */
    slippage?: number;
    /**
     * Gas amount for CosmosSDK chain transactions.
     * @default 200_000
     */
    customGasAmount?: number;
  };
  routeConfig?: WidgetRouteConfig;
  filter?: ChainFilter;
} & NewSkipClientOptions;

type NewSwapVenueRequest = {
  name: string;
  chainId: string;
};

type NewSkipClientOptions = Omit<SkipClientOptions, "apiURL" | "chainIDsToAffiliates"> & {
  apiUrl?: string;
  chainIdsToAffiliates?: Record<string, ChainAffiliates>;
}

export const Widget = (props: WidgetProps) => {
  return (
    <NiceModal.Provider>
      <WidgetWithoutNiceModalProvider {...props} />
    </NiceModal.Provider>
  );
};

const WidgetWithoutNiceModalProvider = (props: WidgetProps) => {
  useInitDefaultRoute(props.defaultRoute);
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  const setSwapSettings = useSetAtom(swapSettingsAtom);
  const setRouteConfig = useSetAtom(routeConfigAtom);
  const setChainFilter = useSetAtom(chainFilterAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);

  const mergedSkipClientConfig = useMemo(() => {
    const { theme, apiUrl, chainIdsToAffiliates, ...skipClientConfig } = props;

    return {
      ...defaultSkipClientConfig,
      ...skipClientConfig,
      apiURL: apiUrl,
      chainIDsToAffiliates: chainIdsToAffiliates,
    };
  }, [props]);

  const mergedTheme = useMemo(() => {
    let theme: Theme;
    if (typeof props.theme === "string") {
      theme = props.theme === "light" ? lightTheme : defaultTheme;
    } else {
      theme = { ...defaultTheme, ...props.theme };
    }
    if (props.brandColor) {
      theme.brandColor = props.brandColor;
    }
    return theme;
  }, [props.brandColor, props.theme]);

  useLayoutEffect(() => {
    setSkipClientConfig(mergedSkipClientConfig);
    setTheme(mergedTheme);
    registerModals();
  }, [setSkipClientConfig, mergedSkipClientConfig, setTheme, mergedTheme]);

  useLayoutEffect(() => {
    if (props.settings) {
      setSwapSettings({
        ...defaultSwapSettings,
        ...props.settings,
      });
    }
    if (props.routeConfig) {
      setRouteConfig((prev) => {
        return {
          ...prev,
          ...props.routeConfig,
        };
      });
    }
    if (props.filter) {
      setChainFilter(props.filter);
    }
    if (props.onlyTestnet) {
      setOnlyTestnets(props.onlyTestnet);
    }
  }, [
    props.filter,
    props.onlyTestnet,
    props.routeConfig,
    props.settings,
    props.settings?.slippage,
    setChainFilter,
    setOnlyTestnets,
    setRouteConfig,
    setSwapSettings,
  ]);

  return (
    <WidgetContainer>
      <ShadowDomAndProviders theme={mergedTheme}>
        <Router />
      </ShadowDomAndProviders>
    </WidgetContainer>
  );
};

export type ShowSwapWidget = {
  button?: ReactElement;
} & WidgetProps;

export const ShowWidget = ({
  button = <button>show widget</button>,
  ...props
}: ShowSwapWidget) => {
  const modal = useModal(
    createModal(() => <WidgetWithoutNiceModalProvider {...props} />)
  );

  const handleClick = () => {
    modal.show();
  };

  const Element = cloneElement(button, { onClick: handleClick });

  return <>{Element}</>;
};

const WidgetContainer = styled.div`
  max-width: 480px;
  width: 100%;
  position: relative;
`;
