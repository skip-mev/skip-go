import { ComponentType, ReactNode, useEffect, useMemo, useState } from "react";
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

  const [shadowRoot, setShadowRoot] = useState<ShadowRoot>();

  const onShadowDomLoaded = (element: HTMLDivElement) => {
    if (shadowRoot === undefined && element?.shadowRoot) {
      setShadowRoot(element?.shadowRoot);
    }
  };

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
        {shadowRoot && (
          <StyleSheetManager shouldForwardProp={shouldForwardProp} target={shadowRoot}>
            <ThemeProvider theme={mergedThemes}>{children}</ThemeProvider>
          </StyleSheetManager>
        )}
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
