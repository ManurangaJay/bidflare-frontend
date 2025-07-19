import Link from "next/link";
import { formatDistanceToNowStrict, isAfter, isBefore } from "date-fns";

type AuctionCardProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  startingPrice?: number | null;
  startTime: string;
  endTime: string;
  isClosed: boolean;
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
}: AuctionCardProps) => {
  const safeStartingPrice =
    typeof startingPrice === "number" ? startingPrice : 0;

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  let statusLabel = "Upcoming";
  let statusClass = "bg-blue-100 text-blue-800";

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

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={image || "/images/default.jpg"}
          alt={title}
          className="w-full h-48 object-contain rounded-t-2xl bg-white"
        />
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
            <span className="font-medium text-blue-600">
              ${safeStartingPrice.toFixed(2)}
            </span>
          </span>
          <span className="text-xs text-gray-400 mt-1 sm:mt-0">
            {isValidDate(start)
              ? `Starts: ${start.toLocaleString()}`
              : "Start time unavailable"}
          </span>
        </div>

        <p className="text-sm text-red-400">
          {isValidDate(end)
            ? `Ends: ${end.toLocaleString()}`
            : "End time unavailable"}
        </p>

        <Link
          href={`/auctions/${id}`}
          className="inline-block mt-2 text-blue-600 hover:underline text-sm font-medium"
        >
          View Auction →
        </Link>
      </div>
    </div>
  );
};

export default AuctionCard;
