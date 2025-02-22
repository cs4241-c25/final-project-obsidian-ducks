"use client"
import { Connect } from "@/lib/types"
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"

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
  websocket:WebSocket | undefined,
  onMessageSubs: ((msg:string) =>void)[],
  addOnMessageSub:(sub:(msg:string) =>void)=>void
}


const webSocketContext = createContext<tmpMsgContext>({
  userName:"",
  websocket:undefined,
  onMessageSubs:[],
  addOnMessageSub:() => {}
})

export function ChatContextProvider(props: {children:ReactNode}) {
  const [socket, setSocket] = useState<undefined | WebSocket>();
  const onMessageSubsRef = useRef<((msg:string) =>void)[]>([]);//we use ref here becasue we dont want re renders
  const [name,setName] = useState("")
  function send_conn() {
    if(socket === undefined) {
      return
    }
    const connect_msg:Connect = {
      event: 'CONNECT',
      sender:name
    }
    socket.send(JSON.stringify(connect_msg))
  }
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const webSocket =new WebSocket(`${protocol}//localhost:3001/api/ws`)
    try {
      // webSocket.onopen = () => send_conn()
      //
      webSocket.onmessage = (event) => {
        for (const sub of onMessageSubsRef.current) {
          sub(event.data)
        }
      }
    } catch (error) {
      console.log(error)
    }
    setSocket(webSocket)
  },[])
  return(
    <webSocketContext.Provider value={{
      userName:"",
      websocket:socket,
      onMessageSubs:onMessageSubsRef.current,
      addOnMessageSub:(sub) => {
        onMessageSubsRef.current.push(sub)
      }
    }}>
      <input type="text" onChange={(event) => setName(event.target.value)}/>
      <button onClick={send_conn}>Connect to chat server</button>
      {props.children}
    </webSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(webSocketContext)
