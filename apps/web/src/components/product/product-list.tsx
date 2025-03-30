// components/product/ProductList.tsx
import ProductCard from './product-card';

const ProductList = () => {
  const products = [
    { id: 1, name: 'Apple', price: 1.5, image: '/images/apple.jpg' },
    { id: 2, name: 'Banana', price: 0.5, image: '/images/banana.jpg' },
    { id: 3, name: 'Carrot', price: 0.8, image: '/images/carrot.jpg' },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
