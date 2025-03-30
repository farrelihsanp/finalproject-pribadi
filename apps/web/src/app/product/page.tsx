// pages/product/list.tsx
import Head from 'next/head';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';
import ProductList from '../../components/product/product-list';

const ProductListPage = () => {
  return (
    <>
      <Head>
        <title>Product List - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <ProductList />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductListPage;
