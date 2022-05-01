import { Router } from "express";
const adminController = require('../controllers/admin/admin.controllers')
const {auth} = require('../middlewares/auth')

const router = Router();

//rutas de los admin
router.put('/categories/:id', auth, adminController.deleteCategory);
router.put('/categories/:id',auth, adminController.updateCategory);
router.put('/categories/disabled/:id', adminController.disableCategory);
router.put('/categories/enabled/:id', adminController.enableCategory)
router.post('/category', auth, adminController.addCategories);
router.put('/userDelete/:id', adminController.deleteUser);
router.put('/userAdmin/:id',auth, adminController.upgradeAdmin);
router.get('/blockPass/:id', auth, adminController.blockPass)
router.get('/allOrders', auth, adminController.allOrders);
router.put('/banned/:id', auth, adminController.banned);

module.exports = router;

