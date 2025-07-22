"use client";

import { useEffect, useState } from "react";
import { authFetch } from "../../../../../lib/authFetch";
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
};

type AuctionWithProduct = Auction & Product & { image: string };

const ITEMS_PER_PAGE = 8;

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<AuctionWithProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await authFetch("/auctions");
        if (!res.ok) throw new Error("Failed to load auctions");
        const auctionsData: Auction[] = await res.json();

        const now = new Date();

        const enriched = await Promise.all(
          auctionsData
            .filter((auction) => new Date(auction.endTime) > now)
            .map(async (auction) => {
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

  const totalPages = Math.ceil(auctions.length / ITEMS_PER_PAGE);
  const currentAuctions = auctions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        🔥 Live & Upcoming Auctions
      </h1>
      <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
        Browse all auctions currently open for bidding or starting soon. Don’t
        miss your chance!
      </p>

      {loading && <p className="text-gray-500 text-center">Loading...</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentAuctions.map((auction) => (
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-xl border ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
