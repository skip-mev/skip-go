import { useEffect } from "react";
import regular from "@/fonts/ABCDiatype-Regular.woff2";

export const fonts = `
  @font-face {
    font-family: ABCDiatype;
    src: url(${regular}) format(woff2);
  }
`;

export const useInjectFontsToDocumentHead = () => {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = fonts;

    if (!document.head.contains(styleElement)) {
      document.head.appendChild(styleElement);
    }

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
};
