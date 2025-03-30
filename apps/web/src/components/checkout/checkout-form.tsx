// components/checkout/CheckoutForm.tsx
import { useState } from 'react';

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout logic here
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Payment Method</label>
        <div className="flex items-center space-x-4">
          <label>
            <input
              type="radio"
              name="payment-method"
              value="credit-card"
              checked={paymentMethod === 'credit-card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              name="payment-method"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            PayPal
          </label>
        </div>
      </div>
      {paymentMethod === 'credit-card' && (
        <div className="mb-6">
          <label htmlFor="card-number" className="block text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            id="card-number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <label
            htmlFor="expiry-date"
            className="block text-gray-700 mt-4 mb-2"
          >
            Expiry Date
          </label>
          <input
            type="text"
            id="expiry-date"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <label htmlFor="cvv" className="block text-gray-700 mt-4 mb-2">
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
      )}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-full w-full hover:bg-green-600 transition duration-300"
      >
        Place Order
      </button>
    </form>
  );
};

export default CheckoutForm;
