import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");
const { cloudinary } = require('../../config/cloudinary');
const Categories = require('../../models/Categories.ts');
const User = require('../../models/User');

const adminController = {
    delCategory: async (req: Request, res: Response, next: NextFunction) => {
        const idCategory = req.params.id;
        try {
            const category = await Categories.findById(idCategory);
            if (!category) {
                return next(new ErrorResponse("Error al eliminar categoría", 400))
            }
            await Categories.findByIdAndDelete(idCategory);
            const categories = await Categories.find();
            res.status(200).json({
                success: true,
                msg: 'La categoría sue eliminada exitosamente',
                data: categories
            })
        } catch (err) {
            next(err)
        }
    },
    updateCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { name, image } = req.body;
            let img = '';
            if (image.length > 0) {
                const result = await cloudinary.uploader.upload(image);
                if (!result) {
                    return res.status(503).json('Upload failed');
                }
                img = result.url
            }
            const cat = await Categories.findById(id);
            if (!cat) {
                return next(new ErrorResponse("La categroia no fue encontrada", 404))
            }
            const newCategory = await Categories.findByIdAndUpdate(id, {
                name,
                image: img
            }, { new: true })
            const allCategories = await Categories.find();
            res.status(201).json({
                success: true,
                msg: "Categoría modificada con exito.",
                data: allCategories
            })
        } catch (err) {
            next(err)
        }
    },

    addCategories: async (req: Request, res: Response, next: NextFunction) => {
        const newCategories = new Categories(req.body);
        try {
            await newCategories.save(async (error: Object, categorie: Object) => {
                if (error) return next(new ErrorResponse("All parameters are required", 404));
                const allCategories = await Categories.find();
                if (categorie) {
                    res.json({
                        success: true,
                        msg: "Category successfully created",
                        data: allCategories
                    });
                }
            });
        } catch (error) {
            next(error);
        }
    },
    deleteUser: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const user = await User.findOne({ userId: id });
            if (!user) {
                return next(new ErrorResponse("No se pudo eliminar el usuario", 400))
            }
            await User.findByIdAndDelete(user._id);
            const users = await User.find();
            res.status(200).json({
                success: true,
                msg: "Usuario eliminado correctamente",
                data: users
            })
        } catch (err) {
            next(err)
        }
    },
    upgradeAdmin: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const user = await User.findById(id).exec();
            if (!user) {
                return next(new ErrorResponse("No se encontro el usuario", 404));
            }
            User.findByIdAndUpdate(id, { isAdmin: true });
            const users = await User.find();
            res.status(200).json({
                success: true,
                msg: "Usuario convertido a Admin correctamente",
                data: users
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = adminController;