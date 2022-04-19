import mongoose from "mongoose";

interface IProduct {
    name: string;
    description: string;
    image: string;
    category: [];
    stock: number;
    price: number;
    userId: mongoose.Schema.Types.ObjectId;
}

const ProductSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    image: {
        type: String,
        required: [true, "image is required"]
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: [true, "category is required"]
    }],
    stock: {
        type: Number,
        required: [true, "stock is required"]
    },
    price: {
        type: Number,
        required: [true, "price is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema)