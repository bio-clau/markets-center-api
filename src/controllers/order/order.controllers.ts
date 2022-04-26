import { Response, Request, NextFunction } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");
import { checkoutMail } from '../../mail/checkout'
const sendMail = require('../../config/sendMail');
const Order = require('../../models/Order');
const User = require("../../models/User");
const Product = require('../../models/Product')
const Cart = require('../../models/Cart.ts');
const Stripe = require('stripe')
const { STRIPE_API_KEY } = process.env
const stripe = new Stripe(STRIPE_API_KEY)

const orderControllers = {
    addOrder: async (req: Request, res: Response, next: NextFunction) => {
        const { idUser } = req.body
        try {
            if (idUser) {
                const userCart = await Cart.findOne({ userId: idUser }).populate('userId').exec();
                if (userCart) {
                    const order = new Order({
                        userId: idUser,
                        products: userCart.products,
                        amount: userCart.amount,
                        address: userCart.userId.address,
                        status: "Pending"
                    });
                    order.save((error: Object, order: Object) => {
                        if (error) return next(new ErrorResponse("All parameters are required", 404));
                        if (order) {
                            return res.json({
                                success: true,
                                msg: 'The order was created',
                                data: order
                            })
                        }
                    });
                }
                else {
                    return next(new ErrorResponse("El carrito de esa persona no existe", 404))
                }
            }
            else {
                return next(new ErrorResponse("Todos los parametros son requeridos", 404))
            }
        } catch (error) {
            next(error)
        }
    },

    sendOrder: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const orderId = await Order.findById(id).populate([{ path: 'products.productId' }, { path: 'userId' }]);
            if (Object.keys(orderId).length > 0) {
                res.json({
                    success: true,
                    msg: 'Orden encontrada',
                    data: orderId
                })
            }
            else {
                return next(new ErrorResponse("La orden no existe", 404))
            }
        } catch (error) {
            next(error);
        }
    },

    updateOrder: async (req: Request, res: Response, next: NextFunction) => {
        const { idOrder, status } = req.body
        try {
            if (idOrder && status) {
                const order = await Order.findById(idOrder).populate([{ path: 'products.productId' }, { path: 'userId' }]);
                if (!order) {
                    return next(new ErrorResponse("La orden no existe", 404))
                }
                if (order.status === 'In process' && status === 'Approved') {
                    const orderApproved = await Order.findByIdAndUpdate(idOrder, { $set: { status: 'Approved' } })
                    const texto = await checkoutMail(order)
                    const msg = {
                        to: order.userId.email,
                        subject: 'Gracias por su compra en Markets Center!',
                        text: texto
                    };
                    await sendMail(msg);
                    
                    return res.json({
                        success: true,
                        msg: 'La orden fue actualizada a Approved',
                        data: orderApproved
                    })
                }
                else if (order.status === 'In process' && status === 'Rejected') {
                    let arrOrder = order.products
                    for await (const element of arrOrder) {
                        let stock = element.quantity
                        let product = await Product.findById(`${element.productId}`).exec();
                        let updateStock = {
                            "stock": product.stock + stock,
                        }
                        await Product.findByIdAndUpdate(`${element.productId}`, { $set: updateStock });
                    };
                    
                    const orderRejected = await Order.findByIdAndUpdate(idOrder, { $set: { status: 'Rejected' } });

                    //const texto = await checkoutMail(order) Cambiar por Rechazada
                    // const msg = {
                    //     to: order.userId.email,
                    //     subject: 'Gracias por su compra en Markets Center!',
                    //     text: texto
                    // };
                    // await sendMail(msg);

                    return res.json({
                        success: true,
                        msg: 'La orden fue actualizada a Rejected',
                        data: orderRejected
                    })
                }
                else if (order.status === 'Approved' && status === 'Dispatched') {
                    const orderDispatched = await Order.findByIdAndUpdate(idOrder, { $set: { status: 'Dispatched' } });

                    // const texto = await checkoutMail(order) Cambiar por despachada
                    // const msg = {
                    //     to: order.userId.email,
                    //     subject: 'Gracias por su compra en Markets Center!',
                    //     text: texto
                    // };
                    // await sendMail(msg);

                    return res.json({
                        success: true,
                        msg: 'La orden fue actualizada a Dispatched',
                        data: orderDispatched
                    })
                }
                else {
                    return next(new ErrorResponse("Todos los parametros son necesarios", 404))
                }
            }
            else {
                return next(new ErrorResponse("Todos los parametros son necesarios", 404))
            }
        } catch (error) {
            next(error)
        }
    },

    orderSellers: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const user = await User.findById(id);
            if (user) {
                const orders = await Order.find().populate('products.productId')
                console.log(orders)
                let aux: string[] = [];
                orders.map((orden: any) => {
                    orden.products.map((product: any) => {
                        if (product.productId !== null && id === `${product.productId.userId}`) {
                            !aux.includes(`${orden._id}`) && aux.push(`${orden._id}`);
                        }
                    })
                });
                if (aux.length > 0) {
                    const orderBuyers = await Order.find({ _id: aux }).populate([{ path: 'products.productId' }, { path: 'userId' }]);
                    return res.json({
                        success: true,
                        msg: "Todas las ordenes coincidentes fueron enviadas",
                        data: orderBuyers
                    });
                }
                else {
                    return next(new ErrorResponse('No existen ordenes del usuario', 404))
                }
            }
        } catch (error) {
            next(error);
        }
    },
    payment: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, amount } = req.body
            const payment = await stripe.paymentIntents.create({
                amount: amount,
                currency: "USD",
                payment_method: id,
                confirm: true
            })

            res.json({
                success: true,
                msg: "El pago fue exitoso",
                data: payment
            });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = orderControllers;