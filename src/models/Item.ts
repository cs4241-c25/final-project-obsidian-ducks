import mongoose from "mongoose";

import { ITEM_CATEGORIES } from "@/lib/types";

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: String,
        enum: ITEM_CATEGORIES,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    username: {
      type: String,
        required: true
    },
    likes: {
        type: Number
    }

});

const Item =  mongoose.models.Item || mongoose.model('Item', ItemSchema);

export default Item