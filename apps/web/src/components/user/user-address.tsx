import { useState } from 'react';

const UserAddress = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA',
    },
    {
      id: 2,
      address: '456 Elm St',
      city: 'Othertown',
      state: 'NY',
      zip: '67890',
      country: 'USA',
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleAddAddress = () => {
    setAddresses([...addresses, { ...newAddress, id: addresses.length + 1 }]);
    setNewAddress({ address: '', city: '', state: '', zip: '', country: '' });
  };

  const handleRemoveAddress = (id: number) => {
    // Check if the id exists in the addresses array
    const addressExists = addresses.some((address) => address.id === id);
    if (!addressExists) {
      console.error(`Address with id ${id} does not exist.`);
      return;
    }

    // Filter out the address with the specified id
    const updatedAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(updatedAddresses);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Addresses</h2>
      {addresses.map((address) => (
        <div key={address.id} className="bg-gray-100 p-4 rounded-lg mb-4">
          <p>{address.address}</p>
          <p>
            {address.city}, {address.state} {address.zip}
          </p>
          <p>{address.country}</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
            onClick={() => handleRemoveAddress(address.id)}
          >
            Remove
          </button>
        </div>
      ))}
      <h3 className="text-xl font-bold mb-4">Add New Address</h3>
      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={newAddress.address}
          onChange={(e) =>
            setNewAddress({ ...newAddress, address: e.target.value })
          }
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
          value={newAddress.city}
          onChange={(e) =>
            setNewAddress({ ...newAddress, city: e.target.value })
          }
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
          value={newAddress.state}
          onChange={(e) =>
            setNewAddress({ ...newAddress, state: e.target.value })
          }
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
          value={newAddress.zip}
          onChange={(e) =>
            setNewAddress({ ...newAddress, zip: e.target.value })
          }
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
          value={newAddress.country}
          onChange={(e) =>
            setNewAddress({ ...newAddress, country: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>
      <button
        onClick={handleAddAddress}
        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
      >
        Add Address
      </button>
    </div>
  );
};

export default UserAddress;
