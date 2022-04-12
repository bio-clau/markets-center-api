import { Router } from "express";

const {all, product} = require('../controllers/products/product.controllers');
const {categorie} = require('../controllers/categories/categories.controllers');

const router = Router();

router.get('/product', all);
router.get('/product/:id', product);
router.get('/categorie', categorie)

module.exports = router;