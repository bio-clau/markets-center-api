import { Router } from "express";

const {auth} = require("../middlewares/auth");

const { createReview, update, add } = require("../controllers/products/product.controllers");
const userController = require('../controllers/users/users.controllers');
const { addOrder, sendOrder, orderSellers, updateOrder, payment } = require('../controllers/order/order.controllers')
const { getCart, emptyCart } = require('../controllers/cart/cart.controllers')
const { showReviews, updateReview, deleteReview } = require('../controllers/reviews/review.controllers')

const router = Router();

//products

router.put('/product/:id', auth, update);
router.post('/product', auth, add);
router.post('/product/:id/review/add', auth, createReview)

router.post('/addOrder', auth, addOrder);
router.get('/sendOrder/:id', auth, sendOrder)
router.get('/orderSellers/:id', auth, orderSellers)
router.put('/updateOrder', auth, updateOrder)


router.post('/payment', auth, payment)
//cart
router.put('/cart', auth, getCart)
router.put('/emptyCart', auth, emptyCart)

//users
router.post('/users/add',auth, userController.add);
router.get('/users', userController.getAll);
router.get('/users/byid/:id', auth, userController.byId);
router.get('/users/sellers',  userController.sellers);
router.get('/users/history/:id', auth, userController.getHistory);
router.put('/users/update', auth, userController.update);

//reviews
router.get('/review/:id', showReviews);
router.put('/review/update/:id/:reviewId', updateReview);
router.delete('/review/delete/:id/:reviewId', deleteReview);

module.exports = router;
