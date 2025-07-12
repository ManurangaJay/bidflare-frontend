"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [isSignedIn, setIsSignedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const res = await fetch(getApiUrl("/products"));
        if (!res.ok) throw new Error("Failed to load products");
        const data: Product[] = await res.json();
        console.log("Products fetched:", data);

        // Fetch image metadata for each product
        const enrichedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              console.log(`Fetching image for product ${product.id}...`);
              const imageRes = await fetch(
                getApiUrl(`/product-images/${product.id}`)
              );
              if (!imageRes.ok) {
                console.warn(`Image fetch failed for product ${product.id}`);
                throw new Error();
              }
              const imageData = await imageRes.json();
              console.log(`Image data for product ${product.id}:`, imageData);
              const imageUrl = imageData[0]?.imageUrl || "/images/default.jpg";
              console.log(
                `Using image URL for product ${product.id}:`,
                imageUrl
              );
              // Store only the relative imageUrl here
              return { ...product, image: imageUrl };
            } catch (error) {
              console.warn(
                `Error fetching image for product ${product.id}, using default`
              );
              return { ...product, image: "/images/default.jpg" };
            }
          })
        );

        console.log("Enriched products with images:", enrichedProducts);
        setProducts(enrichedProducts);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleStartBidding = () => {
    if (isSignedIn) {
      router.push("/auctions"); // Redirect to the auctions page
    } else {
      router.push("/signin"); // Redirect to the signin page
    }
  };

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
        <button
          onClick={handleStartBidding}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Start Bidding
        </button>
      </section>

      {/* Live Auctions */}
      <section className="py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          🔥 Live Auctions
        </h2>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageUrl = product.image
              ? product.image.startsWith("http")
                ? product.image
                : `http://localhost:8080${
                    product.image.startsWith("/") ? "" : "/"
                  }${product.image}`
              : "/images/default.jpg";

            console.log(
              `Rendering product ${product.id} with image URL:`,
              imageUrl
            );

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
                endsAt={product.updatedAt}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
