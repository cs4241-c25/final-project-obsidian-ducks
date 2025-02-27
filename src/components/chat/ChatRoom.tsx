"use client"
import { useState } from "react"
import ChatSession from "./chatSession"
import { useWebSocket } from "./ChatContext"
import { CreateChat } from "@/lib/types"

export default function ChatRoom() {
  const websocket = useWebSocket()
  const [currentChatIndex,setCurrentChatIndex] = useState(0)

  //todo load from db


  if(websocket.chats.length <= 0) {
    return <div>
      <h1>Chats</h1>
      <CreateChatButton username={websocket.userName } />
    </div>
  }
  return (
    <div>
      <div className='flex flex-row gap-5 overflow-scroll'>
        <h1>chats:</h1>{
          websocket.chats.map((chat_room,index) =>
            <button onClick={() => {
              console.log(index)
              setCurrentChatIndex(index);
            }}
              key={chat_room.chat_id}>{chat_room.chat_id}
            </button>
          )}
        <CreateChatButton username={websocket.userName}/>
      </div>
      <ChatSession chat={websocket.chats[currentChatIndex]} />
    </div>
  )
}


export function CreateChatButton(props: {username:string}) {
  const [otherChatters,setOtherChatters] = useState<string[]>([])
  const [show, setShow] = useState(false)
  const chatContext = useWebSocket()


  async function createChat() {
    if(props.username.length === 0) {
      return
    }
   const res = await fetch("/api/chats",{
     method:"POST",
     body:JSON.stringify({chatters:[props.username,...otherChatters]})
   })
   const new_chat_room = await res.json()
   console.log()
   setShow(false)

   chatContext.setChats([...chatContext.chats,new_chat_room,])
  }
  if(show === false ) {
    return <button onClick={() => setShow(!show)}>Show create chats</button>
  }
  return (
    <div className={"py-5"}>
      <input className="w-full px-5" placeholder="enter users comma seperated" onChange={(event) => {
        const chattersStr = event.target.value
        setOtherChatters(chattersStr.split(","))
      }}></input>
      <button onClick={createChat}>Create chat</button>
    </div>
  )
}
