import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");

const Categories = require('../../models/Categories.ts');

const adminController = {
    delCategory: async (req: Request, res: Response, next:NextFunction)=> {
        const idCategory = req.params.id;
        try {
            const category = await Categories.findById(idCategory);
            if (!category) {
                return next(new ErrorResponse("Error al eliminar categoría", 400))
            }
            await Categories.findByIdAndDelete(idCategory)
            res.status(200).json({
                success: true,
                msg: 'La categoría sue eliminada exitosamente',
                data: []
            })
        } catch (err) {
            next(err)
        }
    },
    updateCategory: async (req:Request, res:Response, next:NextFunction) => {
        try {
            const {id} = req.params;
            const {name, image} = req.body;
            const cat = await Categories.findById(id);
            if(!cat){
                return next(new ErrorResponse("La categroia no fue encontrada", 404))
            }
            const newCategory = await Categories.findByIdAndUpdate(id, {
                name,
                image
            }, {new:true})
            res.status(201).json({
                success: true,
                msg: "Categoría modificada con exito.",
                data: newCategory
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = adminController;