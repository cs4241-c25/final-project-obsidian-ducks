import { models,model, Schema} from "mongoose";


const ChatRoomSchema = new Schema({
 username: {
   type:String
 },
 chat_id: {
   type:[String], //todo in some cases this can just be a string but this is largly not used by our program
 }
});

const ChatRoom = models.ChatRoomSchema || model("Message",ChatRoomSchema)

export default ChatRoom;
