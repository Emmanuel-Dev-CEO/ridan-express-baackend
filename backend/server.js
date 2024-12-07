const express = require('express');
const { dbConnect } = require('./utiles/db');
const app = express();
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const paystack = require('paystack')('YOUR_PAYSTACK_SECRET_KEY'); // Add your Paystack secret key
require('dotenv').config();
const socket = require('socket.io');

const server = http.createServer(app);

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true
    }
});

var allCustomer = [];
var allSeller = [];

const addUser = (customerId, socketId, userInfo) => {
    const checkUser = allCustomer.some(u => u.customerId === customerId);
    if (!checkUser) {
        allCustomer.push({
            customerId,
            socketId,
            userInfo
        });
    }
};

const addSeller = (sellerId, socketId, userInfo) => {
    const checkSeller = allSeller.some(u => u.sellerId === sellerId);
    if (!checkSeller) {
        allSeller.push({
            sellerId,
            socketId,
            userInfo
        });
    }
};

const findCustomer = (customerId) => {
    return allCustomer.find(c => c.customerId === customerId);
};

const findSeller = (sellerId) => {
    return allSeller.find(c => c.sellerId === sellerId);
};

const remove = (socketId) => {
    allCustomer = allCustomer.filter(c => c.socketId !== socketId);
    allSeller = allSeller.filter(c => c.socketId !== socketId);
};

let admin = {};

const removeAdmin = (socketId) => {
    if (admin.socketId === socketId) {
        admin = {};
    }
};

io.on('connection', (soc) => {
    console.log('socket server is connected...');

    soc.on('add_user', (customerId, userInfo) => {
        addUser(customerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
        io.emit('activeCustomer', allCustomer);
    });

    soc.on('add_seller', (sellerId, userInfo) => {
        addSeller(sellerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
        io.emit('activeCustomer', allCustomer);
        io.emit('activeAdmin', { status: true });
    });

    soc.on('add_admin', (adminInfo) => {
        delete adminInfo.email;
        admin = adminInfo;
        admin.socketId = soc.id;
        io.emit('activeSeller', allSeller);
        io.emit('activeAdmin', { status: true });
    });

    soc.on('send_seller_message', (msg) => {
        const customer = findCustomer(msg.receverId);
        if (customer !== undefined) {
            soc.to(customer.socketId).emit('seller_message', msg);
        }
    });

    soc.on('send_customer_message', (msg) => {
        const seller = findSeller(msg.receverId);
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('customer_message', msg);
        }
    });

    soc.on('send_message_admin_to_seller', msg => {
        const seller = findSeller(msg.receverId);
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('receved_admin_message', msg);
        }
    });

    soc.on('send_message_seller_to_admin', msg => {
        if (admin.socketId) {
            soc.to(admin.socketId).emit('receved_seller_message', msg);
        }
    });

    soc.on('disconnect', () => {
        console.log('user disconnect');
        remove(soc.id);
        removeAdmin(soc.id);
        io.emit('activeAdmin', { status: false });
        io.emit('activeSeller', allSeller);
        io.emit('activeCustomer', allCustomer);
    });
});

app.use(bodyParser.json());
app.use(cookieParser());


const verifyPaystackPayment = async (reference) => {
    try {
        const verificationResponse = await paystack.transaction.verify(reference);
        console.log('Reference passed to verify:', reference);
        if (verificationResponse.status && verificationResponse.data.status === 'success') {
            return verificationResponse.data;  // Payment is successful
        }
        console.log('Paystack Verification Response:', verificationResponse);
        return null;
    } catch (error) {
        console.log('Error verifying payment: ', error);
        return null;
    }
};


app.post('/api/v2/order/verify-payment', async (req, res) => {
    const { reference } = req.body; // Get reference from the request body
    console.log('Reference passed to verify:', reference); // Log the reference

    if (!reference) {
        return res.status(400).json({ message: 'No reference provided for payment verification' });
    }

    try {
        const verificationResult = await verifyPaystackPayment(reference);
        if (verificationResult) {
            return res.status(200).json({ message: 'Payment verified successfully', data: verificationResult });
        } else {
            return res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error in payment verification:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Other routes
app.use('/api', require('./routes/chatRoutes'));
app.use('/api', require('./routes/supplierRoutes'));
app.use('/api', require('./routes/paymentRoutes'));
app.use('/api', require('./routes/bannerRoutes'));
app.use('/api', require('./routes/dashboard/dashboardIndexRoutes'));
app.use('/api/home', require('./routes/home/homeRoutes'));
app.use('/api', require('./routes/order/orderRoutes'));
app.use('/api', require('./routes/home/cardRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/home/customerAuthRoutes'));
app.use('/api', require('./routes/dashboard/sellerRoutes'));
app.use('/api', require('./routes/dashboard/categoryRoutes'));
app.use('/api', require('./routes/dashboard/productRoutes'));

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT;
dbConnect();
server.listen(port, () => console.log(`Server is running on port ${port}!`));
