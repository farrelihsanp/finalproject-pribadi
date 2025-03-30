'use client';

import { useState } from 'react';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending a reset email
    console.log(`Reset password request sent to: ${email}`);
    // In a real application, you would send an API request here
    // For example: fetch('/api/reset-password', { method: 'POST', body: JSON.stringify({ email }) });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-full w-full hover:bg-green-600 transition duration-300"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
