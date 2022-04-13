import { Router } from "express";

const {all, product, deleteProduct} = require('../controllers/products/product.controllers');
const {allCategories } = require('../controllers/categories/categories.controllers');
const {addOrder, sendOrder} = require('../controllers/order/order.controllers')
const router = Router();

router.get('/products', all);
router.get('/product/:id', product);
router.get('/categories', allCategories);
router.delete('/product/:id', deleteProduct);
router.post('/addOrder', addOrder);
router.get('/sendOrder/:id', sendOrder)

module.exports = router;