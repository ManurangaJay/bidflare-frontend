"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { Heart, HeartOff } from "lucide-react";
import { authFetch } from "../../lib/authFetch";

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

const isValidDate = (date: Date) => !isNaN(date.getTime());

const AuctionCard = ({
  id,
  title,
  description,
  image,
  startingPrice,
  startTime,
  endTime,
  isClosed,
  onClick,
}: AuctionCardProps) => {
  const safeStartingPrice =
    typeof startingPrice === "number" ? startingPrice : 0;

  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  let statusLabel = "Upcoming";
  let statusClass = "bg-orange-100 text-orange-800";

  if (isClosed) {
    statusLabel = "Closed";
    statusClass = "bg-gray-200 text-gray-600";
  } else if (isBefore(now, start)) {
    statusLabel = `Starts in ${formatDistanceToNowStrict(start)}`;
    statusClass = "bg-yellow-100 text-yellow-800";
  } else if (isAfter(now, start) && isBefore(now, end)) {
    statusLabel = "Ongoing";
    statusClass = "bg-green-100 text-green-800";
  } else if (isAfter(now, end)) {
    statusLabel = "Ended";
    statusClass = "bg-gray-300 text-gray-700";
  }

  useEffect(() => {
    const fetchWishlistState = async () => {
      try {
        const res = await authFetch(`/wishlist/contains/${id}`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (res.status === 304) {
          setIsWishlisted(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`Error fetching wishlist: ${res.status}`);
        }

        const data = await res.json();
        setIsWishlisted(Boolean(data));
      } catch (error) {
        console.error("Failed to load wishlist status:", error);
      }
    };

    fetchWishlistState();
  }, [id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setLoading(true);
    try {
      if (isWishlisted) {
        await authFetch(`/wishlist/${id}`, {
          method: "DELETE",
        });
        setIsWishlisted(false);
      } else {
        await authFetch(`/wishlist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: id }),
        });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border border-orange-100 cursor-pointer relative"
    >
      <div className="relative">
        <img
          src={image || "/images/default.jpg"}
          alt={title}
          className="w-full h-48 object-contain rounded-t-2xl bg-white"
        />

        {/* ❤️ Wishlist Button */}
        <button
          onClick={toggleWishlist}
          disabled={loading}
          className={`absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1.5 shadow transition ${
            isWishlisted ? "hover:scale-105" : "hover:bg-white"
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>

        <span
          className={`absolute bottom-2 right-2 text-xs font-semibold px-3 py-1 rounded-full ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-600">
          <span>
            Starting at:{" "}
            <span className="font-medium text-orange-600">
              ${safeStartingPrice.toFixed(2)}
            </span>
          </span>
          <span className="text-xs text-gray-400 mt-1 sm:mt-0">
            {isValidDate(start)
              ? `Starts: ${start.toLocaleString()}`
              : "Start time unavailable"}
          </span>
        </div>

        <p className="text-sm text-red-500">
          {isValidDate(end)
            ? `Ends: ${end.toLocaleString()}`
            : "End time unavailable"}
        </p>
      </div>
    </div>
  );
};

export default AuctionCard;
