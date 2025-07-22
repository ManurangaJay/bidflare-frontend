"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const FooterSeller = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "My Products", href: "/seller/products" },
    { name: "Create Listing", href: "/seller/create" },
    { name: "My Auctions", href: "/seller/auctions" },
    { name: "Analytics", href: "/seller/analytics" },
    { name: "Profile", href: "/seller/profile" },
    { name: "Contact Us", href: "/seller/contact" },
  ];

  return (
    <footer className="bg-gray-100 text-gray-700 py-10 mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link
            href="/"
            className="flex items-center text-xl font-bold text-blue-600 mb-2"
          >
            <span className="text-2xl text-orange-500">🔥</span>
            <span className="ml-2">BidFlare</span>
          </Link>
          <p className="text-sm mt-2 text-gray-600">
            Reach thousands of buyers and turn your passion into profit.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Seller Links</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="hover:text-blue-600 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} BidFlare. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterSeller;
