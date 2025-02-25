import gleam/io
import gleam/function
import gleam/dict
import mungo/crud
import youid/uuid
import bison
import bison/bson
import gleam/erlang/process
import mungo
import mungo/client
import bath
import messages
import gleam/result
import gleam/list
import gleam/option

pub type MongoCon = process.Subject(client.Message)

pub fn create_db_manager(url:String) {
  let assert Ok(pool) =
    bath.new(fn() {
      io.debug("connected to db")
      mungo.start(
            url,
            512,
          )
    })
    |> bath.with_size(5)
    |> bath.with_shutdown(fn(conn) { process.send(conn,client.Shutdown) })
    |> bath.start(1000)
    pool
}

pub fn insert_chat(pool,chat_id,chatters:List(String)) {
  use conn <- bath.apply(pool, 1000)
  let chats_col = mungo.collection(conn,"chats")
  let _new_chat_res = mungo.insert_one(chats_col,messages.encode_chat(chat_id,chatters),500)
  list.map(chatters,fn(chatter) {
    mungo.update_one(chats_col,[
      #("username",bson.String(chatter))
    ],[
      #("$push",bson.Document([
          #("chat_id",bson.String(uuid.to_string(chat_id))),
        ] |> dict.from_list))
    ]
    ,[crud.Upsert],500)
  })
}

//todo see if we should error this
pub fn find_chat_rooms(pool,user_name) {
  use conn <- bath.apply(pool, 1000)
  case find_chat_rooms_from_db(conn,user_name) {
    Error(_) -> dict.new()
    Ok(chat_rooms) -> chat_rooms
  }
}

fn find_chat_rooms_from_db(conn,user_name) {
  let chat_room_collection = mungo.collection(conn,"chats")
  use user_chats <- result.try(
    mungo.find_one(chat_room_collection,[
    #("username",bson.String(user_name))
  ],[],500)
    |> result.replace_error("")
  )
  io.debug(user_chats)
  use user_chats <- result.try(option.to_result(user_chats,""))
  let chat_ids = unwrap_user_chats(user_chats)
  |> io.debug
  |> list.filter_map(fn(chat_id) {
    use chat_id <- result.try(chat_id)
    Ok(bson.String(chat_id))
  }) |> bson.Array

  use chats <- result.try(mungo.find_many(chat_room_collection,[
    #("chat_id",bson.Document([
      #("$in",chat_ids)
    ] |> dict.from_list))
  ],[],500)
  |> result.replace_error("cant find chats"))

  io.debug(chats)

  mungo.to_list(chats,500)
  |> list.map(unwrap_chat_rooms)
  |> list.filter_map(function.identity) // this is dumb
  |> dict.from_list
  |> Ok()
}

fn unwrap_chat_rooms(chat_room:bson.Value) {
  case chat_room {
    bson.Document(chat_room) -> {
      case chat_room |> dict.to_list {
        [
          #("_id",bson.ObjectId(_id)),
          #("chat_id",bson.String(chat_id)),
          #("chatters",bson.Array(chatters))
        ] -> {
          let chatters = chatters |> io.debug
          |> list.filter_map(fn(chatter) {
            case chatter {
              bson.String(chatter) -> {
                Ok(chatter)
              }
              _ -> Error("not a string")
            }
          })
          use chat_id <- result.try(uuid.from_string(chat_id) |> result.replace_error(""))
          Ok(#(chat_id,chatters))
        }
        _ -> {
          Error("not valid")
        }
      }
    }
    _ ->  Error("not valid")
  }
}

fn unwrap_user_chats(user_chats) {
  case user_chats {
    bson.Document(doc) -> {
      //we destructure the array
      case doc |> dict.to_list {
        [
          #("_id",bson.ObjectId(_id)),
          #("chat_id",bson.Array(chats)),
          #("username",bson.String(_name)),
        ] -> chats |> list.map(fn(value) {
          case value {
            bson.String(id) -> Ok(id)
            _ -> Error("not a string")
          }
        })
        _ -> []
      }
    }
    _ -> []
  }
}

pub fn insert_message(pool,msg:messages.Message) {
    use conn <- bath.apply(pool, 1000)
    mungo.collection(conn,"messages")
    |> mungo.insert_one(messages.encode_message_bson(msg),500)
}
