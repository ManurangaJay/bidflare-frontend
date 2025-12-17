"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import WonItemCard from "@/components/WonItemCard";
import Link from "next/link";
import { authFetch } from "../../../../../lib/authFetch";
import PaymentModal from "@/components/payment/PaymentModal";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import ReviewModal from "@/components/ReviewModal";

const CardSkeleton = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    <div className="aspect-[4/3] w-full animate-pulse bg-muted"></div>
    <div className="p-4">
      <div className="h-5 w-3/4 animate-pulse rounded bg-muted"></div>
      <div className="mt-2 h-6 w-1/2 animate-pulse rounded bg-muted"></div>
      <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-muted"></div>
    </div>
  </div>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-10 flex items-center justify-center space-x-1 sm:space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-orange-secondary/50 disabled:opacity-50"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-lg border px-4 py-2 text-sm ${
            page === currentPage
              ? "border-orange-primary bg-orange-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:bg-orange-secondary/50"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-orange-secondary/50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

// --- Type Definitions ---
type ItemStatus = "SOLD" | "PAID" | "SHIPPED" | "DELIVERED";
type WonAuction = { id: string; productId: string; lastPrice: number };
type Product = {
  id: string;
  title: string;
  status: ItemStatus;
  sellerId: string;
};
type WonItemWithProduct = Product & {
  auctionId: string;
  price: number;
  image: string;
};

const ITEMS_PER_PAGE = 8;

const TABS: { name: string; status: ItemStatus }[] = [
  { name: "To Pay", status: "SOLD" },
  { name: "Processing", status: "PAID" },
  { name: "Shipped", status: "SHIPPED" },
  { name: "Delivered", status: "DELIVERED" },
];

export default function MyWinsPageContent() {
  // --- State ---
  const [items, setItems] = useState<WonItemWithProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ItemStatus>("SOLD");
  const searchParams = useSearchParams();

  // State to track which item is selected for payment
  const [itemToPay, setItemToPay] = useState<{
    auctionId: string;
    title: string;
    price: number;
  } | null>(null);

  // State for the review modal
  const [itemToReview, setItemToReview] = useState<{
    sellerId: string;
    productTitle: string;
    productId: string;
  } | null>(null);
  const isReviewModalOpen = !!itemToReview;

  // --- Data Fetching ---
  const fetchWonItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch("/auctions/won");
      if (!res.ok)
        throw new Error("Failed to load your won auctions. Please try again.");
      const auctionsData: WonAuction[] = await res.json();

      const enrichedItems = await Promise.all(
        auctionsData.map(async (auction) => {
          try {
            const productRes = await authFetch(
              `/products/${auction.productId}`
            );
            if (!productRes.ok) {
              console.error(
                `Debug: Failed to fetch product ${auction.productId}`
              );
              return null;
            }
            const product: Product = await productRes.json();
            console.log("Debug: Product fetched:", product);

            let image = "https://placehold.co/600x400/EEE/31343C?text=No+Image";
            try {
              const imageRes = await authFetch(`/product-images/${product.id}`);
              if (imageRes.ok) {
                const imageData = await imageRes.json();
                const imageUrl = imageData[0]?.imageUrl;
                if (imageUrl) {
                  image = imageUrl.startsWith("http")
                    ? imageUrl
                    : `${
                        process.env.NEXT_PUBLIC_API_URL ||
                        "http://localhost:8080"
                      }${
                        imageUrl.startsWith("/") ? "" : "/"
                      }${imageUrl}`;
                }
              }
            } catch {}

            return {
              ...product,
              auctionId: auction.id,
              price: auction.lastPrice,
              image,
            };
          } catch {
            return null;
          }
        })
      );
      const finalItems = enrichedItems.filter(Boolean) as WonItemWithProduct[];
      console.log("Debug: Enriched items ready for display:", finalItems);
      setItems(finalItems);
    } catch (err: unknown) {
      console.error("Debug: Error in fetchWonItems:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Effects ---
  useEffect(() => {
    fetchWonItems();
  }, [fetchWonItems]);

  useEffect(() => {
    const redirectStatus = searchParams.get("redirect_status");

    if (redirectStatus === "succeeded") {
      toast.success(
        "Payment Successful! Your item status will update shortly."
      );
      fetchWonItems();
    } else if (redirectStatus) {
      toast.error("Payment failed or was canceled. Please try again.");
    }
  }, [searchParams, fetchWonItems]);

  // --- Handlers ---

  // Opens the Payment Modal
  const handlePayment = (auctionId: string, title: string, price: number) => {
    setItemToPay({ auctionId, title, price });
  };

  const handleMarkDelivered = async (productId: string) => {
    setUpdatingItemId(productId);
    const originalItems = [...items];

    // Optimistic UI update
    const newItems = items.map((item) =>
      item.id === productId ? { ...item, status: "DELIVERED" as const } : item
    );
    setItems(newItems);

    try {
      const res = await authFetch(`/products/${productId}/deliver`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to confirm delivery.");

      toast.success("Enjoy your new item! Delivery confirmed.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(
          err.message || "Could not confirm delivery. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      setItems(originalItems);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleWriteReview = (
    sellerId: string,
    productTitle: string,
    productId: string
  ) => {
    setItemToReview({ sellerId, productTitle, productId });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTabClick = (status: ItemStatus) => {
    setActiveTab(status);
    setCurrentPage(1);
  };

  // --- Derived State (Filtering & Pagination) ---
  const filteredItems = useMemo(
    () => items.filter((item) => item.status === activeTab),
    [items, activeTab]
  );

  const tabCounts = useMemo(
    () =>
      TABS.reduce(
        (acc, tab) => ({
          ...acc,
          [tab.status]: items.filter((i) => i.status === tab.status).length,
        }),
        {} as Record<ItemStatus, number>
      ),
    [items]
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- Rendering Helpers ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-destructive">
            Something went wrong
          </h3>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <button
            onClick={fetchWonItems}
            className="mt-6 rounded-md bg-orange-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-orange-accent"
          >
            Try Again
          </button>
        </div>
      );
    }
    if (filteredItems.length === 0) {
      const emptyMessages: Record<ItemStatus, string> = {
        SOLD: "You have no items to pay for. Great job staying on top of things!",
        PAID: "No items are currently being processed.",
        SHIPPED: "There are no items currently in transit.",
        DELIVERED: "You haven't received any items yet.",
      };
      return (
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground">
            This Tab is Empty
          </h3>
          <p className="mt-2 text-muted-foreground">
            {emptyMessages[activeTab]}
          </p>
          <Link
            href="/buyer/auctions"
            className="mt-6 inline-block rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-orange-accent text-white"
          >
            Browse Auctions
          </Link>
        </div>
      );
    }
    return (
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
          {currentItems.map((item) => (
            <WonItemCard
              key={item.auctionId}
              title={item.title}
              image={item.image}
              price={item.price}
              status={item.status}
              isUpdating={updatingItemId === item.id}
              onPay={() =>
                handlePayment(item.auctionId, item.title, item.price)
              }
              onMarkDelivered={() => handleMarkDelivered(item.id)}
              onWriteReview={() =>
                handleWriteReview(item.sellerId, item.title, item.id)
              }
            />
          ))}
        </div>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-orange-primary sm:text-3xl lg:text-4xl">
            🏆 My Wins
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Congratulations! Manage your payments and track your deliveries all
            in one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 sm:mt-10">
          <div className="overflow-x-auto border-b border-border pb-px">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabClick(tab.status)}
                  className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200 focus:outline-none ${
                    activeTab === tab.status
                      ? "border-orange-primary text-orange-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {tab.name}
                  <span
                    className={`ml-2 hidden rounded-full py-0.5 px-2 text-xs font-semibold sm:inline-block ${
                      activeTab === tab.status
                        ? "bg-orange-secondary/50 text-orange-primary dark:bg-orange-primary/20 dark:text-orange-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isLoading ? "..." : tabCounts[tab.status] ?? 0}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8">{renderContent()}</div>
      </div>

      {/* Payment Modal */}
      {itemToPay && (
        <PaymentModal
          isOpen={!!itemToPay}
          onClose={() => setItemToPay(null)}
          auctionId={itemToPay.auctionId}
          itemTitle={itemToPay.title}
          price={itemToPay.price}
        />
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setItemToReview(null)}
          sellerId={itemToReview.sellerId}
          productTitle={itemToReview.productTitle}
          productId={itemToReview.productId}
        />
      )}
    </div>
  );
}
