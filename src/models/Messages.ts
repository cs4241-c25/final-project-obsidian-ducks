import { models,model, Schema} from "mongoose";


const MessageSchema = new Schema({
  event: {
    type:String,
    enum: ["MESSAGE"]
  },
  chat_id: {
    type:String,
    required:true,
    index:true
  },
  content: {
    type:String,
    required:true,
  },
  message_id: {
    type:String,
    required:true,
  },
  sender: {
    type:String,
    required:true,
    index:true
  },


});

const Message = models.Message || model("Message",MessageSchema)

export default Message;
