import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    isAdmin:{
        type: Boolean,
        required:true,
        default: false
    },
    isSeller:{
        type: Boolean,
        required: true,
        default: false
    },
    name: {
        type: String,
        validate: {
            validator: (name: string) => {
              return /^[a-zA-Z\ áéíóúÁÉÍÓÚñÑ\s]*$/.test(name);
            },
            message: 'El nombre ingresado no es válido.'
          },
        required: [true, 'El nombre es requerido.']
    },
    userId:{
        type: String,
        unique:true,
        required: true
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
        unique: [true, "El email ya existe."],
        required: [true, 'El email es requerido']
    },
    IdDocument:{
        type: Number,
    },
    dateOfBirth: {
        type: Date,
        validate: {
            validator: (date: string) => {
              return /^(?:3[01]|[12][0-9]|0?[1-9])([\-/.])(0?[1-9]|1[1-2])\1\d{4}$/.test(date);
            },
            message: 'La fecha no es válida.'
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
    },
    delivery: {
        type: Boolean,
        default: false,
        required: false
    }
})
const User = model("User", UserSchema);
module.exports = User;