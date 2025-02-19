import { models,model, Schema} from "mongoose";


const MessageSchema = new Schema({
  event: {
    type:String,
    enum: ["Register","Message"]
  },
  message: {
    type:String,
    required:true,
  },
  sender: {
    type:String,
    required:true,
    index:true
  },
  recver: {
    type:String,
    required:true,
    index:true
  }
});

const Message = models.Message || model("Message",MessageSchema)

export default Message;
