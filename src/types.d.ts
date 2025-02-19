export type Event = "REGISTER" | "MESSAGE"

export type Message = {
  event:Event
  message:string,
  sender:string,//todo change this to an id?
  recver:string,//todo change this to a user id or chat id?
  read:boolean
}
