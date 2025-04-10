import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
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
          <Widget
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
            ibcEurekaHighlightedAssets={[
              "0x7A56E1C57C7475CCf742a1832B028F0456652F97",
              "0xd9D920AA40f578ab794426F5C90F6C731D159DEf",
              "0xF469fBD2abcd6B9de8E169d128226C0Fc90a012e",
              "0xf6718b2701D4a6498eF77D7c152b2137Ab28b8A3",
              "0xbDf245957992bfBC62B07e344128a1EEc7b7eE3f",
              "0x9356f6d95b8E109F4b7Ce3E49D672967d3B48383",
              "0x657e8C867D8B37dCC18fA4Caead9C45EB088C642",
              "0x6b7de496080e26ee8567a60b7b823b7e28ebe224",
              "0x14862c03A0cACcC1aB328B062E64e31B2a1afcd7",
              "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
              "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "0x214BF9f07684459aCD56324e3D247b2e5e67D277",
              "0xd7a25d995Cf5e4e7D295CF1Dbd0310d2981C50Bb",
              "0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD",
              "0xbf6Bc6782f7EB580312CC09B976e9329f3e027B3",
              "0x8236a87084f8B84306f72007F36F2618A5634494",
              "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
              "0x6A9A65B84843F5fD4aC9a0471C4fc11AFfFBce4a",
              "0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD",
              "0x45804880De22913dAFE09f4980848ECE6EcbAf78",
              "0x6b7de496080E26Ee8567a60b7b823b7E28ebE224",
            ]}
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
              destination: {
                "pacific-1": [
                  "ibc/6C00E4AA0CC7618370F81F7378638AE6C48EFF8C9203CE1C2357012B440EBDB7",
                ],
                "1329": ["0xB75D0B03c06A926e488e2659DF1A861F860bD3d1"],
                1: ["0xbf45a5029d081333407cc52a84be5ed40e181c46"],
              },
            }}
          />
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
