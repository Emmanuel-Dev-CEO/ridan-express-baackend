// File: components/Admin/SupplierProducts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/supplier/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching supplier products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Supplier Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button>Add to Store</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierProducts;
 