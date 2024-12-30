const authOrderModel = require('../../models/authOrder')
const customerOrder = require('../../models/customerOrder')
const cardModel = require('../../models/cardModel')
const myShopWallet = require('../../models/myShopWallet')
const sellerWallet = require('../../models/sellerWallet')
const { mongo: { ObjectId } } = require('mongoose')
const axios = require('axios');
const { responseReturn } = require('../../utiles/response')
const moment = require('moment')
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY)

class orderController {
    verifyPaystackPayment = async (reference) => {
        if (!reference) {
            console.log('Invalid reference passed.');
            return null;
        }

        console.log('Reference passed to verify:', reference);
        try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                }
            });
            console.log('Paystack Verification Response:', response.data);

            if (response.data.status && response.data.data.status === 'success') {
                return response.data.data;  // Payment is successful
            }

            console.log('Payment verification failed:', response.data.message);
            return null;
        } catch (error) {
            console.log('Error verifying payment:', error.response?.data || error.message);
            return null;
        }
    };

    paymentCheck = async (orderId, reference) => {

        try {
            const order = await customerOrder.findById(orderId);

            if (order.payment_status === 'unpaid') {
                // Verify the payment status with Paystack
                const verifiedPayment = await this.verifyPaystackPayment(reference);
                console.log('Reference passed to verify:', reference);

                if (verifiedPayment) {
                    // Payment is verified
                    await customerOrder.findByIdAndUpdate(orderId, {
                        payment_status: 'paid',
                        delivery_status: 'pending'
                    });
                    await authOrderModel.updateMany({ orderId: new ObjectId(orderId) }, {
                        payment_status: 'paid',
                        delivery_status: 'pending'
                    });
                } else {
                    // If payment wasn't successful, mark the order as cancelled
                    await customerOrder.findByIdAndUpdate(orderId, {
                        delivery_status: 'cancelled'
                    });
                    await authOrderModel.updateMany({
                        orderId: orderId
                    }, {
                        delivery_status: 'cancelled'
                    });
                }
            }
            return true;
        } catch (error) {
            console.log('Error in paymentCheck:', error.message);
        }
    }

    place_order = async (req, res) => {
        const {
            price,
            products,
            shipping_fee,
            shippingInfo,
            userId,
            reference  // Include payment reference
        } = req.body;

        let authorOrderData = [];
        let cardId = [];
        const tempDate = moment(Date.now()).format('LLL');

        let customerOrderProduct = [];

        for (let i = 0; i < products.length; i++) {
            const pro = products[i].products;
            for (let j = 0; j < pro.length; j++) {
                let tempCusPro = pro[j].productInfo;
                tempCusPro.quantity = pro[j].quantity;
                customerOrderProduct.push(tempCusPro);
                if (pro[j]._id) {
                    cardId.push(pro[j]._id);
                }
            }
        }

        try {
            const order = await customerOrder.create({
                customerId: userId,
                shippingInfo,
                products: customerOrderProduct,
                price: price + shipping_fee,
                delivery_status: 'pending',
                payment_status: 'unpaid',
                date: tempDate
            });

            for (let i = 0; i < products.length; i++) {
                const pro = products[i].products;
                const pri = products[i].price;
                const sellerId = products[i].sellerId;
                let storePro = [];
                for (let j = 0; j < pro.length; j++) {
                    let tempPro = pro[j].productInfo;
                    tempPro.quantity = pro[j].quantity;
                    storePro.push(tempPro);
                }

                authorOrderData.push({
                    orderId: order.id,
                    sellerId,
                    products: storePro,
                    price: pri,
                    payment_status: 'unpaid',
                    shippingInfo: 'Dhaka myshop Warehouse',
                    delivery_status: 'pending',
                    date: tempDate
                });
            }

            await authOrderModel.insertMany(authorOrderData);
            for (let k = 0; k < cardId.length; k++) {
                await cardModel.findByIdAndDelete(cardId[k]);
            }

            // Check payment after some delay (adjust timeout if necessary)
            setTimeout(() => {
                this.paymentCheck(order.id, reference);
            }, 15000);

            responseReturn(res, 201, {
                message: "Order placed successfully",
                orderId: order.id
            });
        } catch (error) {
            console.log('Place order error: ', error.message);
        }
    }

    get_customer_databorad_data = async (req, res) => {
        const {
            userId
        } = req.params

        try {
            const recentOrders = await customerOrder.find({
                customerId: new ObjectId(userId)
            }).limit(5)
            const pendingOrder = await customerOrder.find({
                customerId: new ObjectId(userId),
                delivery_status: 'pending'
            }).countDocuments()
            const totalOrder = await customerOrder.find({
                customerId: new ObjectId(userId)
            }).countDocuments()
            const cancelledOrder = await customerOrder.find({
                customerId: new ObjectId(userId),
                delivery_status: 'cancelled'
            }).countDocuments()
            responseReturn(res, 200, {
                recentOrders,
                pendingOrder,
                cancelledOrder,
                totalOrder
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    get_orders = async (req, res) => {
        const {
            customerId,
            status
        } = req.params

        try {
            let orders = []
            if (status !== 'all') {
                orders = await customerOrder.find({
                    customerId: new ObjectId(customerId),
                    delivery_status: status
                })
            } else {
                orders = await customerOrder.find({
                    customerId: new ObjectId(customerId)
                })
            }
            responseReturn(res, 200, {
                orders
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    get_order = async (req, res) => {
        const {
            orderId,
        } = req.params

        try {
            const order = await customerOrder.findById(orderId)
            responseReturn(res, 200, {
                order
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    get_admin_orders = async (req, res) => {
        let { page, parPage, searchValue } = req.query
        page = parseInt(page)
        parPage = parseInt(parPage)

        const skipPage = parPage * (page - 1)

        try {
            if (searchValue) {

            } else {
                const orders = await customerOrder.aggregate([
                    {
                        $lookup: {
                            from: 'authororders',
                            localField: "_id",
                            foreignField: 'orderId',
                            as: 'suborder'
                        }
                    }
                ]).skip(skipPage).limit(parPage).sort({ createdAt: -1 })

                const totalOrder = await customerOrder.aggregate([
                    {
                        $lookup: {
                            from: 'authororders',
                            localField: "_id",
                            foreignField: 'orderId',
                            as: 'suborder'
                        }
                    }
                ])

                responseReturn(res, 200, { orders, totalOrder: totalOrder.length })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    get_admin_order = async (req, res) => {

        const { orderId } = req.params

        try {
            const order = await customerOrder.aggregate([
                {
                    $match: { _id: new ObjectId(orderId) }
                }, {
                    $lookup: {
                        from: 'authororders',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'suborder'
                    }
                }
            ])
            responseReturn(res, 200, { order: order[0] })
        } catch (error) {
            console.log('get admin order ' + error.message)
        }
    }

    admin_order_status_update = async (req, res) => {
        const { orderId } = req.params
        const { status } = req.body

        try {
            await customerOrder.findByIdAndUpdate(orderId, {
                delivery_status: status
            })
            responseReturn(res, 200, { message: 'order status change success' })
        } catch (error) {
            console.log('get admin order status error ' + error.message)
            responseReturn(res, 500, { message: 'internal server error' })
        }
    }

    get_seller_orders = async (req, res) => {

        const { sellerId } = req.params
        let { page, parPage, searchValue } = req.query
        page = parseInt(page)
        parPage = parseInt(parPage)

        const skipPage = parPage * (page - 1)


        try {
            if (searchValue) {

            } else {
                const orders = await authOrderModel.find({
                    sellerId,
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                const totalOrder = await authOrderModel.find({
                    sellerId,
                }).countDocuments()
                responseReturn(res, 200, { orders, totalOrder })
            }
        } catch (error) {
            console.log('get seller order error ' + error.message)
            responseReturn(res, 500, { message: 'internal server error' })
        }
    }

    get_seller_order = async (req, res) => {

        const { orderId } = req.params

        try {
            const order = await authOrderModel.findById(orderId)

            responseReturn(res, 200, { order })
        } catch (error) {
            console.log('get admin order ' + error.message)
        }
    }

    seller_order_status_update = async (req, res) => {
        const { orderId } = req.params
        const { status } = req.body

        try {
            await authOrderModel.findByIdAndUpdate(orderId, {
                delivery_status: status
            })
            responseReturn(res, 200, { message: 'order status change success' })
        } catch (error) {
            console.log('get admin order status error ' + error.message)
            responseReturn(res, 500, { message: 'internal server error' })
        }
    }

    create_payment = async (req, res) => {
        const { price, email } = req.body
        if (!email) {
            return responseReturn(res, 400, { message: 'Email is required.' });
        }

        try {
            const payment = await paystack.transaction.initialize({
                amount: price * 100,
                email: email,
                currency: 'NGN',
                automatic_payment_methods: {
                    enabled: true
                }
            })
            responseReturn(res, 200, { clientSecret: payment.client_secret })
        } catch (error) {
            console.log(error.message)
        }
    }
    order_confirm = async (req, res) => {
        const { orderId, reference } = req.params;
        try {
            console.log('Verifying payment with reference:', reference);
            const verifiedPayment = await this.verifyPaystackPayment(reference);

            if (verifiedPayment) {
                await customerOrder.findByIdAndUpdate(orderId, {
                    payment_status: 'paid',
                    delivery_status: 'pending'
                });
                await authOrderModel.updateMany({ orderId: new ObjectId(orderId) }, {
                    payment_status: 'paid',
                    delivery_status: 'pending'
                });

                const cuOrder = await customerOrder.findById(orderId);
                console.log('Updated Customer Order:', cuOrder);
                const auOrder = await authOrderModel.find({ orderId: new ObjectId(orderId) });

                const time = moment(Date.now()).format('l');
                const splitTime = time.split('/');

                await myShopWallet.create({
                    amount: cuOrder.price,
                    month: splitTime[0],
                    year: splitTime[2],
                });

                for (let i = 0; i < auOrder.length; i++) {
                    await sellerWallet.create({
                        sellerId: auOrder[i].sellerId.toString(),
                        amount: auOrder[i].price,
                        month: splitTime[0],
                        year: splitTime[2],
                    });
                }

                responseReturn(res, 200, { message: 'Payment verified and order confirmed' });
            } else {
                responseReturn(res, 400, { message: 'Payment verification failed' });
            }
        } catch (error) {
            console.log('Order confirm error: ', error.message);
            responseReturn(res, 500, { message: 'Internal server error' });
        }
    }

}

module.exports = new orderController()