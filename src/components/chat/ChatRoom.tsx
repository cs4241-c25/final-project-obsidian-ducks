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
      <CreateChatButton/>
    </div>
  }
  return (
    <div>
      <div className='flex flex-row gap-5 overflow-scroll'>
        <h1>chats:</h1>{
          websocket.chats.map((chat_id,index) =>
            <button onClick={()=> setCurrentChatIndex(index)}
              key={chat_id}>{chat_id}
            </button>
          )}
        <CreateChatButton/>
      </div>
      <ChatSession chat_id={websocket.chats[currentChatIndex]} />
    </div>
  )
}


export function CreateChatButton() {
  const [otherChatters,setOtherChatters] = useState<string[]>([])
  const [show, setShow] = useState(false)
  const chatHandler = useWebSocket()


  function createChat() {
    if(chatHandler.websocket === undefined) {
      return
    }
    const createChat:CreateChat = {
        event: 'CREATE_CHAT',
        sender: chatHandler.userName,
        chatters: otherChatters
    }
    chatHandler.websocket.send(JSON.stringify(createChat));
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
