import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        unique: [true, "name is unique"],
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    image: {
        type: String,
        required: [true, "image is required"]
    },
    stock: {
        type: Number,
        required: [true, "stock is required"]
    },
    discount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "price is required"]
    }
});

module.exports = mongoose.model('Product', ProductSchema)