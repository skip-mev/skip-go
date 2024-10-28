import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal, useModal } from "@/components/Modal";
import {
  cloneElement,
  ReactElement,
  useEffect,
  useMemo,
} from "react";
import { defaultTheme, lightTheme, PartialTheme, Theme } from "./theme";
import { Router } from "./Router";
import { useResetAtom } from "jotai/utils";
import { numberOfModalsOpenAtom } from "@/state/modal";
import { useSetAtom } from "jotai";
import {
  skipClientConfigAtom,
  themeAtom,
  defaultSkipClientConfig,
} from "@/state/skipClient";
import { SkipClientOptions } from "@skip-go/client";
import { DefaultRouteConfig, useInitDefaultRoute } from "./useInitDefaultRoute";
import { ChainFilter, chainFilterAtom, defaultSwapSettings, swapSettingsAtom } from "@/state/swapPage";
import { RouteConfig, routeConfigAtom } from "@/state/route";

export type WidgetProps = {
  theme?: PartialTheme | "light" | "dark";
  brandColor?: string;
  defaultRoute?: DefaultRouteConfig;
  settings?: {
    /**
     * percentage of slippage 0-100
     * @default 3
     */
    slippage?: number;
  };
  onlyTestnet?: boolean;
  routeConfig?: RouteConfig;
  filter?: ChainFilter;
} & SkipClientOptions;

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

  const mergedSkipClientConfig = useMemo(() => {
    const { theme, ...skipClientConfig } = props;

    return {
      ...defaultSkipClientConfig,
      ...skipClientConfig,
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

  useEffect(() => {
    setSkipClientConfig(mergedSkipClientConfig);
    setTheme(mergedTheme);
  }, [
    setSkipClientConfig,
    mergedSkipClientConfig,
    setTheme,
    mergedTheme
  ]);

  useEffect(() => {
    if (props.settings?.slippage) {
      setSwapSettings({
        ...defaultSwapSettings,
        ...props.settings,
      });
    }
    if (props.routeConfig) {
      setRouteConfig(props.routeConfig);
    }
    if (props.filter) {
      setChainFilter(props.filter);
    }
  }, [props.filter, props.routeConfig, props.settings, props.settings?.slippage, setChainFilter, setRouteConfig, setSwapSettings]);

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
  const resetNumberOfModalsOpen = useResetAtom(numberOfModalsOpenAtom);

  const handleClick = () => {
    resetNumberOfModalsOpen();
    modal.show({
      stackedModal: false,
    });
  };

  const Element = cloneElement(button, { onClick: handleClick });

  return <>{Element}</>;
};

const WidgetContainer = styled.div`
  width: 480px;
  position: relative;
`;
