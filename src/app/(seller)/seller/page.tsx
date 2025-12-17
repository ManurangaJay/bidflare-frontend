"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserFromToken } from "../../../../utils/getUserFromToken";

export default function SellerHomepage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Seller");

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-16 max-w-3xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold text-orange-primary mb-6">
          Welcome back, {userName}! 🚀
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          At BidFlare, we empower sellers like you to reach thousands of eager
          buyers quickly and easily. Manage your auctions, track sales, and grow
          your business all in one place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-orange-secondary/50 dark:bg-orange-primary/20 p-6 rounded-lg shadow border-2 border-orange-500">
            <h3 className="font-semibold text-xl text-orange-primary mb-2">
              Reach Thousands
            </h3>
            <p className="text-muted-foreground text-sm">
              Get your products in front of a large audience of enthusiastic
              bidders.
            </p>
          </div>
          <div className="bg-orange-secondary/50 dark:bg-orange-primary/20 p-6 rounded-lg shadow border-2 border-orange-500">
            <h3 className="font-semibold text-xl text-orange-primary mb-2">
              Easy Auction Setup
            </h3>
            <p className="text-muted-foreground text-sm">
              List your products with simple tools and flexible auction options.
            </p>
          </div>
          <div className="bg-orange-secondary/50 dark:bg-orange-primary/20 p-6 rounded-lg shadow border-2 border-orange-500">
            <h3 className="font-semibold text-xl text-orange-primary mb-2">
              Track & Manage
            </h3>
            <p className="text-muted-foreground text-sm">
              Monitor bids, sales, and performance all from your dashboard.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/seller/create-listing")}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-orange-700 transition-colors"
        >
          List a New Product
        </button>
      </section>
    </div>
  );
}
