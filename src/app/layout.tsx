import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Providers from "@/components/Providers";

import "./globals.css";
import NavBar from "@/components/NavBar";

const openSans = Open_Sans({
    subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "WPIBuys",
  description: "An online platform for WPI students to sell second-hand items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className}`}>
      <Providers>
        <NavBar/>
            {children}
      </Providers>
      </body>
    </html>
  );
}
