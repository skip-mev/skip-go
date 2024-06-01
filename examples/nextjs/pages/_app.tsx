import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { WidgetProvider } from 'widget';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WidgetProvider>
      <Component {...pageProps} />
    </WidgetProvider>
  );
}

export default MyApp;
