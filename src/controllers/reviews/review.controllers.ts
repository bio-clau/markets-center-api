const Product = require('../../models/Product');
import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");

const reviewControllers = {
    showReviews: (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        Product.findById(id)
            .populate({ path: 'reviews' })
            .populate({ path: 'reviews.user', select: 'name' })
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
        const { id } = req.params;
        const { reviewId } = req.body;
        Product.findById(id)
            .populate({ path: 'reviews' })
            .populate({ path: 'reviews.user', select: 'name' })
            .exec((err: any, product: any) => {
                if (err) {
                    return next(new ErrorResponse("Producto no encontrado", 404));
                }
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
        const { id } = req.params;
        const { reviewId, comment, rating, user } = req.body;

        try {
            if (!user) return next(new ErrorResponse("El user es requerido", 404));
            await Product.findById(id)
                .populate({ path: 'reviews' })
                .populate({ path: 'reviews.user', select: 'name' })
                .exec((err: any, product: any) => {
                    if (err) {
                        return next(new ErrorResponse("Producto no encontrado", 404));
                    }
                    product.reviews.id(reviewId).set({
                        comment,
                        rating,
                        user
                    });

                    product.save();
                    res.status(200).json({
                        success: true,
                        data: product.reviews
                    });
                });
        } catch (error) {
            next(error);
        }
    }
};


module.exports = reviewControllers;



