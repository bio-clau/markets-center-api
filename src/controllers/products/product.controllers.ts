import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");
const { cloudinary } = require('../../config/cloudinary');
const User = require('../../models/User');

const Product = require('../../models/Product');

const productController = {
    //@route POST /api/private/product
    //access private
    add: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, description, image, stock, category, price, userId } = req.body;
            let img = '';
            const user = await User.findById(userId);
            if (!user) {
                return next(new ErrorResponse("El usuario no existe", 404))
            }
            if (image.length > 0) {
                const result = await cloudinary.uploader.upload(image);
                if (!result) {
                    return res.status(503).json('Falló carga de imágen');
                }
                img = result.url
            }

            const newProduct = new Product({
                name,
                description,
                image: img === '' ? 'https://res.cloudinary.com/markets-center/image/upload/v1651348537/def_h45bqp.jpg' : img,
                stock,
                category,
                price,
                userId: user._id
            });
            newProduct.save(async (err: Object, product: Object) => {
                if (err) return next(new ErrorResponse("Complete todos los campos", 400));
                const productCat = await Product.find({disable: false}).populate({ path: 'category', select: "name" });
                let result = productCat.filter((product: any) => `${product.userId}` === `${user._id}`);
                if (product) {
                    res.status(201).json({
                        success: true,
                        msg: "Producto agregado correctamente",
                        data: result
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
                return res.status(503).json('Falló carga de imagen');
            }
            img = result.url
        }
        try {
            const product = await Product.findById(req.params.id);
            if (product.banned) {
                return next(new ErrorResponse("El producto se encuentra deshabilitado", 404));
            }
            if (product.deleted) {
                return next(new ErrorResponse("El producto se encuentra eliminado", 404));
            }
            Product.findByIdAndUpdate(req.params.id, {
                $set: {
                    name,
                    description,
                    image: img,
                    stock,
                    category,
                    price
                }
            }, { new: true, runValidators: true }, async (err: Object, productUpdated: Object) => {
                if (err) return next(new ErrorResponse("No se encontró el ID", 404));
                if (productUpdated) {
                    const allProduct = await Product.find({userId: product.userId})
                    res.json({
                        success: true,
                        msg: "Producto actualizado correctamente",
                        data: allProduct
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
                Product.find({banned: false ,deleted: false ,name: { $regex: `.*${name}`, $options: "i" }}, (err: Object, product: Object) => {
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
                const allProducts = await Product.find({banned: false, deleted: false}).populate([{ path: 'category', select: "name" }, { path: 'reviews' }]).populate({ path: 'reviews.user' });
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
            const product = await Product.findById(id);
            if (!product) {
                return next(new ErrorResponse("El producto no existe", 404));
            }
            if (product.banned) {
                return next(new ErrorResponse("El producto se encuentra deshabilitado", 404));
            }
            if (product.deleted) {
                return next(new ErrorResponse("El producto se encuentra eliminado", 404));
            }
            Product.findById(id).populate({ path: 'category', select: "name" }).exec((err: Object, productId: Object) => {
                if (err) return next(new ErrorResponse("El producto no existe", 404));
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
    disableProduct: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (id) {
                const productDelete = await Product.findById(id);
                if (!productDelete) return next(new ErrorResponse("El producto no existe", 404));
                if (productDelete.banned) return next(new ErrorResponse("El producto ya se encuentra deshabilitado", 404))
                if (productDelete.deleted) {
                    return next(new ErrorResponse("El producto se encuentra eliminado", 404));
                }
                Product.findByIdAndUpdate(id, { banned: true }, { new: true, runValidators: true }, async (error: Object, product: Object) => {
                    if (error) return next(new ErrorResponse("No se encontro el producto", 404));
                    if (product) {
                        const products = await Product.find();
                        res.json({
                            success: true,
                            msg: "El producto fue deshabilitado exitosamente",
                            data: products
                        });
                    };
                });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
        } catch (error) {
            next(error)
        }
    },
    enableProduct: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (id) {
                const productDelete = await Product.findById(id);
                if (!productDelete) return next(new ErrorResponse("El producto no existe", 404));
                if (!productDelete.banned) return next(new ErrorResponse("El producto ya se encuentra habilitado", 404))
                if (productDelete.deleted) return next(new ErrorResponse("El producto ya se encuentra eliminado", 404))
                Product.findByIdAndUpdate(id, { banned: false }, { new: true, runValidators: true }, async (error: Object, product: Object) => {
                    if (error) return next(new ErrorResponse("No se encontro el producto", 404));
                    if (product) {
                        const products = await Product.find();
                        res.json({
                            success: true,
                            msg: "El producto fue habilitado exitosamente",
                            data: products
                        });
                    };
                });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
        } catch (error) {
            next(error)
        }
    },
    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (id) {
                const productDelete = await Product.findById(id);
                if (!productDelete) return next(new ErrorResponse("El producto no existe", 404));
                if (productDelete.banned) return next(new ErrorResponse("El producto ya se encuentra deshabilitado", 404))
                if (productDelete.deleted) {
                    return next(new ErrorResponse("El producto ya se encuentra eliminado", 404));
                }
                Product.findByIdAndUpdate(id, { deleted: true }, { new: true, runValidators: true }, async (error: Object, product: Object) => {
                    if (error) return next(new ErrorResponse("No se encontro el producto", 404));
                    if (product) {
                        const products = await Product.find();
                        res.json({
                            success: true,
                            msg: "El producto fue eliminado exitosamente",
                            data: products
                        });
                    };
                });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
        } catch (error) {
            next(error)
        }
    },
    createReview: async (req: Request, res: Response, next: NextFunction) => {
        const { rating, comment, user } = req.body;
        const { id } = req.params
        try {
            if (id) {
                const product = await Product.findById(id);
                if (!user) return next(new ErrorResponse("Inicia sesión, por favor!", 404));
                if (product.banned) return next(new ErrorResponse("El producto fue deshabilitado", 404));
                if (product.deleted) return next(new ErrorResponse("El producto se encuentra eliminado", 404));
                if (product) {
                    //already review for user
                    let result = product.reviews.filter((review: any) => `${review.user}` === user);

                    if (result.length > 0) {
                        return next(new ErrorResponse("Ya has realizado una reseña", 404))
                    } else {
                        product.reviews.push({
                            product: req.params.id,
                            user,
                            rating,
                            comment
                        });
                        product.numReviews = product.reviews.length;

                        product.rating = product.reviews.reduce((acc: any, item: any) => item.rating + acc, 0) / product.numReviews;
                        await product.save();
                        const allProducts = await Product.find({ banned: false, deleted: false }).populate({ path: 'category', select: "name" });
                        res.json({
                            success: true,
                            msg: "Calificación agregada correctamente",
                            data: allProducts
                        });
                    }
                } else {
                    next(new ErrorResponse("El producto no existe", 404));
                }
            }
            else {
                return next(new ErrorResponse("Todos los parametros son necesarios", 404))
            }
        } catch (error) {
            next(error);
        }
    },
    productBySeller: async(req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        try {
            const user = await User.findById(id);
                if(user.banned) return next(new ErrorResponse("El usuario se encuentra deshabilitado", 404));
                if(user.deleted) return next(new ErrorResponse("El usuario fue eliminado", 404));
                Product.find({ userId: id, deleted: false }, (error: Object, products: Object) => {
                    if (error) return next(new ErrorResponse("El producto no existe", 404));
                    else {
                        return res.json({
                            success: true,
                            msg: "Todos los productos coincidentes fueron enviados",
                            data: products
                        });
                    }
                });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = productController;