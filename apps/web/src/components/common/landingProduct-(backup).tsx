// import Image from 'next/image';
// import Link from 'next/link';

// // New component for individual product display
// const ProductItem = ({ name, imageUrl, price, sold }) => {
//   return (
//     <div className="border border-gray-300 shadow-2xl rounded-lg max-w-56 h-56">
//       <Link href="#">
//         <div className="relative h-32">
//           <Image
//             src={imageUrl}
//             alt={name}
//             objectFit="cover"
//             layout="fill"
//             className="rounded-t-lg"
//           />
//         </div>
//         <div className="p-2">
//           <h2>{name}</h2>
//           <p className="font-semibold">Rp. {price.toLocaleString()}</p>
//           <p className="text-gray-500 mt-2">Terjual {sold}</p>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default function LandingProduct() {
//   const products = [
//     {
//       name: 'Buah Tomat',
//       imageUrl:
//         'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
//       price: 100000,
//       sold: 105,
//     },
//     {
//       name: 'Buah Jeruk',
//       imageUrl:
//         'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
//       price: 80000,
//       sold: 100,
//     },
//     {
//       name: 'Buah Apel',
//       imageUrl:
//         'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
//       price: 120000,
//       sold: 90,
//     },
//     {
//       name: 'Buah Mangga',
//       imageUrl:
//         'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
//       price: 150000,
//       sold: 80,
//     },
//     {
//       name: 'Buah Pisang',
//       imageUrl:
//         'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
//       price: 70000,
//       sold: 70,
//     },
//     {
//       name: 'Buah Alpukat',
//       imageUrl:
//         'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
//       price: 110000,
//       sold: 60,
//     },
//   ];

//   return (
//     <section>
//       <div className=" mx-auto px-5 mt-10 min-h-screen">
//         <h1 className="text-2xl font-bold mb-10">Product Highlight</h1>
//         <div className="grid grid-cols-3 lg:grid-cols-6 gap-8">
//           {products.map((product, index) => (
//             <ProductItem
//               key={index}
//               name={product.name}
//               imageUrl={product.imageUrl}
//               price={product.price}
//               sold={product.sold}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
