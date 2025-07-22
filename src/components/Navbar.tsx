"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getUserFromToken } from "../../utils/getUserFromToken";
import Image from "next/image";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.role) {
      setIsSignedIn(true);
      setUserRole(user.role.toUpperCase());
    }
  }, []);

  const buyerLinks = [
    { name: "Home", href: "/" },
    { name: "Auctions", href: "/auctions" },
    { name: "My Bids", href: "/my-bids" },
    { name: "Watchlist", href: "/watchlist" },
    { name: "Profile", href: "/profile" },
  ];

  const sellerLinks = [
    { name: "Home", href: "/" },
    { name: "My Products", href: "/my-products" },
    { name: "Create Listing", href: "/create-listing" },
    { name: "My Auctions", href: "/my-auctions" },
    { name: "Analytics", href: "/analytics" },
    { name: "Profile", href: "/profile" },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Users", href: "/admin/users" },
    { name: "Reports", href: "/admin/reports" },
    { name: "Profile", href: "/profile" },
  ];

  const signedOutLinks = [
    { name: "Register", href: "/register" },
    { name: "Sign In", href: "/signin" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsSignedIn(false);
    setUserRole(null);
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  const getMenuLinks = () => {
    if (!isSignedIn) return signedOutLinks;
    if (userRole === "SELLER") return sellerLinks;
    if (userRole === "ADMIN") return adminLinks;
    return buyerLinks;
  };

  const menuLinks = getMenuLinks();

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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuLinks.map((link) => (
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
          {menuLinks.map((link) => (
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
