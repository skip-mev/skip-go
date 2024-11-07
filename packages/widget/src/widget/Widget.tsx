import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal, useModal } from "@/components/Modal";
import { cloneElement, ReactElement, useContext, useLayoutEffect, useMemo } from "react";
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
  SkipClientOptions,
} from "@skip-go/client";
import { DefaultRouteConfig, useInitDefaultRoute } from "./useInitDefaultRoute";
import {
  ChainFilter,
  chainFilterAtom,
  defaultSwapSettings,
  swapSettingsAtom,
} from "@/state/swapPage";
import { RouteConfig, routeConfigAtom } from "@/state/route";
import { registerModals } from "@/modals/registerModals";

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
  routeConfig?: Omit<RouteConfig, "swapVenues"> & {
    swapVenues?: NewSwapVenueRequest[];
  };
  filter?: ChainFilter;
} & NewSkipClientOptions;

type NewSwapVenueRequest = {
  name: string;
  chainId: string;
};

type NewSkipClientOptions = Omit<SkipClientOptions, "apiURL"> & {
  apiUrl?: string
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

  const nicemodal = useContext(NiceModal.NiceModalContext);

  console.log(nicemodal);

  const mergedSkipClientConfig = useMemo(() => {
    const { theme, apiUrl, ...skipClientConfig } = props;

    return {
      ...defaultSkipClientConfig,
      ...skipClientConfig,
      apiURL: apiUrl,
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
      // temp before clientLibrary updates swapVenues to be
      // { name: string, chainId: string }[]
      const tempClientRouteConfig = props.routeConfig;
      if (tempClientRouteConfig.swapVenues) {
        (tempClientRouteConfig as RouteConfig).swapVenues =
          tempClientRouteConfig.swapVenues.map((swapVenue) => ({
            name: swapVenue.name,
            chainID: swapVenue.chainId,
          }));
      }
      setRouteConfig(tempClientRouteConfig as RouteConfig);
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
    <ShadowDomAndProviders theme={mergedTheme}>
      <WidgetContainer>
        <Router />
      </WidgetContainer>
    </ShadowDomAndProviders>
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
  width: 480px;
  position: relative;
`;
