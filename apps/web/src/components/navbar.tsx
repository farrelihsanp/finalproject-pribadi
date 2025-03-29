import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <section>
      <div className=" bg-blue-600 py-3 flex items-center justify-between ">
        <div className="mx-3">
          <Link href="#">
            <Image
              src="https://res.cloudinary.com/dm1cnsldc/image/upload/v1741129248/LOGO-NEW_ylnnp9.png"
              width={200}
              height={200}
              alt="Landing Page Photo"
              className="w-20 h-auto"
            />
          </Link>
        </div>
        <div className="RightContainer mx-2">
          <Link href="/login" className="text-white mx-2">
            Login
          </Link>
          <Link href="#" className="text-white mx-2">
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}
