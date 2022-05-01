import {NextFunction, Request, Response} from 'express'
import { updateExpressionWithTypeArguments } from 'typescript';
const ErrorResponse = require('../../helpers/errorConstructor')
const User = require('../../models/User');
const Favs = require('../../models/Favourites');

const favsControllers = {
    add: async (req: Request, res: Response, next:NextFunction)=>{
        try {
            const {userId, productId} = req.body;
            const user = await User.findOne({userId: userId});
            console.log('punto1')
            if(!user){
                return next(new ErrorResponse("Usuario Inválido", 400))
            }
            const favs = await Favs.findOne({userId: user._id});
            console.log('punto2')
            console.log(favs)
            if(favs.favs.includes(productId)){
                return next(new ErrorResponse("Ya existe en favoritos", 400))
            }
            let updated
            if(!favs){
                const userFav = new Favs({
                    userId: user._id,
                    favs: [productId]
                });
                await userFav.save()
            } else {
                updated = await Favs.findOneAndUpdate({userId: user._id},{
                    favs:[...favs.favs, productId]
                },{
                    new:true
                })
                console.log('punto3')
                if(!updated) return next(new ErrorResponse("No se pudo agregar a favoritos", 304))
            }
            res.status(201).json({
                success: true,
                msg: "Producto agregado a favoritos",
                data: updated
            })
        } catch (err) {
            next(err)
        }
    },
    delete: async (req: Request, res:Response, next:NextFunction)=>{
        try {
            const {userId, productId} = req.body;
            const user = await User.findOne({userId: userId});
            console.log('user')
            if(!user){
                return next(new ErrorResponse("Usuario Inválido", 400))
            }
            const favs = await Favs.findOne({userId: user._id});
            console.log('favs')
            if(!favs){
                return next(new ErrorResponse("No se encontraron favoritos", 404))
            }
            const newFavs = favs.favs.filter((p: any)=>`${p}`!== productId)
            console.log(newFavs)
            const updated = await Favs.findOneAndUpdate({userId: user._id},{
                favs: newFavs
            },{new:true})
            if(!updated) return next(new ErrorResponse("No se pudo agregar a favoritos", 304))
            res.status(201).json({
                success:true,
                msg: "Producto eliminado de favoritos",
                data: updated
            })
        } catch (err) {
            next(err)
        }
    },
    getAll: async (req:Request, res:Response, next:NextFunction)=>{
        try {
            const {userId} = req.params;
            const user = await User.findOne({userId: userId});
            if(!user) return next(new ErrorResponse("Usuario invalido", 400))
            const favs = await Favs.findOne({userId: user._id})
            if(!favs) return next(new ErrorResponse("Favoritos no encontrados", 404));
            res.status(200).json({
                success: true,
                msg: "Favoritos encontrados",
                data: favs
            })
        } catch (err) {
            next(err)
        }
    },
    getAllDetail: async (req:Request, res:Response, next:NextFunction)=>{
        try {
            const {userId} = req.params;
            const user = await User.findOne({userId: userId});
            if(!user) return next(new ErrorResponse("Usuario invalido", 400))
            const favs = await Favs.findOne({userId: user._id}).populate('favs')
            if(!favs) return next(new ErrorResponse("Detalle de Favoritos no encontrados", 404));
            res.status(200).json({
                success: true,
                msg: "Detall de Favoritos encontrados",
                data: favs
            })
        } catch (err) {
            next(err)
        }
    },
    deleteDetail: async (req: Request, res:Response, next:NextFunction)=>{
        try {
            const {userId, productId} = req.body;
            const user = await User.findOne({userId: userId});
            console.log('user')
            if(!user){
                return next(new ErrorResponse("Usuario Inválido", 400))
            }
            const favs = await Favs.findOne({userId: user._id});
            console.log('favs')
            if(!favs){
                return next(new ErrorResponse("No se encontraron favoritos", 404))
            }
            const newFavs = favs.favs.filter((p: any)=>`${p}`!== productId)
            console.log(newFavs)
            const updated = await Favs.findOneAndUpdate({userId: user._id},{
                favs: newFavs
            },{new:true})
            const favsUp = await Favs.findOne({userId: user._id}).populate('favs')
            if(!updated) return next(new ErrorResponse("No se pudo agregar a favoritos", 304))
            res.status(201).json({
                success:true,
                msg: "Producto eliminado de favoritos",
                data: favsUp
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = favsControllers;