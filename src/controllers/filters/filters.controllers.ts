import { Response, Request, NextFunction } from "express";
const Product = require("../../models/Product");
const Categories = require("../../models/Categories");
const User = require("../../models/User");
const Order = require("../../models/Order");
const ErrorResponse = require("../../helpers/errorConstructor");

const filtersControllers = {
    filterBySellerAndCategories: async (req: Request, res: Response, next: NextFunction) => {
        const { id, categories } = req.query
        try {
            if (id && categories) {
                let categoriesAux = `${categories}`
                let arrayCategory = categoriesAux.split('-');
                let idCategory: string[] = []
                for await (const element of arrayCategory) {
                    let category = await Categories.find({ name: { $regex: `.*${element}`, $options: "i" } });
                    idCategory.push(`${category[0]._id}`) // devuelve el objeto pero dentro de un array
                    // por eso el [0]
                };
                const productCat = await Product.find({ category: idCategory }).populate({ path: 'category', select: "name" });
                const user = await User.find({ userId: id })
                if (!user) {
                    return next(new ErrorResponse("El producto no existe", 404))
                }
                let result = productCat.filter((product: any) => `${product.userId}` === id);
                return res.json({
                    success: true,
                    msg: "Todos los productos coincidentes fueron enviados",
                    data: result
                });
            }
            else if (categories) {
                let categoriesAux = `${categories}`
                let arrayCategory = categoriesAux.split('-');
                let idCategory: string[] = []
                for await (const element of arrayCategory) {
                    let category = await Categories.find({ name: { $regex: `.*${element}`, $options: "i" } });
                    idCategory.push(`${category[0]._id}`) // devuelve el objeto pero dentro de un array
                    // por eso el [0]
                };
                Product.find({ category: idCategory }, (error: Object, product: Object) => {
                    if (error || Object.keys(product).length === 0) return next(new ErrorResponse("El producto no existe", 404));
                    else {
                        return res.json({
                            success: true,
                            msg: "Todos los productos coincidentes fueron enviados",
                            data: product
                        });
                    }
                }).populate({ path: 'category', select: "name" });;
            }
            else if (id) {
                Product.find({ userId: id }, (error: Object, product: Object) => {
                    if (error) return next(new ErrorResponse("El producto no existe", 404));
                    else {
                        return res.json({
                            success: true,
                            msg: "Todos los productos coincidentes fueron enviados",
                            data: product
                        });
                    }
                });
            }
        } catch (error) {
            next(error)
        }
    },
    filterByStatus: async(req: Request, res: Response, next: NextFunction) => {
        const { status } = req.query
        try {
            if(status === 'Aprovada') {
                Order.find({status: 'Aprovada'},(error: Object, order: Object) => {
                    if (error) return next(new ErrorResponse("No existen ordenes con ese status", 404));
                    else {
                        return res.json({
                            success: true,
                            msg: "Todas las ordenes coincidentes fueron enviadas",
                            data: order
                        });
                    }
                }).populate([{path: 'products.productId'},{ path: 'userId' }]);
            }
            else if(status === 'Pendiente') {
                Order.find({status: 'Pendiente'},(error: Object, order: Object) => {
                    if (error) return next(new ErrorResponse("No existen ordenes con ese status", 404));
                    else {
                        return res.json({
                            success: true,
                            msg: "Todas las ordenes coincidentes fueron enviadas",
                            data: order
                        });
                    }
                }).populate([{path: 'products.productId'},{ path: 'userId' }]);
            }
            else if(status === 'Rechazada') {
                Order.find({status: 'Rechazada'},(error: Object, order: Object) => {
                    if (error) return next(new ErrorResponse("No existen ordenes con ese status", 404));
                    else {
                        return res.json({
                            success: true,
                            msg: "Todas las ordenes coincidentes fueron enviadas",
                            data: order
                        });
                    }
                }).populate([{path: 'products.productId'},{ path: 'userId' }]);
            }
            else if(status === 'En proceso') {
                Order.find({status: 'En proceso'},(error: Object, order: Object) => {
                    if (error) return next(new ErrorResponse("No existen ordenes con ese status", 404));
                    else {
                        return res.json({
                            success: true,
                            msg: "Todas las ordenes coincidentes fueron enviadas",
                            data: order
                        });
                    }
                }).populate([{path: 'products.productId'},{ path: 'userId' }]);
            }
            else {
                return next(new ErrorResponse("El status no existe", 404));
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = filtersControllers;