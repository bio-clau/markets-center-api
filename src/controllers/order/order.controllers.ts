import { Response, Request, NextFunction } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");
const Order = require('../../models/Order')

const orderControllers = {
    addOrder: (req: Request, res: Response, next: NextFunction) => {
        const newOrder = new Order(req.body);
        try {
            newOrder.save((error: Object, order: Object) => {
                // AGREGAR QUE SE ENVIE AL EMAIL DEL COMPRADOR -- SO DIFICULT
                if(error) return next(new ErrorResponse("All parameters are required", 404));
                if(order) {
                    res.json({
                        success: true,
                        msg: 'The order was created',
                        data: order
                    })
                }
            })
        } catch (error) {
            next(error)
        }
    },
    sendOrder: async(req: Request, res: Response, next: NextFunction) => {
        const {id} = req.params
        try {
            const orderId = await Order.findById(id).populate({path: 'user', select: 'name'}).exec();
            if(Object.keys(orderId).length > 0) {
                res.json({
                    success: true,
                    msg: 'The order were founded',
                    data: orderId
                })
            }
            else {
                return next(new ErrorResponse("That product isn't exist", 404))
            }
        } catch (error) {
            next(error);
        }
    },
}

module.exports = orderControllers;