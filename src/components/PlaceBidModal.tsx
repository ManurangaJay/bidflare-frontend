"use client";

import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { authFetch } from "../../lib/authFetch";
import { toast } from "sonner"; // ✅ Import toast

export default function PlaceBidModal({
  isOpen,
  onClose,
  auctionId,
  bidderId,
  startingPrice,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  auctionId: string;
  bidderId: string;
  startingPrice: number;
  onSuccess?: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const bidAmount = parseFloat(amount);

    if (!bidAmount || bidAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (bidAmount <= startingPrice) {
      toast.error(
        `Bid must be higher than the starting price of $${startingPrice.toFixed(
          2
        )}`
      );
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch("/bids", {
        method: "POST",
        body: JSON.stringify({
          auctionId,
          bidderId,
          amount: bidAmount,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      setAmount("");
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Failed to place bid: " + err.message); // ✅ Show error as toast
      } else {
        toast.error("An unexpected error occurred while placing bid.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-lg transition-all"
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-border"
              >
                <Dialog.Title className="text-xl font-semibold text-card-foreground mb-4 text-white">
                  Place a Bid
                </Dialog.Title>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-card-foreground text-white">
                      Bid Amount ($)
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 block w-full rounded-2xl px-4 py-3 shadow-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground backdrop-blur-sm"
                      style={{ backgroundColor: "var(--muted)" }}
                      placeholder="Enter your bid amount"
                    />
                  </label>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm border px-4 py-2 rounded-2xl bg-card text-card-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-4 py-2 text-sm rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-400 dark:to-orange-700 text-white shadow-lg hover:scale-y-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {loading ? "Placing..." : "Place Bid"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
