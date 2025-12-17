"use client";

import { useState, useEffect } from "react";
import { authFetch } from "../../lib/authFetch";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";

type Review = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function ShowReviewsModal({
  isOpen,
  onClose,
  productId,
}: {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && productId) {
      const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await authFetch(`/reviews/product/${productId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch reviews");
          }
          const data = await res.json();
          setReviews(data);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
            toast.error(err.message);
          } else {
            setError("An unexpected error occurred.");
            toast.error("An unexpected error occurred.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchReviews();
    }
  }, [isOpen, productId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-gray-500 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-500 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Product Reviews
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -mt-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-orange-600" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading reviews...
              </span>
            </div>
          )}

          {error && (
            <div className="text-center text-destructive py-10">
              <p>⚠️ {error}</p>
            </div>
          )}

          {!loading && !error && reviews.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
              <p>No reviews found for this product.</p>
            </div>
          )}

          {!loading &&
            !error &&
            reviews.length > 0 &&
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-lg bg-muted/30 border border-gray-500"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">
                    {review.reviewerName}
                  </h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-400 dark:text-gray-600"
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {review.comment}
                </p>
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-500 flex justify-end items-center bg-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-md border border-border hover:bg-accent hover:text-accent-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
