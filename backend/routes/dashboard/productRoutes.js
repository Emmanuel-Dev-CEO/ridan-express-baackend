const router = require('express').Router();
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { saveDraft, getDrafts, publishDraft, add_product, products_get, product_get, product_update, product_image_update } = require('../../controllers/dashboard/productController');

// Product Draft Routes
router.post("/drafts", saveDraft);
router.get("/drafts", getDrafts);
router.post("/drafts/publish", publishDraft);

// Product Routes
router.post('/product-add', authMiddleware, add_product);
router.get('/products-get', authMiddleware, products_get);
router.get('/product-get/:productId', authMiddleware, product_get);
router.post('/product-update', authMiddleware, product_update);
router.post('/product-image-update', authMiddleware, product_image_update);

module.exports = router;
