"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const NavbarSeller = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sellerLinks = [
    { name: "Home", href: "/seller" },
    { name: "My Products", href: "/seller/my-products" },
    { name: "Create Listing", href: "/seller/create-listing" },
    { name: "My Auctions", href: "/seller/my-auctions" },
    { name: "Profile", href: "/seller/profile" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="bg-background shadow-md dark:shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <Image src="/Logo.png" alt="Logo" width={80} height={30} priority />
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {sellerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-orange-primary font-medium transition-colors hover:text-orange-500"
              >
                {link.name}
              </Link>
            ))}
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-card px-4 pb-4 space-y-2 shadow-sm dark:shadow-2xl">
          {sellerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-card-foreground font-medium hover:text-orange-primary transition-colors hover:text-orange-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="w-full bg-orange-500 text-white py-2 rounded-xl mt-2 hover:bg-orange-600 transition-colors shadow-2xl"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavbarSeller;
