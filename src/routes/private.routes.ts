import { Router } from "express";
const productController = require("../controllers/products/product.controllers");
const categoriesController = require("../controllers/categories/categories.controllers");

const router = Router();

router.put('/product/:id', productController.update);
router.post('/product', productController.add);
router.post('/category', categoriesController.add)

module.exports = router;
