import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import { ChatContextProvider } from "@/components/chat/chatContext";

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
        <ChatContextProvider>
          {children}
        </ChatContextProvider>
      </body>
    </html>
  );
}
