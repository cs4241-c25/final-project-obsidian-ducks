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
import gleam/erlang/process
import gleam/dict
import youid/uuid
import messages

pub fn main() {
  io.println("Hello from chat_server!")
  let state = create_chat_server()
  let selector = process.new_selector()
  let assert Ok(_server) = create_request_handler(state,selector)
  |> mist.new
  |> mist.port(3001)
  |> mist.start_http
  process.sleep_forever()
}

type ChatServer {
  ChatServer(
    chatters:dict.Dict(String,mist.WebsocketConnection),
    active_chat_rooms:dict.Dict(messages.Id(uuid.Uuid),List(String))
  )
}

fn create_chat_server() {
  ChatServer(dict.new(),dict.new())
}

fn create_request_handler(state,selector) {
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
              #(state, option.Some(selector))
            },
            on_close: fn(_state) { io.println("goodbye!") },
            handler: handle_websocket_message,
        )
      _ ->  not_found
    }
  }
}


fn handle_websocket_message(state, conn, message) {
  case message {
    mist.Shutdown | mist.Closed -> {
      //todo remove the chatter from the list of connections
      actor.continue(state)
    }
    mist.Text(msg) -> {
      let msg_result = {
          use decoded_msg <- result.try(result.replace_error(messages.decode_message(msg),"failed to parse message"))
          case decoded_msg {
            messages.Connect(_event,sender) -> handle_connect(state,conn,sender)
            messages.CreateChat(_event,sender, chatters) -> handle_create_chat_room(state,sender,chatters)
            messages.LeaveChat(_event,sender, chat_id) -> handle_leave_chat(state,sender,chat_id)
            messages.Message(_event,sender,id,content,chat_id) -> handle_message(state,sender,id,content,chat_id)
            messages.Read(_event,sender,msg_id) -> handle_read(state,sender,msg_id)
            messages.NonValid(_event,_) -> Error("failed to parse message")
            messages.InspectChats(_event, _sender, _chat_ids) ->  handle_inspect_chats(state,conn)
          }
        }
        case msg_result |> io.debug {
          Ok(state) ->  actor.continue(state) // continue the web sockets with the state
          Error(_) ->  {
            actor.continue(state) //re use old state but still continue
          }
        }
      }
    mist.Binary(_) | mist.Custom(_) -> actor.continue(state)
  }
}

//send list of chats
fn handle_inspect_chats(state:ChatServer,conn:mist.WebsocketConnection) {
  let chats = dict.keys(state.active_chat_rooms)
  let _sent = mist.send_text_frame(conn,json.to_string(messages.encode_message_json(messages.InspectChats("","SERVER",chats))))
  Ok(state)
}

fn handle_connect(state:ChatServer,conn:mist.WebsocketConnection,sender:String) {
  //todo send the user all messages that they got while offline
  //check the db for waht chat rooms the chatter is part of
  let new_chatters = state.chatters
  |> dict.insert(sender,conn)

  //send the list of chats back
  let chats = dict.keys(state.active_chat_rooms)
  let _sent = mist.send_text_frame(conn,json.to_string(messages.encode_message_json(messages.InspectChats("","SERVER",chats))))

  Ok(ChatServer(..state,chatters:new_chatters))
}

fn handle_read(state:ChatServer,sender,msg_id) {
  todo
  //show other users in the chat that the message has been read
  Ok(state)
}

fn handle_create_chat_room(state:ChatServer,sender, chatters) {
  let chat_rooms =  state.active_chat_rooms
  |> dict.insert(uuid.v4(),[sender,..chatters])
  //create a new chat
  Ok(ChatServer(..state,active_chat_rooms:chat_rooms))
}

fn handle_leave_chat(state:ChatServer,sender,chat_id) {

  use chat_room_users <- result.try(result.replace_error(dict.get(state.active_chat_rooms,chat_id),"Failed to find chat room were the chatters at"))
  let chat_room_users = chat_room_users
  |> list.filter(fn(chatter) { chatter == sender }) // remove chatter
  let active_chat_rooms = dict.insert(state.active_chat_rooms,chat_id,chat_room_users)
  //leave a chat
  Ok(ChatServer(..state,active_chat_rooms:active_chat_rooms))
}


fn handle_message(state:ChatServer,sender,msg_id,content,chat_id) {
  use chat_room_users <- result.try(result.replace_error(dict.get(state.active_chat_rooms,chat_id),"Failed to find chat room were the chatters at"))
  chat_room_users
  |> list.map(fn(chatter) {
    dict.get(state.chatters,chatter)
  })
  |> list.each(fn(conn) {
    use conn <- result.try(conn)
    //rn we are ignoring errs
    Ok(mist.send_text_frame(conn,json.to_string(messages.encode_message_json(messages.Message("",sender,msg_id,content,chat_id)))))
  })
  // send a message in a chat
  Ok(state)
}
