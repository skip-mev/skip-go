import { useState, useEffect } from "react";

export const useIsMobileScreenSize = (size = 767) => {
  const [isMobileScreenSize, setIsMobileScreenSize] = useState(
    typeof window !== "undefined" && window.innerWidth <= size,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      const isMobileScreenSize = window?.innerWidth <= size;
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
