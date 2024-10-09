import { SwapWidget } from '@skip-go/widget';
import { defaultTheme, lightTheme } from '@skip-go/widget/src/widget/theme';
import { useState } from 'react';

const Home = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 20
      }}
    >
      <SwapWidget theme={theme === "dark" ? defaultTheme : lightTheme} />
      <div>
        <button onClick={() => toggleTheme()}> Toggle theme (current theme: {theme})</button>
      </div>
    </div>
  );
};

export default Home;
