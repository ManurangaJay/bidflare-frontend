"use client";

import { useEffect, useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { authFetch } from "../../../../../lib/authFetch";
import RoleGuard from "@/components/RoleGuard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ShowReviewsModal from "@/components/ShowReviewsModal";

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

type ProductStatus = "SOLD" | "PAID" | "SHIPPED" | "DELIVERED" | "ACTIVE";
type TabStatus = ProductStatus | "ALL";

const TABS: { name: string; status: TabStatus }[] = [
  { name: "All", status: "ALL" },
  { name: "To get paid", status: "SOLD" },
  { name: "To Ship", status: "PAID" },
  { name: "Delivering", status: "SHIPPED" },
  { name: "Completed", status: "DELIVERED" },
];

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabStatus>("ALL");
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const router = useRouter();

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
                : `${
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
                  }${rawUrl?.startsWith("/") ? "" : "/"}${rawUrl}`;

              return { ...product, image: imageUrl || "/images/default.jpg" };
            } catch {
              return { ...product, image: "/images/default.jpg" };
            }
          })
        );

        setProducts(enrichedProducts);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProducts();
  }, []);

  const handleTabClick = (status: TabStatus) => {
    setActiveTab(status);
  };

  const handleMarkAsShipped = async (productId: string) => {
    setUpdatingProductId(productId);
    const originalProducts = [...products];

    // Optimistic update
    const newProducts = products.map((p) =>
      p.id === productId ? { ...p, status: "SHIPPED" } : p
    );
    setProducts(newProducts);

    try {
      const res = await authFetch(`/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SHIPPED" }),
      });
      if (!res.ok) throw new Error("Failed to update product status.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(
          err.message || "Could not mark as shipped. Reverting change."
        );
      } else {
        toast.error("An unknown error occurred. Reverting change.");
      }
      setProducts(originalProducts); // Revert on failure
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleSeeReviews = (productId: string) => {
    setSelectedProductId(productId);
    setIsReviewsModalOpen(true);
  };

  const filteredProducts = useMemo(
    () =>
      activeTab === "ALL"
        ? products
        : products.filter((product) => product.status === activeTab),
    [products, activeTab]
  );

  const tabCounts = useMemo(
    () =>
      TABS.reduce((acc, tab) => {
        if (tab.status === "ALL") {
          acc[tab.status] = products.length;
        } else {
          acc[tab.status] = products.filter(
            (p) => p.status === tab.status
          ).length;
        }
        return acc;
      }, {} as Record<TabStatus, number>),
    [products]
  );

  if (loading) {
    return (
      <RoleGuard allowedRoles={["SELLER"]}>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-orange-600" />
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

  if (products.length === 0 && !loading) {
    return (
      <RoleGuard allowedRoles={["SELLER"]}>
        <div className="text-center text-gray-500 pt-20 text-lg">
          <p className="pb-20">No products found. Start listing some!</p>
          <button
            onClick={() => router.push("/seller/create-listing")}
            className="bg-orange-500 text-white px-6 py-3 mb-80 rounded-xl shadow hover:bg-orange-600 transition"
          >
            List a New Product
          </button>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["SELLER"]}>
      <div className="px-4 md:px-8 py-6">
        <h1 className="text-2xl font-bold text-orange-primary mb-6">
          Your Products
        </h1>

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
                    {loading ? "..." : tabCounts[tab.status] ?? 0}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  isUpdating={updatingProductId === product.id}
                  onMarkAsShipped={() => handleMarkAsShipped(product.id)}
                  onSeeReviews={() => handleSeeReviews(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 pt-10 text-lg">
              <p>No products found in this category.</p>
              {activeTab !== "ALL" && (
                <button
                  onClick={() => setActiveTab("ALL")}
                  className="mt-4 text-orange-500 hover:underline"
                >
                  View All Products
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {selectedProductId && (
        <ShowReviewsModal
          isOpen={isReviewsModalOpen}
          onClose={() => setIsReviewsModalOpen(false)}
          productId={selectedProductId}
        />
      )}
    </RoleGuard>
  );
}
