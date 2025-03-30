'use client';

import { useState } from 'react';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    { id: 1, product: 'Apple', stock: 100 },
    { id: 2, product: 'Banana', stock: 200 },
    { id: 3, product: 'Carrot', stock: 150 },
  ]);

  const [newInventory, setNewInventory] = useState({ product: '', stock: 0 });

  const handleAddInventory = () => {
    setInventory([...inventory, { ...newInventory, id: inventory.length + 1 }]);
    setNewInventory({ product: '', stock: 0 });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => (
            <div key={item.id} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-bold">{item.product}</h4>
              <p className="mt-2 text-gray-600">Stock: {item.stock}</p>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">Add New Inventory</h3>
      <div className="mb-4">
        <label htmlFor="product" className="block text-gray-700 mb-2">
          Product
        </label>
        <input
          type="text"
          id="product"
          value={newInventory.product}
          onChange={(e) =>
            setNewInventory({ ...newInventory, product: e.target.value })
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
          value={newInventory.stock}
          onChange={(e) =>
            setNewInventory({ ...newInventory, stock: Number(e.target.value) })
          }
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <button
        onClick={handleAddInventory}
        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
      >
        Add Inventory
      </button>
    </div>
  );
};

export default InventoryManagement;
