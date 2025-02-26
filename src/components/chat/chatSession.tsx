"use client"
import { useState, useEffect } from 'react';
import MessageDisplay from '@/components/chat/MessageDisplay';
import { useWebSocket } from '@/components/chat/ChatContext';
import { ChatMessage, Message} from "@/lib/types"
import { useQuery } from '@tanstack/react-query';

export default function ChatSession(props: {chat_id:string}) {
  const chatHandler = useWebSocket()
  const { isLoading, error, data:old_msgs } = useQuery<ChatMessage[]>({
    queryKey:["messages",props.chat_id],
    queryFn:async () => {
      const res = await fetch("/api/chats", {
        body: JSON.stringify({chat_id:props.chat_id})
      })
      return await res.json()
    }
  })

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  // const [createChatShown,setcreateChatShown] = useState(false)

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
          case "CREATE_CHAT":
            break;
          case "LEAVE_CHAT":
            break;
          case "ADDED_TO_CHAT":
              // setChats((prvChatIds) => [...prvChatIds,(msg as ChatEvent).chat_id])
            break;
          case "MESSAGE":
            const chat_msg = (msg as ChatMessage)
            if(chat_msg.chat_id === props.chat_id) {
              setMessages((prevMessages) => [...prevMessages,chat_msg]);
            }
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
      chat_id: props.chat_id
    }
    chatHandler.websocket.send(JSON.stringify(msg));
  };

  if(chatHandler === undefined) {
    return
  }

  if(isLoading) {
    return <div>Loading</div>
  }

  if(error != null || old_msgs === undefined) {
    console.log(error)
    return <div>Error</div> //todo hadnle better
  }

  return (
    <div className='flex flex-col px-10 h-full'>
      <h1>name:{chatHandler.userName} </h1>
      <div className='flex flex-col grow gap-10'>
        {old_msgs.map((message, index) => (
          <MessageDisplay key={index} message={message}/>
        ))}
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
