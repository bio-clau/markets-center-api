import { Response, Request, NextFunction } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");
import { despachoMail } from '../../mail/despacho'
import { checkoutMail } from '../../mail/checkout'
import { rechazadaMail } from '../../mail/rechazada'
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
                const user = await User.findOne({ userId: idUser });
                if (!user) {
                    return next(new ErrorResponse("No se encontraron usuarios", 404))
                }
                if (user.banned) {
                    return next(new ErrorResponse("El usuario se encuentra baneado", 404))
                }
                const userCart = await Cart.findOne({ userId: user._id }).populate([{ path: 'userId' }, { path: 'products.productId' }]).exec();
                let purchasedProducts: { product: { name: string; description: string; image: string; price: number; userId: any; }; quantity: number; }[] = [];
                let sellers: any[] = [];
                userCart.products.map((element: any) => {
                    let product = {
                        product: {
                            name: element.productId.name,
                            description: element.productId.description,
                            image: element.productId.image,
                            price: element.productId.price,
                            userId: element.productId.userId
                        },
                        quantity: element.quantity
                    }
                    let seller = {
                        sellerId: element.productId.userId,
                        dispatched: false
                    }
                    let variable = sellers.some(e => `${e.sellerId}` === `${element.productId.userId}`)
                    !variable && sellers.push(seller)
                    purchasedProducts.push(product);
                })
                if (userCart) {
                    let stockDisponible = false;
                    let arrOrder = userCart.products;
                    for await (const element of arrOrder) {
                        let stock = element.quantity;
                        let product = await Product.findById(element.productId).exec();
                        if (product.stock >= stock) {
                            stockDisponible = true;
                            let updateStock = {
                                "stock": product.stock - stock,
                            }
                            await Product.findByIdAndUpdate(element.productId, { $set: updateStock });
                        }
                    }
                    if (stockDisponible) {
                        const order = new Order({
                            userId: user._id,
                            products: userCart.products,
                            purchased: purchasedProducts,
                            amount: userCart.amount,
                            address: userCart.userId.address,
                            dispatches: sellers,
                            status: "Pendiente"
                        });
                        await Cart.findByIdAndUpdate(userCart._id, {
                            $set: {
                                products: [],
                                amount: 0
                            }
                        }, { new: true, runValidators: true }).populate('userId');
                        const newOrder = await order.save();

                        if (newOrder) {
                            return res.json({
                                success: true,
                                msg: 'La orden fue creada',
                                data: newOrder
                            })
                        }
                    }
                    else {
                        if (userCart.products.length <= 0) return next(new ErrorResponse("No hay productos agregados al carrito", 404))
                        return next(new ErrorResponse("Lo siento, no hay stock", 404));
                    }
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
                if (order.status === 'Pendiente' && status === 'Aprobada') {
                    const orderAprovada = await Order.findByIdAndUpdate(idOrder, { $set: { status: 'Aprobada' } })
                    const texto = checkoutMail(order)
                    const msg = {
                        to: order.userId.email,
                        subject: 'Gracias por su compra en Markets Center!',
                        text: texto
                    };
                    await sendMail(msg);

                    return res.json({
                        success: true,
                        msg: 'La orden fue actualizada a Aprobada',
                        data: orderAprovada
                    })
                }
                else if (order.status === 'Pendiente' && status === 'Rechazada') {
                    let arrOrder = order.products
                    for await (const element of arrOrder) {
                        let stock = element.quantity
                        let product = await Product.findById(element.productId).exec();
                        let updateStock = {
                            "stock": product.stock + stock,
                        }
                        await Product.findByIdAndUpdate(element.productId, { $set: updateStock });
                    };

                    const orderRechazada = await Order.findByIdAndUpdate(idOrder, { $set: { status: 'Rechazada' } });

                    const texto = rechazadaMail(order.userId.name)
                    const msg = {
                        to: order.userId.email,
                        subject: 'Hubo un problema con el pago',
                        text: texto
                    };
                    await sendMail(msg);

                    return res.json({
                        success: true,
                        msg: 'La orden fue actualizada a Rechazada',
                        data: orderRechazada
                    })
                }
                else if (order.status === 'Aprobada' && status === 'Despachada') {
                    const orderDespachada = await Order.findByIdAndUpdate(idOrder, { $set: { status: 'Despachada' } });

                    const texto = despachoMail(order.userId.name)
                    const msg = {
                        to: order.userId.email,
                        subject: 'Tu orden fue despachada!',
                        text: texto
                    };
                    await sendMail(msg);

                    return res.json({
                        success: true,
                        msg: 'La orden fue actualizada a Despachada',
                        data: orderDespachada
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
                if (user.banned) return next(new ErrorResponse('El usuario se encuentra baneado', 404));
                if (user.deleted) return next(new ErrorResponse('El usuario fue eliminado', 404));
                const orders = await Order.find().populate('products.productId')
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
            else {
                return next(new ErrorResponse('El usuario no existe', 404))
            }
        } catch (error) {
            next(error);
        }
    },
    updateDispatches: async (req: Request, res: Response, next: NextFunction) => {
        const { idUser, idOrder } = req.body;
        try {
            if (idUser && idOrder) {
                const order = await Order.findById(idOrder).populate({ path: 'dispatches.sellerId' });
                const user = await User.findOne({ userId: idUser })
                if (order && user) {
                    order.dispatches.map((element: any) => {
                        if (`${element.sellerId._id}` === `${user._id}`) {
                            element.dispatched = true;
                        }
                    });
                    const dispatchUpdated = await Order.findByIdAndUpdate(idOrder, { $set: order }, { new: true, runValidators: true });
                    if (dispatchUpdated) {
                        return res.json({
                            success: true,
                            msg: "Todas las ordenes coincidentes fueron enviadas",
                            data: dispatchUpdated
                        })
                    }
                }
                else {
                    return next(new ErrorResponse('El usuario o la orden son inexistentes', 404))
                }
            }
            else {
                return next(new ErrorResponse('Todos los parametros son requeridos', 404))
            }
        } catch (error) {
            next(error)
        }
    },
    payment: async (req: Request, res: Response, next: NextFunction) => {
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
            next(error)
        }
    }
}

module.exports = orderControllers;