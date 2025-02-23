import mongoose, {mongo, Schema} from 'mongoose'

const LikeSchema = new mongoose.Schema({
    itemID: {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    isLiked: {type: Boolean}

})
const Like = mongoose.models.Like || mongoose.model('Like', LikeSchema)

export default Like