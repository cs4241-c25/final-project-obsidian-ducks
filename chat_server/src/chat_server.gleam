import gleam/json
import gleam/list
import gleam/otp/actor
import gleam/result
import gleam/io
import mist.{type Connection, type ResponseData}
import gleam/http/request.{type Request}
import gleam/http/response.{type Response}
import gleam/bytes_tree
import gleam/option
import gleam/erlang/process.{type Subject}
import gleam/dict
import youid/uuid
import messages

pub fn main() {
  io.println("Hello from chat_server!")
  let assert Ok(chat_server) = actor.start(create_chat_server(), handle_chat_server_message)

  let assert Ok(_server) = create_request_handler(chat_server)
  |> mist.new
  |> mist.port(3001)
  |> mist.bind("0.0.0.0")
  |> mist.start_http
  process.sleep_forever()
}

type ChatServer {
  ChatServer(
    chatters:dict.Dict(String,Subject(InternalMessages)),
    chat_rooms:dict.Dict(messages.Id(uuid.Uuid),List(String))
  )
}

type ChatServerMessage {
  GetCurrentServer(reply_to:Subject(ChatServer))
  SetCurrentServer(chat_server:ChatServer)
}

type InternalMessages {
  BroadCast(message:messages.Message)
}

fn handle_chat_server_message(msg:ChatServerMessage,chat_server) {
  case msg {
    GetCurrentServer(reply_to) -> {
      process.send(reply_to,chat_server)
      actor.continue(chat_server)
    }
    SetCurrentServer(chat_server) -> {
      actor.continue(chat_server)
    }
  }
}

fn create_chat_server() {
  ChatServer(dict.new(),dict.new())
}

fn create_request_handler(chat_server:Subject(ChatServerMessage)) {
  fn (req:Request(Connection)) { // this returns a setup handler function
    let not_found =
      response.new(404)
      |> response.set_body(mist.Bytes(bytes_tree.new()))
    case request.path_segments(req) {
      ["api","ws"] ->
          mist.websocket(
            request: req,
            on_init: fn(_conn) {
              io.debug("got a connection")
              let selector = process.new_selector()

              #(chat_server, option.Some(selector))
            },
            on_close: fn(_chat_server) { io.println("goodbye!") },
            handler: handle_websocket_message,
        )
      _ ->  not_found
    }
  }
}


fn handle_websocket_message(chat_server:Subject(ChatServerMessage), conn, message) {
  case message {
    mist.Shutdown | mist.Closed -> {
      //todo remove the chatter from the list of connections
      actor.Stop(process.Normal)
    }
    mist.Text(msg) -> {
      io.debug(msg)
      let msg_result = {
          use decoded_msg <- result.try(result.replace_error(messages.decode_message(msg),"failed to parse message"))
          case decoded_msg {
            messages.Connect(_event,sender) -> handle_connect(chat_server,conn,sender)
            messages.CreateChat(_event,sender, chatters) -> handle_create_chat_room(chat_server,sender,chatters)
            messages.ChatEvent("LEAVE_CHAT",sender, chat_id) -> handle_leave_chat(chat_server,sender,chat_id)
            messages.ChatEvent(event,sender, chat_id) -> todo
            messages.Message(_event,sender,id,content,chat_id) -> handle_rcved_message(chat_server,sender,id,content,chat_id)
            messages.Read(_event,sender,msg_id) -> handle_read(chat_server,sender,msg_id)
            messages.InspectChats(_event, _sender, _chat_ids) ->  handle_inspect_chats(chat_server,conn)
            messages.NonValid(_event,_) -> Error("failed to parse message")
          }
        }
        case msg_result |> io.debug {
          Ok(chat_server) ->  actor.continue(chat_server) // continue the web sockets with the chat_server
          Error(_) ->  {
            actor.continue(chat_server) //re use old chat_server but still continue
          }
        }
      }
    mist.Custom(BroadCast(message)) -> {
      //todo send messages here
      case message {
        messages.Message(_event,sender,id,content,chat_id) -> todo
        messages.Read(_event,sender,msg_id) ->  todo
        messages.CreateChat(_event,sender, chatters) -> todo
        messages.ChatEvent("LEAVE_CHAT",sender, chat_id) -> todo
        _ -> todo
      }
      actor.continue(chat_server)
    }
    mist.Binary(_) ->  actor.continue(chat_server)
  }
}

//send list of chats
fn handle_inspect_chats(chat_server:Subject(ChatServerMessage),conn:mist.WebsocketConnection) {
  let chat_server_state = process.call(chat_server,GetCurrentServer,10)

  let chats = dict.keys(chat_server_state.chat_rooms)
  let _sent = mist.send_text_frame(conn,json.to_string(messages.encode_message_json(messages.InspectChats("","SERVER",chats))))
  Ok(chat_server)
}

fn handle_connect(chat_server:Subject(ChatServerMessage),conn:mist.WebsocketConnection,sender:String) {
  //todo send the user all messages that they got while offline
  //check the db for waht chat rooms the chatter is part of
  io.debug("new connection")
  io.debug(sender)
  let chat_server_state = process.call(chat_server,GetCurrentServer,10)
  let new_chats = chat_server_state.chatters
  |> dict.insert(sender,process.new_subject()) |> io.debug

  //send the list of chats back
  let chats = dict.keys(chat_server_state.chat_rooms)
  let _sent = messages.InspectChats("","SERVER",chats)
  |> messages.encode_message_json()
  |> json.to_string()
  |> mist.send_text_frame(conn,_) |> io.debug

  //this should send back updates for all chats that they are part of
  process.send(chat_server,SetCurrentServer(ChatServer(..chat_server_state,chatters:new_chats)))
  Ok(chat_server)
}

fn handle_read(chat_server:Subject(ChatServerMessage),sender,msg_id) {
  todo
  //show other users in the chat that the message has been read
  Ok(chat_server)
}

fn handle_create_chat_room(chat_server:Subject(ChatServerMessage),sender, chatters) {
  io.debug("got conn")
  let chat_id = uuid.v4()
  let chat_server_state = process.call(chat_server,GetCurrentServer,10) //todo handle crash

  let chat_rooms = chat_server_state.chat_rooms
  |> dict.insert(chat_id,[sender,..chatters])
  let new_chat_room = ChatServer(..chat_server_state,chat_rooms:chat_rooms)
  process.send(chat_server,SetCurrentServer(new_chat_room))


  let _chat_to_room_res = messages.ChatEvent("JOINED_CHAT",sender,chat_id)
    |> messages.encode_message_json()
    |> json.to_string()
    |> chat_to_room(new_chat_room,chat_id,_)

  //create a new chat
  Ok(chat_server)
}

fn handle_leave_chat(chat_server:Subject(ChatServerMessage),sender,chat_id) {
  let chat_server_state = process.call(chat_server,GetCurrentServer,10)  //todo handle crash
  use chat_room_users <- result.try(result.replace_error(dict.get(chat_server_state.chat_rooms,chat_id),"Failed to find chat room were the chatters at"))
  let chat_room_users = chat_room_users
  |> list.filter(fn(chatter) { chatter == sender }) // remove chatter
  let chat_rooms = dict.insert(chat_server_state.chat_rooms,chat_id,chat_room_users)
  process.send(chat_server,SetCurrentServer(ChatServer(..chat_server_state,chat_rooms:chat_rooms)))

  //leave a chat
  Ok(chat_server)
}


fn handle_rcved_message(chat_server:Subject(ChatServerMessage),sender,msg_id,content,chat_id) {
  let chat_server_state = process.call(chat_server,GetCurrentServer,10)  //todo handle crash

  let _chat_to_room_res = messages.Message("",sender,msg_id,content,chat_id)
  |> messages.encode_message_json()
  |> json.to_string()
  |> chat_to_room(chat_server_state,chat_id,_)
  // send a message in a chat
  Ok(chat_server)
}

fn chat_to_room(chat_server:ChatServer,chat_id,msg:messages.Message) {
  io.debug(chat_server)
  dict.get(chat_server.chat_rooms,chat_id)
  |> result.replace_error("Failed to find chat room were the chatters at")
  |> result.map(fn (chat_room_users) {
    chat_room_users
    |> list.map(fn(chatter) {
      dict.get(chat_server.chatters,chatter)
    }) |> list.map(fn(conn) {
      use conn <- result.try(result.replace_error(conn,"No active conn for chatter"))
      Ok(process.send(conn,BroadCast(msg)))
    })
  })
}
