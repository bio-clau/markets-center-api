import { NextFunction, Request, Response } from "express";
const Cart = require('../../models/Cart.ts');
const Order = require('../../models/Order')
const ErrorResponse = require("../../helpers/errorConstructor");

const cartController = {
    getCart: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (id) {
                const userCart = await Cart.findOne({ userId: id }).populate([{path: 'products.productId'},{ path: 'userId' }]);
                if (userCart) {
                    if (req.body.products && req.body.amount) {
                        Cart.findByIdAndUpdate(userCart._id, { $set: req.body }, { new: true, runValidators: true }, (error: Object, cart: Object) => {
                            if (error) next(new ErrorResponse("El carrito no existe", 404));
                            else {
                                return res.status(200).json({
                                    success: true,
                                    msg: "El carrito fue actualizado con exito",
                                    data: cart
                                });
                            }
                        }).populate([{path: 'products.productId'},{ path: 'userId' }]);
                    }
                    else {
                        res.status(200).json({
                            success: true,
                            msg: "El carrito fue enviado",
                            data: userCart
                        });
                    }
                }
                else {
                    next(new ErrorResponse("El carrito no existe", 404));
                }
            }
            else {
                next(new ErrorResponse("El carrito no existe", 404));
            }
        } catch (error) {
            next(error)
        }
    },

    emptyCart: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (id) {
                const userCart = await Cart.findOne({ userId: id }).populate('userId').exec();
                console.log(userCart)
                if (userCart) {
                    new Order({
                        userId: id,
                        products: userCart.products,
                        amount: userCart.amount,
                        address: userCart.userId.address,
                        status: "Approved"
                    });
                    
                    Cart.findByIdAndUpdate(userCart._id, {
                        $set: {
                            products: [],
                            amount: 0
                        }
                    },  { new: true, runValidators: true }, (error: Object, cart: Object) => {
                        if (error) next(new ErrorResponse("El carrito no existe", 404));
                        else {
                            return res.json({
                                success: true,
                                msg: "El carrito fue vaciado con exito",
                                data: cart
                            });
                        }
                    }).populate('userId');
                }
                else {
                    next(new ErrorResponse("El carrito no existe", 404));
                }
            }
            else {
                next(new ErrorResponse("El carrito no existe", 404));
            }
        } catch (error) {
            next(error)
        }
    },
}

module.exports = cartController;