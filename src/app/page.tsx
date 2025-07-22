"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "../../utils/getUserFromToken";
import { authFetch } from "../../lib/authFetch";
import AuctionCard from "@/components/AuctionCard";

type Auction = {
  id: string;
  productId: string;
  startTime: string;
  endTime: string;
  isClosed: boolean;
};

type Product = {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  image?: string;
};

type AuctionWithProduct = Auction & Product;

export default function HomePage() {
  const [auctions, setAuctions] = useState<AuctionWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Get user role from token
    const user = getUserFromToken();
    if (user?.role) {
      setUserRole(user.role.toUpperCase());
    }

    // Fetch auctions and enrich with product & image
    const fetchAuctions = async () => {
      try {
        const res = await authFetch("/auctions");
        if (!res.ok) throw new Error("Failed to load auctions");
        const auctionsData: Auction[] = await res.json();

        const enriched = await Promise.all(
          auctionsData.map(async (auction) => {
            try {
              // Fetch product details
              const productRes = await authFetch(
                `/products/${auction.productId}`
              );
              if (!productRes.ok) throw new Error();
              const product: Product = await productRes.json();

              // Fetch product image
              let image = "/images/default.jpg";
              try {
                const imageRes = await authFetch(
                  `/product-images/${product.id}`
                );
                if (imageRes.ok) {
                  const imageData = await imageRes.json();
                  image = imageData[0]?.imageUrl || image;
                  if (!image.startsWith("http")) {
                    image = `http://localhost:8080${
                      image.startsWith("/") ? "" : "/"
                    }${image}`;
                  }
                }
              } catch {
                return { ...product, image: "/images/default.jpg" };
              }
              return {
                ...auction,
                ...product,
                image,
              };
            } catch {
              return null;
            }
          })
        );

        setAuctions(enriched.filter(Boolean) as AuctionWithProduct[]);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleStartBidding = () => {
    if (userRole) {
      router.push("/auctions");
    } else {
      router.push("/signin");
    }
  };

  // Render Buyer Homepage
  const BuyerHome = () => (
    <>
      <section className="text-center py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Discover Exclusive Auctions on{" "}
          <span className="text-orange-500">BidFlare</span>
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Bid smart. Win big. Explore high-demand items in real time.
        </p>
        <button
          onClick={handleStartBidding}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Start Bidding
        </button>
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          🔥 Ending Soon
        </h2>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {auctions
            .filter((a) => {
              const now = new Date();
              const start = new Date(a.startTime);
              const end = new Date(a.endTime);
              return start <= now && end > now;
            })
            .slice(0, 8)
            .map((auction) => (
              <AuctionCard
                key={auction.id}
                id={auction.id}
                title={auction.title}
                description={auction.description}
                image={auction.image || "/images/default.jpg"}
                startingPrice={auction.startingPrice}
                startTime={auction.startTime}
                endTime={auction.endTime}
                isClosed={auction.isClosed}
              />
            ))}
        </div>
      </section>
    </>
  );

  // Render Seller Homepage
  const SellerHome = () => (
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

      <div className="space-x-4">
        <button
          onClick={() => router.push("/create-listing")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          List a New Product
        </button>
      </div>
    </section>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {userRole === "SELLER" && <SellerHome />}
      {(userRole === "BUYER" || userRole === null) && <BuyerHome />}
    </div>
  );
}
