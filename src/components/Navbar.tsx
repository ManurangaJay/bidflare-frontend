"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsSignedIn(!!token);
  }, []);

  const signedInLinks = [
    { name: "Home", href: "/" },
    { name: "Auctions", href: "/auctions" },
    { name: "My Bids", href: "/my-bids" },
    { name: "Profile", href: "/profile" },
  ];

  const signedOutLinks = [
    { name: "Register", href: "/register" },
    { name: "Sign In", href: "/signin" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsSignedIn(false);
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-xl font-bold text-blue-600"
          >
            <span className="text-2xl text-orange-500">🔥</span>
            <span className="ml-2">BidFlare</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {(isSignedIn ? signedInLinks : signedOutLinks).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                {link.name}
              </Link>
            ))}

            {isSignedIn && (
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 space-y-2 shadow-sm">
          {(isSignedIn ? signedInLinks : signedOutLinks).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-gray-700 font-medium hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {isSignedIn && (
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-2 rounded-xl mt-2 hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
