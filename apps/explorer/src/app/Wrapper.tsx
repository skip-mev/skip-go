"use client";
import { defaultTheme, lightTheme } from "@skip-go/widget";
import { ShadowDomAndProviders } from "@skip-go/widget/ui";
import { useLocalStorage, useIsClient } from "@uidotdev/usehooks";


export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useLocalStorage<"dark" | "light">(
    "explorer-theme",
    "dark"
  );
   const isClient = useIsClient()

  if (isClient === false) {
    return null
  }

  return (
    <ShadowDomAndProviders theme={theme === "dark" ? defaultTheme : lightTheme}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100vw",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url('${
            theme === "dark" ? "/gobg-dark.svg" : "/gobg-light.svg"
          }')`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      >
        {children}
      </div>
    </ShadowDomAndProviders>
  );
};

export const ToggleThemeButton = () => {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">(
    "explorer-theme",
    "dark"
  );

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        padding: "8px 16px",
        backgroundColor: theme === "dark" ? "#fff" : "#000",
        color: theme === "dark" ? "#000" : "#fff",
        borderRadius: 4,
      }}
    >
      Toggle Theme
    </button>
  );
}
