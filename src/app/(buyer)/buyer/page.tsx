"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "../../../../lib/authFetch";
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

export default function BuyerHomepage() {
  const [auctions, setAuctions] = useState<AuctionWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await authFetch("/auctions");
        if (!res.ok) throw new Error("Failed to load auctions");
        const auctionsData: Auction[] = await res.json();

        const enriched = await Promise.all(
          auctionsData.map(async (auction) => {
            try {
              const productRes = await authFetch(
                `/products/${auction.productId}`
              );
              if (!productRes.ok) throw new Error();
              const product: Product = await productRes.json();

              let image = "/images/default.jpg";
              try {
                const imageRes = await authFetch(
                  `/product-images/${product.id}`
                );
                if (imageRes.ok) {
                  const imageData = await imageRes.json();
                  image = imageData[0]?.imageUrl || image;
                  if (!image.startsWith("http")) {
                    image = `${
                      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
                    }${image.startsWith("/") ? "" : "/"}${image}`;
                  }
                }
              } catch {}

              return { ...auction, ...product, image };
            } catch {
              return null;
            }
          })
        );

        setAuctions(enriched.filter(Boolean) as AuctionWithProduct[]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleStartBidding = () => {
    router.push("/buyer/auctions");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="text-center py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Discover Exclusive Auctions on{" "}
          <span className="text-orange-500">BidFlare</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Bid smart. Win big. Explore high-demand items in real time.
        </p>
        <button
          onClick={handleStartBidding}
          className="bg-orange-600 text-primary-foreground px-6 py-3 rounded-xl shadow hover:bg-orange-accent transition-colors text-white"
        >
          Start Bidding
        </button>
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          🔥 Ending Soon
        </h2>
        {loading && <p className="text-muted-foreground">Loading...</p>}
        {error && <p className="text-destructive">Error: {error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {auctions
            .filter((a) => {
              const now = new Date();
              return new Date(a.startTime) <= now && new Date(a.endTime) > now;
            })
            .slice(0, 8)
            .map((auction) => (
              <AuctionCard
                key={auction.id}
                {...auction}
                image={auction.image || "/images/default.jpg"}
                onClick={() => router.push(`/buyer/auctions/${auction.id}`)}
              />
            ))}
        </div>
      </section>
    </div>
  );
}
