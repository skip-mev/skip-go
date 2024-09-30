import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { createModal, useModal } from "@/components/Modal";
import { cloneElement, ReactElement, useEffect, createElement } from "react";
import { defaultTheme, PartialTheme } from "./theme";
import { Router } from "./Router";
import { useResetAtom } from "jotai/utils";
import { numberOfModalsOpenAtom } from "@/state/modal";
import { useAtom, useSetAtom } from "jotai";
import { skipClientConfigAtom, themeAtom } from "@/state/skipClient";
import { SkipClientOptions } from "@skip-go/client";
import { useInitializeDebouncedValues } from "@/hooks/useInitializeDebouncedValues";
import { setup, styled } from "goober";

export type SwapWidgetProps = {
  theme?: PartialTheme;
} & SkipClientOptions;

export const SwapWidget = ({ theme, ...skipClientConfig }: SwapWidgetProps) => {
  useInitializeDebouncedValues();
  const [defaultSkipClientConfig, setSkipClientConfig] = useAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  useEffect(() => {
    setSkipClientConfig({
      ...defaultSkipClientConfig,
      ...skipClientConfig,
    });
    setTheme({ ...defaultTheme, ...theme });
  }, [defaultSkipClientConfig, setSkipClientConfig, setTheme, skipClientConfig, theme]);

  useEffect(() => {
    setup(createElement, undefined, () => ({ ...defaultTheme, ...theme }));
  }, [theme]);

  return (
    <NiceModal.Provider>
      <ShadowDomAndProviders theme={theme}>
        <WidgetContainer>
          <Router />
        </WidgetContainer>
      </ShadowDomAndProviders>
    </NiceModal.Provider>
  );
};

const SwapWidgetWithoutNiceModalProvider = ({ theme, ...skipClientConfig }: SwapWidgetProps) => {
  useInitializeDebouncedValues();
  const [defaultSkipClientConfig, setSkipClientConfig] = useAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  useEffect(() => {
    setSkipClientConfig({
      ...defaultSkipClientConfig,
      ...skipClientConfig,
    });
    setTheme({ ...defaultTheme, ...theme });
  }, [defaultSkipClientConfig, setSkipClientConfig, setTheme, skipClientConfig, theme]);

  useEffect(() => {
    setup(createElement, undefined, () => ({ ...defaultTheme, ...theme }));
  }, [theme]);

  return (
    <ShadowDomAndProviders theme={theme}>
      <WidgetContainer>
        <Router />
      </WidgetContainer>
    </ShadowDomAndProviders>
  );
};

export type ShowSwapWidget = {
  button?: ReactElement;
} & SwapWidgetProps;

export const ShowSwapWidget = ({
  button = <button>show widget</button>,
  ...props
}: ShowSwapWidget) => {
  const modal = useModal(
    createModal(() => <SwapWidgetWithoutNiceModalProvider {...props} />)
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

const WidgetContainer = styled("div")`
  width: 480px;
  position: relative;
`;
