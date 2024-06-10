import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { SwapWidgetProvider } from '@skip-go/widget';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SwapWidgetProvider>
      <Component {...pageProps} />
    </SwapWidgetProvider>
  );
}

export default MyApp;
