import { ComponentType, ReactNode, useEffect, useMemo, useState } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { Scope } from "react-shadow-scope";
import { defaultTheme, PartialTheme } from "./theme";
import isPropValid from "@emotion/is-prop-valid";
import { useInjectFontsToDocumentHead } from "@/hooks/useInjectFontsToDocumentHead";
import { atom, useAtomValue } from "jotai";

function shouldForwardProp(propName: string, target: string | ComponentType<unknown>) {
  if (typeof target === "string") {
    return isPropValid(propName);
  }
  return true;
}

export const disableShadowDomAtom = atom<boolean>(false);

export const ShadowDomAndProviders = ({
  children,
  theme,
  disableShadowDom,
}: {
  children: ReactNode;
  theme?: PartialTheme;
  disableShadowDom?: boolean;
}) => {
  const disableShadowDomAtomValue = useAtomValue(disableShadowDomAtom);
  if (disableShadowDom === undefined) {
    disableShadowDom = disableShadowDomAtomValue;
  }
  useInjectFontsToDocumentHead();

  const [localShadowRoot, setLocalShadowRoot] = useState<ShadowRoot>();

  const onShadowDomLoaded = (element: HTMLDivElement) => {
    if (!element?.shadowRoot) return;
    if (!localShadowRoot) {
      setLocalShadowRoot(element?.shadowRoot);
    }
  };

  const mergedThemes = useMemo(() => {
    return {
      ...defaultTheme,
      ...theme,
    };
  }, [theme]);

  if (disableShadowDom) {
    return (
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <ThemeProvider theme={mergedThemes}>{children}</ThemeProvider>
      </StyleSheetManager>
    );
  }

  return (
    <ClientOnly>
      <Scope ref={onShadowDomLoaded}>
        {localShadowRoot && (
          <StyleSheetManager shouldForwardProp={shouldForwardProp} target={localShadowRoot}>
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
