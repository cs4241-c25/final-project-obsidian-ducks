import messages
import gleam/otp/actor
import stratus
import gleam/io
import gleam/http/request
import gleeunit
import gleeunit/should
import chat_server

pub fn main() {
  gleeunit.main()
}

// gleeunit test functions end in `_test`
pub fn hello_world_test() {
  1
  |> should.equal(1)
}


pub fn test_connect() {
  //todo finish this
  // chat_server.main()
  //   let assert Ok(req) = request.to("http://localhost:3001/ws")
  //   let builder =
  //       stratus.websocket(
  //         request: req,
  //         init: fn() { #(Nil, None) },
  //         loop: fn(msg, state, conn) {
  //           case msg {
  //             stratus.Text(_msg) -> {
  //               let assert Ok(_resp) = stratus.send_text_message(conn, "hello, world!")
  //               actor.continue(state)
  //             }
  //             stratus.Binary(_msg) -> actor.continue(state)
  //             stratus.User(_) -> actor.continue(state)
  //           }
  //         },
  //       )
  //       |> stratus.on_close(fn(_state) { io.debug("closed ") Nil })

  //   let assert Ok(subj) = stratus.initialize(builder)
  //   stratus.call(subj,messages.Message,100)
}
