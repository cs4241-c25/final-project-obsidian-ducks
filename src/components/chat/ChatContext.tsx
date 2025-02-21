"use client"
import { createContext, ReactNode, useContext } from "react"

  // setInterval(() => {
  //   if (webSocket.readyState !== webSocket.OPEN) {
  //     webSocket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
  //     return;
  //   }

  //   webSocket.send(`{"event":"ping"}`);
  // }, 29000);
const webSocketContext = createContext<WebSocket | undefined>(undefined)

export function ChatContextProvider(props: {children:ReactNode}) {
  let webSocket: WebSocket | undefined = undefined;
  if (typeof window !== "undefined") {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    webSocket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
  }
  return(
    <webSocketContext.Provider value={webSocket}>
      {props.children}
    </webSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(webSocketContext)
