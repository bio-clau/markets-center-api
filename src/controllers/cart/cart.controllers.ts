import { NextFunction, Request, Response } from "express";
const User = require('../../models/User');
const Cart = require('../../models/Cart.ts');
const Order = require('../../models/Order')
const ErrorResponse = require("../../helpers/errorConstructor");
const Product = require('../../models/Product')

const cartController = {
    getCart: async (req: Request, res: Response, next: NextFunction) => {
        const { idUser, products, amount } = req.body;
        try {
            if (idUser) {
                const iduser = await User.findOne({userId: idUser});
                const userCart = await Cart.findOne({ userId: iduser._id }).populate([{ path: 'products.productId' }, { path: 'userId' }]);
                if (userCart) {
                    if (products && amount) {
                        Cart.findByIdAndUpdate(userCart._id, {
                            $set: {
                                products: products,
                                amount: amount,
                            }
                        }, { new: true, runValidators: true }, (error: Object, cart: Object) => {
                            if (error) next(new ErrorResponse("El carrito no existe", 404));
                            else {
                                return res.status(200).json({
                                    success: true,
                                    msg: "El carrito fue actualizado con exito",
                                    data: cart
                                });
                            }
                        }).populate([{ path: 'products.productId' }, { path: 'userId' }]);
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
        const { idUser, idOrder } = req.body;
        try {
            if (idUser && idOrder) {
                const iduser = await User.findOne({userId: idUser});
                const userCart = await Cart.findOne({ userId: iduser._id }).populate('userId').exec();
                const order = await Order.findById(idOrder).populate([{ path: 'products.productId' }, { path: 'userId' }]);
                if (userCart && order) {
                    if (order.status === 'Pendiente') {
                        let allOk = false;
                        let arrOrder = order.products;
                        for await (const element of arrOrder) {
                            let stock = element.quantity;
                            let product = await Product.findById(element.productId).exec();
                            if (product.stock >= stock) {
                                allOk = true;
                                let updateStock = {
                                    "stock": product.stock - stock,
                                }
                                await Product.findByIdAndUpdate(element.productId, { $set: updateStock });
                            }
                        }
                        if (allOk) {
                            await Order.findByIdAndUpdate(idOrder, {
                                $set: {
                                    status: 'En proceso'
                                }
                            });
                            Cart.findByIdAndUpdate(userCart._id, {
                                $set: {
                                    products: [],
                                    amount: 0
                                }
                            }, { new: true, runValidators: true }, (error: Object, cart: Object) => {
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
                            return next(new ErrorResponse("Lo siento, no hay stock", 404));
                        }
                    }
                    else {
                        next(new ErrorResponse("El carrito no esta Pendiente"))
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
}

module.exports = cartController;