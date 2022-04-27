import { NextFunction, Request, Response } from "express";
import { isCaseClause } from "typescript";
import {blockPassMail} from '../../mail/blockPass'
const ErrorResponse = require("../../helpers/errorConstructor");
const { cloudinary } = require('../../config/cloudinary');
const Categories = require('../../models/Categories.ts');
const User = require('../../models/User');
// const firebaseAdmin = require('../../config/firebase')
import {firebaseAdmin} from '../../config/firebase'
const sendMail = require('../../config/sendMail')

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
                msg: 'La categoría fue eliminada exitosamente',
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
                    return res.status(503).json('Falló la carga de imágen');
                }
                img = result.url
            }
            const cat = await Categories.findById(id);
            if (!cat) {
                return next(new ErrorResponse("La categoría no fue encontrada", 404))
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
                if (error) return next(new ErrorResponse("Todos los parámetros son requeridos", 404));
                const allCategories = await Categories.find();
                if (categorie) {
                    res.json({
                        success: true,
                        msg: "Categoría creada exitosamente",
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
            if(!id){
                return next(new ErrorResponse("ID inválido", 400))
            }
            await firebaseAdmin.auth().deleteUser(id)
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
            await User.findByIdAndUpdate(id, {
                isAdmin: true,
                isSeller: false
            });
            const users = await User.find();
            res.status(200).json({
                success: true,
                msg: "Usuario convertido a Admin correctamente",
                data: users
            })
        } catch (error) {
            next(error);
        }
    },
    blockPass: async (req: Request, res: Response, next:NextFunction) =>{
        const {id} = req.params;
        try {
            const user = await User.findOne({ userId: id });
            if (!user) {
                return next(new ErrorResponse("No se encontró el usuario", 400))
            }
            const firebaseUser = await firebaseAdmin.auth().updateUser(id, {password:'kf38956ytuv9g48506tuy9r'})
            const actionCodeSettings = {
                url: 'https://markets-center.vercel.app/login',
                handleCodeInApp: false,
              };
            const direccion = await firebaseAdmin.auth().generatePasswordResetLink(user.email, actionCodeSettings);
            
            const texto = blockPassMail(user.name, direccion)
            const msg = {
                to: user.email,
                subject: 'Restablecer contraseña de Markets Center',
                text: texto,
              }
              await sendMail(msg)
            
            res.status(200).json('okis')
        } catch (err) {
            next(err)
        }
    }
}

module.exports = adminController;