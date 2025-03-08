"use client"
import { ChatRoom, Connect, Message } from "@/lib/types"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
// import { useSession } from "next-auth/react"
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"

export type MsgContext = {
  userName:string,
  websocket:WebSocket | undefined,
  chats:ChatRoom[],
  setChats:(chats:ChatRoom[]) => void,
  addOnMessageSub:(key:string,sub:(msg:Message) =>void)=>void
}



const webSocketContext = createContext<MsgContext>({
  userName:"",
  websocket:undefined,
  chats:[],
  setChats: () => {},
  addOnMessageSub:() => {}
})

export function ChatContextProvider(props: { url: string |undefined,children:ReactNode}) {
  const [socket, setSocket] = useState<undefined | WebSocket>();
  const [chats,setChats] = useState<ChatRoom[]>([])
  const onMessageSubsRef = useRef<Map<string,(msg:Message) =>void>>(new Map());//we use ref here becasue we dont want re renders
  const [socketOpen, setSocketOpen] = useState(false);
  const { data: session } = useSession()


  // const { data: session, status } = useSession()
  async function send_conn(session:Session | null) {
    console.log("huhhhhhh")
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
        console.log(event)
        try {
          const msg: Message = JSON.parse(event.data)
          console.log(msg)

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
          console.log(onMessageSubsRef.current)
          for (const sub of onMessageSubsRef.current.values()) {
            console.log(sub)
            sub(msg)
          }
        } catch(error) {
          console.log(error)
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
      addOnMessageSub:(key,sub) => {
        onMessageSubsRef.current.set(key,sub)
      },
      setChats:(chats:ChatRoom[]) => {
        setChats(chats)
      },
      chats:chats
    }}>
      {props.children}
    </webSocketContext.Provider>
  )
}



export const useWebSocket = () => useContext(webSocketContext)
