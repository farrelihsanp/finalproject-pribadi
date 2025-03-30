import Footer from '@/components/common/footer';
import Navbar from '@/components/common/navbar';
import Link from 'next/link';

export default function SuperAdminPage() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
        <div className="mb-4">
          <Link
            href="/dashboard/superadmin/create-store"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Create Store
          </Link>
        </div>
        <div>
          <Link
            href="/dashboard/superadmin/store-management"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-green-700 transition duration-200"
          >
            Store Management
          </Link>
        </div>
        <div>
          <Link
            href="#"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-green-700 transition duration-200 mt-5"
          >
            Create Store Admin
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
