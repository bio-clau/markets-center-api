import { Schema, model } from "mongoose";

interface IUser {
    isAdmin: boolean;
    isSeller:boolean;
    name: string;
    userId: string;
    phone: number;
    email: any;
    IdDocument: number;
    dateOfBirth: any;
    image: string;
    address: string;
    delivery: boolean;
}

const UserSchema = new Schema<IUser>({
    isAdmin:{
        type: Boolean,
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
        default: 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png',
        required: false
    },
    address: {
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