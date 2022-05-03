import { Schema, model } from "mongoose";

interface IOrder {
    userId: Schema.Types.ObjectId;
    products:[];
    amount:number;
    address:string;
    status:string;
    dispatches: [],
    purchased:[];
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
    purchased: [{
        product: {
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
                type: String,
                required: [true, "category is required"]
            }],
            price: {
                type: Number,
                required: [true, "price is required"]
            },
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        },
        quantity: {
            type: Number,
            default: 0
        }
    }],
    dispatches: [{
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        dispatched: {
            type: Boolean,
            default: false
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
        enum: ['Pendiente', 'Rechazada', 'Aprovada', 'Despachada'],
        default: 'Pendiente'
    }
},
{timestamps: true});

module.exports = model('Order', orderSchema);