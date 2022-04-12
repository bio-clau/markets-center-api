import { Schema, model } from "mongoose";
const bcrypt = require("bcryptjs");

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
    password: {
        type: String,
        select: false,
    },
    phone: {
        type: Number,
        required: [true, 'El numero de teléfono es requerido.']
    },
    email: {
        type: String,
        unique: [true, "El email ya existe."],
        required: [true, 'El email es requerido']
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
        required: [true, 'Adress required']
    },
    delivery: {
        type: Boolean,
        default: false,
        required: false
    }
})
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

export default model('User', UserSchema)