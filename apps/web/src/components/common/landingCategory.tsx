import Link from 'next/link';
import Image from 'next/image'; // Pastikan untuk mengimpor komponen Image

export default function LandingCategory() {
  // Dummy data for categories
  const categories = [
    {
      id: 1,
      image:
        'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
      title: 'Sayuran',
    },
    {
      id: 2,
      image:
        'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
      title: 'Buah',
    },
    {
      id: 3,
      image:
        'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
      title: 'Daging',
    },
    {
      id: 4,
      image:
        'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
      title: 'Ikan',
    },
    {
      id: 5,
      image:
        'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
      title: 'Bumbu',
    },
    {
      id: 6,
      image:
        'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
      title: 'Minuman',
    },
    {
      id: 7,
      image:
        'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
      title: 'Suplemen',
    },
    {
      id: 8,
      image:
        'https://i.pinimg.com/736x/51/60/a2/5160a26f9980f169b612b868880c4e6c.jpg',
      title: 'Vitamin',
    },
  ];

  return (
    <section>
      <div className=" mt-5 mx-auto px-5">
        <div>
          <h1 className="text-2xl font-bold">Category:</h1>
        </div>
        <div className=" flex flex-wrap justify-center items-center mx-auto mt-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className=" m-5 flex flex-col items-center justify-center"
            >
              <Link href="#">
                <div className="relative h-16 w-16">
                  <Image
                    src={category.image}
                    alt={category.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              </Link>
              <div>
                <p className="text-bold text-center mt-2">{category.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
