import { Response, Request, NextFunction } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");
const Product = require('../../models/Product')
const Order = require('../../models/Order')
const User = require("../../models/User");

const orderControllers = {
    addOrder: async (req: Request, res: Response, next: NextFunction) => {
        const newOrder = new Order(req.body);
        try {
            newOrder.save((error: Object, order: Object) => {
                if (error) return next(new ErrorResponse("All parameters are required", 404));
                if (order) {
                    res.json({
                        success: true,
                        msg: 'The order was created',
                        data: order
                    })
                }
            });
        } catch (error) {

            next(error)
        }
    },

    sendOrder: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const orderId = await Order.findById(id).populate('userId');
            if (Object.keys(orderId).length > 0) {
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

    updateOrder: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const order = await Order.findById(id);
            let allOk = false;
            if (!order) {
                return next(new ErrorResponse("La orden no existe", 404))
            }
            if (order[0].status === 'In process') {
                let arrOrder = order.products;
                for await (const element of arrOrder) {
                    let stock = element.quantity;
                    let product = await Product.findById(`${element.productId}`).exec();
                    if (product.stock >= stock) {
                        allOk = true;
                        let updateStock = {
                            "stock": product.stock - stock,
                        }
                        await Product.findByIdAndUpdate(`${element.productId}`, { $set: updateStock });
                    }
                }
            }
            if (allOk) {
                Order.findByIdAndUpdate(id, { $set: req.body }, (err: Object, order: Object) => {
                    if (err) next(new ErrorResponse("La orden no existe", 404));
                    else {
                        res.json({
                            success: true,
                            msg: "La orden fue actualizada con exito",
                            data: order
                        });
                    }
                });
            }
            else {
                next(new ErrorResponse("Lo siento, no hay stock", 404));
            }
        } catch (error) {
            next(error)
        }
    },

    buyersOfSeller: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const user = await User.findById(id)
            if (!user) {
                return next(new ErrorResponse("El usuario no existe", 404))
            }
            const orders = await Order.find();
            let aux: string[] = [];
            for await (const element of orders) {
                let auxiliar = element.products
                for await (const product of auxiliar) {
                    const productId = await Product.findById(`${product.productId}`);
                    if (productId !== null && `${productId.userId}` === id) {
                        !aux.includes(`${element._id}`) && aux.push(`${element._id}`);
                    }
                }
            }
            // NO LO HIZO MAS RAPIDO ASIQUE NO SEGUI POR NO PERDER MAS TIEMPO, DESPUES SE VOLVERA 
            // const orders = await Order.find();
            // let aux: string[] = []
            // orders.map((element: any) => {
            //     element.products.map((product: any) => {
            //         const result = Product.findById(`${product.productId}`).then();
            //         aux.push(result);
            //     });
            // });
            // Promise.all(aux).then(response => {
            //     console.log(response)
            // })
            const orderBuyers = await Order.find({ _id: aux });
            res.json({
                success: true,
                msg: "Todas las ordenes coincidentes fueron enviadas",
                data: orderBuyers
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = orderControllers;