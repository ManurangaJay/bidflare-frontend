"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { authFetch } from "../../../../lib/authFetch";
import RoleGuard from "@/components/RoleGuard";

type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  startingPrice?: number | null;
  status: string;
  createdAt: string;
  endsAt: string;
};

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const res = await authFetch("/products/seller");
        if (!res.ok) throw new Error("Failed to fetch seller products");

        const products = await res.json();

        const enrichedProducts = await Promise.all(
          products.map(async (product: Product) => {
            try {
              const imageRes = await authFetch(`/product-images/${product.id}`);
              if (!imageRes.ok) throw new Error();
              const imageData = await imageRes.json();

              const rawUrl = imageData[0]?.imageUrl;

              const imageUrl = rawUrl?.startsWith("http")
                ? rawUrl
                : `http://localhost:8080${
                    rawUrl?.startsWith("/") ? "" : "/"
                  }${rawUrl}`;

              return { ...product, image: imageUrl || "/images/default.jpg" };
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

    fetchSellerProducts();
  }, []);

  if (loading) {
    return (
      <RoleGuard allowedRoles={["SELLER"]}>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
          <span className="ml-2 text-sm text-gray-500">
            Loading products...
          </span>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={["SELLER"]}>
        <div className="text-center text-red-600 py-10">
          <p>⚠️ {error}</p>
        </div>
      </RoleGuard>
    );
  }

  if (products.length === 0) {
    return (
      <RoleGuard allowedRoles={["SELLER"]}>
        <div className="text-center text-gray-500 py-10">
          <p>No products found. Start listing some!</p>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["SELLER"]}>
      <div className="px-4 md:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>{" "}
    </RoleGuard>
  );
}
