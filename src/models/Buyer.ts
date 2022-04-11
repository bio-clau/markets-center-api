import { Schema, model } from "mongoose";
//password: tiene que tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula.
//date: examples 31.12.3013 01/01/2013 5-3-2013 15.03.2013

const buyerSchema = new Schema({
    name: {
        type: String,
        validate: {
            validator: (name: string) => {
              return /^[a-zA-Z\ áéíóúÁÉÍÓÚñÑ\s]*$/.test(name);
            },
            message: 'Name is not valid!'
          },
        required: [true, 'Name required']
    },
    password: {
        type: String,
        validate: {
            validator: (password: string) => {
              return  /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/.test(password);
            },
            message: 'Password is not valid!'
          },
        required: [true, 'Password required']
    },
    phone: {
        type: Number,
        required: [true, 'Phone required']
    },
    email: {
        type: String,
        validate: {
            validator: (email: string) => {
              return /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm.test(email);
            },
            message: 'Email is not valid!'
          },
        required: [true, 'Email required']
    },
    DNI:{
        type: Number,
        required: [true, 'DNI required']
    },
    dateOfBirth: {
        type: Date,
        validate: {
            validator: (date: string) => {
              return /^(?:3[01]|[12][0-9]|0?[1-9])([\-/.])(0?[1-9]|1[1-2])\1\d{4}$/.test(date);
            },
            message: 'Date is not valid!'
          },
        required: false
    },
    image: {
        type: String,
        required: false
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
},
    {
        timestamps: true,
        versionKey: false
    });

export default model('Buyer', buyerSchema)