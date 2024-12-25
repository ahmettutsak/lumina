"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  status: "available" | "sold" | "reserved";
  category: "abstract" | "landscape" | "portrait" | "modern" | "other";
  image_url: string | null;
  created_at: string;
}

const categories = [
  "all", // Filtreleme için
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

export default function ArtworksPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchArtworks();
  }, [searchQuery, categoryFilter, statusFilter]);

  async function fetchArtworks() {
    try {
      setLoading(true);
      let query = supabase
        .from("artworks")
        .select("*")
        .order("created_at", { ascending: false });

      // Arama filtresi
      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%`
        );
      }

      // Kategori filtresi
      if (categoryFilter) {
        query = query.eq("category", categoryFilter);
      }

      // Durum filtresi
      if (statusFilter) {
        query = query.eq("status", statusFilter);
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

  async function handleDelete(id: string) {
    if (window.confirm("Are you sure you want to delete this artwork?")) {
      try {
        // Önce artwork bilgilerini al
        const { data: artwork, error: fetchError } = await supabase
          .from("artworks")
          .select("image_url")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        // Eğer resim varsa, storage'dan sil
        if (artwork?.image_url) {
          const path = artwork.image_url.split("/").pop(); // URL'den dosya adını al
          if (path) {
            const { error: storageError } = await supabase.storage
              .from("artworks")
              .remove([`artworks/${path}`]);

            if (storageError) throw storageError;
          }
        }

        // Veritabanından artwork'ü sil
        const { error: deleteError } = await supabase
          .from("artworks")
          .delete()
          .eq("id", id);

        if (deleteError) throw deleteError;

        // Listeyi güncelle
        setArtworks((prev) => prev.filter((artwork) => artwork.id !== id));
      } catch (error) {
        console.error("Error deleting artwork:", error);
        alert("Error deleting artwork. Please try again.");
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Artworks</h1>
        <button
          onClick={() => router.push("/admin/artworks/new")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Artwork
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-200 p-4 rounded-xl mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
          >
            <option value="">All Categories</option>
            <option value="abstract">Abstract</option>
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
            <option value="modern">Modern</option>
            <option value="digital painting">Digital Painting</option>
            <option value="3D art">3D Art</option>
            <option value="illustration">Illustration</option>
            <option value="pixel art">Pixel Art</option>
            <option value="photography">Photography</option>
            <option value="concept art">Concept Art</option>
            <option value="animation">Animation</option>
            <option value="mixed media">Mixed Media</option>
            <option value="other">Other</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-dark-300">
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Image
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Title
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Artist
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Price
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Category
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Status
              </th>
              <th className="px-6 py-4 text-left text-gray-300 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-300">
            {artworks.map((artwork) => (
              <tr
                key={artwork.id}
                className="hover:bg-dark-300/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <img
                    src={artwork.image_url || "/placeholder-image.jpg"}
                    alt={artwork.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="px-6 py-4 text-white">{artwork.title}</td>
                <td className="px-6 py-4 text-gray-300">{artwork.artist}</td>
                <td className="px-6 py-4 text-gray-300">
                  ${artwork.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm bg-purple-500/10 text-purple-500">
                    {artwork.category.charAt(0).toUpperCase() +
                      artwork.category.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      artwork.status === "available"
                        ? "bg-green-500/10 text-green-500"
                        : artwork.status === "sold"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {artwork.status.charAt(0).toUpperCase() +
                      artwork.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/artworks/edit/${artwork.id}`)
                      }
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
