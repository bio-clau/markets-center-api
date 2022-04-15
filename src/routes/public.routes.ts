import { Router } from "express";
const { filterBySeller } = require('../controllers/filters/filters.controllers')
const {all, product, deleteProduct} = require('../controllers/products/product.controllers');
const {allCategories } = require('../controllers/categories/categories.controllers');
const router = Router();

router.get('/products', all);
router.get('/product/:id', product);
router.get('/categories', allCategories);
router.delete('/product/:id', deleteProduct);
router.get('/filter/bySeller/:id', filterBySeller);

module.exports = router;