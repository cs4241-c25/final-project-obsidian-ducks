export enum ItemCategory {
    Furniture = "Furniture",
    Electronics = "Electronics",
    Clothes = "Clothes",
    Stationary = "Stationary",
    HomeEssentials = "Home Essentials",
    HandMade = "Handmade"
}

export const ITEM_CATEGORIES = [
    ItemCategory.Furniture,
    ItemCategory.Electronics,
    ItemCategory.Clothes,
    ItemCategory.Stationary,
    ItemCategory.HomeEssentials,
    ItemCategory.HandMade
];

export type Event =
"CONNECT" |  //connect to chat server
"MESSAGE" |  //message within a chat room
"CREATE_CHAT" |  //create new chatr room
"LEAVE_CHAT" | //leave chat room
"JOINED_CHAT" |
"INSPECT_CHATS" | //find all chat rooms that client is in
"READ_MESSAGE" // send read message


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
  msg_id?:string, // must be a uuid4
  content:string,
  chat_id:string// must be a uuid 4
}

export type ReadMesage = {
  event:Event, // used in type narrowing
  sender:string,
  msg_id:string // must be a uuid4
}

export type Message = Connect | CreateChat | ChatEvent | InspectChats | ChatMessage | ReadMesage
