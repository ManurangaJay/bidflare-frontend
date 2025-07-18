import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type ProductCardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  startingPrice?: number | null;
  status: string;
  createdAt: string;
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
  id,
  title,
  description,
  image,
  startingPrice,
  status,
  createdAt,
}: ProductCardProps) => {
  const safeStartingPrice =
    typeof startingPrice === "number" ? startingPrice : 0;

  const createdDate = new Date(createdAt);

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={image || "/images/default.jpg"}
          alt={title}
          className="w-full h-48 object-contain rounded-t-2xl bg-white"
        />

        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-3 py-1 rounded-full ${
            status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>

        <div className="text-sm text-gray-600 flex justify-between items-center">
          <span>
            Starting at:{" "}
            <span className="font-medium text-blue-600">
              ${safeStartingPrice.toFixed(2)}
            </span>
          </span>
          <span className="text-xs text-gray-400">
            {isValidDate(createdDate)
              ? `Listed ${formatDistanceToNow(createdDate)} ago`
              : "Listing date unavailable"}
          </span>
        </div>

        <Link
          href={`/my-auction/${slugify(title)}`}
          className="inline-block mt-2 text-blue-600 hover:underline text-sm font-medium"
        >
          Manage Auction →
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
