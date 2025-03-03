"use client"
import { useEffect, useState } from "react"
import ChatSession from "@/components/chat/chatSession"
import { useWebSocket } from "./ChatContext"
import { twMerge } from "tailwind-merge"
import Link from "next/link"

export default function ChatRoom(props: {chat_id:string}) {
  const websocket = useWebSocket()
  const [currentChatIndex,setCurrentChatIndex] = useState(0)

  useEffect(() => {
    if(props.chat_id.length === 0 ) {
      return
    }
    const chat_index = websocket.chats.findIndex((chat) => { return chat.chat_id === props.chat_id })
    console.log(websocket.chats)
    setCurrentChatIndex(chat_index)
  },[websocket])

  if(websocket.chats.length <= 0) {
    return <div>
      <h1>Chats</h1>
      <CreateChatButton username={websocket.userName } />
    </div>
  }
  return (
    <div className="flex flex-row grow">
      <div className='flex flex-col border overflow-scroll basis-md'>
        <CreateChatButton username={websocket.userName}/>
        {
          websocket.chats.map((chat_room,index) =>
            <Link href={`/chats/${websocket.chats[index].chat_id}`} className={twMerge("border w-full p-3",currentChatIndex === index ? "bg-gray-100" : "" )}
              key={chat_room.chat_id}>
                {
                  chat_room.chatters
                  .filter((chatter) => {return chatter !== websocket.userName} )
                  .slice(0,3)
                  .join(", ")
                }
            </Link>
          )
        }
      </div>
      {currentChatIndex !== -1  ?
        <ChatSession chat={websocket.chats[currentChatIndex]} />
        :
        <div>No chat exists with that id</div>
      }
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
   setShow(false)

   chatContext.setChats([...chatContext.chats,new_chat_room])
  }
  if(show === false ) {
    return <button className="p-3" onClick={() => setShow(!show)}>
      New Chat
    </button>
  }
  return (
    <div className={"py-5"}>
      <input className="w-full px-5" placeholder="enter users comma seperated" onChange={(event) => {
        const chattersStr = event.target.value
        setOtherChatters(chattersStr.split(","))
      }}></input>
      <button className="p-3" onClick={createChat}>
        New Chat
      </button>
    </div>
  )
}
