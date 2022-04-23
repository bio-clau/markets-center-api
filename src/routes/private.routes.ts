import { Router } from "express";
const { createReview, update, add } = require("../controllers/products/product.controllers");
const userController = require('../controllers/users/users.controllers');
const { addOrder, sendOrder, orderSellers, updateOrder } = require('../controllers/order/order.controllers')
const { getCart, emptyCart} = require('../controllers/cart/cart.controllers')

const router = Router();

//products

router.put('/product/:id', update);
router.post('/product', add);
router.post('/product/:id/review/add', createReview)

router.post('/addOrder', addOrder);
router.get('/sendOrder/:id', sendOrder)
router.get('/orderSellers/:id', orderSellers)
router.put('/update/:id', updateOrder)

//cart
router.put('/cart/:id', getCart)
router.put('/emptyCart/:id', emptyCart)

//users
router.post('/users/add', userController.add);
router.get('/users', userController.getAll);
router.get('/users/byid/:id', userController.byId);
router.get('/users/sellers', userController.sellers);
router.get('/users/history/:id', userController.getHistory);
router.put('/users/update', userController.update);


module.exports = router;
