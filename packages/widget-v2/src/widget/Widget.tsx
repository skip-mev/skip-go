import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal, useModal } from "@/components/Modal";
import { cloneElement, ReactElement, useEffect } from "react";
import { defaultTheme, PartialTheme } from "./theme";
import { Router } from "./Router";
import { useResetAtom } from "jotai/utils";
import { numberOfModalsOpenAtom } from "@/state/modal";
import { useAtom, useSetAtom } from "jotai";
import { skipClientConfigAtom, themeAtom } from "@/state/skipClient";
import { SkipClientOptions } from "@skip-go/client";

export type SwapWidgetProps = {
  theme?: PartialTheme;
} & SkipClientOptions;

export const SwapWidget = ({ theme, ...skipClientConfig }: SwapWidgetProps) => {
  const [defaultSkipClientConfig, setSkipClientConfig] = useAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  useEffect(() => {
    setSkipClientConfig({
      ...defaultSkipClientConfig,
      ...skipClientConfig,
    });
    setTheme({ ...defaultTheme, ...theme });
  }, [defaultSkipClientConfig, setSkipClientConfig, setTheme, skipClientConfig, theme]);

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
  const [defaultSkipClientConfig, setSkipClientConfig] = useAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  useEffect(() => {
    setSkipClientConfig({
      ...defaultSkipClientConfig,
      ...skipClientConfig,
    });
    setTheme({ ...defaultTheme, ...theme });
  }, [defaultSkipClientConfig, setSkipClientConfig, setTheme, skipClientConfig, theme]);

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

const WidgetContainer = styled.div`
  width: 480px;
  position: relative;
`;
