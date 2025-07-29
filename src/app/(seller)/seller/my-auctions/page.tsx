"use client";

import { useEffect, useState } from "react";
import AuctionCard from "@/components/AuctionCard";
import { Loader2 } from "lucide-react";
import { authFetch } from "../../../../../lib/authFetch";
import RoleGuard from "@/components/RoleGuard";

type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  startingPrice?: number | null;
};

type Auction = {
  id: string;
  startTime: string;
  endTime: string;
  isClosed: boolean;
  productId: string;
};

type AuctionWithProduct = Auction & {
  title: string;
  description: string;
  image: string;
  startingPrice?: number | null;
};

export default function MyAuctionsPage() {
  const [auctions, setAuctions] = useState<AuctionWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyAuctions = async () => {
      try {
        const productRes = await authFetch("/products/seller");
        if (!productRes.ok) throw new Error("Failed to fetch seller products");
        const products: Product[] = await productRes.json();

        const enrichedProductData = await Promise.all(
          products.map(async (product) => {
            try {
              const imageRes = await authFetch(`/product-images/${product.id}`);
              if (!imageRes.ok) throw new Error();
              const imageData = await imageRes.json();
              const rawUrl = imageData[0]?.imageUrl;

              const imageUrl = rawUrl?.startsWith("http")
                ? rawUrl
                : `http://localhost:8080${
                    rawUrl?.startsWith("/") ? "" : "/"
                  }${rawUrl}`;

              return { ...product, image: imageUrl || "/images/default.jpg" };
            } catch {
              return { ...product, image: "/images/default.jpg" };
            }
          })
        );

        const auctionPromises = enrichedProductData.map(async (product) => {
          const auctionRes = await authFetch(`/auctions/product/${product.id}`);
          if (!auctionRes.ok) return [];

          const productAuctions: Auction[] = await auctionRes.json();
          return productAuctions.map((auction) => ({
            ...auction,
            title: product.title,
            description: product.description,
            image: product.image,
            startingPrice: product.startingPrice,
          }));
        });

        const results = await Promise.all(auctionPromises);
        const allAuctions = results.flat();
        setAuctions(allAuctions);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAuctions();
  }, []);

  if (loading) {
    return (
      <RoleGuard allowedRoles={["SELLER"]}>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
          <span className="ml-2 text-sm text-gray-500">
            Loading your auctions...
          </span>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={["SELLER"]}>
        <div className="text-center text-red-600 py-10">
          <p>⚠️ {error}</p>
        </div>{" "}
      </RoleGuard>
    );
  }

  if (auctions.length === 0) {
    return (
      <RoleGuard allowedRoles={["SELLER"]}>
        <div className="text-center text-orange-700 py-10">
          <p>You haven’t created any auctions yet.</p>
        </div>{" "}
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["SELLER"]}>
      <div className="px-4 md:px-8 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-orange-600">
          My Auctions
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              id={auction.id}
              title={auction.title}
              description={auction.description}
              image={auction.image}
              startingPrice={auction.startingPrice}
              startTime={auction.startTime}
              endTime={auction.endTime}
              isClosed={auction.isClosed}
            />
          ))}
        </div>
      </div>{" "}
    </RoleGuard>
  );
}
