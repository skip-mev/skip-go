import {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { Scope } from "react-shadow-scope";
import { defaultTheme, PartialTheme } from "./theme";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import isPropValid from "@emotion/is-prop-valid";
import { WalletProviders } from "@/providers/WalletProviders";
import { useInjectFontsToDocumentHead } from "@/hooks/useInjectFontsToDocumentHead";
import { globalStyles } from "./globalStyles";
export const queryClient = new QueryClient();

function shouldForwardProp(
  propName: string,
  target: string | ComponentType<unknown>
) {
  if (typeof target === "string") {
    return isPropValid(propName);
  }
  return true;
}

export const ShadowDomAndProviders = ({
  children,
  theme,
}: {
  children: ReactNode;
  theme?: PartialTheme;
}) => {
  useInjectFontsToDocumentHead();
  const [isClient, setIsClient] = useState<boolean>(false);

  const [, setShadowDom] = useState<HTMLElement>();
  const [styledComponentContainer, setStyledComponentContainer] =
    useState<HTMLElement>();

  const onShadowDomLoaded = useCallback((element: HTMLDivElement) => {
    setShadowDom(element);
  }, []);

  const onStyledComponentContainerLoaded = useCallback(
    (element: HTMLDivElement) => {
      setStyledComponentContainer(element);
    },
    []
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const mergedThemes = useMemo(() => {
    return {
      ...defaultTheme,
      ...theme,
    };
  }, [theme]);

  return isClient ? (
    <Scope ref={onShadowDomLoaded} stylesheet={globalStyles}>
      <div ref={onStyledComponentContainerLoaded}></div>
      <StyleSheetManager
        shouldForwardProp={shouldForwardProp}
        target={styledComponentContainer}
      >
        <ThemeProvider theme={mergedThemes}>
          <WalletProviders>
            <QueryClientProvider client={queryClient} key={"skip-widget"}>
              {children}
            </QueryClientProvider>
          </WalletProviders>
        </ThemeProvider>
      </StyleSheetManager>
    </Scope>
  ) : null;
};
