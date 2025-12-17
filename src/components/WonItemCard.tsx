"use client";

import React from "react";

type WonItemCardProps = {
  title: string;
  image: string;
  price: number;
  status: "SOLD" | "PAID" | "SHIPPED" | "DELIVERED";
  isUpdating: boolean;
  onPay: () => void;
  onMarkDelivered: () => void;
  onWriteReview: () => void;
};

// A simple spinner icon for the loading state on buttons
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

export default function WonItemCard({
  title,
  image,
  price,
  status,
  isUpdating,
  onPay,
  onMarkDelivered,
  onWriteReview,
}: WonItemCardProps) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-xl transition-all duration-300 ease-in-out hover:shadow-md  dark: hover:shadow-gray-800 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          width={300}
          height={192}
          className="w-full h-48 object-contain rounded-t-2xl bg-card transition-transform duration-300 group-hover:scale-105"
        />
        {/* <span
          className={`absolute top-3 right-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle}`}
        >
          {status}
        </span> */}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-card-foreground" title={title}>
          {title}
        </h3>
        <p className="mt-1 text-lg font-semibold text-orange-primary">
          Won at: ${price.toFixed(2)}
        </p>

        <div className="mt-4 flex-1 flex items-end">
          {status === "SOLD" && (
            <button
              onClick={onPay}
              disabled={isUpdating}
              className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted"
            >
              {isUpdating ? <SpinnerIcon /> : "Pay Now"}
            </button>
          )}
          {status === "SHIPPED" && (
            <button
              onClick={onMarkDelivered}
              disabled={isUpdating}
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted"
            >
              {isUpdating ? <SpinnerIcon /> : "Mark as Delivered"}
            </button>
          )}
          {status === "DELIVERED" && (
            <button
              onClick={onWriteReview}
              className="flex w-full items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Review the Seller
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
