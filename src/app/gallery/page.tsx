"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArtworkType } from "../../../types/type";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import Artwork from "@/components/Artwork";

export default function Gallery() {
  const [artworks, setArtworks] = useState<ArtworkType[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<ArtworkType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  async function fetchData() {
    let { data: artworks, error } = await supabase.from("artworks").select("*");
    if (error) throw error;
    if (artworks && artworks.length > 0) {
      setArtworks(artworks);
      setFilteredArtworks(artworks);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredArtworks(artworks);
    } else {
      setFilteredArtworks(
        artworks.filter((artwork) => artwork.category === selectedCategory)
      );
    }
  }, [selectedCategory, artworks]);

  return (
    <div className="mt-24 w-full h-full flex items-center justify-center flex-col">
      <div className="w-full h-full flex items-center justify-center flex-col gap-6">
        <h1 className="text-white text-6xl font-bold">Gallery</h1>
        <p className="text-gray-500 text-xl font-light">
          Explore our curated collection of digital masterpieces
        </p>
      </div>
      <div className="w-full h-full flex justify-between p-12">
        <Dropdown
          categories={[
            "All",
            "Nature",
            "Animals",
            "Abstract",
            "Urban",
            "Portraits",
            "Landscapes",
            "Architecture",
            "Food",
            "Travel",
            "Black & White",
            "Minimalist",
            "Vintage",
            "Fantasy",
            "Space",
            "Underwater",
            "Macro",
            "Street",
            "Wildlife",
            "Industrial",
            "Cultural",
          ]}
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
        <p>{filteredArtworks.length} artworks found</p>
      </div>
      <div className="w-full h-full flex items-start justify-center gap-12">
        {filteredArtworks.map((artwork) => (
          <Link
            href={`/artwork/${artwork.id}`}
            key={artwork.id}
            className="cursor-pointer"
          >
            <div>
              <Artwork artwork={artwork} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const Dropdown = ({
  categories,
  onSelectCategory,
}: {
  categories: string[];
  onSelectCategory: (category: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
      onSelectCategory(category);
    }
  }, [searchParams, categories, onSelectCategory]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onSelectCategory(category);
    router.push(`?category=${category.toLocaleLowerCase()}`);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm"
      >
        {selectedCategory}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-black border border-gray-600 shadow-lg ring-1 ring-gray-500 ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategorySelect(category)}
                className="block w-full px-4 py-2 text-left text-sm text-white bg-black hover:bg-gray-700 hover:text-white focus:bg-gray-800 focus:text-white"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
