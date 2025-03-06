import ws from 'k6/ws';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { vu } from 'k6/execution';
import { Counter } from 'k6/metrics';
const MAX_VU_NUM = 100

const messagesSent = new Counter('messages_sent');
const messagesRcved = new Counter('messages_received');

export const options = {
  stages: [
    { duration: '2m30s', target: 100 },
    { duration: '1m', target: 0 },
  ],
};
//
// export const options = {
//   scenarios: {
//     login: {
//       executor: 'per-vu-iterations',
//       vus: MAX_VU_NUM,
//       iterations: 20,
//       maxDuration: '2m',
//     },
//   },
// };


const users = new SharedArray('users', function () {
  const arr = []
  for (let i = 0; i < MAX_VU_NUM;i++) {
    arr.push(i.toString())
  }
  return arr
});


export default function test() {
  const url = 'ws://localhost:3001/api/ws';
  const params = { tags: { my_tag: 'hello' } };
  let username = users[vu.idInTest - 1];
  let chat_ids = [];
  let sent = 0;


  const res = ws.connect(url, params, function (socket) {
    socket.on('open', () => {
      let json_string = JSON.stringify({
        event:"CONNECT",
        sender:username
      })
      socket.send(json_string)
      console.log("starting time out")
      socket.setTimeout(() => {
        console.log("sending create chat")
        let chatters = [users[Math.floor(Math.random() * users.length)]]
        console.log(`creating chat with ${chatters}`)
         socket.setInterval(() => {
          if(sent>= 500) {
            console.log(bypassi)
            return;
          }
          socket.send(JSON.stringify({
              event:"MESSAGE",
              sender: username, // subing this for a
              content:  "YIPEEE",
              chatters: [username,...chatters]
            }))
          messagesSent.add(1)
          sent += 1;
        },500)
      },500)
    })
    socket.on('message', (data) => {
      let msg = JSON.parse(data)
      switch (msg.event) {
        case "CONNECT":
          break;
        case "INSPECT_CHATS":
          const chats = msg.chats
          console.log(chats)
          chat_ids=chats
          break;
        case "CREATE_CHAT":
          break;
        case "LEAVE_CHAT":
          break;
        case "ADDED_TO_CHAT":
          console.log(msg)
          chat_ids.push(msg.chat_id);
          break;
        case "MESSAGE":
          console.log("got message")
          console.log(msg)
          check(msg.content,"YIPEEE")
          messagesRcved.add(1)
          break;
        case "READ_MESSAGE":
          break;
      }
    });
    socket.on('close', () => console.log('disconnected'));
  });


  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
