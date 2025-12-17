import React from "react";

const SellerAnalyticsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
      <h1 className="text-4xl font-bold text-orange-primary mb-4">
        Seller Analytics
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-md">
        This section will provide detailed analytics for your sales and
        auctions.
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
            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default SellerAnalyticsPage;
