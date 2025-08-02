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
      <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-500">No bids yet.</p>
      </div>
    );
  }

  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const maxAmount = sortedBids[0].amount;

  return (
    <div className="mt-8 p-4 border border-orange-200 rounded-lg bg-gray-50 shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Bid History</h2>
      <ul className="space-y-3">
        {sortedBids.map((bid) => {
          const widthPercent = (bid.amount / maxAmount) * 100;
          const isUserBid = bid.bidderId === currentUserId;

          return (
            <li
              key={bid.id}
              className={`rounded-lg shadow-sm p-3 border text-sm ${
                isUserBid
                  ? "bg-blue-50 border-blue-400"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex justify-between mb-1">
                <span
                  className={`font-medium ${
                    isUserBid ? "text-blue-700" : "text-gray-800"
                  }`}
                >
                  ${bid.amount.toFixed(2)}{" "}
                  {isUserBid && <span className="text-xs">(You)</span>}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(bid.createdAt), "PPpp")}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
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
