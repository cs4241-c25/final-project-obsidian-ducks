import { models,model, Schema} from "mongoose";


const ChatRoomSchema = new Schema({
 chat_id: {
   type:String, //todo in some cases this can just be a string but this is largly not used by our program
 },
 chatters: {
   type:[String]
 }
});

const ChatRoom = models.ChatRoomSchema || model("ChatRooms",ChatRoomSchema)

export default ChatRoom;
