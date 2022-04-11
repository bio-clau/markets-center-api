import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//use routes

//start server
app.listen(app.get('port'), () => {
    console.log('Server listening on port', app.get('port'));
});

