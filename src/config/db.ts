import mongoose from "mongoose";
const { MONGO_URL } = process.env;

mongoose.connect(MONGO_URL as string)
    .then(() => console.log('Database is connected'))
    .catch((error) => console.log(error));

module.exports = mongoose;