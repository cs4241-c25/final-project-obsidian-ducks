import mongoose, {mongo, Schema} from 'mongoose'

const LikeSchema = new mongoose.Schema({
    itemID: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true},
    username: {type: String, ref: 'User'},
    isLiked: {type: Boolean, default: false}

})
const Like = mongoose.models.Like || mongoose.model('Like', LikeSchema)

export default Like