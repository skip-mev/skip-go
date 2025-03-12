'use client';
import { Widget, resetWidget } from '@skip-go/widget';
import { useEffect, useState } from 'react';
import { useQueryParams } from '@/hooks/useURLQueryParams';

export default function Home() {
  // optional theme, widget will be dark mode be default
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [disableShadowDom, setDisableShadowDom] = useState(false);
  // optional query params, not necessary for the widget to work
  const defaultRoute = useQueryParams();

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
      <div 
        style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: "column" }}>
        <button
          onClick={() => toggleTheme()}
        >
          Toggle theme (current theme: {theme})
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
        <button onClick={() => setDisableShadowDom((prev) => !prev)}>
          shadow dom:{(!disableShadowDom).toString()}
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
          key={disableShadowDom.toString()}
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
            onRouteUpdated={(props) => console.log('onRouteUpdated', props)}
            disableShadowDom={disableShadowDom}
          />
        </div>
      </div>
    </div>
  );
}
