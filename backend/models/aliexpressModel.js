const mongoose = require('mongoose');

const AliexpressSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  Brand: { type: String, required: true },
  Description: { type: Number, required: true },
  Image: { type: String },
  Price: { type: String , require: true},
  Tag: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', AliexpressSchema);

module.exports = Product;
