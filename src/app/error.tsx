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
    <div className="min-h-screen flex items-center justify-center bg-orange-secondary/30 dark:bg-orange-primary/10 px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Image
          src="/Computer troubleshooting-pana.svg"
          alt="Error Illustration"
          width={300}
          height={300}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-orange-primary mb-2">
          Something went wrong.
        </h1>
        <p className="text-muted-foreground text-lg mb-6">
          An unexpected error occurred. Please try again or go back to the
          homepage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 text-primary-foreground bg-orange-primary hover:bg-orange-accent rounded-lg transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 text-orange-primary border border-orange-primary hover:bg-orange-secondary/50 rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
