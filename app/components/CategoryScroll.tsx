"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Image from "next/image";

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  artist: string;
  status: string;
}

export default function CategoryScroll() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchArtworks();
  }, [selectedCategory]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("artworks")
        .select("*")
        .eq("status", "available");

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      const { data: artworksData, error } = await query;

      if (error) throw error;
      if (artworksData) {
        setArtworks(artworksData);
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      {/* Kategori Scroll */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-light transition-colors ${
                selectedCategory === category
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Artwork Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-white">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white/5 rounded-xl overflow-hidden group hover:bg-white/10 transition-colors"
            >
              <div className="aspect-square relative">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  width={400}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      {artwork.title}
                    </h3>
                    <p className="text-gray-300 text-sm">${artwork.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
