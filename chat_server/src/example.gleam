// import gleam/bytes_builder
// import gleam/erlang/process.{type Subject}
// import gleam/function
// import gleam/http/request.{type Request}
// import gleam/http/response.{type Response}
// import gleam/io
// import gleam/iterator
// import gleam/list
// import gleam/option.{None, Some}
// import gleam/otp/actor
// import gleam/result
// import gleam/string
// import mist.{type Connection, type ResponseData}

// type BroadcasterMessage(a) {
//   Register(subject: Subject(a))
//   Unregister(subject: Subject(a))
//   Broadcast(msg: a)
// }

// fn broadcaster_handle_message(
//   message: BroadcasterMessage(a),
//   destinations: List(Subject(a)),
// ) {
//   case message {
//     Register(subject) -> actor.continue([subject, ..destinations])
//     Unregister(subject) ->
//       actor.continue(
//         destinations
//         |> list.filter(fn(d) { d != subject }),
//       )
//     Broadcast(inner) -> {
//       destinations
//       |> list.each(fn(dest) { process.send(dest, inner) })
//       actor.continue(destinations)
//     }
//   }
// }

// type SocketState {
//   SocketState(subject: Subject(MyMessage))
// }

// pub fn main() {
//   let assert Ok(broadcaster) = actor.start([], broadcaster_handle_message)

//   let not_found =
//     response.new(404)
//     |> response.set_body(mist.Bytes(bytes_builder.new()))

//   let assert Ok(_) =
//     fn(req: Request(Connection)) -> Response(ResponseData) {
//       case request.path_segments(req) {
//         ["ws"] -> {
//           mist.websocket(
//             request: req,
//             on_init: fn(_conn) {
//               let subject = process.new_subject()
//               let selector =
//                 process.new_selector()
//                 |> process.selecting(subject, function.identity)
//               process.send(broadcaster, Register(subject))
//               #(SocketState(subject), Some(selector))
//             },
//             on_close: fn(state) {
//               process.send(broadcaster, Unregister(state.subject))
//               io.println("goodbye!")
//             },
//             handler: handle_ws_message,
//           )
//         }
//         ["broadcast"] -> {
//           process.send(broadcaster, Broadcast(Send("foo")))
//           response.new(200)
//           |> response.set_body(mist.Bytes(bytes_builder.from_string("OK")))
//         }
//         ["echo"] -> echo_body(req)
//         ["chunk"] -> serve_chunk(req)
//         ["file", ..rest] -> serve_file(req, rest)
//         ["form"] -> handle_form(req)

//         _ -> not_found
//       }
//     }
//     |> mist.new
//     |> mist.port(5432)
//     |> mist.start_http

//   process.sleep_forever()
// }

// pub type MyMessage {
//   Send(String)
// }

// fn handle_ws_message(state, conn, message) {
//   case message {
//     mist.Text("ping") -> {
//       let assert Ok(_) = mist.send_text_frame(conn, "pong")
//       actor.continue(state)
//     }
//     mist.Text(text) -> {
//       io.debug("<<" <> text)
//       actor.continue(state)
//     }
//     mist.Binary(_) -> {
//       actor.continue(state)
//     }
//     mist.Custom(Send(text)) -> {
//       let assert Ok(_) = mist.send_text_frame(conn, text)
//       actor.continue(state)
//     }
//     mist.Closed | mist.Shutdown -> actor.Stop(process.Normal)
//   }
// }

// fn echo_body(request: Request(Connection)) -> Response(ResponseData) {
//   let content_type =
//     request
//     |> request.get_header("content-type")
//     |> result.unwrap("text/plain")

//   mist.read_body(request, 1024 * 1024 * 10)
//   |> result.map(fn(req) {
//     response.new(200)
//     |> response.set_body(mist.Bytes(bytes_builder.from_bit_array(req.body)))
//     |> response.set_header("content-type", content_type)
//   })
//   |> result.lazy_unwrap(fn() {
//     response.new(400)
//     |> response.set_body(mist.Bytes(bytes_builder.new()))
//   })
// }

// fn serve_chunk(_request: Request(Connection)) -> Response(ResponseData) {
//   let iter =
//     ["one", "two", "three"]
//     |> iterator.from_list
//     |> iterator.map(bytes_builder.from_string)

//   response.new(200)
//   |> response.set_body(mist.Chunked(iter))
//   |> response.set_header("content-type", "text/plain")
// }

// fn serve_file(
//   _req: Request(Connection),
//   path: List(String),
// ) -> Response(ResponseData) {
//   let file_path = string.join(path, "/")

//   // Omitting validation for brevity
//   mist.send_file(file_path, offset: 0, limit: None)
//   |> result.map(fn(file) {
//     let content_type = guess_content_type(file_path)
//     response.new(200)
//     |> response.prepend_header("content-type", content_type)
//     |> response.set_body(file)
//   })
//   |> result.lazy_unwrap(fn() {
//     response.new(404)
//     |> response.set_body(mist.Bytes(bytes_builder.new()))
//   })
// }

// fn handle_form(req: Request(Connection)) -> Response(ResponseData) {
//   let _req = mist.read_body(req, 1024 * 1024 * 30)
//   response.new(200)
//   |> response.set_body(mist.Bytes(bytes_builder.new()))
// }

// fn guess_content_type(_path: String) -> String {
//   "application/octet-stream"
// }
