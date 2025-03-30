'use client';

import React, { useState } from 'react';

interface AssignStoreAdminFormProps {
  onAssign: (adminData: { storeId: number; adminId: number }) => void;
  users: { id: number; name: string }[];
  stores: { id: number; name: string }[];
}

const AssignStoreAdminForm: React.FC<AssignStoreAdminFormProps> = ({
  onAssign,
  users,
  stores,
}) => {
  const [storeId, setStoreId] = useState<number | ''>('');
  const [adminId, setAdminId] = useState<number | ''>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate that storeId and adminId are numbers
    if (typeof storeId !== 'number' || typeof adminId !== 'number') {
      setError('Store ID and Admin ID must be numbers.');
      return;
    }

    // Validate that storeId and adminId are not empty
    if (!storeId || !adminId) {
      setError('Store ID and Admin ID are required.');
      return;
    }

    // Call the onAssign function with validated data
    onAssign({ storeId, adminId });
    setStoreId('');
    setAdminId('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
    >
      <div>
        <label
          htmlFor="storeId"
          className="block text-sm font-medium text-gray-700"
        >
          Store
        </label>
        <select
          id="storeId"
          value={storeId}
          onChange={(e) => setStoreId(Number(e.target.value))}
          className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="adminId"
          className="block text-sm font-medium text-gray-700"
        >
          Admin
        </label>
        <select
          id="adminId"
          value={adminId}
          onChange={(e) => setAdminId(Number(e.target.value))}
          className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select an admin</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300"
        >
          Assign Admin
        </button>
      </div>
    </form>
  );
};

export default AssignStoreAdminForm;
