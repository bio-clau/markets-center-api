import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");

const Product = require('../../models/Product');

const productController = {
    add: async (req: Request, res: Response, next: NextFunction) => {
        const newProduct = new Product(req.body);
        try {
            const savedProduct = await newProduct.save();
            res.status(201).json({
                success: true,
                msg: "Producto agregado correctamente",
                data: savedProduct
            });
        } catch (error) {
            next(error)
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updateProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.json({
                success: true,
                msg: "Producto actualizado correctamente",
                data: updateProduct
            })
        } catch (error) {
            next(error);
        }
    },

    all: async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.query;
        try {
            if (name) {
                const productsName = await Product.find({ name: /name/i });
                if (productsName.length === 0) {
                    res.json({
                        success: true,
                        msg: "All matching products were shipped",
                        data: productsName
                    });
                }
                else {
                    return next(new ErrorResponse("That product isn't exist", 404));
                }
            }
            else {
                const allProducts = await Product.find({});
                res.json({
                    success: true,
                    msg: "All products were shipped",
                    data: allProducts
                });
            }
        } catch (error) {
            next(error);
        }
    },

    product: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const productId = await Product.findById(id).exec();
            if(productId.length === 0) {
                res.json({
                    success: true,
                    msg: "The product was found",
                    data: productId
                });
            }
            else {
                next(new ErrorResponse("That product isn't exist", 404));
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = productController;


