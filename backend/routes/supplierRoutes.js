const express = require('express');
const router = express.Router();
const {
  getSupplierProducts,
  createSupplierOrder,
} = require('../controllers/supplierController');
router.get('/products', getSupplierProducts);
router.post('/order', createSupplierOrder);

module.exports = router;
