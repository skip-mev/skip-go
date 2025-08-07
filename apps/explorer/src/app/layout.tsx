
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skip Go Explorer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
