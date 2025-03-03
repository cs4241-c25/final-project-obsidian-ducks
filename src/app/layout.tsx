import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Providers from "@/components/Providers";

import "./globals.css";
import {ChatContextProvider} from "@/components/chat/ChatContext";
import NavBar from "@/components/NavBar";
import ReactQueryProvider from "@/components/reactQueryProvider";

const openSans = Open_Sans({
    subsets: ["latin"]
});
const chat_url = process.env.CHAT_URL;

export const metadata: Metadata = {
  title: "WPIBuys",
  description: "An online platform for WPI students to sell second-hand items.",
  icons: "/WPIBuysIcon.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} h-screen flex flex-col overflow-x-hidden`}>
        <ReactQueryProvider>
          <Providers>
            <ChatContextProvider url={chat_url}>
              <NavBar/>
              {children}
            </ChatContextProvider>
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
