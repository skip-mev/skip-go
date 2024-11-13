import { useEffect } from "react";
import regular from "@/fonts/ABCDiatype-Regular.woff2";
import medium from "@/fonts/ABCDiatype-Medium.woff2";
import bold from "@/fonts/ABCDiatype-Bold.woff2";
import monospace from "@/fonts/ABCDiatypeMono-Medium.woff2";

export const fonts = `
  @font-face {
    font-family: ABCDiatype;
    font-weight: 400;
    src: url(${regular}) format(woff2);
  }
  @font-face {
    font-family: ABCDiatype;
    font-weight: 500;
    src: url(${medium}) format(woff2);
  }
  @font-face {
    font-family: ABCDiatype;
    font-weight: 700;
    src: url(${bold}) format(woff2);
  }
  @font-face {
    font-family: ABCDiatype-mono;
    font-weight: 500;
    src: url(${monospace}) format(woff2);
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
