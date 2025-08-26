
import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: "Skip:Go - Explorer",
  description: "Explore cross-chain transactions",
  manifest: '/skip-site.webmanifest',
  icons: {
    icon: '/skip-favicon.ico',
    apple: '/skip-apple-touch-icon.png',
  },
  themeColor: '#F6F',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Skip Go Explorer',
    description: 'Explore cross-chain transactions',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
