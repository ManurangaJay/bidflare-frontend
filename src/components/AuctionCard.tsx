import { useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";
import { Heart } from "lucide-react";
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
  let statusClass =
    "bg-orange-secondary/50 text-orange-primary dark:bg-orange-primary/20 dark:text-orange-secondary";

  if (isClosed) {
    statusLabel = "Closed";
    statusClass = "bg-muted text-muted-foreground";
  } else if (isBefore(now, start)) {
    statusLabel = `Starts in ${formatDistanceToNowStrict(start)}`;
    statusClass =
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  } else if (isAfter(now, start) && isBefore(now, end)) {
    statusLabel = "Ongoing";
    statusClass =
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  } else if (isAfter(now, end)) {
    statusLabel = "Ended";
    statusClass = "bg-muted text-muted-foreground";
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
      className="bg-card rounded-2xl shadow-2xl hover:shadow-lg transition overflow-hidden cursor-pointer relative"
    >
      <div className="relative">
        <Image
          src={image || "/images/default.jpg"}
          alt={title}
          width={300}
          height={192}
          className="w-full h-48 object-contain rounded-t-2xl bg-card"
        />

        {/* ❤️ Wishlist Button */}
        <button
          onClick={toggleWishlist}
          disabled={loading}
          className={`absolute top-2 right-2 z-10 bg-card/90 rounded-full p-1.5 shadow transition ${
            isWishlisted ? "hover:scale-105" : "hover:bg-card"
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-muted-foreground hover:text-red-500"
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
        <h3 className="text-lg font-semibold text-card-foreground truncate">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-muted-foreground">
          <span>
            Starting at:{" "}
            <span className="font-medium text-orange-primary">
              ${safeStartingPrice.toFixed(2)}
            </span>
          </span>
          <span className="text-xs text-muted-foreground mt-1 sm:mt-0">
            {isValidDate(start)
              ? `Starts: ${start.toLocaleString()}`
              : "Start time unavailable"}
          </span>
        </div>

        <p className="text-sm text-destructive">
          {isValidDate(end)
            ? `Ends: ${end.toLocaleString()}`
            : "End time unavailable"}
        </p>
      </div>
    </div>
  );
};

export default AuctionCard;
