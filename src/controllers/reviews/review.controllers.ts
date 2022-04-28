const Product = require('../../models/Product');
import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");

const reviewControllers = {
    showReviews: (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
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
    },
    deleteReview: (req: Request, res: Response, next: NextFunction) => {
        const { id, reviewId } = req.params;
        Product.findById(id)
            .populate({ path: 'reviews' })
            .populate({ path: 'reviews.user', select: 'name image' })
            .exec((err: any, product: any) => {
                if (err) {
                    return next(new ErrorResponse("Producto no encontrado", 404));
                }
                if (!product.reviews.id(reviewId)) return next(new ErrorResponse("Review no encontrado", 404));

                product.reviews.id(reviewId).remove();
                product.save();
                res.status(200).json({
                    success: true,
                    data: product.reviews
                });
            });
    },
    updateReview: async (req: Request, res: Response, next: NextFunction) => {
        //update review of one user
        const { id, reviewId } = req.params;
        const { comment, rating, user } = req.body;
        try {
            const product = await Product.findById(id).populate({ path: 'reviews' });
            if (!product) return next(new ErrorResponse("Producto no encontrado", 404));
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
        } catch (error) {
            next(error);
        }
    }
};


module.exports = reviewControllers;



