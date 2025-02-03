import { ComponentType, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { useCSS, Scope } from "react-shadow-scope";
import { defaultTheme, PartialTheme } from "./theme";
import isPropValid from "@emotion/is-prop-valid";
import { useInjectFontsToDocumentHead } from "@/hooks/useInjectFontsToDocumentHead";
import { globalStyles } from "./globalStyles";

function shouldForwardProp(propName: string, target: string | ComponentType<unknown>) {
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
  const css = useCSS();

  const [, setShadowDom] = useState<HTMLElement>();
  const [styledComponentContainer, setStyledComponentContainer] = useState<HTMLElement>();

  const onShadowDomLoaded = useCallback((element: HTMLDivElement) => {
    setShadowDom(element);
  }, []);

  const onStyledComponentContainerLoaded = useCallback((element: HTMLDivElement) => {
    setStyledComponentContainer(element);
  }, []);

  const mergedThemes = useMemo(() => {
    return {
      ...defaultTheme,
      ...theme,
    };
  }, [theme]);

  return (
    <ClientOnly>
      <Scope
        ref={onShadowDomLoaded}
        stylesheet={css`
          ${globalStyles}
        `}
      >
        <div ref={onStyledComponentContainerLoaded}></div>
        <StyleSheetManager shouldForwardProp={shouldForwardProp} target={styledComponentContainer}>
          <ThemeProvider theme={mergedThemes}>{children}</ThemeProvider>
        </StyleSheetManager>
      </Scope>
    </ClientOnly>
  );
};

export const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return <>{isHydrated ? children : null}</>;
};
