import { Router } from "express";
const adminController = require('../controllers/admin/admin.controllers')

const router = Router();

//rutas de los admin
router.delete('/categories/:id', adminController.delCategory)
router.put('/categories/:id', adminController.updateCategory)
router.post('/category', adminController.addCategorie)

module.exports = router;

