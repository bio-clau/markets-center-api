import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        validate: {
            validator: (name: string) => {
              return /^[a-zA-Z\ áéíóúÁÉÍÓÚñÑ\s]*$/.test(name);
            },
            message: 'Name is not valid!'
          },
        required: [true, 'Name required']
    }
})