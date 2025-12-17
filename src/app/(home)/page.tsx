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
      <main className="min-h-screen flex flex-col justify-center items-center bg-orange-secondary dark:bg-orange-primary/10 text-center px-6">
        <div className="animate-pulse text-orange-primary text-3xl font-bold mb-4">
          BidFlare
        </div>
        <p className="text-muted-foreground text-lg">
          Redirecting to your homepage...
          <br />
          Hold tight while we set up your auction experience!
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-secondary/30 dark:from-orange-primary/10 to-background">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
          Welcome to{" "}
          <span className="text-orange-primary text-orange-500">BidFlare</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          The modern auction platform where rare finds meet eager bidders.
          Whether you&apos;re selling unique art or discovering hidden treasures,
          BidFlare is the marketplace for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <button className="bg-orange-600 font-semibold text-white px-6 py-3 rounded-xl shadow hover:bg-orange-700 transition-colors">
              Register
            </button>
          </Link>
          <Link href="/signin">
            <button className="bg-card border border-border font-semibold text-card-foreground px-6 py-3 rounded-xl hover:border-2 transition-colors">
              Login
            </button>
          </Link>
        </div>
      </section>

      {/* Why Sell on BidFlare */}
      <section className="bg-card py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-card-foreground mb-4">
            Sell Your Masterpieces to the World
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Whether you&apos;re an artist, collector, or entrepreneur, BidFlare gives
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
                className="bg-orange-secondary/50 dark:bg-orange-primary/20 rounded-xl p-6 text-left shadow border-2 border-orange-primary/20 border-orange-500 light:bg-orange-200"
              >
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy on BidFlare */}
      <section className="bg-orange-secondary/20 dark:bg-orange-primary/10 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Discover & Win Amazing Items
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
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
                className="bg-card rounded-xl p-6 text-left shadow-md border-2 border-orange-500"
              >
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-card-foreground mb-6">
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
                className="bg-muted border-2 border-border p-6 rounded-xl shadow-sm border-orange-500"
              >
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                  {title}
                </h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-orange-primary to-orange-accent text-primary-foreground py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Join the Auction?</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Sign up now and experience the thrill of real-time auctions. Whether
          you&apos;re a seller or buyer — BidFlare is built for you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <button className="bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-orange-secondary transition-colors">
              Get Started
            </button>
          </Link>
          <Link href="/signin">
            <button className="bg-card border border-border font-semibold text-card-foreground px-6 py-3 rounded-xl hover:border-2  transition-colors">
              Login
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
