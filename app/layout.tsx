import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Open Sans - Default body font
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

// Have Heart - Brand script font
const haveHeart = localFont({
  src: "../public/fonts/HaveHeart.otf",
  variable: "--font-have-heart",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "HopeChest Partnership Guide | Find Your Match",
  description: "Discover the perfect international partnership for your church. Take our guided assessment to connect your heart with a community's greatest needs.",
  icons: { 
    icon: '/hopechest-logo.png' 
  },
  openGraph: {
    title: "HopeChest Partnership Guide",
    description: "Connect your church's heart with a community's greatest needs. Start your journey today.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "HopeChest",
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'en_US',
    type: 'website',
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
        className={`${openSans.variable} ${haveHeart.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
