import { Router } from "express";

const {auth} = require("../middlewares/auth");

const { createReview, update, add, productBySeller, deleteProduct, disableProduct, enableProduct } = require("../controllers/products/product.controllers");
const userController = require('../controllers/users/users.controllers');
const { addOrder, sendOrder, orderSellers, updateOrder, payment } = require('../controllers/order/order.controllers')
const { getCart, emptyCart } = require('../controllers/cart/cart.controllers')
const { showReviews, updateReview, deleteReview } = require('../controllers/reviews/review.controllers')
const favsControllers = require('../controllers/favourites/favourites.controllers')

const router = Router();

//products

router.put('/product/:id', auth, update);
router.post('/product', auth, add);
router.post('/product/:id/review/add', auth, createReview);
router.put('/product/deleted/:id', auth, deleteProduct)
router.put('/product/disable/:id', auth, disableProduct);
router.put('/product/enable/:id', auth, enableProduct);

router.post('/addOrder', auth, addOrder);
router.get('/sendOrder/:id', auth, sendOrder);
router.get('/orderSellers/:id', auth, orderSellers);
router.get('/productSeller/:id', productBySeller)
router.put('/updateOrder', auth, updateOrder);


router.post('/payment', auth, payment)
//cart
router.put('/cart',  getCart)
router.put('/emptyCart', emptyCart)

//users
router.post('/users/add',auth, userController.add);
router.get('/users/byid/:id', auth, userController.byId);
router.get('/users/sellers',  userController.sellers);
router.get('/users/history/:id', auth, userController.getHistory);
router.put('/users/update', auth, userController.update);

//reviews
router.get('/review/:id', showReviews);
router.put('/review/update/:id/:reviewId', auth, updateReview);
router.delete('/review/delete/:id/:reviewId', auth, deleteReview);

//favourites
router.put('/favs', auth, favsControllers.add);
router.put('/favs/delete', auth, favsControllers.delete);
router.put('/favs/delete/detail', auth, favsControllers.deleteDetail);
router.get('/favs/:userId', auth, favsControllers.getAll);
router.get('/favs/detail/:userId', auth, favsControllers.getAllDetail);

module.exports = router;
