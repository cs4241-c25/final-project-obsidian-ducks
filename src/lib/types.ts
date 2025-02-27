export enum ItemCategory {
    Clothes = "Clothes",
    Electronics = "Electronics",
    HomeEssentials = "Home Essentials",
    HandMade = "Handmade",
    Furniture = "Furniture",
    Stationary = "Stationary"
}

export const ITEM_CATEGORIES = [
    ItemCategory.Clothes,
    ItemCategory.Electronics,
    ItemCategory.Furniture,
    ItemCategory.HomeEssentials,
    ItemCategory.HandMade,
    ItemCategory.Stationary,
];

export type Item = {
    id: string;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
}

export type Event =
"CONNECT" |  //connect to chat server
"MESSAGE" |  //message within a chat room
"CREATE_CHAT" |  //create new chatr room
"LEAVE_CHAT" | //leave chat room
"ADDED_TO_CHAT" |
"INSPECT_CHATS" | //find all chat rooms that client is in
"READ_MESSAGE" // send read message

export type ChatRoom = {
  chat_id:string
  chatters:string[]
}

//the message type as a normal typescript type
export type Connect  = {
  event:Event, // used in type narrowing
  sender:string
}

export type CreateChat = {
  event:Event, // used in type narrowing
  sender:string,
  chatters:string[]
}

export type ChatEvent = {
  event:Event, // used in type narrowing
  sender:string,
  chat_id:string // must be a uuid4
}
export type InspectChats  = {
  event:Event, // used in type narrowing
  sender:string,
  chats:string[] // must be a uuid4
}

export type ChatMessage = {
  event:Event, // used in type narrowing
  sender:string,
  msg_id:string, // must be a uuid4
  content:string,
  chat_id:string// must be a uuid 4
  chatters:string[]// must be a uuid 4
}

export type ReadMesage = {
  event:Event, // used in type narrowing
  sender:string,
  msg_id:string // must be a uuid4
}

export type Message = Connect | CreateChat | ChatEvent | InspectChats | ChatMessage | ReadMesage
