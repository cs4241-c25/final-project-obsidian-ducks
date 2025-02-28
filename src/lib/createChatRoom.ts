import { v4 as uuidv4 } from 'uuid';
import ChatRoom from '@/models/ChatRoom';

export default async function createChatRoom(chatters:string[]) {
  const chat_id = uuidv4();
  const chat_room = new ChatRoom()
  chat_room.chatters = chatters;
  chat_room.chat_id = chat_id
  console.log( await chat_room.save())
  return {
    chat_id:chat_id,
    chatters:chatters
  }
}
