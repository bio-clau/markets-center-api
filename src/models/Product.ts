import mongoose from "mongoose";

interface IProduct {
    name: string;
    description: string;
    image: string;
    category: [];
    stock: number;
    price: number;
    reviews: [];
    numReviews: number;
    rating: number;
    userId: mongoose.Schema.Types.ObjectId;
}

const ReviewSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        rating: {
            type: Number,
            default: 0
        },
        comment: {
            type: String,
            trim: true
        }
    }, {
        timestamps: true
    }
)

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
    },
    reviews: [ReviewSchema],
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema)