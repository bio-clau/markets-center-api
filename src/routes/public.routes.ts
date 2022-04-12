import { Router } from "express";

const {all, product} = require('../controllers/products/product.controllers');

const router = Router();

router.get('/product', all);
router.get('/product/:id', product);

module.exports = router;