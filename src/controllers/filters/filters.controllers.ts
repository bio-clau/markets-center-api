import { Response, Request, NextFunction } from "express";
const Product = require("../../models/Product");
const User = require("../../models/Users");
const ErrorResponse = require("../../helpers/errorConstructor");

const filtersControllers = {
    filterBySeller: async (req: Request,res: Response, next: NextFunction) => {
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
    }
}

module.exports = filtersControllers;