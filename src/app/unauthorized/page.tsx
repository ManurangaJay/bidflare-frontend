"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/signin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <Image
            src="/401 Error Unauthorized-pana.svg"
            alt="Unauthorized Access"
            width={400}
            height={300}
            className="mx-auto"
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-orange-600 mb-2">
          Unauthorized!
        </h1>
        <p className="text-orange-600 mb-6">
          You don’t have permission to view this page. Please sign in with the
          appropriate account.
        </p>
        <button
          onClick={handleSignIn}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
