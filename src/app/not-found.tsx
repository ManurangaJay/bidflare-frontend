// app/not-found.tsx
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Image
          src="/404-illustration.svg"
          alt="404 Not Found"
          width={500}
          height={500}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
