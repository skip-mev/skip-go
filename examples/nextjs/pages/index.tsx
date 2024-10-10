import { SwapWidget } from '@skip-go/widget';
import { defaultTheme, lightTheme } from '@skip-go/widget';
import darkbg from './gobg-dark.svg';
import lightbg from './gobg-light.svg';

import { useState } from 'react';

const Home = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

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
        backgroundImage: `url('${theme === 'dark' ? darkbg.src : lightbg.src
          }')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
        }}
      >
        <SwapWidget theme={theme === 'dark' ? defaultTheme : lightTheme} />
      </div>
    </div>
  );
};

export default Home;
