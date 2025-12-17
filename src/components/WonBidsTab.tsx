import { Bid } from "../../types";
import BidCard from "./BidCard";

interface TabProps {
  bids: Bid[];
  userId: string | null;
}

export default function WonBidsTab({ bids, userId }: TabProps) {
  if (bids.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        You haven&apos;t won any auctions yet. Keep bidding! 🎉
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {bids.map((bid) => (
        <BidCard key={bid.id} bid={bid} userId={userId} />
      ))}
    </div>
  );
}
