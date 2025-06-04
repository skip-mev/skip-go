import { useEffect, useMemo } from "react";
import { defaultTheme, lightTheme, Theme } from "./theme";
import { useAtomValue, useSetAtom } from "jotai";
import {
  skipClientConfigAtom,
  themeAtom,
  defaultSkipClientConfig,
  onlyTestnetsAtom,
} from "@/state/skipClient";
import { SkipClientOptions, setClientOptions } from "@skip-go/client";
import { useInitDefaultRoute } from "./useInitDefaultRoute";
import { swapSettingsAtom } from "@/state/swapPage";
import { routeConfigAtom } from "@/state/route";
import {
  walletConnectAtom,
  getConnectedSignersAtom,
  connectedAddressesAtom,
  walletsAtom,
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
import { hideAssetsUnlessWalletTypeConnectedAtom } from "@/state/hideAssetsUnlessWalletTypeConnected";
import { filterAtom, filterOutAtom, filterOutUnlessUserHasBalanceAtom } from "@/state/filters";

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
  const setFilter = useSetAtom(filterAtom);
  const setFilterOut = useSetAtom(filterOutAtom);
  const setFilterOutUnlessUserHasBalanceAtom = useSetAtom(filterOutUnlessUserHasBalanceAtom);
  const setOnlyTestnets = useSetAtom(onlyTestnetsAtom);
  const setWalletConnect = useSetAtom(walletConnectAtom);
  const setCallbacks = useSetAtom(callbacksAtom);
  const setSimulateTx = useSetAtom(simulateTxAtom);
  const setDisableShadowDom = useSetAtom(disableShadowDomAtom);
  const setIbcEurekaHighlightedAssets = useSetAtom(ibcEurekaHighlightedAssetsAtom);
  const setAssetSymbolsSortedToTop = useSetAtom(assetSymbolsSortedToTopAtom);
  const setHideAssetsUnlessWalletTypeConnected = useSetAtom(
    hideAssetsUnlessWalletTypeConnectedAtom,
  );
  const getSigners = useAtomValue(getConnectedSignersAtom);
  const wallets = useAtomValue(walletsAtom);

  const mergedSkipClientConfig: SkipClientOptions = useMemo(() => {
    const { apiUrl, chainIdsToAffiliates, endpointOptions } = props;
    const fromWidgetProps = {
      apiUrl,
      chainIdsToAffiliates,
      endpointOptions,
    };

    // merge if not undefined
    return {
      apiUrl: fromWidgetProps.apiUrl ?? defaultSkipClientConfig.apiUrl,
      endpointOptions: fromWidgetProps.endpointOptions ?? defaultSkipClientConfig.endpointOptions,
      chainIdsToAffiliates: fromWidgetProps.chainIdsToAffiliates ?? {},
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
    setSkipClientConfig(mergedSkipClientConfig);
    setTheme(mergedTheme);
  }, [setSkipClientConfig, mergedSkipClientConfig, setTheme, mergedTheme]);

  useEffect(() => {
    setClientOptions({
      ...mergedSkipClientConfig,
      apiHeaders: { "content-type": "text/plain" },
    });
  }, [getSigners, mergedSkipClientConfig, wallets.cosmos, wallets.svm?.walletName]);

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
      setFilter(props.filter);
    }
    if (props.filterOut) {
      setFilterOut(props.filterOut);
    }
    if (props.filterOutUnlessUserHasBalance) {
      setFilterOutUnlessUserHasBalanceAtom(props.filterOutUnlessUserHasBalance);
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

    if (props.hideAssetsUnlessWalletTypeConnected) {
      setHideAssetsUnlessWalletTypeConnected(props.hideAssetsUnlessWalletTypeConnected);
    }

    const callbacks = {
      onWalletConnected: props.onWalletConnected,
      onWalletDisconnected: props.onWalletDisconnected,
      onTransactionBroadcasted: props.onTransactionBroadcasted,
      onTransactionComplete: props.onTransactionComplete,
      onTransactionFailed: props.onTransactionFailed,
      onRouteUpdated: props.onRouteUpdated,
      onSourceAndDestinationSwapped: props.onSourceAndDestinationSwapped,
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
    props.assetSymbolsSortedToTop,
    setAssetSymbolsSortedToTop,
    props.filterOut,
    setFilter,
    setFilterOut,
    props.hideAssetsUnlessWalletTypeConnected,
    setHideAssetsUnlessWalletTypeConnected,
    props.filterOutUnlessUserHasBalance,
    setFilterOutUnlessUserHasBalanceAtom,
    props.onSourceAndDestinationSwapped,
  ]);

  return { theme: mergedTheme };
};

const useInitGetSigners = (props: Partial<WidgetProps>) => {
  const setInjectedAddresses = useSetAtom(connectedAddressesAtom);
  const setGetSigners = useSetAtom(getConnectedSignersAtom);
  // Update injected addresses whenever `connectedAddresses` changes
  useEffect(() => {
    setInjectedAddresses(props.connectedAddresses);
  }, [props.connectedAddresses, setInjectedAddresses]);

  // Update all signers together whenever any of them changes
  useEffect(() => {
    setGetSigners((prev) => ({
      ...prev,
      ...(props.getCosmosSigner && { getCosmosSigner: props.getCosmosSigner }),
      ...(props.getEvmSigner && { getEvmSigner: props.getEvmSigner }),
      ...(props.getSvmSigner && { getSvmSigner: props.getSvmSigner }),
    }));
  }, [props.getCosmosSigner, props.getEvmSigner, props.getSvmSigner, setGetSigners]);
};
