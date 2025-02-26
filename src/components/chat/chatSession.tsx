"use client"
import { useState, useEffect } from 'react';
import MessageDisplay from '@/components/chat/MessageDisplay';
import { useWebSocket } from '@/components/chat/ChatContext';
import { ChatEvent, ChatMessage, CreateChat, InspectChats, Message} from "@/lib/types"

export default function ChatSession() {
  const chatHandler = useWebSocket()

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherChatters,setOtherChatters] = useState<string[]>([])
  const [createChatShown,setcreateChatShown] = useState(false)

  useEffect(() => {
    chatHandler.addOnMessageSub((msgEvent) => {
      console.log(msgEvent)

    });
  }, []);

  const sendMessage = () => {
    if(chatHandler.websocket === undefined) {
      return
    }
    if(chats.length <= 0) {
      return
    }
    const msg:ChatMessage = {
      event:"MESSAGE",
      sender: chatHandler.userName, // subing this for a
      content:  newMessage,
      chat_id: chats[0]
    }
    chatHandler.websocket.send(JSON.stringify(msg));
    setMessages((prevMessages) => [...prevMessages, msg]);
    setNewMessage('');
  };

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

  if(chatHandler === undefined) {
    return
  }
  return (
    <div className='flex flex-col px-10 h-full'>
      <h1>name:{chatHandler.userName} </h1>
      <div className='flex flex-row gap-5 overflow-hidden'>
        <h1>chats:</h1>{chats.map((chat_id) => <div key={chat_id}>{chat_id}</div>)}
        <button onClick={() => setcreateChatShown(!createChatShown)} >Create new chat</button>
      </div>
      <div className={createChatShown ? "py-5" : "hidden"}>
        <input className="w-full px-5" placeholder="enter users comma seperated" onChange={(event) => {
          const chattersStr = event.target.value
          setOtherChatters(chattersStr.split(","))
        }}></input>
        <button onClick={createChat}>Create chat</button>
      </div>
      <div className='flex flex-col grow gap-10'>
        {messages.map((message, index) => (
          <MessageDisplay key={index} message={message}/>
        ))}
      </div >
      <div className='flex flex-row gap-10  pb-10'>
        <input
          type="text"
          className="border border-gray-400 grow rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};
