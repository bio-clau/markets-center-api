import { Schema, model } from "mongoose";

const sellerSchema = new Schema({
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
    IdDocument:{
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
        default: 'https://cdn.icon-icons.com/icons2/37/PNG/512/adduser_a%C3%B1adir_3553.png',
        required: false
    },
    adress: {
        type: String,
        required: [true, 'Adress required']
    },
    delivery: {
        type: Boolean,
        default: false,
        required: false
    },
},
    {
        timestamps: true,
        versionKey: false
    });

export default model('Seller', sellerSchema)