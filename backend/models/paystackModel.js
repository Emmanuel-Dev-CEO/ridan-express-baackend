const { Schema, model } = require('mongoose');

const paystackSchema = new Schema({
    sellerId: {
        type: Schema.ObjectId,  // Ensure this references a valid ObjectId (e.g., from a `Seller` model)
        required: true,
        ref: 'Seller'  // If you have a Seller model, use this to reference it
    },
    transactionId: {
        type: String,  // Store your uuidv4 generated transaction ID here
        required: true,
    },
    reference: {
        type: String,  // Paystack's generated reference number
        required: true,
        unique: true  // It should be unique for each transaction
    },
    amount: {
        type: Number,  // Store the transaction amount in NGN (or kobo, depending on your usage)
        required: true,
    },
    status: {
        type: String,  // Optionally track the status of the payment (e.g., 'pending', 'success', 'failed')
        default: 'pending',
    }
}, { timestamps: true });

module.exports = model('Paystack', paystackSchema);

