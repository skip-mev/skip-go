import {
  useEffect,
  useMemo,
} from "react";
import { defaultTheme, lightTheme, Theme } from "./theme";
import { useSetAtom } from "jotai";
import {
  skipClientConfigAtom,
  themeAtom,
  defaultSkipClientConfig,
  onlyTestnetsAtom,
} from "@/state/skipClient";
import { SkipClientOptions } from "@skip-go/client";
import { useInitDefaultRoute } from "./useInitDefaultRoute";
import {
  chainFilterAtom,
  defaultSwapSettings,
  swapSettingsAtom,
} from "@/state/swapPage";
import { routeConfigAtom } from "@/state/route";
import { getSignersAtom, walletConnectAtom } from "@/state/wallets";
import { WidgetProps } from "./Widget";

export const useInitWidget = (props: WidgetProps) => {
  useInitDefaultRoute(props.defaultRoute);
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  const setSwapSettings = useSetAtom(swapSettingsAtom);
  const setRouteConfig = useSetAtom(routeConfigAtom);
  const setChainFilter = useSetAtom(chainFilterAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);
  const setWalletConnect = useSetAtom(walletConnectAtom);
  const setGetSigners = useSetAtom(getSignersAtom)

  const mergedSkipClientConfig: SkipClientOptions = useMemo(() => {
    const { apiUrl, chainIdsToAffiliates, endpointOptions } = props;
    const fromWidgetProps = {
      apiUrl,
      chainIdsToAffiliates,
      endpointOptions,
    };

    // merge if not undefined
    return {
      apiURL: fromWidgetProps.apiUrl ?? defaultSkipClientConfig.apiUrl,
      endpointOptions:
        fromWidgetProps.endpointOptions ??
        defaultSkipClientConfig.endpointOptions,
      chainIDsToAffiliates: fromWidgetProps.chainIdsToAffiliates ?? {},
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
    setSkipClientConfig({
      apiURL: mergedSkipClientConfig.apiURL,
      endpointOptions: mergedSkipClientConfig.endpointOptions,
      chainIDsToAffiliates: mergedSkipClientConfig.chainIDsToAffiliates,
    });
    setTheme(mergedTheme);
  }, [setSkipClientConfig, mergedSkipClientConfig, setTheme, mergedTheme]);

  useEffect(() => {
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
    if (props.walletConnect) {
      setWalletConnect(props.walletConnect);
    }
    if (props.getCosmosSigner) {
      setGetSigners({
        getCosmosSigner: props.getCosmosSigner,
      });
    }
    if (props.getEVMSigner) {
      setGetSigners({
        getEVMSigner: props.getEVMSigner,
      });
    }
    if (props.getSVMSigner) {
      setGetSigners({
        getSVMSigner: props.getSVMSigner,
      });
    }

  }, [
    props.filter,
    props.onlyTestnet,
    props.routeConfig,
    props.settings,
    props.settings?.slippage,
    props.walletConnect,
    setChainFilter,
    setOnlyTestnets,
    setRouteConfig,
    setSwapSettings,
    setWalletConnect,
  ]);

  return { theme: mergedTheme };
};
