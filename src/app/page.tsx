"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getApiUrl } from "../../lib/api";
import { getUserFromToken } from "../../utils/getUserFromToken";

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
  const [userRole, setUserRole] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Get role from token
    const user = getUserFromToken();
    if (user?.role) {
      setUserRole(user.role.toUpperCase());
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(getApiUrl("/products"));
        if (!res.ok) throw new Error("Failed to load products");
        const data: Product[] = await res.json();

        // Fetch images for products
        const enrichedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const imageRes = await fetch(
                getApiUrl(`/product-images/${product.id}`)
              );
              if (!imageRes.ok) throw new Error();
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

  const handleStartBidding = () => {
    if (userRole) {
      router.push("/auctions");
    } else {
      router.push("/signin");
    }
  };

  // Render Buyer Homepage
  const BuyerHome = () => (
    <>
      <section className="text-center py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          Discover Exclusive Auctions on{" "}
          <span className="text-orange-500">BidFlare</span>
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Bid smart. Win big. Explore high-demand items in real time.
        </p>
        <button
          onClick={handleStartBidding}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Start Bidding
        </button>
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          🔥 Ending Soon
        </h2>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products
            .filter((p) => p.status === "LISTED")
            .slice(0, 8)
            .map((product) => {
              const imageUrl = product.image?.startsWith("http")
                ? product.image
                : `http://localhost:8080${
                    product.image?.startsWith("/") ? "" : "/"
                  }${product.image}`;
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  image={imageUrl}
                  startingPrice={Number(product.startingPrice) || 0}
                  status={product.status}
                  createdAt={product.createdAt}
                />
              );
            })}
        </div>
      </section>
    </>
  );

  // Render Seller Homepage
  const SellerHome = () => (
    <section className="py-16 max-w-3xl mx-auto text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Welcome back, Seller! 🚀
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        At BidFlare, we empower sellers like you to reach thousands of eager
        buyers quickly and easily. Manage your auctions, track sales, and grow
        your business all in one place.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-orange-50 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">Reach Thousands</h3>
          <p className="text-gray-700 text-sm">
            Get your products in front of a large audience of enthusiastic
            bidders.
          </p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">Easy Auction Setup</h3>
          <p className="text-gray-700 text-sm">
            List your products with simple tools and flexible auction options.
          </p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-xl mb-2">Track & Manage</h3>
          <p className="text-gray-700 text-sm">
            Monitor bids, sales, and performance all from your dashboard.
          </p>
        </div>
      </div>

      <div className="space-x-4">
        <button
          onClick={() => router.push("/create-listing")}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          List a New Product
        </button>
      </div>
    </section>
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {userRole === "SELLER" && <SellerHome />}
      {(userRole === "BUYER" || userRole === null) && <BuyerHome />}
    </div>
  );
}
