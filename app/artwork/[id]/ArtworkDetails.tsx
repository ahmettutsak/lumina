"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import Image from "next/image";

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  artist_name: string;
  created_at: string;
}

interface Props {
  id: string;
}

export default function ArtworkDetails({ id }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
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
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Checkout sayfasına yönlendir
    router.push(`/checkout/${artwork?.id}`);
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
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Artwork Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden">
            <Image
              src={artwork.image_url}
              alt={artwork.title}
              width={800}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white">{artwork.title}</h1>
            <p className="text-xl text-gray-400">by {artwork.artist_name}</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Price</span>
                <span className="text-2xl font-bold text-white">
                  ${artwork.price.toLocaleString()}
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
              onClick={handlePurchase}
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
