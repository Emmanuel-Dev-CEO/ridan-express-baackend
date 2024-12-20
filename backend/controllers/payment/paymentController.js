const paystackModel = require('../../models/paystackModel');
const sellerModel = require('../../models/sellerModel');
const sellerWallet = require('../../models/sellerWallet');
const myShopWallet = require('../../models/myShopWallet');
const withdrawRequest = require('../../models/withdrawRequest');
const { responseReturn } = require('../../utiles/response');
const { mongo: { ObjectId } } = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const moment = require('moment');

console.log('Paystack initialized:', paystack);

class paymentController {
    create_paystack_payment = async (req, res) => {
        const { amount, sellerId } = req.body;

        try {
            // Retrieve seller details
            const seller = await sellerModel.findById(sellerId);
            if (!seller) {
                return res.status(404).json({ message: 'Seller not found' });
            }
            const sellerEmail = seller.email;

            // Generate unique transaction ID
            const transactionId = uuidv4();

            // Create payment on Paystack
            const payment = await paystack.transaction.initialize({
                email: sellerEmail,
                amount: amount * 100,
                callback_url: 'http://localhost:3001/payment/callback',
                metadata: { sellerId, transactionId },
            });

            const paymentReference = payment.data.reference;

            const newPayment = new paystackModel({
                sellerId,
                transactionId,
                reference: paymentReference,
                amount,
                status: 'pending',
            });

            await newPayment.save();

            return res.status(200).json({
                authorization_url: payment.data.authorization_url,
                reference: paymentReference,
            });
        } catch (error) {
            console.error('Payment creation error:', error.message);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    };

    payment_callback = async (req, res) => {
        const { reference } = req.query;

        try {
            const verificationResponse = await paystack.transaction.verify(reference);

            if (verificationResponse.data.status === 'success') {
                const { sellerId, amount } = verificationResponse.data.metadata;

                await this.creditSellerAndAdmin(sellerId, amount / 100);

                return res.status(200).json({ message: 'Payment verified and credited' });
            } else {
                return res.status(400).json({ message: 'Payment verification failed' });
            }
        } catch (error) {
            console.error('Error verifying payment:', error.message);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    };

    creditSellerAndAdmin = async (sellerId, amount) => {
        const commissionRate = 0.02;
        const adminAmount = amount * commissionRate;
        const sellerAmount = amount - adminAmount;
        const time = moment().format('MM/DD/YYYY').split('/');

        try {
            await sellerWallet.create({
                sellerId,
                amount: sellerAmount,
                month: time[0],
                year: time[2],
            });

            await myShopWallet.create({
                amount: adminAmount,
                month: time[0],
                year: time[2],
            });
        } catch (error) {
            console.error('Error crediting wallets:', error.message);
            throw new Error('Error crediting wallets');
        }
    };


    create_paystack_account = async (req, res) => {
        const { id } = req;
        const uid = uuidv4();

        try {

            const existingAccount = await paystackModel.findOne({ sellerId: id });

            if (existingAccount) {
                await paystackModel.deleteOne({ sellerId: id });
            }

            // Create a new Paystack account
            const account = await paystack.customer.create({
                type: 'express',
            });

            // Ensure the account was created successfully
            if (!account || !account.id) {
                throw new Error('Failed to create Paystack account.');
            }

            // Create an account link
            const accountLink = await paystack.account.link(account.id, {
                refresh_url: 'http://localhost:3001/refresh',
                return_url: `http://localhost:3001/success?activeCode=${uid}`,
            });

            // Save the Paystack account details in the database
            await paystackModel.create({
                sellerId: id,
                paystackId: account.id,
                code: uid,
            });

            return responseReturn(res, 201, { url: accountLink });
        } catch (error) {
            console.error('Paystack account creation error:', error.message);
            return responseReturn(res, 500, { message: 'Internal server error', error: error.message });
        }
    };

    active_paystack_account = async (req, res) => {
        const { activeCode } = req.params;
        const { id } = req; // Get seller ID from request object
        try {
            const userPaystackInfo = await paystackModel.findOne({ code: activeCode });
            if (userPaystackInfo) {
                await sellerModel.findByIdAndUpdate(id, {
                    payment: 'active'
                });
                return responseReturn(res, 200, { message: 'Payment active' });
            } else {
                return responseReturn(res, 404, { message: 'Payment activation failed' });
            }
        } catch (error) {
            console.error('Payment activation error:', error.message);
            return responseReturn(res, 500, { message: 'Internal server error', error: error.message });
        }
    };

    sumAmount = (data) => {
        return data.reduce((sum, item) => sum + item.amount, 0);
    };

    get_seller_payment_details = async (req, res) => {
        const { sellerId } = req.params;

        try {
            const payments = await sellerWallet.find({ sellerId });
            const pendingWithdrawals = await withdrawRequest.find({
                sellerId,
                status: 'pending'
            });
            const successfulWithdrawals = await withdrawRequest.find({
                sellerId,
                status: 'success'
            });

            const pendingAmount = this.sumAmount(pendingWithdrawals);
            const withdrawalAmount = this.sumAmount(successfulWithdrawals);
            const totalAmount = this.sumAmount(payments);

            const availableAmount = totalAmount > 0 ? totalAmount - (pendingAmount + withdrawalAmount) : 0;

            // Get the admin balance from myShopWallet
            const adminWallet = await myShopWallet.findOne(); // Assuming there's only one admin wallet
            const adminBalance = adminWallet ? adminWallet.balance : 0; // Get the balance or set to 0 if not found

            return responseReturn(res, 200, {
                totalAmount,
                pendingAmount,
                withdrawalAmount,
                availableAmount,
                adminBalance, // Include admin balance in the response
                successfulWithdrawals,
                pendingWithdrawals
            });
        } catch (error) {
            console.error('Error fetching seller payment details:', error.message);
            return responseReturn(res, 500, { message: 'Internal server error', error: error.message });
        }
    };

    withdrawal_request = async (req, res) => {
        const { amount, sellerId } = req.body;

        try {
            const withdrawal = await withdrawRequest.create({
                sellerId,
                amount: parseInt(amount)
            });
            return responseReturn(res, 200, { withdrawal, message: 'Withdrawal request sent' });
        } catch (error) {
            console.error('Withdrawal request error:', error.message);
            return responseReturn(res, 500, { message: 'Internal server error', error: error.message });
        }
    };

    get_payment_requests = async (req, res) => {
        try {
            const withdrawalRequests = await withdrawRequest.find({ status: 'pending' });
            return responseReturn(res, 200, { withdrawalRequests });
        } catch (error) {
            console.error('Error fetching payment requests:', error.message);
            return responseReturn(res, 500, { message: 'Internal server error', error: error.message });
        }
    };

    payment_request_confirm = async (req, res) => {
        const { paymentId } = req.body;

        try {
            const payment = await withdrawRequest.findById(paymentId);
            const { paystackId } = await paystackModel.findOne({
                sellerId: new ObjectId(payment.sellerId)
            });

            await paystack.transaction.charge({
                amount: payment.amount * 100,
                currency: 'NGN',
                destination: paystackId,
            });

            await withdrawRequest.findByIdAndUpdate(paymentId, { status: 'success' });
            return responseReturn(res, 200, { payment, message: 'Request confirmed successfully' });
        } catch (error) {
            console.error('Error confirming payment request:', error.message);
            return responseReturn(res, 500, { message: 'Internal server error', error: error.message });
        }
    };
}

module.exports = new paymentController();
