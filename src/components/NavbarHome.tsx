"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const NavbarHome = () => {
  return (
    <nav className="bg-background shadow-md dark:shadow-2xl sticky top-0 z-50">
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

          {/* Auth Links and Theme Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/register"
              className="text-foreground hover:text-orange-primary font-medium transition-colors hover:text-orange-500"
            >
              Register
            </Link>
            <Link
              href="/signin"
              className="text-foreground hover:text-orange-primary font-medium transition-colors hover:text-orange-500"
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
