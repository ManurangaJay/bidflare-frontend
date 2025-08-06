"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuctionCard from "@/components/AuctionCard";
import { Spinner } from "@/components/ui/Spinner";
import { authFetch } from "../../../../../lib/authFetch";

type WishlistItem = {
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

export default function WishlistPage() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<AuctionCardProps[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlistRes = await authFetch("/wishlist");
        if (!wishlistRes.ok) throw new Error("Failed to load wishlist");
        const wishlistData: WishlistItem[] = await wishlistRes.json();

        const detailedCards = await Promise.all(
          wishlistData.map(async (item) => {
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
                    image = `http://localhost:8080${
                      image.startsWith("/") ? "" : "/"
                    }${image}`;
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
                onClick: () => router.push(`/buyer/auctions/${auction.id}`),
              } satisfies AuctionCardProps;
            } catch {
              return null;
            }
          })
        );

        setCards(detailedCards.filter(Boolean) as AuctionCardProps[]);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-orange-600 mb-6 text-center">
        My Wishlist
      </h1>
      <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
        Auctions you've saved for later. Stay competitive and don’t miss out!
      </p>

      {loading ? (
        <div className="flex justify-center mt-12">
          <Spinner />
        </div>
      ) : cards.length === 0 ? (
        <p className="text-orange-500 text-center text-2xl">
          Your wishlist is empty. Start adding some auctions!
        </p>
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
