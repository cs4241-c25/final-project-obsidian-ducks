"use client"
import { useEffect, useState } from "react"
import { ChatSession } from "@/components/chat/chatSession"
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
      <CreateChatButton createChat={createChat} username={websocket.userName } />
    </div>
  }

  async function leaveChat(chat_id:string) {
    const response = await fetch('/api/chats/leave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: websocket.userName, chat_id: chat_id }),
    });
    const left_chat_info= await response.json();
    websocket.setChats(websocket.chats.filter((chat) => { return chat.chat_id !== left_chat_info.chat_id}));
  }

  async function createChat(chatters:string[]) {
    if(websocket.userName.length === 0) {
      return
    }
   const res = await fetch("/api/chats",{
     method:"POST",
     body:JSON.stringify({chatters:[websocket.userName,...chatters]})
   })
   const new_chat_room = await res.json()

   const existingChatIndex = websocket.chats.findIndex((chat) => { return chat.chat_id === new_chat_room.chat_id })
   if(existingChatIndex !== -1) {
     setCurrentChatIndex(existingChatIndex)
     return
   }

    websocket.setChats([...websocket.chats,new_chat_room])
  }

  return (
    <div className="flex flex-col md:flex-row grow">
      <div className='flex flex-row md:flex-col border overflow-scroll md:basis-md'>
        <CreateChatButton createChat={createChat} username={websocket.userName}/>
        {
          websocket.chats.map((chat_room,index) =>
            <div  className={twMerge("border md:w-full p-3 flex flex-col md:flex-row",currentChatIndex === index ? "bg-gray-100" : "" )}
              key={chat_room.chat_id}>
                <Link href={`/chats/${websocket.chats[index].chat_id}`}>
                  {
                    chat_room.chatters
                    .filter((chatter) => {return chatter !== websocket.userName} )
                    .slice(0,3)
                    .join(", ")
                  }
                </Link>
                <div className="md:grow"/>
              <button className="place-self-center" onClick={() => leaveChat(chat_room.chat_id).then()}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
              </button>
            </div>
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




export function CreateChatButton(props: {username:string,createChat:(chatters:string[])=>Promise<void>}) {
  const [otherChatters,setOtherChatters] = useState<string[]>([])
  const [show, setShow] = useState(false)



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
      <button className="p-3" onClick={() => {
        props.createChat(otherChatters).then();
        setShow(false);
      }}>
        New Chat
      </button>
    </div>
  )
}
