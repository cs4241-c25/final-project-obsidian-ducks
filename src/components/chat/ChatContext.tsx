"use client"
import { createContext, ReactNode, useContext } from "react"

  // setInterval(() => {
  //   if (webSocket.readyState !== webSocket.OPEN) {
  //     webSocket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
  //     return;
  //   }

  //   webSocket.send(`{"event":"ping"}`);
  // }, 29000);
  //
export type tmpMsgContext = {
  userName:string,
  websocket:WebSocket
}


const webSocketContext = createContext<tmpMsgContext | undefined>(undefined)

export function ChatContextProvider(props: {children:ReactNode}) {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const  websocket = new WebSocket(`${protocol}//localhost:3001/api/ws`);
  return(
    <webSocketContext.Provider value={{
      userName:"",
      websocket,
    }}>
      {props.children}
    </webSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(webSocketContext)
