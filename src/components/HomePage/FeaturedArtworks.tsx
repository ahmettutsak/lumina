"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { ArtworkType } from "../../../types/type";
import Image from "next/image";
import Artwork from "../Artwork";

export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState<ArtworkType[]>([]);

  async function fetchData() {
    let { data: artworks, error } = await supabase
      .from("artworks")
      .select("*")
      .range(0, 5);
    if (error) throw error;
    if (artworks && artworks.length > 0) {
      setArtworks(artworks);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  console.log(artworks);
  return (
    <section className="w-full h-full flex items-center justify-center flex-col mt-12 flex-shrink-0 overflow-x-auto gap-12">
      <h1 className="text-white text-3xl font-light">Featured Artworks</h1>
      <div className="w-full h-full flex items-start justify-center gap-12 overflow-x-auto overflow-y-hidden">
        {artworks.map((artwork) => (
          <Artwork artwork={artwork} key={artwork.id} />
        ))}
      </div>
    </section>
  );
}
