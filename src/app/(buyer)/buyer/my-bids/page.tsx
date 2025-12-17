"use client";

import { useEffect, useState, useMemo } from "react";
import { authFetch } from "../../../../../lib/authFetch";
import { toast } from "sonner";
import { getUserFromToken } from "../../../../../utils/getUserFromToken";
import { Bid } from "../../../../../types";
import AllBidsTab from "../../../../components/AllBidsTab";
import WonBidsTab from "../../../../components/WonBidsTab";
import LostBidsTab from "../../../../components/LostBidsTab";

type Tab = "all" | "won" | "lost";

export default function MyBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("all");

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
                  image = `${
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
                  }${image.startsWith("/") ? "" : "/"}${image}`;
                }
              }
            } catch {}
            return { ...bid, image };
          })
        );

        enriched.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setBids(enriched);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
          toast.error(err.message);
        } else {
          console.error("An unexpected error occurred:", err);
          toast.error("Could not load your bids.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  // Filter bids based on status using useMemo for performance
  const wonBids = useMemo(
    () => bids.filter((bid) => bid.auction.winnerId === userId),
    [bids, userId]
  );

  const lostBids = useMemo(
    () =>
      bids.filter(
        (bid) => bid.auction.isClosed && bid.auction.winnerId !== userId
      ),
    [bids, userId]
  );

  const TabButton = ({
    tabName,
    label,
    count,
  }: {
    tabName: Tab;
    label: string;
    count: number;
  }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm md:text-base font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none ${
        activeTab === tabName
          ? "border-b-2 border-orange-primary text-orange-primary"
          : "text-muted-foreground hover:text-orange-primary"
      }`}
    >
      {label}{" "}
      <span className="ml-2 bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
        {count}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-primary mb-6">My Bids</h1>

        {loading ? (
          <div className="text-center py-10 text-orange-primary">
            Loading bids...
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="border-b border-border mb-6">
              <nav className="flex space-x-2" aria-label="Tabs">
                <TabButton tabName="all" label="All Bids" count={bids.length} />
                <TabButton
                  tabName="won"
                  label="Bids Won"
                  count={wonBids.length}
                />
                <TabButton
                  tabName="lost"
                  label="Lost Bids"
                  count={lostBids.length}
                />
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === "all" && (
                <AllBidsTab bids={bids} userId={userId} />
              )}
              {activeTab === "won" && (
                <WonBidsTab bids={wonBids} userId={userId} />
              )}
              {activeTab === "lost" && (
                <LostBidsTab bids={lostBids} userId={userId} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
