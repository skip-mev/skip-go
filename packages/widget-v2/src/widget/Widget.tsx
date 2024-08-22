import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal, useModal } from "@/components/Modal";
import { cloneElement, ReactElement } from "react";
import { PartialTheme } from "./theme";
import { Router } from "./Router";
import { useResetAtom } from "jotai/utils";
import { numberOfModalsOpenAtom } from "@/state/modal";

export type SwapWidgetProps = {
  theme?: PartialTheme;
};

export const SwapWidget = (props: SwapWidgetProps) => {
  return (
    <NiceModal.Provider>
      <ShadowDomAndProviders {...props}>
        <WidgetContainer>
          <Router />
        </WidgetContainer>
      </ShadowDomAndProviders>
    </NiceModal.Provider>
  );
};

const SwapWidgetWithoutNiceModalProvider = (props: SwapWidgetProps) => {
  return (
    <ShadowDomAndProviders {...props}>
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
