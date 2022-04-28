import { Router } from "express";
const adminController = require('../controllers/admin/admin.controllers')
const {auth} = require('../middlewares/auth')

const router = Router();

//rutas de los admin
router.delete('/categories/:id', auth, adminController.delCategory);
router.put('/categories/:id',auth, adminController.updateCategory);
router.post('/category', auth, adminController.addCategories);
router.delete('/userDelete/:id', auth, adminController.deleteUser);
router.put('/userAdmin/:id',auth, adminController.upgradeAdmin);
router.get('/blockPass/:id', auth, adminController.blockPass)
router.get('/allOrders', auth, adminController.allOrders);

module.exports = router;

