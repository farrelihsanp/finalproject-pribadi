'use client';

import { useState } from 'react';

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Apple', price: 1.5, stock: 100 },
    { id: 2, name: 'Banana', price: 0.5, stock: 200 },
    { id: 3, name: 'Carrot', price: 0.8, stock: 150 },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0 && newProduct.stock >= 0) {
      setProducts([...products, { ...newProduct, id: products.length + 1 }]);
      setNewProduct({ name: '', price: 0, stock: 0 });
    }
  };

  const handleRemoveProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-bold">{product.name}</h4>
              <p className="mt-2 text-gray-600">
                Price: ${product.price.toFixed(2)}
              </p>
              <p className="mt-2 text-gray-600">Stock: {product.stock}</p>
              <button
                onClick={() => handleRemoveProduct(product.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">Add New Product</h3>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 mb-2">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: Number(e.target.value) })
          }
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="stock" className="block text-gray-700 mb-2">
          Stock
        </label>
        <input
          type="number"
          id="stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: Number(e.target.value) })
          }
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <button
        onClick={handleAddProduct}
        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
      >
        Add Product
      </button>
    </div>
  );
};

export default ProductManagement;
