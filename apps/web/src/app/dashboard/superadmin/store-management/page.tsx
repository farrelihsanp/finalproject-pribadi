'use client';

import React, { useState, useEffect } from 'react';
import StoreForm from '../../../../components/store-form';
// import AssignStoreAdminForm from '../../../../components/assign-store-admin';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';
import { useRouter } from 'next/navigation';

const SuperAdminPage: React.FC = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
  const [editingStoreData, setEditingStoreData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAdmins = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/admin/admins',
        );
        if (!response.ok) {
          throw new Error('Failed to fetch admins');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
    fetchAdmins();
  }, []);

  const handleAddStore = async (storeData: any) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeData),
      });
      if (!response.ok) {
        throw new Error('Failed to add store');
      }
      const newStore = await response.json();
      setStores((prevStores) => [...prevStores, newStore]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditStore = (storeId: number) => {
    const storeToEdit = stores.find((store) => store.id === storeId);
    if (storeToEdit) {
      setEditingStoreId(storeId);
      setEditingStoreData(storeToEdit);
    }
  };

  const handleUpdateStore = async (updatedStoreData: any) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/stores/${editingStoreId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedStoreData),
        },
      );
      if (!response.ok) {
        throw new Error('Failed to update store');
      }
      const updatedStore = await response.json();
      setStores((prevStores) =>
        prevStores.map((store) =>
          store.id === editingStoreId ? updatedStore : store,
        ),
      );
      setEditingStoreId(null);
      setEditingStoreData({});
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteStore = async (storeId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/stores/${storeId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to delete store');
      }
      setStores((prevStores) =>
        prevStores.filter((store) => store.id !== storeId),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDetailStore = (storeId: number) => {
    router.push(`/dashboard/superadmin/store-management/${storeId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Super Admin Dashboard
        </h1>
        <h2 className="text-xl font-semibold mb-2 text-center">
          Manage Stores
        </h2>
        {editingStoreId ? (
          <StoreForm
            onSubmit={handleUpdateStore}
            initialData={editingStoreData}
          />
        ) : (
          <StoreForm onSubmit={handleAddStore} />
        )}
        <h2 className="text-xl font-semibold mt-6 mb-2 text-center">
          Stores List
        </h2>
        <div className="flex justify-center">
          <div className="overflow-x-auto max-w-128">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Store Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Assigned Admin
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stores.map((store) => {
                  const adminId = store.storeAdminId; // Directly use storeAdminId
                  const adminName = adminId
                    ? users.find((user) => user.id === adminId)?.name
                    : 'None';
                  return (
                    <tr key={store.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {adminName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => handleEditStore(store.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 mr-2"
                          onClick={() => handleDeleteStore(store.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleDetailStore(store.id)}
                        >
                          Detail Store
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SuperAdminPage;
