// components/dashboard/AdminDashboard.tsx
import Link from 'next/link';

const AdminDashboard = () => {
  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/dashboard/storeadmin/products"
          className="bg-white p-4 rounded-lg shadow-md text-gray-800 hover:bg-gray-200 transition duration-300 ease-in-out flex items-center justify-center w-full sm:w-auto"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2H5m0 0v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2H5"
            ></path>
          </svg>
          Manage Products
        </Link>
        <Link
          href="/dashboard/storeadmin/inventory"
          className="bg-white p-4 rounded-lg shadow-md text-gray-800 hover:bg-gray-200 transition duration-300 ease-in-out flex items-center justify-center w-full sm:w-auto"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h4a2 2 0 002-2v-8a2 2 0 00-2-2h-4a2 2 0 00-2 2v8a2 2 0 002 2zm-1 0h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2z"
            ></path>
          </svg>
          Manage Inventory
        </Link>
        <Link
          href="/dashboard/storeadmin/discounts"
          className="bg-white p-4 rounded-lg shadow-md text-gray-800 hover:bg-gray-200 transition duration-300 ease-in-out flex items-center justify-center w-full sm:w-auto"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2V11a2 2 0 00-2-2m0-4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z"
            ></path>
          </svg>
          Manage Discounts
        </Link>
        <Link
          href="/dashboard/storeadmin/reports"
          className="bg-white p-4 rounded-lg shadow-md text-gray-800 hover:bg-gray-200 transition duration-300 ease-in-out flex items-center justify-center w-full sm:w-auto"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h4a2 2 0 002-2v-8a2 2 0 00-2-2h-4a2 2 0 00-2 2v8a2 2 0 002 2zm-1 0h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2z"
            ></path>
          </svg>
          View Reports
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
