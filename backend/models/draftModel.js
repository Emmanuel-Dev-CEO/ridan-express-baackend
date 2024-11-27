const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    adminId: { type: String, required: true },
    published: { type: Boolean, default: false }, // Assuming there is a `published` field
}, { timestamps: true });

const Draft = mongoose.model('Draft', draftSchema);

module.exports = Draft;
