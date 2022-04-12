import { NextFunction, Request, Response } from "express";

const Categories = require('../../models/Categories.ts');

const categoriesController =  {
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