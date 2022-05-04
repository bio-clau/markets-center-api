import { Router } from "express";
const adminController = require('../controllers/admin/admin.controllers')
const {auth} = require('../middlewares/auth')

const router = Router();

//rutas de los admin
router.get('/users', auth, adminController.getAllUsers);
router.get('/categories', auth, adminController.allCategory);
router.put('/categories/delete/:id', auth, adminController.deleteCategory);
router.put('/categories/update/:id',auth, adminController.updateCategory);
router.put('/categories/disabled/:id', auth, adminController.disableCategory);
router.put('/categories/enabled/:id', auth, adminController.enableCategory)
router.post('/category', auth, adminController.addCategories);
router.put('/userDelete/:id', adminController.deleteUser);
router.put('/userAdmin/:id',auth, adminController.upgradeAdmin);
router.get('/blockPass/:id', auth, adminController.blockPass)
router.get('/allOrders', auth, adminController.allOrders);
router.put('/banned/:id', auth, adminController.banned);
router.delete('/deleteUid/:id', auth, adminController.deleteUid);

module.exports = router;

