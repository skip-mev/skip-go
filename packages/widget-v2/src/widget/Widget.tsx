import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal, useModal } from "@/components/Modal";
import { cloneElement, ReactElement, useEffect, useMemo } from "react";
import { defaultTheme, lightTheme, PartialTheme, Theme } from "./theme";
import { Router } from "./Router";
import { useResetAtom } from "jotai/utils";
import { numberOfModalsOpenAtom } from "@/state/modal";
import { useAtom, useSetAtom } from "jotai";
import { skipClientConfigAtom, themeAtom } from "@/state/skipClient";
import { SkipClientOptions } from "@skip-go/client";

export type WidgetProps = {
  theme?: PartialTheme | "light" | "dark";
  brandColor?: string;
} & SkipClientOptions;

export const Widget = (props: WidgetProps) => {
  return (
    <NiceModal.Provider>
      <WidgetWithoutNiceModalProvider {...props} />
    </NiceModal.Provider>
  );
};

const WidgetWithoutNiceModalProvider = (props: WidgetProps) => {
  const [defaultSkipClientConfig, setSkipClientConfig] = useAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  const mergedSkipClientConfig = useMemo(
    () => {
      const { theme, ...skipClientConfig } = props;

      return {
        ...defaultSkipClientConfig,
        ...skipClientConfig,
      };
    },
    [defaultSkipClientConfig, props]
  );

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
  }, [mergedSkipClientConfig, mergedTheme, setSkipClientConfig, setTheme]);

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
