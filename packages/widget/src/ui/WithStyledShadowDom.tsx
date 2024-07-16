import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import shadowDomStyles from '../styles/shadowDomStyles.css';
import toastStyles from '../styles/toastStyles.css';
import cssReset from '../styles/cssReset.css';
import { useInjectFontsToDocumentHead } from '../hooks/use-inject-fonts-to-document-head';

export const WithStyledShadowDom = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useInjectFontsToDocumentHead();

  const onRefLoaded = useCallback((element: HTMLDivElement) => {
    if (element !== null) {
      const shadowRoot = element.attachShadow({ mode: 'open' });

      const styleContainer = document.createElement('div');
      const appContainer = document.createElement('div');
      const hostStyle = document.createElement('style');
      hostStyle.textContent = `
        ${cssReset}
        ${toastStyles}
        ${shadowDomStyles}
      `;

      shadowRoot.appendChild(hostStyle);
      shadowRoot.appendChild(styleContainer);
      shadowRoot.appendChild(appContainer);

      const Root = ({ children }: { children?: ReactNode }) => {
        useEffect(() => {
          const stopPropagation = (e: Event) => e.stopPropagation();

          element?.shadowRoot?.addEventListener('wheel', stopPropagation, true);
          element?.shadowRoot?.addEventListener(
            'touchmove',
            stopPropagation,
            true
          );
          return () => {
            element?.shadowRoot?.removeEventListener(
              'wheel',
              stopPropagation,
              true
            );
            element?.shadowRoot?.removeEventListener(
              'touchmove',
              stopPropagation,
              true
            );
          };
        }, []);
        return (
          <StyleSheetManager target={styleContainer}>
            {children}
          </StyleSheetManager>
        );
      };

      createRoot(appContainer).render(<Root>{children}</Root>);
    }
  }, []);

  return isClient ? <div ref={onRefLoaded}></div> : null;
};
