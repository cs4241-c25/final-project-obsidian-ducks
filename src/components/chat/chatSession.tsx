"use client"
import { useState, useEffect } from 'react';
import MessageDisplay from '@/components/chat/MessageDisplay';
import { useWebSocket } from '@/components/chat/ChatContext';
import { ChatMessage, InspectChats, Message} from "@/lib/types"

export default function ChatSession() {
  const chatHandler = useWebSocket()

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

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
            setChats((msg as InspectChats).chat_ids)
            console.log(msg);
            break;
          case "CREATE_CHAT":
            break;
          case "LEAVE_CHAT":
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
    const msg:ChatMessage = {
      event:"MESSAGE",
      sender: chatHandler.userName, // subing this for a
      content:  newMessage,
      chat_id: ''
    }
    chatHandler.websocket.send(JSON.stringify(msg));
    setNewMessage('');
  };
  if(chatHandler === undefined) {
    return
  }
  return (
    <div className='w-full'>
      <h1>chats {chats} </h1>
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
      </div>
    </div>
  );
};
