"use client";
import { useState } from "react"
import ChatSession from "@/chaat/c/chatSession"
import { useWebSocket } from "./ChatContext"

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
    <div className="flex flex-col grow">
      <Modal is>
        <div>Hi</div>
      </Modal>
      <div className='flex flex-row gap-5 overflow-scroll py-10'>
        <h1>chats:</h1>{
          websocket.chats.map((chat_room,index) =>
            <button className="border px-5 rounded-xl" onClick={() => {
              setCurrentChatIndex(index);
            }}
              key={chat_room.chat_id}>{chat_room.chatters.join(", ")}
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

   chatContext.setChats([...chatContext.chats,new_chat_room])
  }
  if(show === false ) {
    return <button onClick={() => setShow(!show)}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></button>
  }
  return (
    <div className={"py-5"}>
      <input className="w-full px-5" placeholder="enter users comma seperated" onChange={(event) => {
        const chattersStr = event.target.value
        setOtherChatters(chattersStr.split(","))
      }}></input>
      <button onClick={createChat}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></button>
    </div>
  )
}
