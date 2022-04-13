import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");

const User = require('../../models/Users');

const userController = {
    add: async (req:Request, res:Response, next:NextFunction) => {
        const {name, picture, user_id, email} = req.body;
        console.log(name, picture, user_id, email)
        try {
            if(await User.findOne({email: email})){
                return next(new ErrorResponse("El mail ya se encuentra registrado", 401))
            }
            console.log('accccccaaaaaa')
            const user = new User({
                name,
                image: picture,
                userId: user_id,
                email
            });
            console.log(user)
            await user.save()
            res.status(201).json({
                success: true,
                message:"Usuario ingresado satisfactoriamente",
                data:[]
            })
        } catch (error) {
            next(error)
        }
    }
}


module.exports = userController;
