import { Schema, model } from "mongoose";

// interface IOrder {
//     userId: Schema.Types.ObjectId;
//     products:[];
//     amount:number;
//     address:string;
//     status:string;
// }
const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
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
        type: String
    },
    status: {
        type: String,
        default: 'pending'
    }
},
{timestamps: true});

module.exports = model('Order', orderSchema);