"use client"
import { createContext, ReactNode, useContext } from "react"

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
let webSocket: WebSocket = new WebSocket(`ws://${window.location.host}/api/ws`); //tmp value
if (typeof window !== "undefined") {

  webSocket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
  // setInterval(() => {
  //   if (webSocket.readyState !== webSocket.OPEN) {
  //     webSocket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
  //     return;
  //   }

  //   webSocket.send(`{"event":"ping"}`);
  // }, 29000);
}
const webSocketContext = createContext(webSocket)

export function ChatContextProvider(props: {children:ReactNode}) {
  return(
    <webSocketContext.Provider value={webSocket}>
      {props.children}
    </webSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(webSocketContext)
