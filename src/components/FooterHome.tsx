"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const FooterHome = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "Register", href: "/register" },
    { name: "Sign In", href: "/signin" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-orange-secondary/30 dark:bg-orange-primary/10 text-foreground py-10 mt-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_25px_-5px_rgba(0,0,0,0.3),0_-4px_10px_-6px_rgba(0,0,0,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link
            href="/"
            className="flex items-center text-xl font-bold text-orange-primary mb-2"
          >
            <span className="text-2xl text-orange-primary">🔥</span>
            <span className="ml-2">BidFlare</span>
          </Link>
          <p className="text-sm mt-2 text-muted-foreground">
            Where buyers win big and sellers reach the world. Dive into auctions
            with BidFlare.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-orange-primary">
            Links
          </h4>
          <ul className="space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-foreground transition-colors hover:text-orange-500"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-orange-primary">
            Follow Us
          </h4>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <p>
            &copy; {new Date().getFullYear()} BidFlare. All rights reserved.
          </p>
          <span className="hidden sm:inline">•</span>
          <p>
            Developed by{" "}
            <a
              href="https://manuranga-jayawardhana-portfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600 transition-colors font-medium"
            >
              Manuranga Jayawardhana
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterHome;
