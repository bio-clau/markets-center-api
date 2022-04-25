import { NextFunction, Request, Response } from "express";
const sendMail = require('../../config/sendMail')
import {bienvenidaMail} from '../../mail/bienvenida'
const ErrorResponse = require("../../helpers/errorConstructor");
const {cloudinary} = require('../../config/cloudinary')

const { STRIPE_API_KEY } = process.env
const stripe = require('stripe')(STRIPE_API_KEY);

const Cart = require('../../models/Cart');
const User = require("../../models/User");
const Order = require("../../models/Order")

const userController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      image,
      uploadImg,
      userId,
      email,
      isSeller,
      phone,
      IdDocument,
      dateofBirth,
      address,
      delivery,
    } = req.body;
    let img='';
    try {
      if (await User.findOne({ email: email })) {
        return next(
          new ErrorResponse("El mail ya se encuentra registrado", 401)
        );
      }
      if(uploadImg){
        const result = await cloudinary.uploader.upload(image);
        if (!result) {
          return res.status(503).json('Upload failed');
        }
        img=result.url
      } else {
        img=image
      }
      const user = new User({
        name,
        image: img,
        userId,
        email,
        isSeller,
        phone,
        IdDocument,
        dateofBirth,
        address,
        delivery,
      });
      await user.save();

      if(isSeller){
        const account = await stripe.accounts.create({
          type: 'custom',
          country: 'US',
          email: email,
          business_type: 'individual',
          id: userId,
          first_name: name,
          phone: phone,
          capabilities: {
            card_payments: {requested: true},
            transfers: {requested: true},
          },
          
        });
      }
      const texto = bienvenidaMail(user.name)
      const msg = {
        to: user.email,
        subject: 'Bienvenido a Markets Center',
        text: texto
      };
      await sendMail(msg);
      
      const newUser = await User.findOne({userId: userId}).exec();
      const newUserCart = new Cart({userId: newUser._id });
      await newUserCart.save();

      res.status(201).json({
        success: true,
        message: "Usuario ingresado satisfactoriamente",
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        image,
        userId,
        email,
        isSeller,
        phone,
        IdDocument,
        dateofBirth,
        address,
        delivery,
        uploadImg
      } = req.body;
      let img= ''
      const user = await User.findOne({ userId: userId });
      if (!user) {
        return next(new ErrorResponse("No se encontro el usuario", 404));
      }
      if(uploadImg){
        const result = await cloudinary.uploader.upload(image);
        if (!result) {
          return res.status(503).json('Upload failed');
        }
        img=result.url
      } else {
        img=image
      }
      const userUpdated = await User.findOneAndUpdate(
        { userId: userId },
        {
          name,
          image: img,
          email,
          isSeller,
          phone,
          IdDocument,
          dateofBirth,
          address,
          delivery,
        },
        { new: true, runValidators: true }
      );
      if (!userUpdated) {
        return next(new ErrorResponse("No se pudo modificar el usuario", 304));
      }
      res.status(201).json({
        success: true,
        msg: "Usuario modificado satisfactoriamente",
        data: userUpdated,
      });
    } catch (err) {
      next(err);
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction)=>{
      try {
          const users = await User.find();
          if(!users) {
              return next(new ErrorResponse("No se encontraron usuarios", 404))
          }
          res.status(200).json({
              success: true,
              msg:"Usuarios encontrados",
              data: users
          })
      } catch (err) {
          next(err)
      }
  },
  getHistory: async (req:Request, res: Response, next:NextFunction)=>{
    const {id} = req.params;
    try {
      if(!id) {
        return next(new ErrorResponse("El ID no es válido", 400));
      }
      if(!await User.findById(id)){
        return next(new ErrorResponse("El ID no es válido", 400))
      }
      const orders = await Order.find({userId:id}).populate('products.productId')
      if(!orders.length){
        return next(new ErrorResponse("El historial esta vacío", 404))
      }
      res.status(200).json({
        success:true,
        msg:"Historial encontrado",
        data: orders
      })
    } catch (err) {
      next(err)
    }
  },

  sellers: async (req: Request, res: Response, next:NextFunction)=> {
      try {
          const sellers = await User.find({isSeller: true});
          if(!sellers.length){
              return next(new ErrorResponse('No se encontrarosn vendedores', 404))
          }
          res.status(200).json({
              success: true,
              msg:"Vendedores encontrados",
              data: sellers
          })
      } catch (err) {
          next(err)
      }
  },
  byId: async (req: Request, res: Response, next: NextFunction)=>{
    const {id} = req.params;
    try {
      const user = await User.find({userId: id})
      if(!user) {
        return next(new ErrorResponse("No se encontro usuario", 404))
      };
      res.status(200).json({
        success: true,
        msg:"Usuario encontrado",
        data: user
      })
    } catch (err) {
      next(err)
    }
  }
};

module.exports = userController;
