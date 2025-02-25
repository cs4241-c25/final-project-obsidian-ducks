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

type MongoCon = process.Subject(client.Message)

pub fn create_db_manager(url:String) {
  let assert Ok(pool) =
    bath.new(fn() {
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

fn insert_chat(pool,chat_id,chatters:List(String)) {
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

fn find_chat_rooms(pool,user_name) {
  use conn <- bath.apply(pool, 1000)
  let chat_room_collection = mungo.collection(conn,"chats")
  use user_chats <- result.try(
    mungo.find_one(chat_room_collection,[
    #("username",bson.String(user_name))
  ],[],500)
    |> result.replace_error("")
  )
  use user_chats <- result.try(option.to_result(user_chats,""))
  let chat_ids =unwrap_user_chats(user_chats)
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
  Ok(mungo.to_list(chats,500))
}

fn unwrap_user_chats(user_chats) {
  case user_chats {
    bson.Document(doc) -> {
      //we destructure the array
      case doc |> dict.to_list {
        [
          #("id",bson.ObjectId(_id)),
          #("username",bson.String(_name)),
          #("chats",bson.Array(chats))
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

fn insert_message(pool,msg:messages.Message) {
    use conn <- bath.apply(pool, 1000)
    mungo.collection(conn,"messages")
    |> mungo.insert_one(messages.encode_message_bson(msg),500)
}
