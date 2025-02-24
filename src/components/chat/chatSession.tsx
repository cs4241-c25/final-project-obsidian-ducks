"use client"
import { useState, useEffect } from 'react';
import MessageDisplay from '@/components/chat/MessageDisplay';
import { useWebSocket } from '@/components/chat/ChatContext';
import { ChatEvent, ChatMessage, CreateChat, InspectChats, Message} from "@/lib/types"

export default function ChatSession() {
  const chatHandler = useWebSocket()

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<string[]>([]);
  const [chatIds,setChatIds] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState('');
  const [otherChatters,setOtherChatters] = useState<string[]>([])

  useEffect(() => {
    chatHandler.addOnMessageSub((msgEvent) => {
      console.log(msgEvent)
      try {
        const msg: Message = JSON.parse(msgEvent)
        console.log(msg)
        //yes I am using casting which may not be considered fully type safe
        //but because we have the events tag its type safe I love javscrips type system so much... :)
        switch (msg.event) {
          case "CONNECT":
            break;
          case "INSPECT_CHATS":
            const chats = (msg as InspectChats).chats
            console.log(chats)
            setChats(chats)
            break;
          case "CREATE_CHAT":
            break;
          case "LEAVE_CHAT":
            break;
          case "ADDED_TO_CHAT":
              setChatIds((prvChatIds) => [...prvChatIds,(msg as ChatEvent).chat_id])
            break;
          case "MESSAGE":
            setMessages((prevMessages) => [...prevMessages, (msg as ChatMessage)]);
            break;
          case "READ_MESSAGE":
            break;
        }
      } catch(error) {
        console.log(error)
      }
    });
  }, []);

  const sendMessage = () => {
    if(chatHandler.websocket === undefined) {
      return
    }
    if(chatIds.length <= 0) {
      return
    }
    const msg:ChatMessage = {
      event:"MESSAGE",
      sender: chatHandler.userName, // subing this for a
      content:  newMessage,
      chat_id: chatIds[0]
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
    <div className='w-full'>
      <h1>name:{chatHandler.userName} </h1>
      <h1>chats {chats.map((chat_id) => <div key={chat_id}>{chat_id}</div>)} </h1>
      <h1>Real-Time Chat</h1>
      <div className='flex flex-col gap-10'>
        {messages.map((message, index) => (
          <MessageDisplay key={index} message={message}/>
        ))}
      </div >
      <div className='flex flex-row gap-10 px-10'>
        <input
          type="text"
          className="border border-gray-400 grow rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />

        <button onClick={sendMessage}>Send</button>
        <div>
          <h1></h1>
          <input onChange={(event) => {
            const chattersStr = event.target.value
            setOtherChatters(chattersStr.split(","))
          }}></input>
          <button onClick={createChat}>Create chat</button>
        </div>
      </div>
    </div>
  );
};
