"use client";
import { format } from "date-fns";

type BidDto = {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  createdAt: string;
};

export default function BidsList({
  bids,
  currentUserId,
}: {
  bids: BidDto[];
  currentUserId: string;
}) {
  if (!bids || bids.length === 0) {
    return (
      <div className="mt-8 p-4 border border-border rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">No bids yet.</p>
      </div>
    );
  }

  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const maxAmount = sortedBids[0].amount;

  return (
    <div className="mt-8 p-4 border border-orange-primary/20 rounded-lg bg-muted shadow-md">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Bid History
      </h2>
      <ul className="space-y-3">
        {sortedBids.map((bid) => {
          const widthPercent = (bid.amount / maxAmount) * 100;
          const isUserBid = bid.bidderId === currentUserId;

          return (
            <li
              key={bid.id}
              className={`rounded-lg shadow-sm p-3 border text-sm ${
                isUserBid
                  ? "bg-blue-50 border-blue-400 dark:bg-blue-900/30 dark:border-blue-600"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex justify-between mb-1">
                <span
                  className={`font-semibold ${
                    isUserBid
                      ? "text-blue-100 dark:text-blue-500"
                      : "text-card-foreground"
                  }`}
                >
                  ${bid.amount.toFixed(2)}{" "}
                  {isUserBid && <span className="text-xs">(You)</span>}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(bid.createdAt), "PPpp")}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isUserBid ? "bg-blue-500" : "bg-orange-500"
                  }`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
