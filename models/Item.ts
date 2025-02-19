import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: [
            "Furniture",
            "Electronics",
            "Clothes",
            "Stationary",
            "Home Essentials",
            "Handmade"],
        required: true,
    },
  /*  photo: {
        type: String,
        required: true,
    },*/
    price: {
        type: String,
        required: true,
    }
})
const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);

export default Item