"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import { useAuthStore } from "../../../../store/authStore";

interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  artist_name: string;
  status: string;
}

interface Props {
  id: string;
}

export default function EditArtworkForm({ id }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
      return;
    }
    fetchArtwork();
  }, [user]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!artwork) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("artworks")
        .update(artwork)
        .eq("id", id);

      if (error) throw error;
      router.push("/admin/artworks");
    } catch (error) {
      console.error("Error updating artwork:", error);
      setError("Failed to update artwork");
    } finally {
      setSaving(false);
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
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-white mb-8 tracking-wider">
          Edit Artwork
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Title</label>
            <input
              type="text"
              value={artwork.title}
              onChange={(e) =>
                setArtwork({ ...artwork, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Description</label>
            <textarea
              value={artwork.description}
              onChange={(e) =>
                setArtwork({ ...artwork, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20 h-32"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Price</label>
            <input
              type="number"
              value={artwork.price}
              onChange={(e) =>
                setArtwork({ ...artwork, price: Number(e.target.value) })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Category</label>
            <select
              value={artwork.category}
              onChange={(e) =>
                setArtwork({ ...artwork, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
              required
            >
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
          </div>

          <div>
            <label className="block text-white mb-2">Status</label>
            <select
              value={artwork.status}
              onChange={(e) =>
                setArtwork({ ...artwork, status: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
              required
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/artworks")}
              className="px-6 py-2 text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
