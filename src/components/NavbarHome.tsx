"use client";

import Link from "next/link";
import Image from "next/image";

const NavbarHome = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.png"
              alt="BidFlare Logo"
              width={80}
              height={30}
              priority
            />
          </Link>

          {/* Auth Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/register"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Register
            </Link>
            <Link
              href="/signin"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;
