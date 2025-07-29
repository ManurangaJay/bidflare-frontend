"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../../../../../lib/api";
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
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["SELLER"]}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-orange-700 mb-6">
          Create a New Listing
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-xl"
        >
          {/* Left column - Product Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-orange-700 mb-2">
                🛍️ Product Details
              </h2>
              <label className="block font-medium text-sm mb-1">Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-sm mb-1">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-medium text-sm mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
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
              <label className="block font-medium text-sm mb-1">Tags</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                placeholder="e.g., electronics, gadgets"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium text-sm mb-1">
                Starting Price ($)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
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
              <h2 className="text-xl font-semibold text-orange-700 mb-2">
                ⏰ Auction Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-sm mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-sm mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-orange-700 mb-2">
                📷 Media Upload
              </h2>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="qaToggle"
                className="mr-2"
                checked={qaEnabled}
                onChange={(e) => setQaEnabled(e.target.checked)}
              />
              <label htmlFor="qaToggle" className="text-gray-700">
                Enable Q&A Section (optional)
              </label>
            </div>

            {error && <p className="text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-3 rounded-xl shadow hover:bg-orange-700 transition w-full"
              disabled={loading}
            >
              {loading ? "Creating Listing..." : "Submit Listing"}
            </button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
};

export default CreateListing;
