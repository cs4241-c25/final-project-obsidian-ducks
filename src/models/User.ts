import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: {
        type: String,
        required: false
    },
    items: [
        {type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
        }
    ],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    } ],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Messages'
    }]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;