import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Providers from "@/components/Providers";

import "./globals.css";
import {ChatContextProvider} from "@/components/chat/ChatContext";
import NavBar from "@/components/NavBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const openSans = Open_Sans({
    subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "WPIBuys",
  description: "An online platform for WPI students to sell second-hand items.",
};
const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} flex flex-col h-dvh overflow-x-hidden`}>
      <QueryClientProvider client={queryClient}>
        <Providers>
          <ChatContextProvider>
            <NavBar/>
            <div className="grow">
              {children}
            </div>
          </ChatContextProvider>
        </Providers>
      </QueryClientProvider>
      </body>
    </html>
  );
}
