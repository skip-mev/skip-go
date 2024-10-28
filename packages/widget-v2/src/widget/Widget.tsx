import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal, useModal } from "@/components/Modal";
import {
  cloneElement,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { defaultTheme, lightTheme, PartialTheme, Theme } from "./theme";
import { Router } from "./Router";
import { useResetAtom } from "jotai/utils";
import { numberOfModalsOpenAtom } from "@/state/modal";
import { useAtom, useSetAtom } from "jotai";
import {
  skipAssetsAtom,
  skipClientConfigAtom,
  themeAtom,
  defaultSkipClientConfig,
} from "@/state/skipClient";
import { SkipClientOptions } from "@skip-go/client";
import {
  destinationAssetAmountAtom,
  destinationAssetAtom,
  sourceAssetAmountAtom,
  sourceAssetAtom,
} from "@/state/swapPage";

export type DefaultRouteConfig = {
  amountIn?: number;
  amountOut?: number;
  srcChainId?: string;
  srcAssetDenom?: string;
  destChainId?: string;
  destAssetDenom?: string;
};

export type WidgetProps = {
  theme?: PartialTheme | "light" | "dark";
  brandColor?: string;
  defaultRoute?: DefaultRouteConfig;
} & SkipClientOptions;

export const Widget = (props: WidgetProps) => {
  return (
    <NiceModal.Provider>
      <WidgetWithoutNiceModalProvider {...props} />
    </NiceModal.Provider>
  );
};

const WidgetWithoutNiceModalProvider = (props: WidgetProps) => {
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  const setSourceAsset = useSetAtom(sourceAssetAtom);
  const setDestinationAsset = useSetAtom(destinationAssetAtom);
  const setSourceAssetAmount = useSetAtom(sourceAssetAmountAtom);
  const setDestinationAssetAmount = useSetAtom(destinationAssetAmountAtom);

  const [{ data: assets }] = useAtom(skipAssetsAtom);

  const getClientAsset = useCallback(
    (denom?: string, chainId?: string) => {
      if (!denom || !chainId) return;
      if (!assets) return;
      return assets.find((a) => a.denom === denom && a.chainID === chainId);
    },
    [assets]
  );

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
    if (props.defaultRoute && assets) {
      const {
        srcAssetDenom,
        srcChainId,
        destAssetDenom,
        destChainId,
        amountIn,
        amountOut,
      } = props.defaultRoute;
      const sourceAsset = getClientAsset(srcAssetDenom, srcChainId);
      const destinationAsset = getClientAsset(destAssetDenom, destChainId);
      setDestinationAsset({
        ...destinationAsset,
        amount: amountOut?.toString(),
      });
      setSourceAsset({
        ...sourceAsset,
        amount: amountIn?.toString(),
      });
      if (amountIn) {
        setSourceAssetAmount(amountIn?.toString());
      } else if (amountOut) {
        setDestinationAssetAmount(amountOut?.toString());
      }
    }
  }, [
    props,
    assets,
    setSkipClientConfig,
    mergedSkipClientConfig,
    setTheme,
    mergedTheme,
    getClientAsset,
    setDestinationAsset,
    setSourceAsset,
    setSourceAssetAmount,
    setDestinationAssetAmount,
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
