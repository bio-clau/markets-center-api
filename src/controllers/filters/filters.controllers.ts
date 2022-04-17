import { Response, Request, NextFunction } from "express";
const Product = require("../../models/Product");
const Categories = require("../../models/Categories");
const ErrorResponse = require("../../helpers/errorConstructor");

const filtersControllers = {
    filterBySeller: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (id) {
                Product.find({ userId: id }, (error: Object, product: Object) => {
                    if (error) return next(new ErrorResponse("El producto no existe", 404));
                    else {
                        res.json({
                            success: true,
                            msg: "Todos los productos coincidentes fueron enviados",
                            data: product
                        });
                    }
                })
            }
        } catch (error) {
            next(error)
        }
    },

    filterByCategories: async (req: Request, res: Response, next: NextFunction) => {
        const categories = `${req.query.categories}`;
        try {
            if (categories) {
                let arrayCategory = categories.split('-');
                let idCategory: string[] = []
                for await (const element of arrayCategory) {
                    let category = await Categories.find({ name: { $regex: `.*${element}`, $options: "i" } });
                    idCategory.push(`${category[0]._id}`) // devuelve el objeto pero dentro de un array
                    // por eso el [0]
                };
                Product.find({category: idCategory}, (error: Object, product: Object) => {
                    if (error || Object.keys(product).length === 0) return next(new ErrorResponse("El producto no existe", 404));
                    else {
                        res.json({
                            success: true,
                            msg: "Todos los productos coincidentes fueron enviados",
                            data: product
                        });
                    }
                }).populate({ path: 'category', select: "name" });;
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = filtersControllers;