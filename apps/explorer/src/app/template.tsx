"use client";
import React, { ReactNode, useEffect } from "react";
import { defaultTheme, lightTheme } from "@/widget/theme";
import { ShadowDomAndProviders } from "@/widget/ShadowDomAndProviders";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useIsClient } from "@uidotdev/usehooks";
import { QueryProvider } from "../components/QueryProvider";
import { Provider, jotaiStore, useSetAtom } from "@/jotai";
import { Modals, NiceModal } from "@/nice-modal";
import { AssetAndChainSelectorModal } from "@/modals/AssetAndChainSelectorModal/AssetAndChainSelectorModal";
import { themeAtom } from "@/state/skipClient";
import { ViewRawDataModal } from "../components/modals/ViewRawDataModal";
import { SearchModal } from "../components/modals/SearchModal";
import { ExplorerModals } from "../constants/modal";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <ClientOnly>
      <QueryProvider>
        <Provider store={jotaiStore}>
          <NiceModal.Provider>
            <Wrapper>
              {children}
              {/* <ToggleThemeButton /> */}
            </Wrapper>
          </NiceModal.Provider>
        </Provider>
      </QueryProvider>
    </ClientOnly>
  );
}

export const Wrapper = ({ children }: { children: ReactNode }) => {
  const [theme] = useLocalStorage<"dark" | "light">("explorer-theme", "dark");
  const setTheme= useSetAtom(themeAtom);

  useEffect(() => {
    setTheme(theme === "dark" ? defaultTheme : lightTheme);
  }, [setTheme, theme]);

  return (
    <ShadowDomAndProviders disableShadowDom theme={theme === "dark" ? defaultTheme : lightTheme}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "100vh",
          width: "100vw",
          justifyContent: "center",
          backgroundImage: `url('${
            theme === "dark" ? "/dark-bg.svg" : "/light-bg.svg"
          }')`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      >
        <RegisterModals>
          {children}
        </RegisterModals>
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

export const RegisterModals = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    NiceModal.register(Modals.AssetAndChainSelectorModal, AssetAndChainSelectorModal);
    NiceModal.register(ExplorerModals.ViewRawDataModal, ViewRawDataModal);
    NiceModal.register(ExplorerModals.SearchModal, SearchModal);
  }, []);

  return children
};
