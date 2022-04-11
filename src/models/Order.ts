import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    products: [{
        productId: String,
        quantity: {
            type: Number,
            default: 1
        }
    }],
    mount: {
        type: Number
    }
});

export default model('Order', orderSchema);