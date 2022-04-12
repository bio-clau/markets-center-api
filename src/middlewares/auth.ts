import { Request, Response, NextFunction } from "express";
const ErrorResponse = require('../helpers/errorConstructor')
const admin = require('../config/firebase')

exports.auth = async (req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers.authorization?.split(' ')[1];
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if(decodeValue){
            (<any>req)['authUser'] = decodeValue;
            return next();
        }
        return next(new ErrorResponse('Invalid Credentials', 401 ))
    } catch (err) {
        return next(new ErrorResponse('Internal Error', 500))
    }
}

//se importa este archivo en rutas y se coloca delante del controlador en las rutas privadas