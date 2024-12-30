"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Image from "next/image";

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  image_url: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedArtworks();
  }, []);

  async function fetchFeaturedArtworks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedArtworks(data || []);
    } catch (error) {
      console.error("Error fetching featured artworks:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full mix-blend-overlay filter blur-xl animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-700" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-8xl font-bold text-white mb-8 tracking-wider font-serif">
            LUMINA
          </h1>
          <p className="text-lg text-gray-300 mb-12 tracking-wide max-w-xl mx-auto font-light">
            Where Digital Art Transcends Reality
          </p>
          <button
            onClick={() => router.push("/gallery")}
            className="group relative px-12 py-4 overflow-hidden rounded-full transition-all duration-300"
          >
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out group-hover:w-full" />
            <span className="relative text-white text-lg font-light tracking-wider">
              Enter Gallery
            </span>
          </button>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl text-white mb-16 text-center font-light tracking-widest">
            Featured Collections
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="text-white/50">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {featuredArtworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="group relative cursor-pointer"
                  onClick={() => router.push(`/artwork/${artwork.id}`)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/50 opacity-0 group-hover:opacity-90 transition-all duration-300" />
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      width={800}
                      height={1000}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="transform translate-y-8 group-hover:translate-y-0 transition-all duration-300 bg-black/50 backdrop-blur-sm p-4 rounded-lg">
                        <h3 className="text-2xl text-white font-medium mb-3 drop-shadow-lg">
                          {artwork.title}
                        </h3>
                        <p className="text-white text-sm mb-4 drop-shadow-lg">
                          by {artwork.artist}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-white text-lg font-medium drop-shadow-lg">
                            ${artwork.price}
                          </span>
                          <span className="text-white bg-purple-500/80 px-4 py-2 rounded-full text-sm font-medium">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Minimal Call to Action */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-white/80 font-light tracking-wide mb-8">
            Begin Your Digital Art Journey
          </p>
          <button
            onClick={() => router.push("/gallery")}
            className="text-white/90 text-lg hover:text-purple-400 transition-colors duration-300"
          >
            Explore Gallery →
          </button>
        </div>
      </section>
    </main>
  );
}
