import React from "react";

const SellerContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
      <h1 className="text-4xl font-bold text-orange-primary mb-4">
        Contact Support
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-md">
        This page will provide ways to contact our support team.
        <br />
        <span className="font-semibold text-orange-accent">Coming soon!</span>
      </p>
      <div className="mt-8">
        {/* You can add a placeholder image or animation here */}
        <svg
          className="w-24 h-24 text-orange-primary animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default SellerContactPage;
