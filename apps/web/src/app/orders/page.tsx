'use client';

import Head from 'next/head';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import { useState } from 'react';
import Link from 'next/link'; // Import Link component

const OrderList = () => {
  const [orders, setOrders] = useState([
    { id: 1, date: '2023-10-01', status: 'Pending' },
    { id: 2, date: '2023-10-02', status: 'Shipped' },
    { id: 3, date: '2023-10-03', status: 'Delivered' },
  ]);

  // Function to add a new order
  const addNewOrder = () => {
    const newOrder = {
      id: orders.length + 1,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setOrders([...orders, newOrder]);
  };

  return (
    <>
      <Head>
        <title>Order List - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Order List</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
            onClick={addNewOrder}
          >
            Add New Order
          </button>
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold">Order #{order.id}</h3>
                <p className="mt-2 text-gray-600">Date: {order.date}</p>
                <p className="mt-2 text-gray-600">Status: {order.status}</p>
                {/* Add Link to navigate to Order Detail page */}
                <Link
                  href={`/orders/${order.id}`}
                  className="bg-red-900 text-white px-4 py-2 rounded hover:bg-black transition-colors duration-300"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderList;
