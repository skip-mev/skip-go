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
import { chainFilterAtom, swapSettingsAtom } from "@/state/swapPage";
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
import { version } from "../../package.json";
import { setTag } from "@sentry/react";
import { useMobileRouteConfig } from "@/hooks/useMobileRouteConfig";
import { simulateTxAtom } from "@/state/swapExecutionPage";
import { initAmplitude } from "./initAmplitude";
import { disableShadowDomAtom } from "./ShadowDomAndProviders";
import { ibcEurekaHighlightedAssetsAtom } from "@/state/ibcEurekaHighlightedAssets";
import { assetSymbolsSortedToTopAtom } from "@/state/assetSymbolsSortedToTop";

export const useInitWidget = (props: WidgetProps) => {
  if (props.enableSentrySessionReplays) {
    initSentry();
  }
  if (props.enableAmplitudeAnalytics) {
    initAmplitude();
  }
  setTag("widget_version", version);
  useInitDefaultRoute(props.defaultRoute);
  useInitGetSigners(props);
  useMobileRouteConfig();

  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  const setSwapSettings = useSetAtom(swapSettingsAtom);
  const setRouteConfig = useSetAtom(routeConfigAtom);
  const setChainFilter = useSetAtom(chainFilterAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);
  const setWalletConnect = useSetAtom(walletConnectAtom);
  const setCallbacks = useSetAtom(callbacksAtom);
  const setSimulateTx = useSetAtom(simulateTxAtom);
  const setDisableShadowDom = useSetAtom(disableShadowDomAtom);
  const setIbcEurekaHighlightedAssets = useSetAtom(ibcEurekaHighlightedAssetsAtom);
  const setAssetSymbolsSortedToTop = useSetAtom(assetSymbolsSortedToTopAtom);

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

    if ((props.theme as Theme)?.brandTextColor === undefined && typeof document !== "undefined") {
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
      setSwapSettings((prev) => ({
        ...prev,
        ...props.settings,
      }));
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

    setOnlyTestnets(props.onlyTestnet ?? false);

    if (props.walletConnect) {
      setWalletConnect(props.walletConnect);
    }
    if (props.simulate !== undefined) {
      setSimulateTx(props.simulate);
    }
    if (props.disableShadowDom !== undefined) {
      setDisableShadowDom(props.disableShadowDom);
    }

    if (props.ibcEurekaHighlightedAssets) {
      setIbcEurekaHighlightedAssets(props.ibcEurekaHighlightedAssets);
    }

    if (props.assetSymbolsSortedToTop) {
      setAssetSymbolsSortedToTop(props.assetSymbolsSortedToTop);
    }

    const callbacks = {
      onWalletConnected: props.onWalletConnected,
      onWalletDisconnected: props.onWalletDisconnected,
      onTransactionBroadcasted: props.onTransactionBroadcasted,
      onTransactionComplete: props.onTransactionComplete,
      onTransactionFailed: props.onTransactionFailed,
      onRouteUpdated: props.onRouteUpdated,
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
    props.simulate,
    setChainFilter,
    setOnlyTestnets,
    setRouteConfig,
    setSwapSettings,
    setWalletConnect,
    setCallbacks,
    setSimulateTx,
    props.onRouteUpdated,
    props.disableShadowDom,
    setDisableShadowDom,
    props.ibcEurekaHighlightedAssets,
    setIbcEurekaHighlightedAssets,
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
