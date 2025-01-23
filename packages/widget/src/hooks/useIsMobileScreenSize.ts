import { useState, useEffect } from "react";

export const MAX_MOBILE_SCREEN_WIDTH = 767;

export const useIsMobileScreenSize = () => {
  const [isMobileScreenSize, setIsMobileScreenSize] = useState(
    window?.innerWidth <= MAX_MOBILE_SCREEN_WIDTH,
  );

  useEffect(() => {
    const handleResize = () => {
      const isMobileScreenSize = window?.innerWidth <= MAX_MOBILE_SCREEN_WIDTH;
      setIsMobileScreenSize(isMobileScreenSize);
    };

    handleResize();

    window?.addEventListener("resize", handleResize);

    return () => {
      window?.removeEventListener("resize", handleResize);
    };
  }, []);
  return isMobileScreenSize;
};
