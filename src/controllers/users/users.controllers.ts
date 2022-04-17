import { NextFunction, Request, Response } from "express";
const ErrorResponse = require("../../helpers/errorConstructor");
const {cloudinary} = require('../../config/cloudinary')

const User = require("../../models/User");

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
        picture,
        user_id,
        email,
        isSeller,
        phone,
        IdDocument,
        dateofBirth,
        address,
        delivery,
      } = req.body;
      const user = await User.findOne({ userId: user_id });
      if (!user) {
        return next(new ErrorResponse("No se encontro el usuario", 404));
      }
      const userUpdated = await User.findOneAndUpdate(
        { userId: user_id },
        {
          name,
          image: picture,
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
  }
};

module.exports = userController;
