'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  // Updated data for images with URLs
  const images = [
    {
      src: 'https://i.pinimg.com/736x/4e/3e/d1/4e3ed1555d1c546f923e3aba24083f3d.jpg',
      alt: 'Landing Page Photo 1',
      url: 'https://example.com/photo1',
    },
    {
      src: 'https://i.pinimg.com/474x/88/55/b9/8855b9e7fb7421068cde6b93baf57e2c.jpg',
      alt: 'Landing Page Photo 2',
      url: 'https://example.com/photo2',
    },
    {
      src: 'https://i.pinimg.com/474x/fc/6f/46/fc6f46986c71b11b9476eac82997bf97.jpg',
      alt: 'Landing Page Photo 3',
      url: 'https://example.com/photo3',
    },
    {
      src: 'https://i.pinimg.com/474x/24/31/59/24315919b96e0f033710d188feb61dfa.jpg',
      alt: 'Landing Page Photo 4',
      url: 'https://example.com/photo4',
    },
  ];

  // State to keep track of the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  return (
    <section>
      <div className=" mx-auto m-10">
        <div className="relative flex items-center justify-center">
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-3 rounded-full shadow-lg hover:bg-opacity-100 hover:scale-110 transition duration-300 ease-in-out z-10"
            onClick={prevImage}
          >
            &lt;
          </button>
          <Link href={images[currentIndex].url} passHref>
            <div className="relative w-[500px] h-64 z-0">
              <Image
                src={images[currentIndex].src}
                layout="fill"
                objectFit="cover"
                alt={images[currentIndex].alt}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </Link>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-3 rounded-full shadow-lg hover:bg-opacity-100 hover:scale-110 transition duration-300 ease-in-out z-10"
            onClick={nextImage}
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}
