// pages/product/[id].tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const product = {
    id: Number(id),
    name: 'Apple',
    price: 1.5,
    description: 'Fresh and juicy apples.',
    image: '/images/apple.jpg',
  };

  return (
    <>
      <Head>
        <title>Product Detail - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="md:w-1/2 md:pl-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-2xl font-bold text-gray-800 mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
