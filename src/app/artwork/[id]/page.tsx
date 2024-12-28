"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "../../../../lib/supabase";
import { ArtworkType } from "../../../../types/type";

export default function ArtworkDetail() {
  const params = useParams();
  const { id } = params;
  const [artwork, setArtwork] = useState<ArtworkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArtwork();
  }, []);

  const fetchArtwork = async () => {
    try {
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setArtwork(data);
    } catch (error) {
      console.error("Error fetching artwork:", error);
      setError("Unable to fetch artwork. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Artwork not found</div>
      </div>
    );
  }

  return (
    <main className=" py-16 px-4 xl:mt-48 mt-0">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Artwork Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image
              src={artwork.image_url}
              alt={artwork.title}
              layout="fill"
              objectFit="contain"
              className="hover:scale-105 transition-transform duration-200 ease-in-out"
            />
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white">{artwork.title}</h1>
            <p className="text-xl text-gray-400">
              by {artwork.artist || "Unknown"}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Price</span>
                <span className="text-2xl font-bold text-white">
                  ${artwork.price?.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Category</span>
                <span className="text-white capitalize">
                  {artwork.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white">
                  {new Date(artwork.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-gray-300 leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              disabled={purchasing}
              className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {purchasing ? "Processing..." : "Purchase Artwork"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
