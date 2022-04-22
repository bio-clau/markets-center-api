import {Schema, model} from "mongoose";
//password: tiene que tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula.
//date: examples 31.12.3013 01/01/2013 5-3-2013 15.03.2013

interface ICart {
    amount: number;
    userId: Schema.Types.ObjectId;
    products:[];
}

const cartSchema = new Schema<ICart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
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
    }
},
    {
        timestamps: true,
        versionKey: false
    });

module.exports = model('Cart', cartSchema);