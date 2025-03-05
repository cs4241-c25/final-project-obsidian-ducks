import { v4 as uuidv4 } from 'uuid';
import ChatRoom from '@/models/ChatRooms';
import connectToDatabase from './db';

export async function createChatRoom(chatters:string[]) {
  const chat_id = uuidv4();
  await connectToDatabase()
  const chat_rooms = await ChatRoom.find({ chatters: chatters }).exec()
  if(chat_rooms.length > 0){
    return chat_rooms[0]
  }
  const chat_room = new ChatRoom()
  chat_room.chatters = chatters;
  chat_room.chat_id = chat_id
  console.log( await chat_room.save())
  return {
    chat_id:chat_id,
    chatters:chatters
  }
}

export async function findChatRooms(username: string) {
  await connectToDatabase()
  const chat_rooms = await ChatRoom.find({ chatters: username }).exec()
  return chat_rooms;
}


export async function leaveChatRoom(username: string, chat_id: string) {
  await connectToDatabase()
  const chat_room = await ChatRoom.findOne({ chat_id: chat_id }).exec()
  if(!chat_room){
    throw new Error('Chat room not found')
  }
  chat_room.chatters = chat_room.chatters.filter((chatter) => chatter !== username)
  await chat_room.save()
  return chat_room
}
