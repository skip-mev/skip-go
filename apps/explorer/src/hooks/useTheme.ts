import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("light");
      } else {
        setTheme("dark");
      }

      window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (event) => {
        const newColorScheme = event.matches ? "light" : "dark";
        setTheme(newColorScheme);
      });
    }
  }, []);

  return theme;
}
