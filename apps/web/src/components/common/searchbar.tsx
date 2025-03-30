'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section>
      <div className="mt-5 flex items-center justify-center">
        <div>
          <input
            type="search"
            placeholder="Search product"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-96 p-2.5"
          />
        </div>
        <div className="mx-3 relative">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Help Center
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Location
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
