import { model, Schema} from "mongoose";


const ChatRooms = new Schema({
 chat_id: {
   type:String, //todo in some cases this can just be a string but this is largly not used by our program
 },
 chatters: {
   type:[String]
 }
});
let ChatRoom
try {
    ChatRoom = model("ChatRooms")
} catch {
    ChatRoom = model("ChatRooms",ChatRooms)
}



export default ChatRoom;
