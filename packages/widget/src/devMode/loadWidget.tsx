import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ShowWidget, Widget } from "@/widget/Widget";
import { Column } from "@/components/Layout";

const DevMode = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  return (
    <Column>
      <Column gap={5} style={{ width: 200 }}>
        <ShowWidget />
        <button onClick={() => toggleTheme()}>
          Toggle theme (current theme: {theme})
        </button>
      </Column>
      <Widget
        theme={theme}
        defaultRoute={{
          amountIn: 5,
          srcChainId: "osmosis-1",
          srcAssetDenom: "uosmo",
          destChainId: "cosmoshub-4",
          destAssetDenom: "uatom",
        }}
        settings={{
          slippage: 5,
        }}
      />
    </Column>
  );
};

createRoot(document.getElementById("root") as HTMLElement)?.render(
  <StrictMode>
    <DevMode />
  </StrictMode>
);
