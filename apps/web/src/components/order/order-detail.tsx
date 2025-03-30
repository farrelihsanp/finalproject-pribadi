// components/order/OrderDetail.tsx
import { useState } from 'react';

const OrderDetail = () => {
  const [order, setOrder] = useState({
    id: 1,
    date: '2023-10-01',
    status: 'Pending',
    total: 25.5,
    items: [
      { product: 'Apple', quantity: 2, price: 1.5 },
      { product: 'Banana', quantity: 3, price: 0.5 },
    ],
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Order Detail</h2>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Order Information</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-600">Order ID: {order.id}</p>
          <p className="text-gray-600">Date: {order.date}</p>
          <p className="text-gray-600">Status: {order.status}</p>
          <p className="text-gray-600">Total: ${order.total.toFixed(2)}</p>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{item.product}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
