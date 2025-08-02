"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { authFetch } from "../../../../../lib/authFetch";
import { toast } from "sonner";
import { getUserFromToken } from "../../../../../utils/getUserFromToken";

interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  auction: {
    id: string;
    startTime: string;
    endTime: string;
    isClosed: boolean;
    winnerId: string;
  };
  product: {
    id: string;
    title: string;
    description: string;
    startingPrice: number;
    status: string;
    sellerId: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  };
  image: string;
}

export default function MyBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.userId) {
      setUserId(user.userId);
    }
  }, []);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await authFetch(`/bids/user`);
        if (!res.ok) throw new Error("Failed to fetch bids");
        const data: Omit<Bid, "image">[] = await res.json();

        const enriched = await Promise.all(
          data.map(async (bid) => {
            let image = "/images/default.jpg";
            try {
              const imageRes = await authFetch(
                `/product-images/${bid.product.id}`
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

            return { ...bid, image };
          })
        );

        // Sort bids by createdAt descending (most recent first)
        enriched.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setBids(enriched);
      } catch (err: any) {
        console.error(err);
        toast.error("Could not load your bids.");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const getAuctionStatus = (auction: Bid["auction"]) => {
    const now = new Date();
    const end = new Date(auction.endTime);

    if (auction.isClosed)
      return { label: "Closed", color: "bg-red-100 text-red-700" };
    if (now < end)
      return { label: "OnGoing", color: "bg-green-100 text-green-700" };
    return { label: "Ended", color: "bg-gray-100 text-gray-700" };
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">My Bids</h1>

      {loading ? (
        <div className="text-orange-600">Loading bids...</div>
      ) : bids.length === 0 ? (
        <div className="text-gray-500">You haven’t placed any bids yet.</div>
      ) : (
        <div className="grid gap-6">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center"
            >
              <div className="w-full md:w-1/3 relative">
                <Image
                  src={bid.image || "/placeholder.png"}
                  alt={bid.product.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-contain rounded-2xl bg-white"
                />

                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                      getAuctionStatus(bid.auction).color
                    }`}
                  >
                    {getAuctionStatus(bid.auction).label}
                  </span>

                  {userId && bid.auction.winnerId === userId && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 shadow-sm">
                      Winner 🏆
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h2 className="text-xl font-semibold text-orange-700">
                  {bid.product.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {bid.product.description}
                </p>

                <div className="flex flex-wrap justify-between mt-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Bid Amount:
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      ${bid.amount.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Bid Date:
                    </p>
                    <p className="text-sm text-gray-800">
                      {format(new Date(bid.createdAt), "PPP p")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Auction Ends:
                    </p>
                    <p className="text-sm text-gray-800">
                      {format(new Date(bid.auction.endTime), "PPP p")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
