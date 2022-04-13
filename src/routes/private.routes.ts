import { Router } from "express";
const productController = require("../controllers/products/product.controllers");
const userController = require('../controllers/users/users.controllers')

const router = Router();

router.put('/product/:id', productController.update);
router.post('/product', productController.add);
router.post('/users/add', userController.add);

module.exports = router;
