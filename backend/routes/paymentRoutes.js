const router = require('express').Router();
const paymentController = require('../controllers/payment/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Paystack routes
router.post('/create-paystack-payment', authMiddleware, paymentController.create_paystack_payment); // <-- Add this line
router.get('/payment/callback', paymentController.payment_callback);

// Other routes...
router.get('/payment/create-paystack-account', authMiddleware, paymentController.create_paystack_account);
router.put('/payment/active-paystack-account/:activeCode', authMiddleware, paymentController.active_paystack_account);
router.get('/payment/seller-payment-details/:sellerId', authMiddleware, paymentController.get_seller_payment_details);
router.get('/payment/request', authMiddleware, paymentController.get_payment_requests);
router.post('/payment/request-confirm', authMiddleware, paymentController.payment_request_confirm);
router.post('/payment/withdrawal-request', authMiddleware, paymentController.withdrawal_request);

module.exports = router;
