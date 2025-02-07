'use client';
import { Widget } from '@skip-go/widget';
import { useEffect, useState } from 'react';
import { useQueryParams } from '@/hooks/useURLQueryParams';

function loadRemoteDebuggingScript(ipAddress: string, port: string) {
  const scriptSrc = `http://${ipAddress}:${port}/target.js`;

  const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
  if (existingScript) {
    existingScript.remove();
  }

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

export default function Home() {
  // optional theme, widget will be dark mode be default
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // optional query params, not necessary for the widget to work
  const defaultRoute = useQueryParams();
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('8080');

  useEffect(() => {
    const initEruda = async () => {
      const eruda = (await import("eruda")).default;
      eruda.init();
    };
    initEruda();
  }, []);

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
      <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: 'column' }}>
        <button
          onClick={() => toggleTheme()}
        >
          Toggle theme (current theme: {theme})
        </button>
        <label>
          ip address for remote debugging:
        </label>
        <input value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
        <label>
          port
        </label>
        <input value={port} onChange={(e) => setPort(e.target.value)} />
        <button onClick={() => loadRemoteDebuggingScript(ipAddress, port)}>
          update ip address / port
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
          style={{
            width: '100%',
            maxWidth: 500,
            padding: '0 10px',
            boxSizing: 'border-box',
          }}
        >
          <Widget
            theme={theme}
            defaultRoute={defaultRoute}
            onWalletConnected={(props) => console.log('onWalletConnected', { ...props })}
            onWalletDisconnected={(props) => console.log('onWalletDisconnected', { ...props })}
            onTransactionBroadcasted={(props) => console.log('onTransactionBroadcasted', { ...props })}
            onTransactionFailed={(props) => console.log('onTransactionFailed', { ...props })}
            onTransactionComplete={(props) => console.log('onTransactionComplete', { ...props })}
          />
        </div>
      </div>
    </div>
  );
}
