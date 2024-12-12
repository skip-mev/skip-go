'use client';
import { Widget } from '@skip-go/widget';
import { useState } from 'react';
import { useQueryParams } from '@/hooks/useURLQueryParams';

export default function Home() {
  // optional theme, widget will be dark mode be default
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // optional query params, not necessary for the widget to work
  const defaultRoute = useQueryParams();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };
  const [account, setAccount] = useState<Record<string, string>>()

  const connectKeplr = async () => {
    // @ts-ignore
    const keplr = window.keplr as unknown as any;
    if (!keplr) {
      alert('Please install keplr extension');
      return;
    }
    if (!keplr.experimentalSuggestChain) {
      alert('Please update keplr extension');
      return;
    }
    const chainIds = ['cosmoshub-4', 'osmosis-1'];

    await keplr.enable(chainIds);

    await Promise.all(chainIds.map(async (chainId) => {
      const account = await keplr.getKey(chainId);
      setAccount((prev) => {
        return {
          ...prev,
          [chainId]: account.bech32Address
        }
      })
    }))

  }

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
      <button
        style={{ position: 'absolute', top: 0, right: 0 }}
        onClick={() => toggleTheme()}
      >
        Toggle theme (current theme: {theme})
      </button>
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
        <div style={{
          width: '100%',
          maxWidth: 500,
          padding: '0 10px',
          boxSizing: 'border-box'
        }}>
          <p>Connected address:</p>
          <ul>
            {Object.entries(account ?? {}).map(([chainId, bech32Address]) => {
              return <li key={chainId}>{chainId}: {bech32Address}</li>
            })}
          </ul>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <button onClick={connectKeplr}>Connect cosmoshub and osmosis with Keplr</button>
            <button onClick={
              () => {
                setAccount(undefined)
              }
            }>Disconnect</button>
          </div>
          <Widget
            theme={theme}
            defaultRoute={{
              srcChainId: 'cosmoshub-4',
              srcAssetDenom: 'uatom',
              destChainId: 'osmosis-1',
              destAssetDenom: 'uosmo',
            }}
            connectedAddress={account}
            getCosmosSigner={async (chainId) => {
              // @ts-ignore
              const keplr = window.keplr as unknown as any;
              if (!keplr) {
                alert('Please install keplr extension');
                return;
              }
              if (!keplr.getOfflineSigner) {
                return;
              }
              try {
                const offlineSigner = await keplr.getOfflineSigner(chainId);
                return offlineSigner
              } catch (error) {
                alert(`${chainId} is not connected in Keplr`);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
