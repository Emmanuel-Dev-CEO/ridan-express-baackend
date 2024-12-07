const axios = require('axios');

// Fetch products from supplier
const getSupplierProducts = async (req, res) => {
  try {
    const response = await axios.get('https://supplier-api.com/products', {
      headers: { Authorization: `Bearer ${process.env.SUPPLIER_API_KEY}` },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supplier products', error });
  }
};

// Create an order with the supplier
const createSupplierOrder = async (req, res) => {
  const { customerDetails, productId, quantity } = req.body;
  try {
    const response = await axios.post(
      'https://supplier-api.com/orders',
      {
        product_id: productId,
        quantity,
        customer_details: customerDetails,
      },
      {
        headers: { Authorization: `Bearer ${process.env.SUPPLIER_API_KEY}` },
      }
    );
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplier order', error });
  }
};

module.exports = {
  getSupplierProducts,
  createSupplierOrder,
};
