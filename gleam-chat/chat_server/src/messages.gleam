import gleam/result
import youid/uuid
import decode/zero
import gleam/dynamic.{type Dynamic}
import gleam/json
import gleam/list
import gleam/io
import bison/bson
import gleam/dict

pub type Id(a) = a

pub type ChatRooms = dict.Dict(Id(uuid.Uuid),List(String))


pub type Message {
  Connect(event:String, sender:String)
  InspectChats(event:String,sender:String,List(Id(uuid.Uuid))) // this sends back a list of chats
  CreateChat(event:String,sender:String,chatters:List(String))
  AddedToChat(event:String,sender:String,chat_id:Id(uuid.Uuid),chatters:List(String))
  ChatEvent(event:String,sender:String,chat_id:Id(uuid.Uuid))
  Message(event:String,sender:String,msg_id:Id(uuid.Uuid),content:String,chat_id:Id(uuid.Uuid),chatters:List(String))
  Read(event:String,sender:String,msg_id:Id(uuid.Uuid))
  NonValid(event:String,sender:String)
  // Disconnect(sender:String)
}

pub fn decode_message(payload:String) {
  json.decode(payload,message_decoder())
}
pub fn message_decoder() {
  fn(dynamic) {
    let decoder = zero.one_of(chat_message_decoder(),[
      connect_decoder()
      ,send_chats_decoder()
      ,create_chat_decoder()
      ,chat_event_decoder()]
    )
    zero.run(dynamic,decoder)
    // |> io.debug()
  }
}

fn connect_decoder() {
  use event <- zero.field("event", zero.string)
  use sender <- zero.field("sender", zero.string)
  case event {
    "CONNECT" ->  zero.success(Connect(event,sender))
    _ -> zero.failure(NonValid(event,sender),"not correct event")
  }
}
fn chat_message_decoder() {
  use event <- zero.field("event", zero.string)
   use sender <- zero.field("sender", zero.string)
   use message_id <- zero.field("msg_id",zero.string)
   use contnent <- zero.field("content",zero.string)
   use chat_id <- zero.field("chat_id",zero.string)
   use chatters <- zero.field("chatters",zero.list(zero.string))
   let res = {
   use chat_id <- result.try(uuid.from_string(chat_id))
   use message_id <- result.try(uuid.from_string(message_id))
    Ok(zero.success(Message(event,sender,message_id,contnent,chat_id,chatters)))
  }
  case res |> io.debug {
    Ok(sucess) -> sucess
    Error(_) -> zero.failure(NonValid(event,sender),"not a valid uuid")
  }
}
fn create_chat_decoder() {
  use event <- zero.field("event", zero.string)
  use sender <- zero.field("sender", zero.string)
  use chatters <- zero.field("chatters", zero.list(zero.string))
  zero.success(CreateChat(event,sender,chatters))
}
fn chat_event_decoder() {
  use event <- zero.field("event", zero.string)
   use sender <- zero.field("sender", zero.string)
   use chat_id <- zero.field("chat_id",zero.string)
   case uuid.from_string(chat_id) {
     Ok(chat_id) -> zero.success(ChatEvent(event,sender,chat_id))
     Error(_) -> zero.failure(NonValid(event,sender),"not a valid uuid")
   }
}
fn send_chats_decoder() {
  use event <- zero.field("event", zero.string)
  use sender <- zero.field("sender", zero.string)
  use chat_ids <- zero.field("chat_id",zero.list(zero.string))
  let chat_ids = list.map(chat_ids,fn(chat_id) {
    uuid.from_string(chat_id)
  }) |> result.all


  case chat_ids {
    Ok(chat_ids) -> zero.success(InspectChats(event,sender,chat_ids))
    Error(_) -> zero.failure(NonValid(event,sender),"not a valid uuid")
  }
}

pub fn encode_message_json(message:Message) {
  case message {
    Connect(_,_) -> todo
    CreateChat(_,_, _) -> todo
    ChatEvent(event,sender, chat_id) -> {
      json.object([
        #("event",json.string(event)),
        #("sender",json.string(sender)),
        #("chat_id",json.string(uuid.to_string(chat_id))),
      ])
    }
    Message(_event,sender, msg_id, content, chat_id,chatters) -> {
      json.object([
        #("event",json.string("MESSAGE")),
        #("sender",json.string(sender)),
        #("msg_id",json.string(uuid.to_string(msg_id))),
        #("content",json.string(content)),
        #("chat_id",json.string(uuid.to_string(chat_id))),
        #("chatters",json.array(chatters,json.string)),
      ])
    }
    NonValid(_,_) -> todo
    Read(_,_, _) -> todo
    InspectChats(_event,sender, chats) -> {
      let chats = list.map(chats,uuid.to_string(_))
      json.object([
        #("event",json.string("INSPECT_CHATS")),
        #("sender",json.string(sender)),
        #("chats",json.array(chats ,json.string)),
      ])
    }
    AddedToChat(_, sender, chat_id, chatters) -> {
      json.object([
        #("event",json.string("ADDED_TO_CHAT")),
        #("sender",json.string(sender)),
        #("chatters",json.array(chatters,json.string)),
        #("chat_id",json.string(uuid.to_string(chat_id))),
      ])
    }
  }
}




// fn disconect_decoder() {
//   use sender <- zero.field("sender", zero.string)
//   zero.success(Disconnect(sender))
// }
