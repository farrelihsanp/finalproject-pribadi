// CartItem.tsx
'use client';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartItemProps {
  product: Product;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
}

const CartItem = ({ product, updateQuantity, removeItem }: CartItemProps) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    updateQuantity(product.id, newQuantity);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
        <p className="mt-2 text-gray-600">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          value={product.quantity}
          onChange={handleQuantityChange}
          className="w-16 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          min="1"
        />
        <button
          className="ml-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
          onClick={() => removeItem(product.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
