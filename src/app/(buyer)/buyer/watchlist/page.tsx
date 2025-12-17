"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuctionCard from "@/components/AuctionCard";
import { Spinner } from "@/components/ui/Spinner";
import { authFetch } from "../../../../../lib/authFetch";
import Image from "next/image";

type WatchlistItem = {
  id: string;
  productId: string;
  createdAt: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
};

type Auction = {
  id: string;
  productId: string;
  startTime: string;
  endTime: string;
  isClosed: boolean;
};

type AuctionCardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  startingPrice?: number | null;
  startTime: string;
  endTime: string;
  isClosed: boolean;
  onClick?: () => void;
};

export default function WatchlistPage() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<AuctionCardProps[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const watchlistRes = await authFetch("/wishlist");
        if (!watchlistRes.ok) throw new Error("Failed to load wishlist");
        const watchlistData: WatchlistItem[] = await watchlistRes.json();

        const detailedCards = await Promise.all(
          watchlistData.map(async (item) => {
            try {
              const [productRes, auctionRes] = await Promise.all([
                authFetch(`/products/${item.productId}`),
                authFetch(`/auctions/product/${item.productId}`),
              ]);

              if (!productRes.ok || !auctionRes.ok) throw new Error();

              const product: Product = await productRes.json();
              const auctions: Auction[] = await auctionRes.json();
              const auction = auctions[0];
              if (!auction) return null;

              // Fetch image
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

              return {
                id: product.id,
                title: product.title,
                description: product.description,
                image,
                startingPrice: product.startingPrice,
                startTime: auction.startTime,
                endTime: auction.endTime,
                isClosed: auction.isClosed,
                onClick: () => router.push(`/buyer/auctions/${product.id}`),
              } satisfies AuctionCardProps;
            } catch {
              return null;
            }
          })
        );

        setCards(detailedCards.filter(Boolean) as AuctionCardProps[]);
      } catch (error) {
        console.error("Failed to load watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-orange-600 mb-6 text-center">
        My watchlist
      </h1>
      <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
        Auctions you&apos;ve saved for later. Stay competitive and don&apos;t miss out!
      </p>

      {loading ? (
        <div className="flex justify-center mt-12">
          <Spinner />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center mt-12 space-y-6">
          <Image
            src="/images/empty-watchlist.png"
            alt="Empty watchlist"
            width={160}
            height={160}
            className="mx-auto w-40 h-40 opacity-60"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />

          <h2 className="text-2xl font-semibold text-gray-700">
            Your watchlist is empty
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Looks like you haven&apos;t saved any auctions yet. Browse our listings
            and keep an eye on the items you love!
          </p>

          <button
            onClick={() => router.push("/buyer/auctions")}
            className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
          >
            Browse Auctions
          </button>

          <div className="mt-10 text-left max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
              How to add auctions to your watchlist
            </h3>
            <ul className="space-y-6 text-gray-600 text-sm sm:text-base text-center">
              <li>
                <p>Browse the auctions by clicking &quot;Browse Auctions&quot; above.</p>
                <div className="text-orange-500 mt-2 text-2xl">↓</div>
              </li>
              <li>
                <p>Find an auction you&apos;re interested in.</p>
                <div className="text-orange-500 mt-2 text-2xl">↓</div>
              </li>
              <li>
                <p>
                  Click the <span className="font-semibold">heart</span> or{" "}
                  <span className="font-semibold">&quot;watchlist&quot;</span> button on
                  the auction card.
                </p>
                <div className="text-orange-500 mt-2 text-2xl">↓</div>
              </li>
              <li>
                <p>
                  The auction is now saved to your watchlist and will appear
                  here.
                </p>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <AuctionCard key={card.id} {...card} />
          ))}
        </div>
      )}
    </div>
  );
}
