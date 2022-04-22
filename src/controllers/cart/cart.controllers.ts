import { NextFunction, Request, Response } from "express";
const Cart = require('../../models/Cart.ts');
const ErrorResponse = require("../../helpers/errorConstructor");

const cartController = {
    getCart: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            Cart.findById(id, (error: Object, cart: Object) => {
                if (error) return next(new ErrorResponse('No se encontro el carrito', 404));
                else {
                    res.json({
                        success: true,
                        msg: "El carrito fue enviado",
                        data: cart
                    });
                }
            });
        } catch (error) {
            next(error)
        }
    },

    updateCart: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            Cart.findByIdAndUpdate(id, { $set: req.body }, (error: Object, cart: Object) => {
                if (error) return next(new ErrorResponse('No se encontro el carrito', 404));
                else {
                    res.json({
                        success: true,
                        msg: "El carrito fue actualizado",
                        data: cart
                    });
                }
            })
        } catch (error) {
            next(error)
        }
    },
}

module.exports = cartController;