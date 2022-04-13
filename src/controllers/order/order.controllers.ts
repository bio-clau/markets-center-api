import { Response, Request, NextFunction } from "express";
const Order = require('../../models/Order')

const orderControllers = {
    addOrder: async(res: Response, req: Request, next: NextFunction) => {

    },
    sendOrder: async(res: Response, req: Request, next: NextFunction) => {

    },
}

module.exports = orderControllers;