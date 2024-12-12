'use client';
import { Widget } from '@skip-go/widget';
import { useState } from 'react';

type ChainId = string;
type Bech32Address = string;

export default function Home() {
  const [account, setAccount] = useState<Record<ChainId, Bech32Address>>()
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

  const connectKeplr = async () => {
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

  const getCosmosSigner = async (chainId: string) => {
    try {
      const offlineSigner = await keplr.getOfflineSigner(chainId);
      return offlineSigner
    } catch (error) {
      alert(`${chainId} is not connected in Keplr`);
    }
  }

  return (
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
        connectedAddress={account}
        getCosmosSigner={getCosmosSigner}
      />
    </div>
  );
}
