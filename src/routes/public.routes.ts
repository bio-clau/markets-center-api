import { Router } from "express";
const { filterBySellerAndCategories } = require('../controllers/filters/filters.controllers')
const { all, product, deleteProduct, createReview } = require('../controllers/products/product.controllers');
const { allCategories } = require('../controllers/categories/categories.controllers');
const { add, updateReview, allReviews, deleteReview } = require('../controllers/reviews/review.controllers');
const { payment } = require('../controllers/order/order.controllers')

const router = Router();

/* Products */
router.get('/products', all);
router.get('/product/:id', product);
router.delete('/product/:id', deleteProduct);


/* Categories */
router.get('/categories', allCategories);

/* Filters */
router.get('/filter', filterBySellerAndCategories);

/* Reviews */
router.post('/product/:id/review/add', createReview)
/* router.get('/reviews', allReviews);
router.put('/review/update/:id', updateReview);
router.delete('/review/delete/:id', deleteReview); */

module.exports = router;