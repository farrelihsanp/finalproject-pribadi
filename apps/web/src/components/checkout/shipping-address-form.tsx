// components/checkout/ShippingAddressForm.tsx
import { useState } from 'react';

const ShippingAddressForm = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle shipping address logic here
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="city" className="block text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="state" className="block text-gray-700 mb-2">
          State
        </label>
        <input
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="zip" className="block text-gray-700 mb-2">
          Zip Code
        </label>
        <input
          type="text"
          id="zip"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="country" className="block text-gray-700 mb-2">
          Country
        </label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-full w-full hover:bg-green-600 transition duration-300"
      >
        Save Address
      </button>
    </form>
  );
};

export default ShippingAddressForm;
