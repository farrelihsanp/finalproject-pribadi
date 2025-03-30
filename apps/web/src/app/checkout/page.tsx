'use client';

import Head from 'next/head';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import ShippingAddressForm from '../../components/checkout/shipping-address-form';
import CheckoutForm from '../../components/checkout/checkout-form';

const Checkout = () => {
  return (
    <>
      <Head>
        <title>Checkout - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ShippingAddressForm />
            </div>
            <div>
              <CheckoutForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
