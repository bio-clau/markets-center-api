const Product = require('../../models/Product');
import { NextFunction, Request, Response } from "express";
const User = require("../../models/User");
const ErrorResponse = require("../../helpers/errorConstructor");

const reviewControllers = {
    showReviews: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            if (id) {
                const product = await Product.findById();
                if (!product) return next(new ErrorResponse("Producto no encontrado", 404));
                if (product.banned) return next(new ErrorResponse("El producto se encuentra deshabilitado", 404));
                if (product.deleted) return next(new ErrorResponse("El producto se encuentra eliminado", 404));
                Product.findById(id)
                    .populate({ path: 'reviews' })
                    .populate({ path: 'reviews.user', select: 'name image' })
                    .exec((err: any, product: any) => {
                        if (err) {
                            return next(new ErrorResponse("Producto no encontrado", 404));
                        }
                        res.status(200).json({
                            success: true,
                            data: product.reviews
                        });
                    });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
        } catch (error) {
            next(error);
        }
    },
    deleteReview: async (req: Request, res: Response, next: NextFunction) => {
        const { id, reviewId } = req.params;
        try {
            if (id && reviewId) {
                const product = await Product.findById();
                if (!product) return next(new ErrorResponse("Producto no encontrado", 404));
                if (product.banned) return next(new ErrorResponse("El producto se encuentra deshabilitado", 404));
                Product.findById(id)
                    .populate({ path: 'reviews' })
                    .populate({ path: 'reviews.user', select: 'name image' })
                    .exec((err: any, product: any) => {
                        if (err) {
                            return next(new ErrorResponse("Producto no encontrado", 404));
                        }
                        if(product.banned) return next(new ErrorResponse("El producto se encuentra deshabilitado", 404));
                        if(product.deleted) return next(new ErrorResponse("El producto se encuentra eliminado", 404));
                        if (!product.reviews.id(reviewId)) return next(new ErrorResponse("Review no encontrado", 404));

                        product.reviews.id(reviewId).remove();
                        product.save();
                        res.status(200).json({
                            success: true,
                            data: product.reviews
                        });
                    });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
        } catch (error) {
            next(error)
        }
    },
    updateReview: async (req: Request, res: Response, next: NextFunction) => {
        //update review of one user
        const { id, reviewId } = req.params;
        const { comment, rating, user } = req.body;
        try {
            if (id && reviewId) {
                const product = await Product.findById(id).populate({ path: 'reviews' });
                const userReview = await User.findById(user);
                if (!product) return next(new ErrorResponse("Producto no encontrado", 404));
                if(!userReview) return next(new ErrorResponse("Usuario no encontrado", 404));
                if(userReview.banned) return next(new ErrorResponse("El usuario se encuentra deshabilitado", 404));
                if(userReview.deleted) return next(new ErrorResponse("El usuario se encuentra eliminado", 404));
                if (product.banned) return next(new ErrorResponse("El producto se encuentra deshabilitado", 404));
                if(product.deleted) return next(new ErrorResponse("El producto se encuentra eliminado", 404));
                const review = product.reviews.id(reviewId);
                if (!review) return next(new ErrorResponse("Review no encontrado", 404));
                if (review.user.toString() !== user) return next(new ErrorResponse("No tienes permisos para editar esta review", 401));

                Product.updateOne({ _id: id, "reviews._id": reviewId }, { $set: { "reviews.$.comment": comment, "reviews.$.rating": rating } }, (err: Object, product: any) => {
                    if (err) {
                        return next(new ErrorResponse("Producto no encontrado", 404));
                    }

                    res.status(200).json({
                        success: true,
                        data: product
                    });
                });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
        } catch (error) {
            next(error);
        }
    }
};


module.exports = reviewControllers;



