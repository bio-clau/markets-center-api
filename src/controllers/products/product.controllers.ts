import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");
const { cloudinary } = require('../../config/cloudinary');
const User = require('../../models/User');

const Product = require('../../models/Product');

const productController = {
    //@route POST /api/private/product
    //access private
    add: async (req: Request, res: Response, next: NextFunction) => {
        const { name, description, image, stock, category, price, userId } = req.body;
        let img = '';
        const user = await User.find({ userId: userId });
        let userID = `${user[0]._id}`
        if (image.length > 0) {
            const result = await cloudinary.uploader.upload(image);
            if (!result) {
                return res.status(503).json('Upload failed');
            }
            img = result.url
        }

        const newProduct = new Product({
            name,
            description,
            image: img,
            stock,
            category,
            price,
            userId: userID
        });
        try {
            newProduct.save(async (err: Object, product: Object) => {
                if (err) return next(new ErrorResponse("Complete todos los campos", 400));
                const allProducts = await Product.find();
                if (product) {
                    res.status(201).json({
                        success: true,
                        msg: "Producto agregado correctamente",
                        data: allProducts
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
        const { name, description, image, stock, category, price } = req.body;
        const product = await Product.findById(req.params.id);
        let img = image
        if (image.length > 0 && image !== product.image) {
            const result = await cloudinary.uploader.upload(image);
            if (!result) {
                return res.status(503).json('Upload failed');
            }
            img = result.url
        }
        try {
            Product.findByIdAndUpdate(req.params.id, {
                $set: {
                    name,
                    description,
                    image: img,
                    stock,
                    category,
                    price
                }
            }, { new: true, runValidators: true }, (err: Object, product: Object) => {
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
            const productDelete = await Product.findById(id);
            if (!productDelete) return next(new ErrorResponse("El producto no existe", 404));
            await Product.findByIdAndDelete(id);
            const products = await Product.find();
            res.json({
                success: true,
                msg: "El producto fue eliminado exitosamente",
                data: products
            });
        } catch (error) {
            next(error)
        }
    },
    createReview: async (req: Request, res: Response, next: NextFunction) => {
        const { rating, comment, user } = req.body;
        const product = await Product.findById(req.params.id);
        const userFind = await User.findById(user);
        if (product) {
            //already reviewed for user
            const alreadyReviewed = product.reviews.find(
                (r: any) => r.user === userFind._id
            )
            if (alreadyReviewed) {
                return next(new ErrorResponse("Ya has calificado este producto", 400));
            }

            product.reviews.push({
                product: req.params.id,
                user,
                rating,
                comment
            });

            product.numReviews = product.reviews.length;

            product.rating = product.reviews.reduce((acc: any, item: any) => item.rating + acc, 0) / product.numReviews;
            await product.save();
            const allProducts = await Product.find().populate({ path: 'category', select: "name" });
            res.json({
                success: true,
                msg: "Calificación agregada correctamente",
                data: allProducts
            });
        } else {
            next(new ErrorResponse("El producto no existe", 404));
        }
    }
}

module.exports = productController;


