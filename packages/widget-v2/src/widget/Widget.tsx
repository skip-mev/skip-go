import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal, useModal } from "@/components/Modal";
import { cloneElement, ReactElement, useEffect } from "react";
import { PartialTheme } from "./theme";
import { Router } from "./Router";
import { useResetAtom } from "jotai/utils";
import { numberOfModalsOpenAtom } from "@/state/modal";
import { useSetAtom } from "jotai";
import { skipClientConfigAtom } from "@/state/skipClient";
import { SkipClientOptions } from "@skip-go/client";

export type SwapWidgetProps = {
  theme?: PartialTheme;
} & SkipClientOptions;

export const SwapWidget = ({ theme, ...skipClientConfig }: SwapWidgetProps) => {
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  useEffect(() => {
    setSkipClientConfig(skipClientConfig);
  }, [setSkipClientConfig, skipClientConfig]);

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
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  useEffect(() => {
    setSkipClientConfig(skipClientConfig);
  }, [setSkipClientConfig, skipClientConfig]);

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
