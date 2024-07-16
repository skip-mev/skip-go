import { ReactNode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StyleSheetManager } from 'styled-components';
import shadowDomStyles from '../styles/shadowDomStyles.css';
import toastStyles from '../styles/toastStyles.css';
import { useInjectFontsToDocumentHead } from '../hooks/use-inject-fonts-to-document-head';

export const WithStyledShadowDom = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const entrypoint = useRef<HTMLDivElement>(null);

  useInjectFontsToDocumentHead();
  useEffect(() => {
    setIsClient(true);

    const wrapper = document.createElement('div');
    const shadowRoot = wrapper.attachShadow({ mode: 'open' });

    const styleContainer = document.createElement('div');
    const appContainer = document.createElement('div');
    const hostStyle = document.createElement('style');
    hostStyle.textContent = `
      ${toastStyles}
      ${shadowDomStyles}
    `;

    shadowRoot.appendChild(hostStyle);
    shadowRoot.appendChild(styleContainer);
    shadowRoot.appendChild(appContainer);

    const Root = ({ children }: { children?: ReactNode }) => {
      useEffect(() => {
        const stopPropagation = (e: Event) => e.stopPropagation();

        wrapper?.shadowRoot?.addEventListener('wheel', stopPropagation, true);
        wrapper?.shadowRoot?.addEventListener(
          'touchmove',
          stopPropagation,
          true
        );
        return () => {
          wrapper?.shadowRoot?.removeEventListener(
            'wheel',
            stopPropagation,
            true
          );
          wrapper?.shadowRoot?.removeEventListener(
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

    const renderComponent = () => {
      if (hasRendered) return;

      if (entrypoint.current) {
        createRoot(appContainer).render(<Root>{children}</Root>);
        entrypoint.current.appendChild(wrapper);
        setHasRendered(true);
      } else {
        setTimeout(renderComponent, 100);
      }
    };

    renderComponent();

    return () => {
      wrapper.remove();
    };
  }, [children, hasRendered, entrypoint]);

  return isClient ? <div ref={entrypoint}></div> : null;
};
