"use client"
import { Connect, InspectChats, Message } from "@/lib/types"
import { useSession } from "next-auth/react"
// import { useSession } from "next-auth/react"
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
  chats:string[],
  addOnMessageSub:(sub:(msg:string) =>void)=>void
}


const webSocketContext = createContext<tmpMsgContext>({
  userName:"",
  websocket:undefined,
  onMessageSubs:[],
  chats:[],
  addOnMessageSub:() => {}
})

export function ChatContextProvider(props: {children:ReactNode}) {
  const [socket, setSocket] = useState<undefined | WebSocket>();
  const onMessageSubsRef = useRef<((msg:string) =>void)[]>([]);//we use ref here becasue we dont want re renders
  const [chats,setChats] = useState([])
  const { data: session } = useSession()
  // const { data: session, status } = useSession()
  function send_conn() {
    if(socket === undefined) {
      return
    }
    if(session ===null|| session === undefined || session.user === undefined || session.user.name === undefined || session.user.name === null) {
      return
    }
    const connect_msg:Connect = {
      event: 'CONNECT',
      sender:session.user.name
    }
    socket.send(JSON.stringify(connect_msg))
  }

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const webSocket =new WebSocket(`${protocol}//localhost:3001/api/ws`)
    try {
      webSocket.onopen = () => send_conn()
      webSocket.onmessage = (event) => {
        try {
          const msg: Message = JSON.parse(event.data)
          console.log(msg)
          //yes I am using casting which may not be considered fully type safe
          //but because we have the events tag its type safe I love javscrips type system so much... :)
          switch (msg.event) {
            case "CONNECT":
              break;
            case "INSPECT_CHATS":
              const chats = (msg as InspectChats).chats
              // console.log(chats)
              setChats(chats)
              break;
            case "CREATE_CHAT":
              break;
            case "LEAVE_CHAT":
              break;
            case "ADDED_TO_CHAT":
                // setChats((prvChatIds) => [...prvChatIds,(msg as ChatEvent).chat_id])
              break;
            case "MESSAGE":
              // setMessages((prevMessages) => [...prevMessages, (msg as ChatMessage)]);
              break;
            case "READ_MESSAGE":
              break;
          }
        } catch(error) {
          console.log(error)
        }
        for (const sub of onMessageSubsRef.current) {
          sub(event.data)
        }
      }
    } catch (error) {
      console.log(error)
    }
    setSocket(webSocket)
  },[])

  if(session ===null|| session === undefined || session.user === undefined || session.user.name === undefined || session.user.name === null) {
    return props.children
  }


  return(
    <webSocketContext.Provider value={{
      userName:session.user.name,
      websocket:socket,
      onMessageSubs:onMessageSubsRef.current,
      addOnMessageSub:(sub) => {
        onMessageSubsRef.current.push(sub)
      },
      chats:chats
    }}>
      <div>{session.user.name }</div>
      {/* <input className="border-2 border-black" onChange={(event) => setName(event.target.value)}></input>
      <button onClick={send_conn}>Connect to chat server</button> */}
      {props.children}
    </webSocketContext.Provider>
  )
}



export const useWebSocket = () => useContext(webSocketContext)
