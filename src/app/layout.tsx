import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ChatContextProvider } from "@/components/chat/ChatContext";
import Providers from "@/components/Providers";
import NavBar from "./nav/NavBar";

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
        <ChatContextProvider>
          <NavBar/>
          {children}
        </ChatContextProvider>
      </Providers>
      </body>
    </html>
  );
}
