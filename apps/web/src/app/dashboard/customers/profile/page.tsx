'use client';

import Navbar from '../../../../components/common/navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Profile() {
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    profileImage: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/me', {
          method: 'GET',
          credentials: 'include', // Include credentials for authentication
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUser({
          name: data.name,
          username: data.username,
          email: data.email,
          profileImage: data.profileImage,
          location: data.location || '', // Assuming location might not be present
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLocationChange = (event) => {
    setUser((prevUser) => ({
      ...prevUser,
      location: event.target.value,
    }));
  };

  return (
    <section>
      <Navbar />
      <div
        id="container"
        className="mx-auto w-120 mt-10 p-6 bg-white rounded-xl shadow-md px-10 max-w-3xl"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-60 h-60 mb-5">
            <Image
              src={
                user.profileImage ||
                'https://i.pinimg.com/736x/2f/57/8d/2f578d07945132849b05fbdaf78cba38.jpg'
              }
              alt="Profile Photo"
              fill
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
          <div className="flex items-center mb-5">
            <Image
              src="/location.svg"
              alt="Location Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            <select
              value={user.location}
              onChange={handleLocationChange}
              className="text-gray-600 text-center"
            >
              <option value="Jatipadang">Jatipadang</option>
              <option value="Menteng">Menteng</option>
              <option value="Tanah Abang">Tanah Abang</option>
            </select>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-5">
          <div className="flex items-center mb-4">
            <Image
              src="/username.svg"
              alt="Username Icon"
              width={20}
              height={20}
              className="mr-5"
            />
            <div className="flex flex-col">
              <span className="text-gray-600">{user.username}</span>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <Image
              src="/mail.svg"
              alt="Email Icon"
              width={20}
              height={20}
              className="mr-5"
            />
            <div className="flex flex-col">
              <span className="text-gray-600">{user.email}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Image
              src="/date.svg"
              alt="Date Icon"
              width={20}
              height={20}
              className="mr-5"
            />
            <div className="flex flex-col">
              <span className="text-gray-600">1 Januari 2025</span>{' '}
              {/* This should be dynamic */}
            </div>
          </div>
        </div>
      </div>
      <div id="container-2" className="mt-10 flex justify-center space-x-4">
        <Link href="/profile/editprofile">Edit Profile</Link>
        <Link
          href="/api/v1/auth/logout"
          onClick={async (e) => {
            e.preventDefault();
            try {
              const response = await fetch(
                'http://localhost:8000/api/v1/auth/logout',
                {
                  method: 'POST',
                  credentials: 'include',
                },
              );
              if (response.ok) {
                window.location.href = '/'; // Redirect to home page after logout
              } else {
                throw new Error('Logout failed');
              }
            } catch (err) {
              setError(err.message);
            }
          }}
        >
          Logout
        </Link>
      </div>
    </section>
  );
}
