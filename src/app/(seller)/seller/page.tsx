"use client";

import { useRouter } from "next/navigation";

export default function SellerHomepage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-16 max-w-3xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Welcome back, Seller! 🚀
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          At BidFlare, we empower sellers like you to reach thousands of eager
          buyers quickly and easily. Manage your auctions, track sales, and grow
          your business all in one place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-orange-50 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Reach Thousands</h3>
            <p className="text-gray-700 text-sm">
              Get your products in front of a large audience of enthusiastic
              bidders.
            </p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Easy Auction Setup</h3>
            <p className="text-gray-700 text-sm">
              List your products with simple tools and flexible auction options.
            </p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Track & Manage</h3>
            <p className="text-gray-700 text-sm">
              Monitor bids, sales, and performance all from your dashboard.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/create-listing")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          List a New Product
        </button>
      </section>
    </div>
  );
}
