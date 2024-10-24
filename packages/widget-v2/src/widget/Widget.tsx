import { ShadowDomAndProviders } from "./ShadowDomAndProviders";
import NiceModal from "@ebay/nice-modal-react";
import { styled } from "styled-components";
import { createModal, useModal } from "@/components/Modal";
import { cloneElement, ReactElement, useEffect, useMemo } from "react";
import { defaultTheme, PartialTheme } from "./theme";
import { Router } from "./Router";
import { useResetAtom } from "jotai/utils";
import { numberOfModalsOpenAtom } from "@/state/modal";
import { useAtom, useSetAtom } from "jotai";
import { defaultSkipClientConfig, skipClientConfigAtom, themeAtom } from "@/state/skipClient";
import { SkipClientOptions } from "@skip-go/client";

export type WidgetProps = {
  theme?: PartialTheme;
} & SkipClientOptions;

export const Widget = (props: WidgetProps) => {
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  const mergedSkipClientConfig = useMemo(
    () => {
      const { theme, ...skipClientConfig } = props;

      return {
        ...defaultSkipClientConfig,
        ...skipClientConfig,
      };
    },
    [props]
  );

  const mergedTheme = useMemo(() => ({ ...defaultTheme, ...props.theme }), [props.theme]);

  useEffect(() => {
    setSkipClientConfig(mergedSkipClientConfig);
    setTheme(mergedTheme);
  }, [mergedSkipClientConfig, mergedTheme, setSkipClientConfig, setTheme]);

  return (
    <NiceModal.Provider>
      <ShadowDomAndProviders theme={mergedTheme}>
        <WidgetContainer>
          <Router />
        </WidgetContainer>
      </ShadowDomAndProviders>
    </NiceModal.Provider>
  );
};

const WidgetWithoutNiceModalProvider = (props: WidgetProps) => {
  const setSkipClientConfig = useSetAtom(skipClientConfigAtom);
  const setTheme = useSetAtom(themeAtom);
  const mergedSkipClientConfig = useMemo(
    () => {
      const { theme, ...skipClientConfig } = props;

      return {
        ...defaultSkipClientConfig,
        ...skipClientConfig,
      };
    },
    [props]
  );

  const mergedTheme = useMemo(() => ({ ...defaultTheme, ...props.theme }), [props.theme]);

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
