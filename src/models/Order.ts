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
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object
    },
    status: {
        type: String,
        default: 'pending'
    }
},
{timestamps: true});

export default model('Order', orderSchema);