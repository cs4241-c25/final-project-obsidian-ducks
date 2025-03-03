"use client"
import { useState, useEffect } from 'react';
import MessageDisplay from '@/components/chat/MessageDisplay';
import { useWebSocket } from '@/components/chat/ChatContext';
import { ChatMessage, ChatRoom, Message} from "@/lib/types"
import { useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export function ChatSession(props: {chat:ChatRoom}) {
  const chatHandler = useWebSocket()
  const { isLoading, error, data:old_msgs } = useQuery<ChatMessage[]>({
    queryKey:["messages",props.chat.chat_id],
    queryFn:async () => {
      const res = await fetch(`/api/chats/msgs?chatid=${props.chat.chat_id}`, {
        method:"GET",
      })

      if(res.status != 200) {
        return []
      }
      const body = await res.json()
      setMessages([])
      return body
    }
  })

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    chatHandler.addOnMessageSub("chatSession",(msg:Message) => {
        console.log(msg)
        if(props.chat === undefined) {
          console.log("ah ha")
          return
        }
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
            console.log(chat_msg.chat_id.toLowerCase() === props.chat.chat_id)
            if(chat_msg.chat_id.toLowerCase() === props.chat.chat_id) {
              setMessages((prevMessages) => [...prevMessages,chat_msg]);
            }
            break;
          case "READ_MESSAGE":
            break;
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
    <div className='flex flex-col px-10 py-10 w-full'>
      <div className='basis-3xs grow overflow-scroll'>
        <div className='flex flex-col gap-2 px-2 '>
          {old_msgs.map((message, index) => (
            <MessageDisplay username={chatHandler.userName} key={index} message={message}/>
          ))}
          {messages.filter((message) => {
            return message.chat_id.toLowerCase() === props.chat.chat_id
          }).map((message, index) => (
            <MessageDisplay username={chatHandler.userName} key={index} message={message}/>
          ))}
        </div>
      </div >
      <div className='flex flex-row gap-10 py-10'>
        <input
          type="text"
          className="border border-gray-400 grow h-12 rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />

        <button onClick={sendMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="black"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg></button>
      </div>
    </div>
  );
};
