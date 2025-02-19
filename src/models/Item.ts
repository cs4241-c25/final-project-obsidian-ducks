import { Schema, model } from "mongoose";

import { ITEM_CATEGORIES } from "@/lib/types";

const ItemSchema = new Schema({
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
    }
});

const Item = model('Item', ItemSchema);

export default Item