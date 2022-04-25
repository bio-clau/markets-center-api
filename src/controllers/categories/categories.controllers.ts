import { NextFunction, Request, Response } from "express";
const Categories = require('../../models/Categories.ts');

const categoriesController = {
    allCategories: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allCategories = await Categories.find();
            res.json({
                success: true,
                msg: "Todas las categorías fueron enviadas",
                data: allCategories
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = categoriesController;