/* eslint-disable no-console */
import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "../web-component";
import { Column, Row } from "@/components/Layout";
import "./global.css";
import { resetWidget, setAsset } from "@/state/swapPage";
import { defaultTheme, lightTheme } from "@/widget/theme";
import { Widget, WidgetProps } from "@/widget/Widget";

const DevMode = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [apiUrl, setApiUrl] = useState<"prod" | "dev">("prod");
  const [testnet, setTestnet] = useState<boolean>(false);
  const [disableShadowDom, setDisableShadowDom] = useState(true);
  const [renderWebComponent, setRenderWebComponent] = useState(false);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const widgetProps: WidgetProps = useMemo(() => {
    return {
      theme: {
        ...(theme === "dark" ? defaultTheme : lightTheme),
        brandTextColor: "black",
        brandColor: "#FF66FF",
      },
      settings: {
        useUnlimitedApproval: true,
      },
      enableAmplitudeAnalytics: true,
      disableShadowDom,
      onlyTestnet: testnet,
      apiUrl:
        apiUrl === "prod" ? "https://go.skip.build/api/skip" : "https://dev.go.skip.build/api/skip",
      assetSymbolsSortedToTop: [
        "LBTC",
        "ATOM",
        "USDC",
        "USDT",
        "ETH",
        "TIA",
        "OSMO",
        "NTRN",
        "INJ",
      ],
      filterOut: {
        destination: {
          "pacific-1": ["ibc/6C00E4AA0CC7618370F81F7378638AE6C48EFF8C9203CE1C2357012B440EBDB7"],
          "1329": ["0xB75D0B03c06A926e488e2659DF1A861F860bD3d1"],
          "1": ["0xbf45a5029d081333407cc52a84be5ed40e181c46"],
        },
      },
      filterOutUnlessUserHasBalance: {
        source: {
          "1": ["0xbf45a5029d081333407cc52a84be5ed40e181c46"],
        },
      },
      onSourceAndDestinationSwapped(props) {
        console.log(props);
      },
      onSourceAssetUpdated(props) {
        console.log(props);
      },
      onDestinationAssetUpdated(props) {
        console.log(props);
      },
    };
  }, [apiUrl, disableShadowDom, testnet, theme]);

  useEffect(() => {
    const skipWidget = document.querySelector("skip-widget");
    if (skipWidget) {
      Object.entries(widgetProps).forEach(([key, value]) => {
        // @ts-expect-error this is like the equivalent of
        // spreading the props to the web-component
        // but we dont expect users to do it like this
        skipWidget[key as keyof WidgetProps] = value;
      });
    }
  }, [widgetProps]);

  return (
    <Column align="flex-end">
      <Column
        gap={5}
        style={{ width: 200, display: process.env.VISUAL_TEST === "true" ? "none" : "flex" }}
      >
        <button onClick={() => toggleTheme()}>Toggle theme (current theme: {theme})</button>
        <button onClick={() => setDisableShadowDom((prev) => !prev)}>
          shadow dom:{(!disableShadowDom).toString()}
        </button>
        <button onClick={() => resetWidget()}> reset widget </button>
        <button onClick={() => resetWidget({ onlyClearInputValues: true })}>
          reset widget only clear input values
        </button>
        <button
          onClick={() =>
            setAsset({ type: "source", chainId: "osmosis-1", denom: "uosmo", amount: 1 })
          }
        >
          set source asset to OSMO on Osmosis
        </button>
        <button
          onClick={() =>
            setAsset({ type: "destination", chainId: "interwoven-1", denom: "uinit", amount: 1 })
          }
        >
          set destination asset to INIT on Initia
        </button>
        <button onClick={() => setTestnet(!testnet)}>{testnet ? "testnet" : "mainnet"}</button>
        <button onClick={() => setApiUrl((v) => (v === "prod" ? "dev" : "prod"))}>
          {apiUrl === "prod" ? "prod" : "dev"}
        </button>
        <button onClick={() => setRenderWebComponent((v) => !v)}>
          web-component: {renderWebComponent.toString()}
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
          {renderWebComponent ? (
            // @ts-expect-error - web-component
            <skip-widget />
          ) : (
            <Widget {...widgetProps} />
          )}
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
