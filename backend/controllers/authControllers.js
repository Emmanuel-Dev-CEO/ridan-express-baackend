const adminModel = require('../models/adminModel');
const sellerModel = require('../models/sellerModel');
const sellerCustomerModel = require('../models/chat/sellerCustomerModel');
const bcrypt = require('bcrypt');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const { responseReturn } = require('../utiles/response');
const { createToken } = require('../utiles/tokenCreate');
const { auth, provider } = require('../../client/src/firebaseConfig'); // Firebase config file
const User = require('../models/customerModel'); // Mongoose user model

class AuthControllers {
    // Admin login
    admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const admin = await adminModel.findOne({ email }).select('+password');
            if (admin) {
                const match = await bcrypt.compare(password, admin.password);
                if (match) {
                    const token = await createToken({ id: admin.id, role: admin.role });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    });
                    responseReturn(res, 200, { token, message: 'Login success' });
                } else {
                    responseReturn(res, 404, { error: 'Password wrong' });
                }
            } else {
                responseReturn(res, 404, { error: 'Email not found' });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Seller login
    seller_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const seller = await sellerModel.findOne({ email }).select('+password');
            if (seller) {
                const match = await bcrypt.compare(password, seller.password);
                if (match) {
                    const token = await createToken({ id: seller.id, role: seller.role });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    });
                    responseReturn(res, 200, { token, message: 'Login success' });
                } else {
                    responseReturn(res, 404, { error: 'Password wrong' });
                }
            } else {
                responseReturn(res, 404, { error: 'Email not found' });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Seller registration
    seller_register = async (req, res) => {
        const { email, name, password } = req.body;
        try {
            const getUser = await sellerModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: 'Email already exists' });
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: 'manual',
                    shopInfo: {},
                });
                await sellerCustomerModel.create({ myId: seller.id });
                const token = await createToken({ id: seller.id, role: seller.role });
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                });
                responseReturn(res, 201, { token, message: 'Register success' });
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };

    // Google Sign-In
    googleSignIn = async (req, res) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const existingUser = await User.findOne({ uid: user.uid });

            if (!existingUser) {
                const newUser = new User({
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                });
                await newUser.save();
            }

            const token = await createToken({
                id: user.uid,
                role: 'seller',
            });

            res.cookie('accessToken', token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            responseReturn(res, 200, { token, message: 'Login with Google successful' });
        } catch (error) {
            console.error('Error signing in with Google:', error);
            responseReturn(res, 500, { error: 'Google Sign-In failed' });
        }
    };

    // Get User by Role
    getUser = async (req, res) => {
        const { id, role } = req;
        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id);
                responseReturn(res, 200, { userInfo: user });
            } else {
                const seller = await sellerModel.findById(id);
                responseReturn(res, 200, { userInfo: seller });
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };

    // Profile Image Upload
    profile_image_upload = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });

        form.parse(req, async (err, _, files) => {
            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET,
                secure: true,
            });

            const { image } = files;

            try {
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'profile' });
                if (result) {
                    await sellerModel.findByIdAndUpdate(id, { image: result.url });
                    const userInfo = await sellerModel.findById(id);
                    responseReturn(res, 201, { message: 'Image upload success', userInfo });
                } else {
                    responseReturn(res, 404, { error: 'Image upload failed' });
                }
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    };

    // Add Profile Info
    profile_info_add = async (req, res) => {
        const { division, district, shopName, sub_district } = req.body;
        const { id } = req;

        try {
            await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    shopName,
                    division,
                    district,
                    sub_district,
                },
            });
            const userInfo = await sellerModel.findById(id);
            responseReturn(res, 201, { message: 'Profile info added successfully', userInfo });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Logout
    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });
            responseReturn(res, 200, { message: 'Logout success' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new AuthControllers();
