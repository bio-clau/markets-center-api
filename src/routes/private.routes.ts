import { Router } from "express";
const productController = require("../controllers/products/product.controllers");

const router = Router();

router.put('/:id', productController.update);
router.post('/', productController.add);

module.exports = router;
