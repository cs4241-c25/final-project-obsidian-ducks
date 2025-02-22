import gleam/result
import youid/uuid
import decode/zero
import gleam/dynamic.{type Dynamic}
import gleam/json

pub type Id(a) = a

pub type Message {
  Connect(sender:String)
  CreateChat(sender:String,chatters:List(String))
  LeaveChat(sender:String,chat_id:Id(uuid.Uuid))
  Message(sender:String,msg_id:Id(uuid.Uuid),content:String,chat_id:Id(uuid.Uuid))
  Read(sender:String,msg_id:Id(uuid.Uuid))
  NonValid(sender:String)
  // Disconnect(sender:String)
}

pub fn decode_message(payload:String) {
  zero.run(dynamic.from(payload),zero.one_of(message_decoder(),[connect_decoder(),create_chat_decoder(),leave_chat_decoder()]))
}

fn connect_decoder() {
  use sender <- zero.field("sender", zero.string)
  zero.success(Connect(sender))
}
fn create_chat_decoder() {
  use sender <- zero.field("sender", zero.string)
  use chatters <- zero.field("chatters", zero.list(zero.string))
  zero.success(CreateChat(sender,chatters))
}
fn message_decoder() {
   use sender <- zero.field("sender", zero.string)
   use contnent <- zero.field("content",zero.string)
   use chat_id <- zero.field("chat_id",zero.string)
   case uuid.from_string(chat_id) {
     Ok(chat_id) -> zero.success(Message(sender,uuid.v4(),contnent,chat_id))
     Error(_) -> zero.failure(NonValid(sender),"not a valid uuid")
   }
}
fn leave_chat_decoder() {
   use sender <- zero.field("sender", zero.string)
   use chat_id <- zero.field("chat_id",zero.string)
   case uuid.from_string(chat_id) {
     Ok(chat_id) -> zero.success(LeaveChat(sender,chat_id))
     Error(_) -> zero.failure(NonValid(sender),"not a valid uuid")
   }
}

pub fn encode_message_json(message:Message) {
  case message {
    Connect(_) -> todo
    CreateChat(_, _) -> todo
    LeaveChat(_, _) -> todo
    Message(sender, msg_id, content, chat_id) -> {
      json.object([
        #("sender",json.string(sender)),
        #("msg_id",json.string(uuid.to_string(msg_id))),
        #("content",json.string(content)),
        #("chat_id",json.string(uuid.to_string(chat_id))),
      ])
    }
    NonValid(_) -> todo
    Read(_, _) -> todo
  }
}
// fn disconect_decoder() {
//   use sender <- zero.field("sender", zero.string)
//   zero.success(Disconnect(sender))
// }
