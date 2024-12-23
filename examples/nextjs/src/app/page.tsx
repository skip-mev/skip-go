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
        <div
          style={{
            width: '100%',
            maxWidth: 500,
            padding: '0 10px',
            boxSizing: 'border-box',
          }}
        >
          <Widget
            theme={theme}
            apiUrl='/api/skip'
            defaultRoute={defaultRoute}
            onWalletConnected={({ walletName, chainIdToAddressMap, chainId, address }) => {
              console.log(
                'wallet connected',
                walletName,
                chainIdToAddressMap,
                chainId,
                address
              );
            }}
            onWalletDisconnected={({ walletName, chainType }) => {
              console.log('wallet disconnected', walletName, chainType);
            }}
            onTransactionBroadcasted={({ txHash, chainId, explorerLink }) => {
              console.log(
                'transaction broadcasted',
                txHash,
                chainId,
                explorerLink
              );
            }}
            onTransactionFailed={({ error }) => {
              console.log('transaction failed', error);
            }}
            onTransactionComplete={({ txHash, chainId, explorerLink }) => {
              console.log(
                'transaction complete',
                txHash,
                chainId,
                explorerLink
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
