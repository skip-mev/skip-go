
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
  themeColor: '#ff86ff',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Skip Go Explorer',
    description: 'Explore cross-chain transactions',
    url: 'https://explorer.skip.build',
    type: 'website',
    siteName: 'Skip Go Explorer',
    images: ['/social-thumbnail.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skip Go Explorer',
    description: 'Explore cross-chain transactions',
    images: ['/social-thumbnail.png'],
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
