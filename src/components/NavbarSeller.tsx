"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const NavbarSeller = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sellerLinks = [
    { name: "Home", href: "/seller" },
    { name: "My Products", href: "/seller/my-products" },
    { name: "Create Listing", href: "/seller/create-listing" },
    { name: "My Auctions", href: "/seller/my-auctions" },
    { name: "Analytics", href: "/seller/analytics" },
    { name: "Profile", href: "/seller/profile" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <Image src="/Logo.png" alt="Logo" width={80} height={30} priority />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {sellerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-orange-600 font-medium transition"
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-2 shadow-sm">
          {sellerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-gray-700 font-medium hover:text-orange-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 text-white py-2 rounded-xl mt-2 hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarSeller;
