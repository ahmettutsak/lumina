"use client";

import { useEffect, useState } from "react";
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
  status: string;
  created_at: string;
}

export default function AdminArtworks() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
      return;
    }
    fetchArtworks();
  }, [user]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const { data: artworksData, error } = await supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false });

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

  const handleStatusChange = async (artworkId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("artworks")
        .update({ status: newStatus })
        .eq("id", artworkId);

      if (error) throw error;
      fetchArtworks();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating artwork status:", error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-light text-white tracking-wider">
            ARTWORKS
          </h1>
          <button
            onClick={() => router.push("/admin/artworks/new")}
            className="px-6 py-3 bg-white/10 text-white rounded-xl font-light tracking-wider hover:bg-white/20 transition-all duration-300 border border-white/5"
          >
            Add New Artwork
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 group hover:bg-white/10 transition-all duration-300"
            >
              <div className="aspect-square relative">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-light text-white tracking-wider">
                    {artwork.title}
                  </h3>
                  <span className="text-gray-400 text-sm font-light">
                    ${artwork.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-light">
                    {artwork.category}
                  </span>
                  <div className="flex items-center space-x-4">
                    <select
                      value={artwork.status}
                      onChange={(e) =>
                        handleStatusChange(artwork.id, e.target.value)
                      }
                      className="bg-white/5 text-white px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/20 text-sm"
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="hidden">Hidden</option>
                    </select>
                    <button
                      onClick={() =>
                        router.push(`/admin/artworks/edit/${artwork.id}`)
                      }
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
