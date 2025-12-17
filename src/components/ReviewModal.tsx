"use client";

import React, { useState, useEffect } from "react";
import { authFetch } from "../../lib/authFetch";
import { toast } from "sonner";

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  productTitle: string;
  productId: string;
};

const SpinnerIcon = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const StarIcon = ({
  filled,
  onClick,
}: {
  filled: boolean;
  onClick: () => void;
}) => (
  <svg
    onClick={onClick}
    className={`w-8 h-8 cursor-pointer ${
      filled ? "text-yellow-400" : "text-gray-400 dark:text-gray-600"
    } hover:text-yellow-400 transition-colors`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.175 0l-3.37 2.45c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.24 9.393c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.966z" />
  </svg>
);

export default function ReviewModal({
  isOpen,
  onClose,
  sellerId,
  productTitle,
  productId,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setRating(0);
      setComment("");
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (comment.trim() === "") {
      setError("Please enter a comment.");
      return;
    }
    setError(null);
    setIsLoading(true);

    const requestBody = {
      sellerId: sellerId,
      productId: productId,
      rating,
      comment,
    };
    console.log("Submitting review with request body:", requestBody);

    try {
      const res = await authFetch("/reviews", {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit review.");
      }

;
      toast.success("Thank you! Your review has been submitted.");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
        toast.error(err.message || "Could not submit review.");
      } else {
        setError("An unexpected error occurred.");
        toast.error("Could not submit review.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-gray-500 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-500 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Write a Review
              </h2>
              <p className="text-sm text-muted-foreground">
                for your purchase: {productTitle}
              </p>
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
          <div className="p-6 space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Overall Rating
              </label>
              <div
                className="flex items-center space-x-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setRating(star)}
                  >
                    <StarIcon
                      filled={(hoverRating || rating) >= star}
                      onClick={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label
                htmlFor="comment"
                className="text-sm font-medium text-foreground"
              >
                Your Review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike? How was your overall experience?"
                className="w-full h-32 p-3 bg-transparent border border-gray-500 rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                rows={4}
              ></textarea>
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-500 flex justify-end items-center bg-muted/30 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-md border border-border hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md bg-orange-500 text-primary-foreground shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted"
            >
              {isLoading ? <SpinnerIcon /> : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
