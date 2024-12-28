import FeaturedArtworks from "@/components/HomePage/FeaturedArtworks";
import HeroSection from "@/components/HomePage/HeroSection";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HeroSection />
      <FeaturedArtworks />
    </div>
  );
}
