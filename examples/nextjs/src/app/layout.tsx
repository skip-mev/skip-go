import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/provider/ReactQueryProvider";


export const metadata: Metadata = {
  title: "Skip Go Example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
