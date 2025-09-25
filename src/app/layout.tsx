import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PointRally - Unify Your Sports Loyalty Points",
  description: "Consolidate loyalty points from all your favorite sports teams into one unified balance. Use points across different teams and events.",
  keywords: "sports loyalty, points aggregator, team rewards, sports rewards, loyalty program",
  authors: [{ name: "PointRally Team" }],
  openGraph: {
    title: "PointRally - One Balance. All Teams. Endless Rewards.",
    description: "Unify your sports loyalty points across all your favorite teams",
    type: "website",
    url: "https://pointrally.com",
    siteName: "PointRally",
  },
  twitter: {
    card: "summary_large_image",
    title: "PointRally - Sports Loyalty Points Aggregator",
    description: "Combine all your team loyalty points into one balance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
