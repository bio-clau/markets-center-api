import { NextFunction, Request, Response } from "express";

const Categories = require('../../models/Categories.ts');

const categoriesController =  {
    allCategories: async(req: Request, res: Response, next: NextFunction) => {
        try {
            const allCategories = await Categories.find();
            res.json({
                success: true,
                msg: "All categories were shipped",
                data: allCategories
            })
        } catch (error) {
            next(error)
        }
    },
    add: async(req: Request, res: Response, next: NextFunction) => {
        const newCategorie = new Categories(req.body);
        try {
            const savedCategorie = await newCategorie.save()
            res.json({
                success: true,
                msg: "Categorie successfully created",
                data: savedCategorie
            })
        } catch (error) {
            next(error);
        }
    },

    categorie: async(req: Request, res: Response, next: NextFunction) => {
    }
}

module.exports = categoriesController;