import { ReactNode, useCallback, useEffect, useState } from 'react';
import { StyleSheetManager } from 'styled-components';
import shadowDomStyles from '../styles/shadowDomStyles.css';
import toastStyles from '../styles/toastStyles.css';
import cssReset from '../styles/cssReset.css';
import { useInjectFontsToDocumentHead } from '../hooks/use-inject-fonts-to-document-head';
import { Scope } from 'react-shadow-scope';

const stopPropagation = (e: Event) => e.stopPropagation();

export const WithStyledShadowDom = ({ children }: { children: ReactNode }) => {
  useInjectFontsToDocumentHead();
  const [shadowDom, setShadowDom] = useState<HTMLElement>();
  const [styledComponentContainer, setStyledComponentContainer] =
    useState<HTMLElement>();

  const onShadowDomLoaded = useCallback((element: HTMLDivElement) => {
    setShadowDom(element);
    element?.addEventListener('wheel', stopPropagation, true);
    element?.addEventListener('touchmove', stopPropagation, true);
  }, []);

  const onStyledComponentContainerLoaded = useCallback(
    (element: HTMLDivElement) => {
      setStyledComponentContainer(element);
    },
    []
  );

  useEffect(() => {
    return () => {
      shadowDom?.removeEventListener('wheel', stopPropagation, true);
      shadowDom?.removeEventListener('touchmove', stopPropagation, true);
    };
  }, []);

  return (
    <Scope
      stylesheets={[cssReset, shadowDomStyles, toastStyles]}
      config={{ dsd: 'emulated' }}
      ref={onShadowDomLoaded}
    >
      <div ref={onStyledComponentContainerLoaded}></div>
      <StyleSheetManager target={styledComponentContainer}>
        {children}
      </StyleSheetManager>
    </Scope>
  );
};
