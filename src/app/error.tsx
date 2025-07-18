// app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Image
          src="/error-illustration.svg"
          alt="Error Illustration"
          width={300}
          height={300}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Something went wrong.
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          An unexpected error occurred. Please try again or go back to the
          homepage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
