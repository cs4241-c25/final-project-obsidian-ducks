"use client"
import { useState, useEffect } from 'react';
import MessageDisplay from '@/components/chat/MessageDisplay';
import { useWebSocket } from '@/components/chat/ChatContext';
import { ChatMessage, ChatRoom, Message} from "@/lib/types"
import { useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export default function ChatSession(props: {chat:ChatRoom}) {
  const chatHandler = useWebSocket()
  const { isLoading, error, data:old_msgs } = useQuery<ChatMessage[]>({
    queryKey:["messages",props.chat.chat_id],
    queryFn:async () => {
      console.log(props.chat.chat_id)
      const res = await fetch(`/api/chats/msgs?chatid=${props.chat.chat_id}`, {
        method:"GET",
      })
      console.log(res)

      if(res.status != 200) {
        return []
      }
      const body = await res.json()
      console.log(body)
      return body
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
            console.log(chat_msg)
            if(chat_msg.chat_id.toLowerCase() === props.chat.chat_id) {
              setMessages((prevMessages) => [...prevMessages,chat_msg]);
            } else {
              console.log(props.chat.chat_id)
              console.log("huhhhh")
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

  const sendMessage = async () => {
    if(chatHandler.websocket === undefined) {
      return
    }
    const msg:ChatMessage = {
      event:"MESSAGE",
      sender: chatHandler.userName, // subing this for a
      content:  newMessage,
      chat_id: props.chat.chat_id,
      msg_id:uuidv4(),
      chatters:props.chat.chatters
    }
    chatHandler.websocket.send(JSON.stringify(msg));
    setMessages((prevMessages) => [...prevMessages,msg]);
    setNewMessage("")
    await fetch("/api/chats/msgs",{
      method:"POST",
      body:JSON.stringify(msg)
    })
    //todo save to db
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
      <div className='flex flex-col grow gap-2'>
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
