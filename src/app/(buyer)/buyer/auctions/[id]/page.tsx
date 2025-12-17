"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ClockIcon, TagIcon } from "lucide-react";
import { authFetch } from "../../../../../../lib/authFetch";
import BidsList from "@/components/BidsList";
import PlaceBidModal from "@/components/PlaceBidModal";
import { getUserFromToken } from "../../../../../../utils/getUserFromToken";
import { toast } from "sonner";

type AuctionResponseDto = {
  id: string;
  productId: string;
  startTime: string;
  endTime: string;
  isClosed: boolean;
  winnerId: string | null;
};

type ProductResponseDto = {
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
type BidDto = {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  createdAt: string;
};

export default function AuctionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [auction, setAuction] = useState<AuctionResponseDto | null>(null);
  const [product, setProduct] = useState<ProductResponseDto | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("/images/default.jpg");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isBidModalOpen, setBidModalOpen] = useState(false);
  const user = getUserFromToken();
  const bidderId = user?.userId ?? "";
  const [bids, setBids] = useState<BidDto[]>([]);

  const fetchBids = useCallback(async () => {
    if (!auction?.id) return;
    try {
      const res = await authFetch(`/bids/auction/${auction.id}`);
      const bidData: BidDto[] = await res.json();
      setBids(bidData);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  }, [auction?.id]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  useEffect(() => {
    if (!id) return;

    const fetchAuctionAndProduct = async () => {
      try {
        const auctionRes = await authFetch(`/auctions/product/${id}`);
        const auctions: AuctionResponseDto[] = await auctionRes.json();
        if (auctions.length > 0) {
          setAuction(auctions[0]);
        } else {
          setAuction(null);
        }

        const productRes = await authFetch(`/products/${id}`);
        const productData: ProductResponseDto = await productRes.json();
        setProduct(productData);

        const imageRes = await authFetch(`/product-images/${id}`);
        if (imageRes.ok) {
          const imageData = await imageRes.json();
          let img = imageData?.[0]?.imageUrl;
          if (img && !img.startsWith("http")) {
            img = `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
            }${img.startsWith("/") ? "" : "/"}${img}`;
          }
          if (img) setImageUrl(img);
        }
      } catch (error) {
        console.error("Error fetching auction/product:", error);
      }
    };

    fetchAuctionAndProduct();
  }, [id]);

  useEffect(() => {
    if (!auction || !auction.endTime) return;

    const end = new Date(auction.endTime).getTime();

    if (isNaN(end)) {
      console.error(
        "Invalid auction endTime after fixing:",
        auction.endTime + "Z"
      );
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));

      const d = Math.floor(diff / (3600 * 24));
      const h = Math.floor((diff % (3600 * 24)) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);

      if (diff <= 0) clearInterval(interval);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [auction]);

  if (!auction || !product) {
    return (
      <div className="text-center py-10 text-foreground">
        Loading auction...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-secondary/20 to-orange-primary/10 text-foreground px-4 py-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-orange-500">{product.title}</h1>
        {/* Product Image + Info */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Image */}
          <img
            src={imageUrl}
            alt={product.title}
            width={600}
            height={400}
            className="w-full h-auto rounded-2xl shadow-2xl"
          />

          {/* Info */}
          <div className="space-y-4">
            <p className="text-card-foreground text-base leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TagIcon className="w-5 h-5 text-orange-500" />
              <span>
                Starting Price:{" "}
                <span className="font-semibold text-orange-500">
                  ${product.startingPrice.toFixed(2)}
                </span>
              </span>
            </div>
            {!auction.isClosed && (
              <div className="mt-2">
                {/* Label above */}
                <p className="text-orange-500 font-semibold text-sm mb-1 flex items-center gap-1 pb-2">
                  <ClockIcon className="w-5 h-5" />
                  Time Remaining:
                </p>
                {/* Timer pills */}
                <div className="flex gap-2">
                  {/* Days */}
                  <div className="bg-orange-secondary/50 dark:bg-orange-primary/20 text-orange-700 dark:text-orange-300 rounded-full px-3 py-1 flex flex-col items-center min-w-[50px]">
                    <span className="font-bold text-lg leading-none">
                      {days}
                    </span>
                    <span className="text-xs">Days</span>
                  </div>
                  {/* Hours */}
                  <div className="bg-orange-secondary/50 dark:bg-orange-primary/20 text-orange-700 dark:text-orange-300 rounded-full px-3 py-1 flex flex-col items-center min-w-[50px]">
                    <span className="font-bold text-lg leading-none">
                      {hours.toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs">Hours</span>
                  </div>
                  {/* Minutes */}
                  <div className="bg-orange-secondary/50 dark:bg-orange-primary/20 text-orange-700 dark:text-orange-300 rounded-full px-3 py-1 flex flex-col items-center min-w-[50px]">
                    <span className="font-bold text-lg leading-none">
                      {minutes.toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs">Minutes</span>
                  </div>
                  {/* Seconds */}
                  <div className="bg-orange-secondary/50 dark:bg-orange-primary/20 text-orange-700 dark:text-orange-300 rounded-full px-3 py-1 flex flex-col items-center min-w-[50px]">
                    <span className="font-bold text-lg leading-none">
                      {seconds.toString().padStart(2, "0")}
                    </span>
                    <span className="text-xs">Seconds</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        {!auction.isClosed && (
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              className="bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-400 dark:to-orange-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-y-105 hover:shadow-xl font-semibold"
              onClick={() => setBidModalOpen(true)}
            >
              Place a Bid
            </button>

            <button className="bg-card/90 backdrop-blur-sm text-orange-500 px-6 py-3 rounded-2xl hover:bg-muted border border-orange-500/30 shadow-lg hover:shadow-xl">
              Ask a Question
            </button>
          </div>
        )}
        {/* Auction Status Panel */}
        <div className="mt-6 p-4 rounded-2xl bg-card/90 backdrop-blur-sm shadow-2xl border border-orange-500/30">
          <p className="text-sm text-muted-foreground">
            Auction Status:{" "}
            <span
              className={`font-semibold ${
                auction.isClosed ? "text-red-500" : "text-green-500"
              }`}
            >
              {auction.isClosed ? "Closed" : "Ongoing"}
            </span>
          </p>
          {auction.isClosed && auction.winnerId && (
            <p className="text-sm text-muted-foreground mt-1">
              Winner:{" "}
              <span className="font-semibold text-card-foreground">
                {auction.winnerId}
              </span>
            </p>
          )}
        </div>
        {auction && <BidsList bids={bids} currentUserId={bidderId} />}
      </div>
      <PlaceBidModal
        isOpen={isBidModalOpen}
        onClose={() => setBidModalOpen(false)}
        auctionId={auction.id}
        bidderId={bidderId}
        startingPrice={product.startingPrice}
        onSuccess={() => {
          toast.success("Your bid has been placed successfully!");
          fetchBids();
        }}
      />
    </div>
  );
}
