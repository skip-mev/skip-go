import { useEffect } from 'react';
import { fonts } from '../styles/fonts';

export const useInjectFontsToDocumentHead = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = fonts;

    if (!document.head.contains(styleElement)) {
      document.head.appendChild(styleElement);
    }

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
};
