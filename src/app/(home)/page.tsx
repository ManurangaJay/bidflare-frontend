"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserFromToken } from "../../../utils/getUserFromToken";

export default function HomePage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const redirectUser = async () => {
      const user = getUserFromToken();
      if (user?.role === "SELLER") {
        router.replace("/seller");
      } else if (user?.role === "BUYER") {
        router.replace("/buyer");
      } else {
        setIsRedirecting(false);
      }
    };

    // Simulate a slight delay for smoother UX
    setTimeout(() => {
      redirectUser();
    }, 1000); // 1 second delay
  }, [router]);

  if (isRedirecting) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-orange-50 text-center px-6">
        <div className="animate-pulse text-orange-500 text-3xl font-bold mb-4">
          BidFlare
        </div>
        <p className="text-gray-600 text-lg">
          Redirecting to your homepage...
          <br />
          Hold tight while we set up your auction experience!
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-orange-500">BidFlare</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          The modern auction platform where rare finds meet eager bidders.
          Whether you're selling unique art or discovering hidden treasures,
          BidFlare is the marketplace for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow hover:bg-orange-600 transition">
              Register
            </button>
          </Link>
          <Link href="/signin">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 transition">
              Login
            </button>
          </Link>
        </div>
      </section>

      {/* Why Sell on BidFlare */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Sell Your Masterpieces to the World
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Whether you're an artist, collector, or entrepreneur, BidFlare gives
            you the tools to sell one-of-a-kind items — from paintings,
            sculptures, and handcrafted jewelry to vintage collectibles and rare
            artifacts.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              ["🎨 Original Artwork", "Reach global art enthusiasts"],
              ["🗿 Sculptures & Statues", "Sell intricate handcrafted pieces"],
              ["💎 Rare Collectibles", "Auction rare and vintage items"],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="bg-orange-100 rounded-xl p-6 text-left shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-700 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy on BidFlare */}
      <section className="bg-orange-50 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Discover & Win Amazing Items
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            BidFlare lets buyers discover unique pieces not found in stores.
            Browse live auctions, place smart bids, and win the items you love —
            from timeless antiques to modern treasures.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              ["🔍 Curated Auctions", "Find high-quality items easily"],
              ["⏰ Real-Time Bidding", "Compete live, win fast"],
              ["💰 Great Deals", "Bid within your budget"],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 text-left shadow border"
              >
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-700 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            How BidFlare Works
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm text-left">
            {[
              ["📝 Create Account", "Sign up as a buyer or seller."],
              ["📸 List Your Product", "Add images, set starting price."],
              ["🏁 Start Auction", "Auctions go live on schedule."],
              ["⚡ Win or Sell", "Buyers win. Sellers get paid."],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-orange-400 to-orange-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Join the Auction?</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Sign up now and experience the thrill of real-time auctions. Whether
          you're a seller or buyer — BidFlare is built for you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-orange-100 transition">
              Get Started
            </button>
          </Link>
          <Link href="/signin">
            <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-orange-100 transition">
              Login
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
