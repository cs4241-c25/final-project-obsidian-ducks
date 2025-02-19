"use client"
import { useState, useEffect } from 'react';
import MessageDisplay from './MessageDisplay';
import { useWebSocket } from './chatContext';



export default function ChatSession() {
  const webSocket = useWebSocket()
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    webSocket.onmessage = (event) => {
      if (event.data === "connection established") return;
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
  }, []);

  const sendMessage = () => {
    webSocket.send(JSON.stringify({
      event:"MESSAGE",
      message:newMessage,
      sender:"",
      recver:"",
      read:false
    }));
    setNewMessage('');
  };

  return (
    <div className='w-full'>
      <h1>Real-Time Chat</h1>
      <div className='flex flex-col gap-10'>
        {messages.map((message, index) => (
          <MessageDisplay key={index} message={{
            event:"MESSAGE",
            message:message,
            sender:"",
            recver:"",
            read:false
          }}/>
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
