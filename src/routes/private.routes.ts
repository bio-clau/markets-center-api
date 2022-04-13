import { Router } from "express";
const productController = require("../controllers/products/product.controllers");
const categoriesController = require("../controllers/categories/categories.controllers");
const userController = require('../controllers/users/users.controllers')

const router = Router();

router.put('/product/:id', productController.update);
router.post('/product', productController.add);


router.post('/category', categoriesController.add);

router.get('/users', userController.getAll);
router.get('/users/sellers', userController.sellers);
router.post('/users/add', userController.add);
router.put('/users/update', userController.update);



module.exports = router;
