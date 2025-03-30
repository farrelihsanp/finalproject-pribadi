'use client';

import { useState } from 'react';

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([
    { id: 1, product: 'Apple', discountType: 'percentage', value: 10 },
    { id: 2, product: 'Banana', discountType: 'fixed', value: 0.5 },
    { id: 3, product: 'Carrot', discountType: 'buy-one-get-one', value: 0 },
  ]);

  const [newDiscount, setNewDiscount] = useState({
    product: '',
    discountType: 'percentage',
    value: 0,
  });

  const handleAddDiscount = () => {
    setDiscounts([...discounts, { ...newDiscount, id: discounts.length + 1 }]);
    setNewDiscount({ product: '', discountType: 'percentage', value: 0 });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Discount Management</h2>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Discounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discounts.map((discount) => (
            <div key={discount.id} className="bg-gray-100 p-4 rounded-lg">
              <h4 className="text-lg font-bold">{discount.product}</h4>
              <p className="mt-2 text-gray-600">
                {discount.discountType === 'percentage'
                  ? `${discount.value}% off`
                  : discount.discountType === 'fixed'
                    ? `$${discount.value} off`
                    : 'Buy One Get One Free'}
              </p>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">Add New Discount</h3>
      <div className="mb-4">
        <label htmlFor="product" className="block text-gray-700 mb-2">
          Product
        </label>
        <input
          type="text"
          id="product"
          value={newDiscount.product}
          onChange={(e) =>
            setNewDiscount({ ...newDiscount, product: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="discountType" className="block text-gray-700 mb-2">
          Discount Type
        </label>
        <select
          id="discountType"
          value={newDiscount.discountType}
          onChange={(e) =>
            setNewDiscount({ ...newDiscount, discountType: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
          <option value="buy-one-get-one">Buy One Get One Free</option>
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="value" className="block text-gray-700 mb-2">
          Value
        </label>
        <input
          type="number"
          id="value"
          value={newDiscount.value}
          onChange={(e) =>
            setNewDiscount({ ...newDiscount, value: Number(e.target.value) })
          }
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <button
        onClick={handleAddDiscount}
        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
      >
        Add Discount
      </button>
    </div>
  );
};

export default DiscountManagement;
