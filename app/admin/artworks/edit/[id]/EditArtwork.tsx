"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";

interface ArtworkForm {
  title: string;
  artist: string;
  description: string;
  price: number;
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
  status: "available" | "sold" | "reserved";
  image_url: string | null;
}

export default function EditArtwork({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<ArtworkForm>({
    title: "",
    artist: "",
    description: "",
    price: 0,
    category: "other",
    status: "available",
    image_url: null,
  });

  useEffect(() => {
    if (params.id) {
      fetchArtwork();
    }
  }, [params.id]);

  async function fetchArtwork() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData(data);
        setImagePreview(data.image_url);
      }
    } catch (error) {
      console.error("Error fetching artwork:", error);
      alert("Error fetching artwork details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = formData.image_url;

      if (imageFile) {
        if (formData.image_url) {
          const oldPath = formData.image_url.split("/").pop();
          if (oldPath) {
            await supabase.storage
              .from("artworks")
              .remove([`artworks/${oldPath}`]);
          }
        }

        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `artworks/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("artworks")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("artworks").getPublicUrl(filePath);

        image_url = publicUrl;
      }

      const { error } = await supabase
        .from("artworks")
        .update({
          ...formData,
          image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) throw error;

      router.push("/admin/artworks");
    } catch (error) {
      console.error("Error updating artwork:", error);
      alert("Error updating artwork. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.title) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Artwork</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="bg-dark-200 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">
            Artwork Image
          </h2>
          <div className="flex items-center space-x-6">
            <div className="w-40 h-40 bg-dark-300 rounded-lg overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-gray-300">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              />
              <p className="mt-2 text-sm text-gray-400">
                Recommended size: 1200x800 pixels
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-dark-200 p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Artist</label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) =>
                  setFormData({ ...formData, artist: e.target.value })
                }
                required
                className="w-full px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ArtworkForm["category"],
                  })
                }
                className="w-full px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
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
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ArtworkForm["status"],
                })
              }
              className="w-full px-4 py-2 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:border-purple-500"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
