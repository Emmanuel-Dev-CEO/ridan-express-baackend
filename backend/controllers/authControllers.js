const adminModel = require('../models/adminModel');
const sellerModel = require('../models/sellerModel');
const sellerCustomerModel = require('../models/chat/sellerCustomerModel');
const bcrypt = require('bcrypt'); // Corrected spelling
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const { responseReturn } = require('../utiles/response'); // Corrected spelling
const { createToken } = require('../utiles/tokenCreate'); // Corrected spelling

class AuthControllers {
    admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const admin = await adminModel.findOne({ email }).select('+password');
            if (!admin) return responseReturn(res, 404, { error: "Email not found" });

            const match = await bcrypt.compare(password, admin.password);
            if (!match) return responseReturn(res, 404, { error: "Incorrect password" });

            const token = await createToken({ id: admin.id, role: admin.role });
            res.cookie('accessToken', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
            return responseReturn(res, 200, { token, message: 'Login successful' });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    seller_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const seller = await sellerModel.findOne({ email }).select('+password');
            if (!seller) return responseReturn(res, 404, { error: "Email not found" });

            const match = await bcrypt.compare(password, seller.password);
            if (!match) return responseReturn(res, 404, { error: "Incorrect password" });

            const token = await createToken({ id: seller.id, role: seller.role });
            res.cookie('accessToken', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
            return responseReturn(res, 200, { token, message: 'Login successful' });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    seller_register = async (req, res) => {
        const { email, name, password } = req.body;
        try {
            const existingUser = await sellerModel.findOne({ email });
            if (existingUser) return responseReturn(res, 404, { error: 'Email already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const seller = await sellerModel.create({ name, email, password: hashedPassword, method: 'manually', shopInfo: {} });
            await sellerCustomerModel.create({ myId: seller.id });
            
            const token = await createToken({ id: seller.id, role: seller.role });
            res.cookie('accessToken', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
            return responseReturn(res, 201, { token, message: 'Registration successful' });
        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    getUser = async (req, res) => {
        const { id, role } = req;
        try {
            const user = role === 'admin' ? await adminModel.findById(id) : await sellerModel.findById(id);
            return responseReturn(res, 200, { userInfo: user });
        } catch (error) {
            return responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    profile_image_upload = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });
        form.parse(req, async (err, _, files) => {
            if (err) return responseReturn(res, 500, { error: 'Error parsing files' });

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            const { image } = files;
            try {
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'profile' });
                if (!result) return responseReturn(res, 404, { error: 'Image upload failed' });

                await sellerModel.findByIdAndUpdate(id, { image: result.url });
                const userInfo = await sellerModel.findById(id);
                return responseReturn(res, 201, { message: 'Image upload successful', userInfo });
            } catch (error) {
                return responseReturn(res, 500, { error: error.message });
            }
        });
    }

    profile_info_add = async (req, res) => {
        const { division, district, shopName, sub_district } = req.body;
        const { id } = req;
        try {
            await sellerModel.findByIdAndUpdate(id, { shopInfo: { shopName, division, district, sub_district } });
            const userInfo = await sellerModel.findById(id);
            return responseReturn(res, 201, { message: 'Profile info added successfully', userInfo });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }

    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, { expires: new Date(Date.now()), httpOnly: true });
            return responseReturn(res, 200, { message: 'Logout successful' });
        } catch (error) {
            return responseReturn(res, 500, { error: error.message });
        }
    }
}

module.exports = new AuthControllers();
