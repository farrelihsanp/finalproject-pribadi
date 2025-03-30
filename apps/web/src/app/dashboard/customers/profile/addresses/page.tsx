'use client';

import Head from 'next/head';
import Navbar from '../../../../../components/common/navbar';
import Footer from '../../../../../components/common/footer';
import UserAddress from '../../../../../components/user/user-address';

const UserAddressPage = () => {
  return (
    <>
      <Head>
        <title>User Address - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <UserAddress />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UserAddressPage;
