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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} flex flex-col h-dvh overflow-x-hidden`}>
        <ReactQueryProvider>
          <Providers>
            <ChatContextProvider url={chat_url}>
              <NavBar/>
              <div className="grow">
                {children}
              </div>
            </ChatContextProvider>
          </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
