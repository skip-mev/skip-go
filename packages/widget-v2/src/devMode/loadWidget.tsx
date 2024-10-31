import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Widget } from "@/widget/Widget";
import { Row, Column } from "@/components/Layout";

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
    <Row gap={20}>
      <Widget
        theme={theme}
        defaultRoute={{
          // amountIn: 5,
          srcChainId: "osmosis-1",
          srcAssetDenom: "uosmo",
          destChainId: "cosmoshub-4",
          destAssetDenom: "uatom",
        }}
        settings={{
          slippage: 5,
        }}
        filter={{
          source: {
            "cosmoshub-4": undefined,
            "osmosis-1": undefined,
          },
          destination: {
            "cosmoshub-4": ["uatom"],
            "osmosis-1": undefined,
          }
        }}
      />
      <Column>
        <button onClick={() => toggleTheme()}>
          Toggle theme (current theme: {theme})
        </button>
      </Column>
    </Row>
  );
};

createRoot(document.getElementById("root") as HTMLElement)?.render(
  <StrictMode>
    <DevMode />
  </StrictMode>
);
