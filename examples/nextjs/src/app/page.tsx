"use client";
import {
  Widget,
  openAssetAndChainSelectorModal,
  resetWidget,
  setAsset,
} from "@skip-go/widget";
import { useEffect, useLayoutEffect, useState } from "react";
import { useQueryParams } from "@/hooks/useURLQueryParams";
import {
  venues,
  bridges as _bridges,
  setApiOptions,
  SwapVenue,
  Bridge,
  BridgeType,
} from "@skip-go/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  // optional query params, not necessary for the widget to work
  const { defaultRoute, otherParams, loaded } = useQueryParams();
  const [urlParamsLoaded, setUrlParamsLoaded] = useState(false);

  // optional theme, widget will be dark mode be default
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [disableShadowDom, setDisableShadowDom] = useState(false);
  const [apiUrl, setApiUrl] = useState<"prod" | "dev">("prod");
  const [testnet, setTestnet] = useState<boolean>(false);

  const [swapVenues, setSwapVenues] = useState<SwapVenue[]>();
  const [bridges, setBridges] = useState<Bridge[]>();

  useLayoutEffect(() => {
    if (otherParams !== undefined) {
      const { api, testnet, shadowDom, theme } = otherParams;
      if (api !== undefined) setApiUrl(api);
      if (testnet !== undefined) setTestnet(testnet);
      if (shadowDom !== undefined) setDisableShadowDom(!shadowDom);
      if (theme !== undefined) setTheme(theme);
    }
    if (loaded) {
      setUrlParamsLoaded(true);
    }
  }, [otherParams, apiUrl, testnet, disableShadowDom, theme, loaded]);

  useEffect(() => {
    const initEruda = async () => {
      const eruda = (await import("eruda")).default;
      eruda.init();
    };

    const loadRemoteDebuggingScript = () => {
      const ipAddress = window.location.hostname;
      // assume local ip addresses start with 192*
      if (!ipAddress.startsWith("192")) return;

      // port is arbitrary but it's easier to have it auto set
      const scriptSrc = `http://${ipAddress}:1234/target.js`;

      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => {
        console.log("Script loaded successfully");
      };
      script.onerror = (error) => {
        console.log(error);
        console.error("Error loading the script");
      };

      document.head.appendChild(script);
    };
    initEruda();
    loadRemoteDebuggingScript();
    setApiOptions({
      apiUrl: "https://go.skip.build/api/skip",
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    updateURLParam("theme", newTheme);
  };

  const swapVenuesQuery = useQuery({
    queryKey: ["example-swap-venues"],
    queryFn: async () => {
      return await venues();
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const bridgesQuery = useQuery({
    queryKey: ["example-bridges"],
    queryFn: async () => {
      return await _bridges();
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (swapVenuesQuery.data) {
      setSwapVenues(swapVenuesQuery.data);
    }
  }, [swapVenuesQuery.data]);
  useEffect(() => {
    if (bridgesQuery.data) {
      setBridges(bridgesQuery.data);
    }
  }, [bridgesQuery.data]);

  return (
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "row",
          gap: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 8,
            paddingRight: 12,
            gap: 4,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <span>Swap venues</span>
          {swapVenuesQuery.isLoading && <span>Loading...</span>}
          <div
            style={{
              height: "200px",
              overflowY: "auto",
            }}
          >
            {swapVenuesQuery.data
              ?.sort((a, b) => a.name!.localeCompare(b.name!))
              .map((venue) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  key={venue.name}
                >
                  <input
                    id={venue.name}
                    type="checkbox"
                    checked={
                      swapVenues?.map((v) => v.name).includes(venue.name) ??
                      true
                    }
                    onChange={(e) => {
                      if (e.currentTarget.checked) {
                        setSwapVenues((prev) => [...(prev ?? []), venue]);
                      } else {
                        // add to state
                        setSwapVenues((prev) =>
                          prev?.filter((v) => v.name !== venue.name)
                        );
                      }
                    }}
                  />
                  <label htmlFor={venue.name}>{venue.name}</label>
                </div>
              ))}
          </div>
          <button
            onClick={() => {
              setSwapVenues((prev) =>
                prev?.length === 0 ? swapVenuesQuery.data : []
              );
            }}
          >
            {swapVenues?.length === 0 ? "Select " : "Deselect "} all
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 8,
            gap: 4,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <span>Bridges</span>
          {bridgesQuery.isLoading && <span>Loading...</span>}
          <div
            style={{
              height: "200px",
              overflowY: "auto",
            }}
          >
            {bridgesQuery.data?.map((bridge) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                key={bridge.id}
              >
                <input
                  id={bridge.id}
                  type="checkbox"
                  checked={
                    bridges?.map((b) => b.id).includes(bridge.id) ?? true
                  }
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      setBridges((prev) => [...(prev ?? []), bridge]);
                    } else {
                      // add to state
                      setBridges((prev) =>
                        prev?.filter((b) => b.id !== bridge.id)
                      );
                    }
                  }}
                />
                <label htmlFor={bridge.id}>{bridge.id}</label>
              </div>
            ))}
          </div>
          <button

            onClick={() => {
             setBridges((prev) => prev?.length === 0 ? bridgesQuery.data : []);
            }}
          >{
bridges?.length === 0 ? "Select " : "Deselect "
          } all</button>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={() => {
            toggleTheme();
          }}
        >
          Toggle theme (current theme: {theme})
        </button>
        <button
          onClick={() => {
            openAssetAndChainSelectorModal({
              context: "source",
              onSelect: (asset) => {
                console.log("Selected asset:", asset);
              },
            });
          }}
        >
          open selector
        </button>
        <button onClick={() => resetWidget()}>Reset state</button>
        <button onClick={() => resetWidget({ onlyClearInputValues: true })}>
          Reset state only clear input values
        </button>
        <button
          onClick={() =>
            setAsset({
              type: "source",
              chainId: "noble-1",
              denom: "uusdc",
              amount: 1,
            })
          }
        >
          set source asset to USDC on noble
        </button>
        <button
          onClick={() =>
            setAsset({
              type: "destination",
              chainId: "cosmoshub-4",
              denom: "uatom",
              amount: 1,
            })
          }
        >
          set destination asset to ATOM on cosmoshub
        </button>
        <button
          onClick={() => {
            const newDisableShadowDom = !disableShadowDom;
            setDisableShadowDom(newDisableShadowDom);
            updateURLParam("shadowDom", (!newDisableShadowDom).toString());
          }}
        >
          shadow dom:{(!disableShadowDom).toString()}
        </button>
        <button
          onClick={() => {
            const newTestnet = !testnet;
            setTestnet(newTestnet);
            updateURLParam("testnet", newTestnet.toString());
          }}
        >
          {testnet ? "testnet" : "mainnet"}
        </button>
        <button
          onClick={() => {
            const newApiUrl = apiUrl === "prod" ? "dev" : "prod";
            setApiUrl(newApiUrl);
            updateURLParam("api", newApiUrl);
          }}
        >
          {apiUrl}
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-185px)",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* widget will cohere to the parent container's width */}
        <div
          key={disableShadowDom.toString() + testnet.toString() + apiUrl}
          style={{
            width: "100%",
            maxWidth: 500,
            padding: "0 10px",
            boxSizing: "border-box",
          }}
        >
          {urlParamsLoaded && (
            <Widget
              theme={theme}
              defaultRoute={defaultRoute}
              onWalletConnected={(props) =>
                console.log("onWalletConnected", { ...props })
              }
              onWalletDisconnected={(props) =>
                console.log("onWalletDisconnected", { ...props })
              }
              onTransactionBroadcasted={(props) =>
                console.log("onTransactionBroadcasted", { ...props })
              }
              onTransactionFailed={(props) =>
                console.log("onTransactionFailed", { ...props })
              }
              onTransactionComplete={(props) =>
                console.log("onTransactionComplete", { ...props })
              }
              onRouteUpdated={(props) => console.log("onRouteUpdated", props)}
              onSourceAssetUpdated={(props) =>
                console.log("onSourceAssetUpdated", props)
              }
              onDestinationAssetUpdated={(props) =>
                console.log("onDestinationAssetUpdated", props)
              }
              disableShadowDom={disableShadowDom}
              onlyTestnet={testnet}
              routeConfig={{
                experimentalFeatures: ["eureka"],
                swapVenues: swapVenues,
                bridges: bridges?.map(i => i.id as BridgeType),
              }}
              apiUrl={
                apiUrl === "prod"
                  ? "https://go.skip.build/api/skip"
                  : "https://dev.go.skip.build/api/skip"
              }
              filterOut={{
                destination: {
                  "pacific-1": [
                    "ibc/6C00E4AA0CC7618370F81F7378638AE6C48EFF8C9203CE1C2357012B440EBDB7",
                  ],
                  "1329": ["0xB75D0B03c06A926e488e2659DF1A861F860bD3d1"],
                  "1": ["0xbf45a5029d081333407cc52a84be5ed40e181c46"],
                },
              }}
              filterOutUnlessUserHasBalance={{
                source: {
                  "1": ["0xbf45a5029d081333407cc52a84be5ed40e181c46"],
                },
              }}

            />
          )}
        </div>
      </div>
    </div>
  );
}

function updateURLParam(key: string, value: string | null) {
  const url = new URL(window.location.href);

  if (value === null) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }

  window.history.replaceState({}, "", url.toString());
}
