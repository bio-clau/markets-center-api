import { NextFunction, Request, Response } from "express";
import { blockPassMail } from '../../mail/blockPass'
const ErrorResponse = require("../../helpers/errorConstructor");
const { cloudinary } = require('../../config/cloudinary');
const Categories = require('../../models/Categories.ts');
const User = require('../../models/User');
const Order = require('../../models/Order')
import { firebaseAdmin } from '../../config/firebase'
import { desbannedMail } from "../../mail/desbanned";
import { bannedMail } from "../../mail/banned";
import { deletedMail } from "../../mail/deleted";
const sendMail = require('../../config/sendMail')

const adminController = {
    deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
        const idCategory = req.params.id;
        try {
            if (idCategory) {
                const category = await Categories.findById(idCategory);
                if (!category) return next(new ErrorResponse("La categoria no existe", 404));
                if (category.deleted) return next(new ErrorResponse("La categoria ya se encuentra eliminada", 404))
                Categories.findByIdAndUpdate(idCategory, { deleted: true }, { new: true, runValidators: true }, async (error: Object, category: Object) => {
                    if (error) return next(new ErrorResponse("No se encontro la categoria", 404));
                    if (category) {
                        const categories = await Categories.find({ deleted: false });
                        return res.json({
                            success: true,
                            msg: "La categoria fue eliminada exitosamente",
                            data: categories
                        });
                    };
                });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
        } catch (err) {
            next(err)
        }
    },
    disableCategory: async (req: Request, res: Response, next: NextFunction) => {
        const idCategory = req.params.id;
        try {
            if (idCategory) {
                const category = await Categories.findById(idCategory);
                if (!category) return next(new ErrorResponse("La categoria no existe", 404));
                if (category.disabled) return next(new ErrorResponse("La categoria ya se encuentra deshabilitada", 404));
                if (category.deleted) return next(new ErrorResponse("La categoria se encuentra eliminada", 404))
                Categories.findByIdAndUpdate(idCategory, { disabled: true }, { new: true, runValidators: true }, async (error: Object, category: Object) => {
                    if (error) return next(new ErrorResponse("No se encontro la categoria", 404));
                    if (category) {
                        const categories = await Categories.find({ deleted: false });
                        return res.json({
                            success: true,
                            msg: "La categoria fue deshabiltiada exitosamente",
                            data: categories
                        });
                    };
                });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
        } catch (err) {
            next(err)
        }
    },
    enableCategory: async (req: Request, res: Response, next: NextFunction) => {
        const idCategory = req.params.id;
        try {
            if (idCategory) {
                const category = await Categories.findById(idCategory);
                if (!category) return next(new ErrorResponse("La categoria no existe", 404));
                if (!category.disabled) return next(new ErrorResponse("La categoria ya se encuentra habilitada", 404))
                if (category.deleted) return next(new ErrorResponse("La categoria se encuentra eliminada", 404))
                Categories.findByIdAndUpdate(idCategory, { disabled: false }, { new: true, runValidators: true }, async (error: Object, category: Object) => {
                    if (error) return next(new ErrorResponse("No se encontro la categoria", 404));
                    if (category) {
                        const categories = await Categories.find({ deleted: false });
                        return res.json({
                            success: true,
                            msg: "La categoria fue habilitada exitosamente",
                            data: categories
                        });
                    };
                });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
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
            if (cat.deleted) return next(new ErrorResponse("La categoria se encuentra eliminada", 404));
            if (cat.disabled) return next(new ErrorResponse("La categoria ya se encuentra deshabilitada", 404));
            const newCategory = await Categories.findByIdAndUpdate(id, {
                name,
                image: img
            }, { new: true })
            const allCategories = await Categories.find({deleted: false});
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
                const allCategories = await Categories.find({deleted: false});
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
            if (id) {
                const user = await User.findById(id);
                if (!user) return next(new ErrorResponse("El usuario no existe", 404));
                if (user.deleted) return next(new ErrorResponse("El usuario ya se encuentra eliminado", 404))
                User.findByIdAndUpdate(id, { deleted: true }, { new: true, runValidators: true }, async (error: Object, userDeleted: Object) => {
                    if (error) return next(new ErrorResponse("No se encontro el usuario", 404));
                    await firebaseAdmin.auth().updateUser(user.userId, { disabled: true });
                    const texto = deletedMail(user.name, user.email)
                        const msg = {
                            to: user.email,
                            subject: 'Su cuenta fue eliminada',
                            text: texto
                        };
                        await sendMail(msg);
                    if (userDeleted) {
                        const users = await User.find({deleted: false});
                        res.json({
                            success: true,
                            msg: "El usuario fue eliminado exitosamente",
                            data: users
                        });
                    };
                });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
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
            if (user.deleted) return next(new ErrorResponse("El usuario se encuentra eliminado", 404))
            if (user.disabled) return next(new ErrorResponse("El usuario se encuentra deshabilitado", 404))
            await User.findByIdAndUpdate(id, {
                isAdmin: true,
                isSeller: false
            });
            const users = await User.find({deleted: false});
            res.status(200).json({
                success: true,
                msg: "Usuario convertido a Admin correctamente",
                data: users
            })
        } catch (error) {
            next(error);
        }
    },
    blockPass: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        try {
            const user = await User.findOne({ userId: id });
            if (!user) {
                return next(new ErrorResponse("No se encontró el usuario", 400))
            }
            if (user.deleted) return next(new ErrorResponse("El usuario se encuentra eliminado", 404))
            if (user.disabled) return next(new ErrorResponse("El usuario se encuentra deshabilitado", 404))
            const firebaseUser = await firebaseAdmin.auth().updateUser(id, { password: 'kf38956ytuv9g48506tuy9r' })
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

            res.status(200).json('La contraseña fue obligada a resetear')
        } catch (err) {
            next(err)
        }
    },
    allOrders: async (req: Request, res: Response, next: NextFunction) => {
        try {
            Order.find({}, (error: Object, orders: []) => {
                if (error) return next(new ErrorResponse("No se encontraron ordenes", 404));
                if (orders) {
                    let ordersObj: { id: number; comprador: any; estado: string; monto: number; comisión: number; }[] = [];
                    orders.map((order: any, index: number) => {
                        let vendedores: any[] = [];
                        order.products.map((vendedor: any) =>  {
                            !vendedores.includes(vendedor.productId.userId.name) && vendedores.push(vendedor.productId.userId.name);
                        })
                        let vendedoresString = vendedores.join(' - ');
                        let fecha = `${order.createdAt}`.slice(0, 15);
                        let newObj = {
                            id: index + 1,
                            vendedores: vendedoresString,
                            comprador: order.userId === null ? 'Anonimo' : order.userId.name,
                            estado: order.status,
                            monto: order.amount,
                            comisión: order.amount / 2,
                            fecha: fecha
                        }
                        ordersObj.push(newObj);
                    })
                    res.json({
                        success: true,
                        msg: "Se enviaron las ordenes encontradas",
                        data: ordersObj
                    })
                }
            }).populate([{ path: 'products.productId', populate: {path: 'userId'} },{ path: 'purchased.product.userId' }, { path: 'userId' }])
        } catch (error) {
            next(error)
        }
    },
    banned: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        let { reason, disabled } = req.body
        try {
            if (id && disabled) {
                const user = await User.findById(id);
                if (user.disabled) return next(new ErrorResponse("El usuario ya se encuentra deshabilitado", 404));
                if (user.deleted) return next(new ErrorResponse("El usuario se encuentra eliminado", 404));
                User.findByIdAndUpdate(id, { disabled: true }, { new: true, runValidators: true }, async (error: Object, userBanned: Object) => {
                    if (error) return next(new ErrorResponse("No se encontro el usuario", 404));
                    if (userBanned) {
                        await firebaseAdmin.auth().updateUser(user.userId, { disabled: true })
                        const texto = bannedMail(user.name, user.email, reason = 'Tuvo conductas inadecuadas')
                        const msg = {
                            to: user.email,
                            subject: 'Su cuenta fue bloqueada',
                            text: texto
                        };
                        await sendMail(msg);
                        return res.json({
                            success: true,
                            msg: "El usuario fue baneado",
                            data: userBanned
                        });
                    };
                });
            }
            else if (id && !disabled) {
                const user = await User.findById(id);
                if (!user.disabled) return next(new ErrorResponse("El usuario ya se encuentra habilitado", 404));
                if (user.deleted) return next(new ErrorResponse("El usuario se encuentra eliminado", 404));
                User.findByIdAndUpdate(id, { disabled: false }, { new: true, runValidators: true }, async (error: Object, userDesbanned: Object) => {
                    if (error) return next(new ErrorResponse("No se encontro el usuario", 404));
                    if (userDesbanned) {
                        await firebaseAdmin.auth().updateUser(user.userId, { disabled: false })
                        const texto = desbannedMail(user.name, user.email, reason = 'Se cumplio el tiempo deteminado de baneo')
                        const msg = {
                            to: user.email,
                            subject: 'Su cuenta fue desbloqueada',
                            text: texto
                        };
                        await sendMail(msg);
                        return res.json({
                            success: true,
                            msg: "El usuario fue desbaneado",
                            data: userDesbanned
                        });
                    };
                });
            }
            else {
                return next(new ErrorResponse("Son necesarios todos los parametros", 404));
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = adminController;