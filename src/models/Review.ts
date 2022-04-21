import { Schema, model } from "mongoose";

const ReviewSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: null
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    rating: {
        type: Number,
        default: 0
    },
    review: {
        type: String,
        trim: true
    }
})

module.exports = model('Review', ReviewSchema);