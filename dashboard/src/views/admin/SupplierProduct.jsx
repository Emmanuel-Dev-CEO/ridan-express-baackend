import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('electronics'); // Default category
  const [exchangeRate, setExchangeRate] = useState(null); // To store current exchange rate for USD to NGN
  const [loadingExchangeRate, setLoadingExchangeRate] = useState(false); // To track exchange rate fetching

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://ecommerce-api3.p.rapidapi.com/malefootwear', // Update the endpoint as required
          {
            headers: {
              'X-RapidAPI-Key': '71725b545fmsh5eea17576dcb9b7p10ef2cjsnada00c5ca0da',
              'X-RapidAPI-Host': 'ecommerce-api3.p.rapidapi.com',
            },
          }
        );

        // Handle the response data
        const fetchedProducts = Array.isArray(response.data)
          ? response.data
          : [response.data]; // Wrap a single product in an array if needed
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Run only on component mount

  // Fetch exchange rate from USD to NGN
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoadingExchangeRate(true);
      try {
        const response = await axios.get('https://v6.exchangerate-api.com/v6/1def85ab3dbac4566c41fc5f/latest/USD');
        setExchangeRate(response.data.conversion_rates.NGN); // Store Naira exchange rate
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      } finally {
        setLoadingExchangeRate(false);
      }
    };

    fetchExchangeRate();
  }, []); // Run only once to fetch exchange rate

  // Handle adding a product to the store
  const handleAddToStore = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/store/products', { productId });
      if (response.status === 200) {
        alert('Product added to the store successfully!');
      }
    } catch (error) {
      console.error('Error adding product to the store:', error);
      alert('Failed to add product to the store.');
    } finally {
      setLoading(false);
    }
  };

  // Convert price to Naira
  const convertToNaira = (priceInUSD) => {
    if (!exchangeRate) return 'N/A'; // If exchange rate is not yet fetched
    return (priceInUSD * exchangeRate).toFixed(2); // Convert USD to NGN
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Supplier Products</h2>

        {/* Category Selector */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-gray-700 font-medium">
            Select Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 block w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          >
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home</option>
            <option value="beauty">Beauty</option>
            <option value="toys">Toys</option>
          </select>
        </div>

        {/* Convert Button */}
        <div className="mb-6">
          <button
            onClick={() => setCategory(category)} // Trigger category change to update prices
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={loadingExchangeRate || loading}
          >
            {loadingExchangeRate ? 'Loading exchange rate...' : 'Convert Prices to Naira'}
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Brand</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Description</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Price (USD)</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Price (NGN)</th>
                <th className="px-4 py-2 text-center text-gray-600 font-semibold">Image</th>
                <th className="px-4 py-2 text-center text-gray-600 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-gray-100">
                    <td className="px-4 py-3 text-gray-800">{product.Brand || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-800">{product.Description || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-800">{product.Price || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {product.Price ? convertToNaira(product.Price) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <img
                        src={product.Image}
                        alt={product.Description}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleAddToStore(product.Id || index)}
                        className={`px-4 py-2 text-white font-semibold rounded ${
                          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                        }`}
                        disabled={loading}
                      >
                        {loading ? 'Adding...' : 'Add to Store'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierProducts;
