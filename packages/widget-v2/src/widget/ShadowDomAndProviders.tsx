import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { Scope } from 'react-shadow-scope';
import { defaultTheme, PartialTheme } from './theme';
import { createGlobalStyle } from 'styled-components';
import regular from '../fonts/ABCDiatype-Regular.woff2';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import isPropValid from '@emotion/is-prop-valid';

export const queryClient = new QueryClient();

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: ABCDiatype;
    src: url(${regular}) format(woff2);
  }

  * {
    font-family: 'ABCDiatype', sans-serif;
  }
  div {
    box-sizing: border-box;
  }
`;

function shouldForwardProp(propName: string, target: any) {
  if (typeof target === 'string') {
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
  const [isClient, setIsClient] = useState<boolean>(false);

  const [shadowDom, setShadowDom] = useState<HTMLElement>();
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
  }, [defaultTheme, theme]);

  return isClient ? (
    <Scope ref={onShadowDomLoaded}>
      <div ref={onStyledComponentContainerLoaded}></div>
      <StyleSheetManager
        shouldForwardProp={shouldForwardProp}
        target={styledComponentContainer}
      >
        <GlobalStyles />
        <ThemeProvider theme={mergedThemes}>
          <QueryClientProvider client={queryClient} key={'skip-widget'}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </StyleSheetManager>
    </Scope>
  ) : null;
};
