"use client";
import React from "react";
import { defaultTheme, lightTheme } from "@/widget/theme";
import { ShadowDomAndProviders } from "@/widget/ShadowDomAndProviders";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useIsClient } from "@uidotdev/usehooks";
import { QueryProvider } from "../components/QueryProvider";
import "../utils/skipClientConfig";
import { Provider } from "jotai";
import { jotaiStore } from "@/widget/Widget";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <QueryProvider>
        <Provider store={jotaiStore}>
          <Wrapper>
            {children}
            <ToggleThemeButton />
          </Wrapper>
        </Provider>
      </QueryProvider>
    </ClientOnly>
  );
}

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useLocalStorage<"dark" | "light">("explorer-theme", "dark");
  return (
    <ShadowDomAndProviders disableShadowDom theme={theme === "dark" ? defaultTheme : lightTheme}>
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
};

type ClientOnlyProps = {
  children: React.ReactNode;
};

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const isClient = useIsClient();

  // Render children if on client side, otherwise return null
  return isClient ? <>{children}</> : null;
};
