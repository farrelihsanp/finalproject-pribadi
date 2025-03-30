// components/product/ProductCard.tsx
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
        <p className="mt-2 text-gray-600">${product.price.toFixed(2)}</p>
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
