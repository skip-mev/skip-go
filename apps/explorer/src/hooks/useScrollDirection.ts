import { useEffect, useState } from "react";

export function useScrollDirection({ threshold = 5 } = {}) {
  const [scrollDir, setScrollDir] = useState<"down" | "up" | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;

      // Ignore small movements
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return;
      }

      setScrollDir(currentScrollY > lastScrollY ? "down" : "up");
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDir);

    return () => {
      window.removeEventListener("scroll", updateScrollDir);
    };
  }, [threshold]);

  return scrollDir;
}
