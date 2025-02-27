"use client"
import { ChatRoom, Connect, Message } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
// import { useSession } from "next-auth/react"
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"

export type MsgContext = {
  userName:string,
  websocket:WebSocket | undefined,
  onMessageSubs: ((msg:string) =>void)[],
  chats:ChatRoom[],
  setChats:(chats:ChatRoom[]) => void,
  addOnMessageSub:(sub:(msg:string) =>void)=>void
}



const webSocketContext = createContext<MsgContext>({
  userName:"",
  websocket:undefined,
  onMessageSubs:[],
  chats:[],
  setChats: () => {},
  addOnMessageSub:() => {}
})

export function ChatContextProvider(props: { url: string |undefined,children:ReactNode}) {
  const [socket, setSocket] = useState<undefined | WebSocket>();
  const [chats,setChats] = useState<ChatRoom[]>([])
  const onMessageSubsRef = useRef<((msg:string) =>void)[]>([]);//we use ref here becasue we dont want re renders
  const [socketOpen, setSocketOpen] = useState(false);
  const { data: session } = useSession()


  // const { data: session, status } = useSession()
  async function send_conn(session:Session | null) {
    if(socket === undefined) {
      return
    }
    console.log(session)
    if(session ===null|| session === undefined || session.user === undefined || session.user.name === undefined || session.user.name === null) {
      return
    }

    const connect_msg:Connect = {
      event: 'CONNECT',
      sender:session.user.name
    }
    socket.send(JSON.stringify(connect_msg))
    const res = await fetch(`/api/chats?username=${session.user.name}`)
    const chats = await res.json()
    setChats(chats)
  }

  useEffect(() => {
    if(socketOpen === false) {
      return
    }
    send_conn(session).then()
  },[session,socketOpen])

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    if(props.url === undefined) {
      console.log("undefined websocket url")
      return
    }
    const webSocket =new WebSocket(`${protocol}${props.url}/api/ws`)
    console.log(webSocket)
    try {
      webSocket.onopen = () => {
        console.log("gaming")
        setSocketOpen(true)
      }
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
              // const chats = (msg as InspectChats).chats
              // console.log(chats)
              // setChats(chats)
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
      setChats:(chats:ChatRoom[]) => {
        setChats(chats)
      },
      chats:chats
    }}>
      <div>{session.user.name }</div>
      {props.children}
    </webSocketContext.Provider>
  )
}



export const useWebSocket = () => useContext(webSocketContext)
