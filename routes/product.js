const express = require('express'); 
const authenticateToken = require("../middleware/auth");
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controller/productController');
const router = express.Router();

router.get('/products', authenticateToken, getProducts);
router.get('/product/:id', authenticateToken, getProduct);
router.post('/product', authenticateToken, createProduct);
router.put('/product/:id', authenticateToken, updateProduct);
router.delete('/product/:id', authenticateToken, deleteProduct);

module.exports = router;
