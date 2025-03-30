'use client';

import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CartSummary = ({ products }: { products: Product[] }) => {
  const total = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0,
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Cart Summary</h2>
      <div className="mb-4">
        <h3 className="text-lg font-bold">Subtotal</h3>
        <p className="text-gray-600">${total.toFixed(2)}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-bold">Shipping</h3>
        <p className="text-gray-600">$5.00</p>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-bold">Total</h3>
        <p className="text-gray-600">${(total + 5).toFixed(2)}</p>
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded-full w-full hover:bg-green-600 transition duration-300">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
