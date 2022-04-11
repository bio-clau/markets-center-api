require('dotenv').config({path:'../.env'});
const cloudinary = require('cloudinary');

//configuracion cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = {cloudinary}

//cuando se requiera, importar el modulo de este archivo