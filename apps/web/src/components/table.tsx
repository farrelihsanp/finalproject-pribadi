// components/Table.tsx
import React from 'react';

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
}

interface TableProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (id: number) => void;
}

const Table: React.FC<TableProps> = ({ stores, onEdit, onDelete }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-200 p-2">ID</th>
          <th className="border border-gray-200 p-2">Name</th>
          <th className="border border-gray-200 p-2">Address</th>
          <th className="border border-gray-200 p-2">City</th>
          <th className="border border-gray-200 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {stores.map((store) => (
          <tr key={store.id}>
            <td className="border border-gray-200 p-2">{store.id}</td>
            <td className="border border-gray-200 p-2">{store.name}</td>
            <td className="border border-gray-200 p-2">{store.address}</td>
            <td className="border border-gray-200 p-2">{store.city}</td>
            <td className="border border-gray-200 p-2">
              <button
                onClick={() => onEdit(store)}
                className="bg-yellow-500 text-white p-1 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(store.id)}
                className="bg-red-500 text-white p-1"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
