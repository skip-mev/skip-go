import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import '../styles/globals.css';
import { Provider } from './provider';

export const metadata: Metadata = {
  title: 'Skip Widget Next.js Example',
  description: 'By Family',
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>{props.children}</Provider>
      </body>
    </html>
  );
}
