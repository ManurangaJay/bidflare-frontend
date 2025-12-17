"use client";

import { format } from "date-fns";
import { Bid } from "../../types";

interface BidCardProps {
  bid: Bid;
  userId: string | null;
}

// Helper function to determine auction status
const getAuctionStatus = (auction: Bid["auction"]) => {
  const now = new Date();
  const end = new Date(auction.endTime);

  if (auction.isClosed)
    return {
      label: "Closed",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    };
  if (now < end)
    return {
      label: "OnGoing",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    };
  return { label: "Ended", color: "bg-muted text-muted-foreground" };
};

export default function BidCard({ bid, userId }: BidCardProps) {
  const isWinner = userId && bid.auction.winnerId === userId;
  const status = getAuctionStatus(bid.auction);

  return (
    <div
      style={{ transition: "all 0.3s ease-in-out" }}
      className="bg-card rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center transition-transform duration-500 hover:scale-[1.02] "
    >
      <div className="w-full md:w-1/3 relative">
        <img
          src={bid.image || "/placeholder.png"}
          alt={bid.product.title}
          width={300}
          height={200}
          className="w-full h-48 object-contain rounded-2xl bg-card"
        />
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${status.color}`}
          >
            {status.label}
          </span>
          {isWinner && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 shadow-sm">
              Winner 🏆
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-3">
        <h2 className="text-xl font-semibold text-orange-primary">
          {bid.product.title}
        </h2>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {bid.product.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-border">
          <div>
            <p className="text-sm font-medium text-foreground">Your Bid</p>
            <p className="text-lg font-bold text-orange-primary">
              ${bid.amount.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Bid Date</p>
            <p className="text-sm text-card-foreground">
              {format(new Date(bid.createdAt), "PPP")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Auction Ends</p>
            <p className="text-sm text-card-foreground">
              {format(new Date(bid.auction.endTime), "PPP")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
