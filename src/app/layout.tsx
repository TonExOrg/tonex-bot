import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

import "normalize.css/normalize.css";
import Providers from "@/components/Providers"; // Import the new Providers component

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
  title: "Your Application Title Goes Here",
  description: "Your application description goes here",
};

export default function RootLayout({ children }: PropsWithChildren) {
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
