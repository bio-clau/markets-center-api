import { Schema, model } from "mongoose";

interface IOrder {
    userId: Schema.Types.ObjectId;
    products:[];
    amount:number;
    address:string;
    status:string;
}
const orderSchema = new Schema<IOrder>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El user es requerido.']
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Almenos un producto es requerido.']
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    amount: {
        type: Number,
        required: [true, 'El monto es requerido.']
    },
    address: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending'
    }
},
{timestamps: true});

module.exports = model('Order', orderSchema);