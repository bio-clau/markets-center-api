import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "http";

//Require ErrorHandler
const errorHandler = require("./middlewares/errorHandler")

//import routes


//init
const app = express();
dotenv.config();
require('./config/db.ts')


//settings
app.set('port', process.env.PORT || 5000);

//middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


//use routes


//ErrorHandler debe estar despues de todas las rutas
app.use(errorHandler);

//start server
const server = app.listen(app.get('port'), () => {
    console.log('Server listening on port', app.get('port'));
});


//unhandledRejecton prettier :P
process.on('inhandledRejection', (err, promise)=>{
    console.log(`Logged error: ${err}`);
    server.close(()=>{
        process.exit(1);
    })
})