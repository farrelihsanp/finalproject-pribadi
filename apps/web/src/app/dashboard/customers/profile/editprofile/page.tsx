'use client';

import Navbar from '@/components/common/navbar';
import Image from 'next/image';
import { useState } from 'react';

export default function EditProfile() {
  const [name, setName] = useState('Farrel Ihsan P');
  const [username, setUsername] = useState('farrelihsanp');
  const [email, setEmail] = useState('farrel.prahaditya@gmail.com');
  const [password, setPassword] = useState('password123');
  const [editingField, setEditingField] = useState(null);
  const [modalValue, setModalValue] = useState('');

  const handleEditClick = (field, value) => {
    setEditingField(field);
    setModalValue(value);
  };

  const handleSaveClick = (field) => {
    switch (field) {
      case 'name':
        setName(modalValue);
        break;
      case 'username':
        setUsername(modalValue);
        break;
      case 'email':
        setEmail(modalValue);
        break;
      case 'password':
        setPassword(modalValue);
        break;
      default:
        break;
    }
    setEditingField(null);
  };

  return (
    <section>
      <Navbar />
      <div className="mx-auto w-120 max-w-4xl p-6 mt-10 bg-white rounded-xl shadow-md">
        <div id="container photo">
          <div className="flex flex-col justify-center items-center">
            <div className="relative w-60 h-60 mb-5">
              <Image
                src="https://i.pinimg.com/736x/2f/57/8d/2f578d07945132849b05fbdaf78cba38.jpg"
                alt="Profile Photo"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <button>
                <span>EDIT</span>
              </button>
            </div>
          </div>
          <div id="container profile" className="mt-10">
            <div
              id="container name"
              className="flex justify-between items-center mb-4"
            >
              <div className="flex items-center">
                <Image
                  src="/name.svg"
                  alt="Username Icon"
                  width={20}
                  height={20}
                  className="mr-5"
                />
                <span className="text-gray-600">{name}</span>
              </div>
              <div id="buttoncontainer">
                <button
                  onClick={() => handleEditClick('name', name)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                >
                  EDIT
                </button>
              </div>
            </div>
            <div
              id="container username"
              className="flex justify-between items-center mb-4"
            >
              <div className="flex items-center">
                <Image
                  src="/username.svg"
                  alt="Username Icon"
                  width={20}
                  height={20}
                  className="mr-5"
                />
                <span className="text-gray-600">{username}</span>
              </div>
              <div id="buttoncontainer">
                <button
                  onClick={() => handleEditClick('username', username)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                >
                  EDIT
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Image
                  src="/mail.svg"
                  alt="Email Icon"
                  width={20}
                  height={20}
                  className="mr-5"
                />
                <span className="text-gray-600">{email}</span>
              </div>
              <button
                onClick={() => handleEditClick('email', email)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                EDIT
              </button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Image
                  src="/password.svg"
                  alt="Password Icon"
                  width={20}
                  height={20}
                  className="mr-5"
                />
                <span className="text-gray-600">••••••••••</span>
              </div>
              <button
                onClick={() => handleEditClick('password', password)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              >
                EDIT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {editingField && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {`Edit ${editingField}`}
            </h2>
            <input
              type={editingField === 'password' ? 'password' : 'text'}
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveClick.bind(null, editingField)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Done
              </button>
              <button
                onClick={() => setEditingField(null)}
                className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
