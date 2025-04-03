'use client';

import React, { useState, useEffect } from 'react';

type Store = {
  id: number;
  name: string;
};

const CreateAdminForm: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
    storeId: '',
  });

  const [error, setError] = useState<string | null>(null);

  // Fetch stores from backend when the page is loaded
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/stores');
        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }
        const data = await response.json();
        setStores(data);
      } catch (err) {
        console.error('Error fetching stores:', err);
      }
    };

    fetchStores();
  }, []);

  // Handle input field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form to create a new admin
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.username ||
      !formData.storeId
    ) {
      setError('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/admins/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include',
        },
      );
      if (response.ok) {
        alert('Admin created successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          username: '',
          storeId: '',
        });
        setError(null);
      } else {
        throw new Error('Failed to create admin');
      }
    } catch (err) {
      setError('Failed to create admin');
      console.error('Error creating admin:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Admin
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Store:</label>
            <select
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-indigo-500 text-white font-semibold rounded-md shadow-md hover:bg-indigo-600"
          >
            Create Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminForm;
