import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "../web-component";
import { Widget } from "@/widget/Widget";
import { Column, Row } from "@/components/Layout";
import "./global.css";
import { defaultTheme, lightTheme } from "@/widget/theme";
import { resetWidget } from "@/state/swapPage";

const DevMode = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [apiUrl, setApiUrl] = useState<"prod" | "dev">("prod");
  const [testnet, setTestnet] = useState<boolean>(false);
  const [disableShadowDom, setDisableShadowDom] = useState(true);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Column align="flex-end">
      <Column gap={5} style={{ width: 200 }}>
        <button onClick={() => toggleTheme()}>Toggle theme (current theme: {theme})</button>
        <button onClick={() => setDisableShadowDom((prev) => !prev)}>
          shadow dom:{(!disableShadowDom).toString()}
        </button>
        <button onClick={() => resetWidget()}> reset widget </button>
        <button onClick={() => resetWidget({ onlyClearInputValues: true })}>
          reset widget only clear input values
        </button>
        <button onClick={() => setTestnet(!testnet)}>{testnet ? "testnet" : "mainnet"}</button>
        <button onClick={() => setApiUrl((v) => (v === "prod" ? "dev" : "prod"))}>
          {apiUrl === "prod" ? "prod" : "dev"}
        </button>
      </Column>
      <Row
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -185px)",
          width: "100%",
        }}
        align="center"
        justify="center"
      >
        <div
          key={disableShadowDom.toString() + testnet.toString() + apiUrl}
          style={{
            width: "100%",
            maxWidth: 500,
            padding: "0 10px",
          }}
        >
          {/* <Widget
            theme={{
              ...(theme === "dark" ? defaultTheme : lightTheme),
              brandTextColor: "black",
              brandColor: "#FF66FF",
            }}
            settings={{
              useUnlimitedApproval: true,
            }}
            disableShadowDom={disableShadowDom}
            onlyTestnet={testnet}
            routeConfig={{
              experimentalFeatures: ["eureka"],
            }}
            apiUrl={
              apiUrl === "prod"
                ? "https://go.skip.build/api/skip"
                : "https://dev.go.skip.build/api/skip"
            }
            ibcEurekaHighlightedAssets={{
              USDC: ["cosmoshub-4"],
              USDT: undefined,
            }}
            assetSymbolsSortedToTop={[
              "LBTC",
              "ATOM",
              "USDC",
              "USDT",
              "ETH",
              "TIA",
              "OSMO",
              "NTRN",
              "INJ",
            ]}
            filterOut={{
              source: {
                "1": ["0xbf45a5029d081333407cc52a84be5ed40e181c46"],
              },
              destination: {
                "pacific-1": [
                  "ibc/6C00E4AA0CC7618370F81F7378638AE6C48EFF8C9203CE1C2357012B440EBDB7",
                ],
                "1329": ["0xB75D0B03c06A926e488e2659DF1A861F860bD3d1"],
                "1": ["0xbf45a5029d081333407cc52a84be5ed40e181c46"],
              },
            }}
          /> */}
          <skip-widget id="skip-widget"></skip-widget>
        </div>
      </Row>
    </Column>
  );
};

createRoot(document.getElementById("root") as HTMLElement)?.render(
  <StrictMode>
    <DevMode />
  </StrictMode>,
);
