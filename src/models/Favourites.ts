import mongoose from "mongoose";
import {Schema, model} from "mongoose";

interface IFavs {
    userId: mongoose.Schema.Types.ObjectId,
    favs: []
}

const FavsSchema = new Schema<IFavs>({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    favs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
})

const Favs = model("Favs", FavsSchema);
module.exports = Favs;