"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getApiUrl } from "../../lib/api";

type Product = {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  status: string;
  sellerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(getApiUrl("/products"));
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Discover Exclusive Auctions on{" "}
          <span className="text-orange-500">BidFlare</span>
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Bid smart. Win big. Explore high-demand items in real time.
        </p>
        <a
          href="/auctions"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Start Bidding
        </a>
      </section>

      {/* Live Auctions */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          🔥 Live Auctions
        </h2>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              image={product.image || "/images/default.jpg"}
              startingPrice={Number(product.startingPrice) || 0}
              status={product.status}
              createdAt={product.createdAt}
              endsAt={product.updatedAt} // or whichever field you want
            />
          ))}
        </div>
      </section>
    </div>
  );
}
