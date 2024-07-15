import { ReactNode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StyleSheetManager, withTheme, ThemeProvider } from 'styled-components';
import { Scope } from 'react-shadow-scope';
import shadowDomStyles from '../styles/shadowDomStyles.css';
import toastStyles from '../styles/toastStyles.css';
import { useInjectFontsToDocumentHead } from '../hooks/use-inject-fonts-to-document-head';

export const WithStyledShadowDom = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useInjectFontsToDocumentHead();
  useEffect(() => {
    setIsClient(true);
  }, []);

  let styles = '';

  const GenerateStyles = (props) => {
    const container = document.createElement('div');
    const target = document.createElement('div');

    const GenerateStyleSheetManager = ({
      resolve,
    }: {
      resolve: (value?: any) => void;
    }) => {
      useEffect(() => {
        //@ts-ignore
        styles = target.firstChild?.innerHTML;
        resolve();
      });

      return <StyleSheetManager target={target}>{children}</StyleSheetManager>;
    };

    if (!styles) {
      const promise = new Promise((resolve) => {
        createRoot(container).render(
          <GenerateStyleSheetManager resolve={resolve} />
        );
      });

      throw promise;
    }

    return props.children({ styles });
  };

  return isClient ? (
    <div>
      <Suspense fallback={null}>
        <GenerateStyles>
          {({ styles }) => (
            <Scope>
              <div>
                <style>
                  {toastStyles}
                  {shadowDomStyles}
                  {styles}
                </style>
                {children}
              </div>
            </Scope>
          )}
        </GenerateStyles>
      </Suspense>
    </div>
  ) : null;
};
