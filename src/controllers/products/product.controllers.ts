import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");

const Product = require('../../models/Product');

const productController = {
    //@route POST /api/private/product
    //access private
    add: async (req: Request, res: Response, next: NextFunction) => {
        const newProduct = new Product(req.body);
        try {
            newProduct.save((err: Object, product: Object) => {
                if (err) return next(new ErrorResponse("Complete todos los campos", 400));
                if (product) {
                    res.status(201).json({
                        success: true,
                        msg: "Producto agregado correctamente",
                        data: product
                    });
                }
            });
        } catch (error) {
            next(error)
        }
    },

    //@route PUT /api/private/product/id
    //access private
    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            Product.updateOne(req.params.id, { $set: req.body }, { new: true, runValidators: true }, (err: Object, product: Object) => {
                if (err) return next(new ErrorResponse("Id not found", 404))
                if (product) {
                    res.json({
                        success: true,
                        msg: "Producto actualizado correctamente",
                        data: product
                    });
                }
            });
        } catch (error) {
            next(error);
        }
    },
    //@route GET /api/public/products
    //access public
    all: async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.query;
        console.log(name);

        try {
            if (name) {
                Product.find({ name: { $regex: `.*${name}`, $options: "i" } }, (err: Object, product: Object) => {
                    if (err) return next(new ErrorResponse("El producto no existe", 404));
                    else {
                        res.json({
                            success: true,
                            msg: "Todos los productos coincidentes fueron enviados",
                            data: product
                        });
                    }
                }).populate({ path: 'category', select: "name" });
            }
            else {
                const allProducts = await Product.find().populate({ path: 'category', select: "name" });
                res.json({
                    success: true,
                    msg: "Todos los productos fueron enviados",
                    data: allProducts
                });
            }
        } catch (error) {
            next(error);
        }
    },

    //@route GET /api/public/product/:id
    //access public
    product: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            Product.findById(id).populate({ path: 'category', select: "name" }).exec((err: Object, productId: Object) => {
                if (err) next(new ErrorResponse("El producto no existe", 404));
                else {
                    res.json({
                        success: true,
                        msg: "El producto fue encontrado",
                        data: productId
                    });
                }
            });
        } catch (error) {
            next(error);
        }
    },
    //@route DELETE /api/private/product/:id
    //access private
    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            Product.findByIdAndDelete(id, (err: Object, productDeleted: Object) => {
                if (err) next(new ErrorResponse("El producto no existe", 404));
                else {
                    res.json({
                        success: true,
                        msg: "El producto fue eliminado con éxito",
                        data: []
                    });
                }
            });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = productController;


