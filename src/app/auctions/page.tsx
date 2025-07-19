"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getApiUrl } from "../../../lib/api";

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

const ITEMS_PER_PAGE = 8;

export default function AuctionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(getApiUrl("/products"));
        if (!res.ok) throw new Error("Failed to load products");
        const data: Product[] = await res.json();

        // Fetch image metadata for each product
        const enrichedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const imageRes = await fetch(
                getApiUrl(`/product-images/${product.id}`)
              );
              if (!imageRes.ok) throw new Error("Image not found");
              const imageData = await imageRes.json();
              const imageUrl = imageData[0]?.imageUrl || "/images/default.jpg";
              return { ...product, image: imageUrl };
            } catch {
              return { ...product, image: "/images/default.jpg" };
            }
          })
        );

        setProducts(enrichedProducts);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        🔥 Live & Upcoming Auctions
      </h1>
      <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
        Browse all auctions currently open for bidding. New products are added
        frequently—don’t miss your chance!
      </p>

      {loading && <p className="text-gray-500 text-center">Loading...</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => {
          const imageUrl = product.image
            ? product.image.startsWith("http")
              ? product.image
              : `http://localhost:8080${
                  product.image.startsWith("/") ? "" : "/"
                }${product.image}`
            : "/images/default.jpg";

          return (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              image={imageUrl}
              startingPrice={Number(product.startingPrice)}
              status={product.status}
              createdAt={product.createdAt}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-xl border ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
