"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "../../../../../lib/authFetch";
import RoleGuard from "@/components/RoleGuard";

type Category = {
  id: string;
  name: string;
};

const CreateListing = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [startingPrice, setStartingPrice] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [qaEnabled, setQaEnabled] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authFetch("/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const productRes = await authFetch("/products", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          startingPrice: parseFloat(startingPrice),
          categoryId,
        }),
      });

      if (!productRes.ok) throw new Error("Failed to create product");
      const product = await productRes.json();

      for (const file of mediaFiles) {
        const formData = new FormData();
        formData.append("imageFile", file);
        formData.append("productId", product.id);

        const uploadRes = await authFetch("/product-images", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Media upload failed");
      }

      const auctionRes = await authFetch("/auctions", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          startTime,
          endTime,
        }),
      });

      if (!auctionRes.ok) throw new Error("Auction creation failed");

      router.push("/seller/my-products");
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

  return (
    <RoleGuard allowedRoles={["SELLER"]}>
      <div className="min-h-screen bg-gradient-to-br from-orange-secondary/20 to-orange-primary/10 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-card-foreground mb-6 text-center">
            Create a New{" "}
            <span className="text-orange-500 bg-orange-secondary/30 px-2 py-1 rounded-lg text-5xl font-bold">
              Listing
            </span>
          </h1>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card/90 backdrop-blur-sm p-8 rounded-3xl "
          >
            {/* Left column - Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-orange-500 mb-4 bg-orange-secondary/20 px-4 py-2 rounded-lg">
                  🛍️ Product Details
                </h2>
                <label className="block font-medium text-sm mb-2 text-foreground">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: "var(--muted)" }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-sm mb-2 text-foreground">
                  Description
                </label>
                <textarea
                  className="w-full backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: "var(--muted)" }}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-sm mb-2 text-foreground">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: "var(--muted)" }}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-sm mb-2 text-foreground">
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: "var(--muted)" }}
                  placeholder="e.g., electronics, gadgets"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium text-sm mb-2 text-foreground">
                  Starting Price ($)
                </label>
                <input
                  type="number"
                  className="w-full backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: "var(--muted)" }}
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Right column - Auction, Media, Settings */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-orange-500 mb-4 bg-orange-secondary/20 px-4 py-2 rounded-lg">
                  ⏰ Auction Settings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-sm mb-2 text-foreground">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-lg"
                      style={{ backgroundColor: "var(--muted)" }}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-sm mb-2 text-foreground">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-lg"
                      style={{ backgroundColor: "var(--muted)" }}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-orange-500 mb-4 bg-orange-secondary/20 px-4 py-2 rounded-lg">
                  📷 Media Upload
                </h2>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="w-full backdrop-blur-sm rounded-2xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-background/80 outline-none text-foreground transition-all duration-300 shadow-lg"
                  style={{ backgroundColor: "var(--muted)" }}
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex items-center bg-orange-secondary/10 p-4 rounded-2xl">
                <input
                  type="checkbox"
                  id="qaToggle"
                  className="mr-3 w-5 h-5 text-orange-500 focus:ring-orange-500 rounded"
                  style={{ backgroundColor: "var(--muted)" }}
                  checked={qaEnabled}
                  onChange={(e) => setQaEnabled(e.target.checked)}
                />
                <label
                  htmlFor="qaToggle"
                  className="text-foreground font-medium"
                >
                  Enable Q&A Section (optional)
                </label>
              </div>

              {error && (
                <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg font-medium">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 dark:from-orange-400 dark:to-orange-700 text-white py-3 rounded-2xl hover:scale-y-105 shadow-lg hover:shadow-xl font-semibold"
                style={{ transition: "all 0.3s ease-in-out" }}
                disabled={loading}
              >
                {loading ? "Creating Listing..." : "Submit Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
};

export default CreateListing;
