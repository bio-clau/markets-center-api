import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");
const Review = require('../../models/Review');
const User = require('../../models/User');

const reviewController = {
    add: async (req: Request, res: Response, next: NextFunction) => {
        console.log('HOLAA');

        const { product, user, rating, review } = req.body;
        const userId = await User.findById(user);
        const userID = userId._id;

        const newReview = new Review({
            product,
            user: userID,
            review,
            rating
        });

        try {
            newReview.save((err: Object, review: Object) => {
                if (err) return next(new ErrorResponse("Complete todos los campos", 400));
                if (review) {
                    res.status(201).json({
                        success: true,
                        msg: "Review agregado correctamente",
                        data: review
                    });
                }
            });
        } catch (error) {
            next(error)
        }
    },
    updateReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            Review.findOneAndUpdate(id, req.body, { new: true }, (err: Object, review: Object) => {
                if (err) return next(new ErrorResponse("Complete todos los campos", 400));
                if (review) {
                    res.status(201).json({
                        success: true,
                        msg: "Review actualizado correctamente",
                        data: review
                    });
                }
            })
        } catch (error) {
            next(error)
        }
    },
    allReviews: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reviews = await Review.find({})
                .populate({ path: 'user', select: 'name' })
                .populate({ path: 'product', select: 'name' })
                .sort({ createdAt: -1 });
            if (!reviews) return next(new ErrorResponse("No hay reviews", 404));

            res.status(200).json({
                success: true,
                msg: "Reviews enviados correctamente",
                data: reviews
            });
        } catch (error) {
            next(error)
        }
    },
    deleteReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Review.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                msg: "Review eliminado correctamente",
                data: []
            });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = reviewController; 