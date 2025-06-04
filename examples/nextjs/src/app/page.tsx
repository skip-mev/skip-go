'use client';
import { Widget, openAssetAndChainSelectorModal, resetWidget, setAsset } from '@skip-go/widget';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useQueryParams } from '@/hooks/useURLQueryParams';

export default function Home() {
  // optional query params, not necessary for the widget to work
  const {defaultRoute, otherParams, loaded } = useQueryParams();
  const [urlParamsLoaded, setUrlParamsLoaded] = useState(false);

  // optional theme, widget will be dark mode be default
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [disableShadowDom, setDisableShadowDom] = useState(false);
  const [apiUrl, setApiUrl] = useState<"prod" | "dev">("prod");
  const [testnet, setTestnet] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (otherParams !== undefined) {
      const {api, testnet, shadowDom, theme} = otherParams;
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
      if (!ipAddress.startsWith('192')) return;

      // port is arbitrary but it's easier to have it auto set
      const scriptSrc = `http://${ipAddress}:1234/target.js`;

      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => {
          console.log('Script loaded successfully');
      };
      script.onerror = (error) => {
        console.log(error);
        console.error('Error loading the script');
      };

      document.head.appendChild(script);
    }
    initEruda();
    loadRemoteDebuggingScript();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    updateURLParam('theme', newTheme);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url('${theme === 'dark' ? '/gobg-dark.svg' : '/gobg-light.svg'
          }')`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }}
    >
      <div
        style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: "column" }}>
        <button
          onClick={() => {
            toggleTheme();
          }}
        >
          Toggle theme (current theme: {theme})
        </button>
        <button onClick={() => {
          openAssetAndChainSelectorModal({
            context: "source",
            onSelect: (asset) => {
              console.log('Selected asset:', asset);
            },
          })
        }}>
          open selector
        </button>
        <button
          onClick={() => resetWidget()}
        >
          Reset state
        </button>
        <button
          onClick={() => resetWidget({ onlyClearInputValues: true})}
        >
          Reset state only clear input values
        </button>
        <button
          onClick={() =>
            setAsset({ type: "source", chainId: "noble-1", denom: "uusdc", amount: 1 })
          }
        >
          set source asset to USDC on noble
        </button>
        <button
          onClick={() =>
            setAsset({ type: "destination", chainId: "cosmoshub-4", denom: "uatom", amount: 1 })
          }
        >
          set destination asset to ATOM on cosmoshub
        </button>
        <button onClick={() => {
          const newDisableShadowDom = !disableShadowDom;
          setDisableShadowDom(newDisableShadowDom);
          updateURLParam('shadowDom', (!newDisableShadowDom).toString());
        }}>
          shadow dom:{(!disableShadowDom).toString()}
        </button>
        <button onClick={() => {
          const newTestnet = !testnet;
          setTestnet(newTestnet);
          updateURLParam('testnet', (newTestnet).toString());
        }}>{testnet ? "testnet" : "mainnet"}</button>
        <button onClick={() => {
          const newApiUrl = apiUrl === "prod" ? "dev" : "prod";
          setApiUrl(newApiUrl);
          updateURLParam('api', newApiUrl);
        }}>
          {apiUrl}
        </button>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-185px)',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* widget will cohere to the parent container's width */}
        <div
          key={disableShadowDom.toString() + testnet.toString() + apiUrl}
          style={{
            width: '100%',
            maxWidth: 500,
            padding: '0 10px',
            boxSizing: 'border-box',
          }}
        >
          {
            urlParamsLoaded && <Widget
            theme={theme}
            defaultRoute={defaultRoute}
            onWalletConnected={(props) => console.log('onWalletConnected', { ...props })}
            onWalletDisconnected={(props) => console.log('onWalletDisconnected', { ...props })}
            onTransactionBroadcasted={(props) => console.log('onTransactionBroadcasted', { ...props })}
            onTransactionFailed={(props) => console.log('onTransactionFailed', { ...props })}
            onTransactionComplete={(props) => console.log('onTransactionComplete', { ...props })}
            onRouteUpdated={(props) => console.log('onRouteUpdated', props)}
            onSourceAssetUpdated={(props) => console.log('onSourceAssetUpdated', props)}
            onDestinationAssetUpdated={(props) => console.log('onDestinationAssetUpdated', props)}
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
          }
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
