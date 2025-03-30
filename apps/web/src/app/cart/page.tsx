// Cart.tsx
'use client';

import { useState } from 'react';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import Head from 'next/head';
import CartItem from '../../components/cart/cart-item';
import CartSummary from '../../components/cart/cart-summary';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<Product[]>([
    { id: 1, name: 'Apple', price: 1.5, quantity: 2 },
    { id: 2, name: 'Banana', price: 0.5, quantity: 3 },
    { id: 3, name: 'Carrot', price: 0.8, quantity: 1 },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <Head>
        <title>Shopping Cart - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Shopping Cart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  product={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}
            </div>
            <div>
              <CartSummary products={cartItems} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
