import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { WidgetProvider } from '@skip-go/widget';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
