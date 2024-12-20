const router = require('express').Router();
const paymentController = require('../controllers/payment/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
    getSupplierProducts,
    createSupplierOrder,
} = require('../controllers/supplierController');

// Paystack Payment Routes
router.post('/payment/create-paystack-payment', authMiddleware, paymentController.create_paystack_payment);
router.get('/payment/callback', paymentController.payment_callback);

// Supplier Management Routes
router.get('/products', getSupplierProducts); // Fetch all supplier products
router.post('/order', createSupplierOrder); // Create supplier order
;
// Seller Payment Account Routes
router.get('/payment/create-paystack-account', authMiddleware, paymentController.create_paystack_account);
router.put('/payment/active-paystack-account/:activeCode', authMiddleware, paymentController.active_paystack_account);

// Seller Payment Details
router.get('/payment/seller-payment-details/:sellerId', authMiddleware, paymentController.get_seller_payment_details);

// Payment Request Management
router.get('/payment/request', authMiddleware, paymentController.get_payment_requests);
router.post('/payment/request-confirm', authMiddleware, paymentController.payment_request_confirm);

// Withdrawal Request
router.post('/payment/withdrawal-request', authMiddleware, paymentController.withdrawal_request);

module.exports = router;
