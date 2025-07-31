"use client";

import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { authFetch } from "../../lib/authFetch";

export default function PlaceBidModal({
  isOpen,
  onClose,
  auctionId,
  bidderId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  auctionId: string;
  bidderId: string;
  onSuccess?: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    const bidAmount = parseFloat(amount);
    if (!bidAmount || bidAmount <= 0) {
      setError("Please enter a valid amount");
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
    } catch (err: any) {
      setError("Failed to place bid: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Centered Panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <Dialog.Title className="text-xl font-semibold text-gray-800 mb-4">
                  Place a Bid
                </Dialog.Title>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">
                      Bid Amount ($)
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your bid amount"
                    />
                  </label>

                  {error && (
                    <p className="text-sm text-red-500 font-medium">{error}</p>
                  )}

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-orange-500 text-white px-4 py-2 text-sm rounded-md hover:bg-orange-600 disabled:opacity-50"
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
