const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const productModel = require('../../models/productModel');
const Draft = require("../../models/draftModel");
const { responseReturn } = require('../../utiles/response');

class productController {

    saveDraft = async (req, res) => {
        try {
            const { productId, category, adminId } = req.body;

            // Check if draft already exists
            const existingDraft = await Draft.findOne({ productId, adminId });
            if (existingDraft) {
                return res.status(400).json({ message: "Draft already exists" });
            }

            // Save the draft
            const draft = new Draft({ productId, category, adminId });
            await draft.save();

            res.status(201).json({ message: "Draft saved successfully", draft });
        } catch (error) {
            res.status(500).json({ message: "Error saving draft", error });
        }
    };

    // Fetch all drafts
    getDrafts = async (req, res) => {
        try {
            const drafts = await Draft.find();
            res.status(200).json(drafts);
        } catch (error) {
            res.status(500).json({ message: "Error fetching drafts", error });
        }
    };

    // Publish a draft
    publishDraft = async (req, res) => {
        try {
            const { productId, adminId } = req.body;

            // Fetch full product details from AliExpress API
            const response = await axios.get(`https://api.aliexpress.com/v1/products/${productId}`);
            const productDetails = response.data;

            // Save the product to the database
            const product = new Product({
                name: productDetails.name,
                price: productDetails.price,
                image_url: productDetails.image_url,
                category: productDetails.category,
                createdBy: adminId,
            });
            await product.save();

            // Remove the draft
            await Draft.deleteOne({ productId, adminId });

            res.status(201).json({ message: "Product published successfully", product });
        } catch (error) {
            res.status(500).json({ message: "Error publishing product", error });
        }
    };

    add_product = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });

        form.parse(req, async (err, field, files) => {
            let { name, category, description, stock, price, discount, shopName, brand, location, whatsapp } = field;
            const { images } = files;
            name = name.trim();
            const slug = name.split(' ').join('-');

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                let allImageUrl = [];

                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(images[i].filepath, { folder: 'products' });
                    allImageUrl = [...allImageUrl, result.url];
                }

                await productModel.create({
                    sellerId: id,
                    name,
                    slug,
                    shopName,
                    category: category.trim(),
                    description: description.trim(),
                    stock: parseInt(stock),
                    whatsapp: parseInt(whatsapp),
                    price: parseInt(price),
                    discount: parseInt(discount),
                    images: allImageUrl,
                    brand: brand.trim(),
                    location: location.trim()
                });

                responseReturn(res, 201, { message: "Product added successfully" });
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    };

    products_get = async (req, res) => {
        const { page, searchValue, parPage } = req.query;
        const { id } = req;

        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {
                const products = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                const totalProduct = await productModel.find({
                    $text: { $search: searchValue },
                    sellerId: id
                }).countDocuments();
                responseReturn(res, 200, { totalProduct, products });
            } else {
                const products = await productModel.find({ sellerId: id }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                const totalProduct = await productModel.find({ sellerId: id }).countDocuments();
                responseReturn(res, 200, { totalProduct, products });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    product_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product });
        } catch (error) {
            console.log(error.message);
        }
    };

    product_update = async (req, res) => {
        let { name, description, discount, price, brand, productId, stock, location, whatsapp } = req.body; // Add location here
        name = name.trim();
        const slug = name.split(' ').join('-');

        try {
            await productModel.findByIdAndUpdate(productId, {
                name,
                description,
                discount,
                price,
                brand,
                stock,
                slug,
                whatsapp,
                location: location.trim() // Update location
            });

            const product = await productModel.findById(productId);
            responseReturn(res, 200, { product, message: 'Product update successful' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    product_image_update = async (req, res) => {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, field, files) => {
            const { productId, oldImage } = field;
            const { newImage } = files;

            if (err) {
                responseReturn(res, 404, { error: err.message });
            } else {
                try {
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true
                    });
                    const result = await cloudinary.uploader.upload(newImage.filepath, { folder: 'products' });

                    if (result) {
                        let { images } = await productModel.findById(productId);
                        const index = images.findIndex(img => img === oldImage);
                        images[index] = result.url;

                        await productModel.findByIdAndUpdate(productId, {
                            images
                        });

                        const product = await productModel.findById(productId);
                        responseReturn(res, 200, { product, message: 'Product image updated successfully' });
                    } else {
                        responseReturn(res, 404, { error: 'Image upload failed' });
                    }
                } catch (error) {
                    responseReturn(res, 404, { error: error.message });
                }
            }
        });
    };
}

module.exports = new productController();
