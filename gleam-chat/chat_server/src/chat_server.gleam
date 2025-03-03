import simplifile
import bath
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
import gleam/erlang/node
import gleam/erlang/atom
import gleam/erlang/process.{type Subject}
import gleam/dict
import youid/uuid
import messages
import gleam/function
import gleam/string
import envoy
import nessie_cluster
import gleam/otp/supervisor
import gleam/dynamic

pub fn main() {
  io.println("Hello from chat_server!")
  envoy.all() |> io.debug()
  let dns_query = case envoy.get("FLY_APP_NAME") |> io.debug {
    Ok(app_name) -> nessie_cluster.DnsQuery(app_name <> ".internal") |> io.debug
    Error(Nil) -> nessie_cluster.Ignore
  }
  let cluster: nessie_cluster.DnsCluster =
      nessie_cluster.with_query(nessie_cluster.new(), dns_query) |> io.debug

  let cluster_worker = fn(_) {
      nessie_cluster.start_spec(cluster, option.None)
  }

  let assert Ok(chat_server) = actor.start(create_chat_server(), handle_chat_server_message)

  let server = fn(_) {
    create_request_handler(chat_server)
    |> mist.new
    |> mist.port(3001)
    |> mist.bind("0.0.0.0")
    |> mist.start_http
    |> result.map_error(fn(e) { actor.InitCrashed(dynamic.from(e)) })
  }

  let assert Ok(_) =
    supervisor.start(fn(children) {
      children
      |> supervisor.add(supervisor.worker(cluster_worker))
      |> supervisor.add(supervisor.worker(server))
    })

  //todo be able to shut down process
  process.sleep_forever()
}

type ClientState {
  ClientState(
    id:uuid.Uuid,
    name:String,
    sub:Subject(InternalMessages),
    server:Subject(ChatServerMessage),
    chat_rooms:messages.ChatRooms, //todo just have this be a list of uuids
  )
}
type InternalMessages {
  BroadCast(message:messages.Message)
}


type ChatServer {
  ChatServer(
    //todo maintain a dict of
    connections:dict.Dict(uuid.Uuid,Subject(InternalMessages)),
    online_chatters:dict.Dict(String,uuid.Uuid),
    id_to_name:dict.Dict(uuid.Uuid,String),
)
}

//todo update this to be a bunch of diffrent messages
type ChatServerMessage {
  RegisterConnection(id:uuid.Uuid,Subject(InternalMessages))
  AddChatter(name:String,id:uuid.Uuid)
  GetCurrentServer(reply_with:Subject(ChatServer))
  LogoffUser(id:uuid.Uuid)
}

fn handle_chat_server_message(msg:ChatServerMessage,chat_server:ChatServer) {
  case msg {
    AddChatter(name, id) -> {
      let online_chatters = chat_server.online_chatters |> dict.insert(name,id)
      let id_to_name = chat_server.id_to_name |> dict.insert(id,name)
      actor.continue(ChatServer(..chat_server,id_to_name:id_to_name,online_chatters:online_chatters))
    }
    RegisterConnection(id, sub) -> {
      let connections = chat_server.connections |> dict.insert(id,sub)
      actor.continue(ChatServer(..chat_server,connections:connections))
    }
    GetCurrentServer(reply_to) -> {
      process.send(reply_to,chat_server)
      actor.continue(chat_server)
    }
    LogoffUser(id) -> {
      io.debug("logging off user")
      case dict.get(chat_server.id_to_name ,id) {
        Ok(name) -> {
           io.debug(name)
          let chatters = chat_server.online_chatters |> dict.delete(name)
          let id_to_name = chat_server.id_to_name |> dict.delete(id)
          let connections = chat_server.connections |> dict.delete(id)

          actor.continue(ChatServer(..chat_server,connections:connections,online_chatters:chatters,id_to_name:id_to_name))

        }
        Error(err) -> {
          io.debug(err)
          let connections = chat_server.connections |> dict.delete(id)
          //case connections |> dict.size {
            // 0 -> actor.Stop(process.Normal)
            // _ -> {
          //process.kill(chat_server.main_pid)
          actor.continue(ChatServer(..chat_server,connections:connections))
          //   }
          // }
        }
      }
    }
  }
}

fn create_chat_server() {
  ChatServer(dict.new(),dict.new(),dict.new())
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
              // io.debug("got a connection")
              let id = uuid.v4()

              let subject = process.new_subject()
              let selector = process.new_selector()
              |> process.selecting(subject, function.identity)

              process.send(chat_server,RegisterConnection(id,subject))

              #(ClientState(id,"",subject,chat_server,dict.new()), option.Some(selector))
            },
            on_close: fn(state) {
              io.println("goodbye!")
              process.send(chat_server,LogoffUser(state.id))
              Nil
            },
            handler: handle_websocket_message,
        )
      ["api","nodes"] -> {
        let nodes =
          node.visible()
          |> list.append([node.self()])
          |> list.map(fn(a) { atom.to_string(node.to_atom(a)) })
          |> string.join(", ")
          |> string.append("nodes:",_)

        response.new(200)
        |> response.set_body(mist.Bytes(bytes_tree.from_string(nodes)))
        |> response.set_header("content-type", "text")
      }
      _ ->  not_found
    }
  }
}


fn handle_websocket_message(client_state:ClientState, conn, message) {
  case message {
    mist.Shutdown | mist.Closed -> {
      //todo remove the chatter from the list of connections
      actor.Stop(process.Normal)
    }
    mist.Text(msg) -> {
      // io.debug(msg)
      let msg_result = {
          use decoded_msg <- result.try(result.replace_error(messages.decode_message(msg),"failed to parse message"))
          case decoded_msg |> io.debug {
            messages.Connect(_event,sender) -> handle_connect(client_state,conn,sender)
            messages.CreateChat(_event,sender, chatters) -> handle_create_chat_room(client_state,conn,sender,chatters)
            messages.ChatEvent("LEAVE_CHAT",sender, chat_id) -> handle_leave_chat(client_state,conn,sender,chat_id)
            messages.ChatEvent(event,sender, chat_id) -> todo
            messages.Message(_event,sender,id,content,chat_id,chatters) -> handle_sent_message(client_state,conn,sender,id,content,chat_id,chatters)
            messages.Read(_event,sender,msg_id) -> handle_read(client_state,conn,sender,msg_id)
            messages.InspectChats(_event, _sender, _chat_ids) ->  handle_inspect_chats(client_state,conn)
            messages.NonValid(_event,_) -> Error("failed to parse message")
            _ -> Ok(client_state) // ignore all other messages
          }
        }
        case msg_result {
          Ok(chat_server) ->  actor.continue(chat_server) // continue the web sockets with the chat_server
          Error(_) ->  {
            actor.continue(client_state) //re use old chat_server but still continue
          }
        }
      }
    mist.Custom(BroadCast(message)) -> {
      //todo send messages here
      // io.debug("we got a message! from a subject")
      io.debug(message)
      case message {
        messages.Message(_event,_sender,_id,_content,_chat_id,_chatters) -> {
          send_message(message,conn)
          actor.continue(client_state)
        }
        messages.Read(_event,sender,msg_id) -> actor.continue(client_state)
        messages.CreateChat(_event,sender, chatters) ->  actor.continue(client_state)
        messages.ChatEvent("LEAVE_CHAT",sender, chat_id) ->  {
          case dict.get(client_state.chat_rooms,chat_id) {
            Ok(chat_room) ->  {
              let chat_rooms = chat_room
              |> list.filter(fn(chatter) {chatter != sender })
              |> dict.insert(client_state.chat_rooms,chat_id,_)

              send_message(message,conn)
              actor.continue(ClientState(..client_state,chat_rooms:chat_rooms))
            }
            Error(_) -> {
              actor.continue(client_state)
            }
          }
        }
        messages.ChatEvent(_event,_sender, _chat_id) ->  {
          send_message(message,conn)
          actor.continue(client_state)
        }
        messages.AddedToChat(_event,sender,chat_id,chatters) -> {
          io.debug("Huhh")
          let chat_rooms =  client_state.chat_rooms
          |> dict.insert(chat_id,[sender, ..chatters])
          send_message(message,conn)
          actor.continue(ClientState(..client_state, chat_rooms:chat_rooms))
        }
        _ -> actor.continue(client_state)
      }
    }
    mist.Binary(_) ->  actor.continue(client_state)
  }
}

fn send_message(msg,conn) {
  let _res = msg
  |> messages.encode_message_json
  |> json.to_string
  |> mist.send_text_frame(conn,_)
}

//send list of chats
fn handle_inspect_chats(client_state:ClientState,conn:mist.WebsocketConnection) {

  let chats = dict.keys(client_state.chat_rooms)
  let _sent = mist.send_text_frame(conn,json.to_string(messages.encode_message_json(messages.InspectChats("","SERVER",chats))))
  Ok(client_state)
}

fn handle_connect(client_state:ClientState,_conn:mist.WebsocketConnection,sender:String) {
  //todo send the user all messages that they got while offline
  //check the db for waht chat rooms the chatter is part of
  // io.debug("new connection")
  // io.debug(sender)
  io.debug("just added a new client")
  process.send(client_state.server,AddChatter(sender,client_state.id))

  // use chats <- result.try(database.find_chat_rooms(client_state.pool,sender) |> io.debug |> result.replace_error("failed to connect"))
  // io.debug(chats)
  // //send the list of chats back
  // let chat_ids = dict.keys(chats)
  //
  //todo I need to get chats but I cant access the databse
  // let _sent = messages.InspectChats("","SERVER",[])
  // |> messages.encode_message_json()
  // |> json.to_string()
  // |> mist.send_text_frame(conn,_)
  // |> io.debug

  //this should send back updates for all chats that they are part of
  // process.send(client_state.server,SetCurrentServer(ChatServer(..chat_server_state,chatters:new_chats)))
  Ok(ClientState(..client_state,chat_rooms:dict.new(),name:sender))
}

fn handle_read(client_state:ClientState,conn,sender,msg_id) {
  //show other users in the chat that the message has been read
  Ok(client_state)
}

fn handle_create_chat_room(client_state:ClientState,conn,sender:String, chatters:List(String)) {
  // io.debug("got conn")
  let chat_id = uuid.v4()

  let chat_rooms = client_state.chat_rooms
  |> dict.insert(chat_id,[client_state.name,..chatters])

  //todo add to dict

  let message = messages.AddedToChat("ADDED_TO_CHAT",sender,chat_id,chatters)
  send_message(message,conn)

  let _chat_to_room_res = message
    |> chat_to_room(client_state,client_state.id,chatters,_)
  //tell the room that the chat has been created

  // let _db_res = database.insert_chat(client_state.pool,chat_id,[sender,..chatters])

  //create a new chat
  Ok(ClientState(..client_state,chat_rooms:chat_rooms))
}

fn handle_leave_chat(client_state:ClientState,_conn,sender,chat_id) {
  //tell all other chats ur leaving
  let _res = client_state.chat_rooms
  |> dict.get(chat_id)
  |> result.map(
    chat_to_room(client_state,client_state.id,_,messages.ChatEvent("LEAVE_CHAT",sender,chat_id))
  )
  //delete the room from your memory
  let chats = client_state.chat_rooms
  |> dict.delete(chat_id)

  Ok(ClientState(..client_state,chat_rooms:chats))
}


fn handle_sent_message(client_state:ClientState,_conn,sender,msg_id,content,chat_id,chatters) {
  io.debug("message")
 let message = messages.Message("MESSAGE",sender,msg_id,content,chat_id,chatters)
  io.debug(message)
  let _res = {
    //this is to silence the failyers
    // use chatters <- result.try(dict.get(client_state.chat_rooms,chat_id))
    let _chat_to_room_res = message
    |> chat_to_room(client_state,client_state.id,chatters,_)
    |> result.all()
    |> io.debug
  }
  // let _insert_res = database.insert_message(client_state.pool,message)
  // send a message in a chat
  Ok(client_state)
}

//todo simplify this
fn chat_to_room(state:ClientState,self:uuid.Uuid,users:List(String),msg:messages.Message) {
  let chat_server = process.call(state.server,GetCurrentServer,10)  //todo handle crash
  io.debug(chat_server)
  users
  |> list.filter_map(dict.get(chat_server.online_chatters,_))
  |> io.debug
  |> list.filter_map(fn(id) {
    case id == self  {
      True -> Error(Nil)
      False -> dict.get(chat_server.connections,id) |> io.debug
    }
  })
  |> list.map(fn(socket) {
    Ok(process.send(socket,BroadCast(msg)))
  })
}
