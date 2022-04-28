import { Router } from "express";
const adminController = require('../controllers/admin/admin.controllers')

const router = Router();

//rutas de los admin
router.delete('/categories/:id', adminController.delCategory);
router.put('/categories/:id', adminController.updateCategory);
router.post('/category', adminController.addCategories);
router.delete('/userDelete/:id', adminController.deleteUser);
router.put('/userAdmin/:id', adminController.upgradeAdmin);
router.get('/blockPass/:id', adminController.blockPass);
router.get('/allOrders', adminController.allOrders);

module.exports = router;

