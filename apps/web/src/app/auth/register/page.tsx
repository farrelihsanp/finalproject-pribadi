'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'CUSTOMERS',
    referralCode: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formDataToSend = {
        ...formData,
        profileImage: profileImage,
      };

      const formDataToSendServer = new FormData();
      formDataToSendServer.append('name', formData.name);
      formDataToSendServer.append('username', formData.username);
      formDataToSendServer.append('email', formData.email);
      formDataToSendServer.append('role', formData.role);
      formDataToSendServer.append('referralCode', formData.referralCode);
      if (profileImage) {
        formDataToSendServer.append('profileImage', profileImage);
      }

      const response = await fetch(
        'http://localhost:8000/api/v1/auth/register',
        {
          credentials: 'include',
          method: 'POST',
          body: formDataToSendServer,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      toast.success('Registration successful! Check your email to confirm.');

      // Reset form fields
      setFormData({
        name: '',
        username: '',
        email: '',
        role: 'CUSTOMERS',
        referralCode: '',
      });
      setProfileImage(null);

      // Redirect to email confirmation page
      router.push('/email-confirmation');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="CUSTOMERS">Customer</option>
              <option value="STOREADMIN">Store Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="referralCode"
              className="block text-sm font-medium text-gray-700"
            >
              Referral Code (optional)
            </label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Image (optional)
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleFileChange}
              className="mt-1 p-2 w-full border rounded-md"
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
