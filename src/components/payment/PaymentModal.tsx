"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { authFetch } from "../../../lib/authFetch";

// Initialize Stripe (Make sure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is in .env.local)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  auctionId: string;
  itemTitle: string;
  price: number;
};

export default function PaymentModal({
  isOpen,
  onClose,
  auctionId,
  itemTitle,
  price,
}: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && auctionId) {
      setLoading(true);
      setError("");

      // --- USING YOUR AUTH FETCH HERE ---
      authFetch("/payments/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({ auctionId: auctionId }), // Matches PaymentRequestDTO
      })
        .then(async (res) => {
          if (!res.ok) {
            // Try to get error message from backend, fallback to generic
            const errorData = await res.text();
            throw new Error(errorData || "Failed to initialize payment");
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret); // Matches PaymentResponseDTO
        })
        .catch((err) => {
          console.error("Payment init error:", err);
          setError("Could not initialize payment gateway. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, auctionId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Secure Payment
            </h2>
            <p className="text-sm text-muted-foreground">for {itemTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
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
        <div className="p-6">
          <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg flex justify-between items-center border border-orange-100 dark:border-orange-900/30">
            <span className="text-orange-900 dark:text-orange-100 font-medium">
              Total Amount
            </span>
            <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
              ${price.toFixed(2)}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="text-sm text-muted-foreground">
                Connecting to secure gateway...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-destructive mb-4 font-medium">{error}</p>
              <button
                onClick={onClose}
                className="text-sm text-primary hover:underline"
              >
                Close
              </button>
            </div>
          ) : (
            clientSecret && (
              <Elements
                options={{
                  clientSecret,
                  appearance: { theme: "stripe" }, // or 'night' if dark mode
                }}
                stripe={stripePromise}
              >
                <CheckoutForm />
              </Elements>
            )
          )}
        </div>
      </div>
    </div>
  );
}
