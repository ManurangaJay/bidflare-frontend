import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

type ProductCardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  startingPrice?: number | null;
  status: string;
  createdAt: string;
  isUpdating?: boolean;
  onMarkAsShipped?: () => void;
  onSeeReviews?: () => void;
};

const isValidDate = (date: Date) => !isNaN(date.getTime());

// Convert title to URL-safe path
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const ProductCard = ({
  title,
  description,
  image,
  startingPrice,
  status,
  createdAt,
  isUpdating = false,
  onMarkAsShipped,
  onSeeReviews,
}: ProductCardProps) => {
  const safeStartingPrice =
    typeof startingPrice === "number" ? startingPrice : 0;

  const createdDate = new Date(createdAt);

  return (
    <div className="bg-card rounded-2xl shadow-2xl hover:shadow-lg transition overflow-hidden ">
      <div className="relative">
        <img
          src={image || "/images/default.jpg"}
          alt={title}
          width={300}
          height={192}
          className="w-full h-48 object-contain rounded-t-2xl bg-card"
        />

        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-3 py-1 rounded-full ${
            status === "ACTIVE"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-card-foreground truncate">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="text-sm text-muted-foreground flex justify-between items-center">
          <span>
            Starting at:{" "}
            <span className="font-medium text-orange-primary">
              ${safeStartingPrice.toFixed(2)}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            {isValidDate(createdDate)
              ? `Listed ${formatDistanceToNow(createdDate)} ago`
              : "Listing date unavailable"}
          </span>
        </div>

        <div className="pt-2">
          {status === "PAID" && onMarkAsShipped && (
            <button
              onClick={onMarkAsShipped}
              disabled={isUpdating}
              className="w-full flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isUpdating ? "Updating..." : "Mark As Shipped"}
            </button>
          )}

          {status === "ACTIVE" && (
            <Link
              href={`/my-auction/${slugify(title)}`}
              className="inline-block text-orange-primary hover:underline text-sm font-medium"
            >
              Manage Auction →
            </Link>
          )}

          {status === "DELIVERED" && onSeeReviews && (
            <button
              onClick={onSeeReviews}
              className="w-full flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600"
            >
              See Reviews
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
