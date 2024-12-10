import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import '@coinbase/onchainkit/styles.css';
import OnchainProviders from './components/OnchainProviders'


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AMPDtr.ee // Support your favorite creators",
  description: "For Creators by Builders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OnchainProviders>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </OnchainProviders>

  );
}
