import { useEffect, useMemo } from "react";
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
import { chainFilterAtom, defaultSwapSettings, swapSettingsAtom } from "@/state/swapPage";
import { routeConfigAtom } from "@/state/route";
import {
  walletConnectAtom,
  getConnectedSignersAtom,
  connectedAddressesAtom,
} from "@/state/wallets";
import { WidgetProps } from "./Widget";
import { callbacksAtom } from "@/state/callbacks";
import { getBrandButtonTextColor } from "@/utils/colors";
import { initSentry } from "./initSentry";
// import { version } from "../../package.json";
// import { setTag } from "@sentry/react";

export const useInitWidget = (props: WidgetProps) => {
  if (props.enableSentrySessionReplays) {
    initSentry();
  }
  // setTag("widget_version", version);
  useInitDefaultRoute(props.defaultRoute);
  useInitGetSigners(props);

  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  const setSwapSettings = useSetAtom(swapSettingsAtom);
  const setRouteConfig = useSetAtom(routeConfigAtom);
  const setChainFilter = useSetAtom(chainFilterAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);
  const setWalletConnect = useSetAtom(walletConnectAtom);
  const setCallbacks = useSetAtom(callbacksAtom);

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
      endpointOptions: fromWidgetProps.endpointOptions ?? defaultSkipClientConfig.endpointOptions,
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

    if ((props.theme as Theme)?.brandTextColor === undefined) {
      theme.brandTextColor = getBrandButtonTextColor(theme.brandColor);
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

    const callbacks = {
      onWalletConnected: props.onWalletConnected,
      onWalletDisconnected: props.onWalletDisconnected,
      onTransactionBroadcasted: props.onTransactionBroadcasted,
      onTransactionComplete: props.onTransactionComplete,
      onTransactionFailed: props.onTransactionFailed,
    };

    if (Object.values(callbacks).some((callback) => callback !== undefined)) {
      setCallbacks(callbacks);
    }
  }, [
    props.onTransactionFailed,
    props.onTransactionComplete,
    props.onTransactionBroadcasted,
    props.onWalletDisconnected,
    props.onWalletConnected,
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
    setCallbacks,
  ]);

  return { theme: mergedTheme };
};

const useInitGetSigners = (props: Partial<WidgetProps>) => {
  const setGetSigners = useSetAtom(getConnectedSignersAtom);
  const setInjectedAddresses = useSetAtom(connectedAddressesAtom);

  // Update injected addresses whenever `connectedAddresses` changes
  useEffect(() => {
    setInjectedAddresses(props.connectedAddresses);
  }, [props.connectedAddresses, setInjectedAddresses]);

  // Update all signers together whenever any of them changes
  useEffect(() => {
    setGetSigners((prev) => ({
      ...prev,
      ...(props.getCosmosSigner && { getCosmosSigner: props.getCosmosSigner }),
      ...(props.getEVMSigner && { getEVMSigner: props.getEVMSigner }),
      ...(props.getSVMSigner && { getSVMSigner: props.getSVMSigner }),
    }));
  }, [props.getCosmosSigner, props.getEVMSigner, props.getSVMSigner, setGetSigners]);
};
