"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  status: "available" | "sold" | "reserved";
  category:
    | "abstract"
    | "landscape"
    | "portrait"
    | "modern"
    | "digital painting"
    | "3D art"
    | "illustration"
    | "pixel art"
    | "photography"
    | "concept art"
    | "animation"
    | "mixed media"
    | "other";
  image_url: string | null;
  created_at: string;
}

export default function Gallery() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    fetchArtworks();
  }, [selectedCategory]);

  async function fetchArtworks() {
    try {
      setLoading(true);
      let query = supabase
        .from("artworks")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArtworks(data || []);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    "all",
    "abstract",
    "landscape",
    "portrait",
    "modern",
    "digital painting",
    "3D art",
    "illustration",
    "pixel art",
    "photography",
    "concept art",
    "animation",
    "mixed media",
    "other",
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gallery
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Explore our curated collection of digital masterpieces
          </p>
        </div>
      </section>

      {/* Category Filter - Mobile */}
      <div className="md:hidden px-4 py-4 sticky top-0 bg-black z-10">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="w-full px-4 py-2 bg-dark-200 text-white rounded-lg flex justify-between items-center"
        >
          <span>
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${
              showCategories ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {showCategories && (
          <div className="absolute left-0 right-0 mt-2 px-4 py-2 bg-dark-200 rounded-lg shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowCategories(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  selectedCategory === category
                    ? "text-purple-500"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter - Desktop */}
      <div className="hidden md:block sticky top-0 bg-black/80 backdrop-blur-sm border-b border-white/10 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-white border-none focus:outline-none focus:ring-0 text-sm cursor-pointer"
              >
                <option value="all" className="bg-dark-200">
                  All Categories
                </option>
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-dark-200"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                {artworks.length}{" "}
                {artworks.length === 1 ? "artwork" : "artworks"} found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Artworks Grid */}
      <section className="px-4 pb-12 pt-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-white/50">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/artwork/${artwork.id}`)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-90 transition-opacity" />
                    <img
                      src={artwork.image_url || "/placeholder.jpg"}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-xl text-white font-medium mb-2">
                        {artwork.title}
                      </h3>
                      <p className="text-gray-200 text-sm mb-2">
                        by {artwork.artist}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">
                          ${artwork.price.toLocaleString()}
                        </span>
                        <span className="text-white text-sm">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
