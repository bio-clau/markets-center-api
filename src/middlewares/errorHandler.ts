import { Request, Response, NextFunction } from "express";
const ErrorResponse = require('../helpers/errorConstructor')


const errorHandler = (err:any, req:Request, res: Response, next:NextFunction) => {
    let error = {...err};
    if(err.code === 11000){
        const message = "Duplicate Field Value Enter";
        error = new ErrorResponse(message, 400);
    }
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map((val:any)=> val.message);
        error = new ErrorResponse(message, 400);
    }

    //Si el mensaje o el status no se envia, entonces es Server Error y statusCode 500
    console.log('error:', error)
    res.status(error.statusCode || 500).json({
        success:false,
        msg: error.message || "Server Error"
    });
}

module.exports = errorHandler;
