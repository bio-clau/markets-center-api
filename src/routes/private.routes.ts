import { Router } from "express";
const productController = require("../controllers/products/product.controllers");
const categoriesController = require("../controllers/categories/categories.controllers");

const router = Router();

router.put('/:id', productController.update);
router.post('/', productController.add);
router.post('/categorie', categoriesController.add)

module.exports = router;
