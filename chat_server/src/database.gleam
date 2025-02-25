import gleam/dict
import mungo/crud
import youid/uuid
import bison/bson
import gleam/erlang/process
import mungo
import mungo/client
import bath
import messages
import gleam/result
import gleam/list

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
        #("chats",bson.String(uuid.to_string(chat_id)))
      ] |> dict.from_list))
    ],[crud.Upsert],500)
  })
}

fn find_chat_rooms(pool,user_name) {
  use conn <- bath.apply(pool, 1000)
  let chat_room_collection = mungo.collection(conn,"chats")
  use cursor <- result.try(mungo.find_many(chat_room_collection,[

  ],[],500))

  Ok(mungo.to_list(cursor,500))
}

fn insert_message(pool,msg:messages.Message) {
    use conn <- bath.apply(pool, 1000)
    mungo.collection(conn,"messages")
    |> mungo.insert_one(messages.encode_message_bson(msg),500)
}
