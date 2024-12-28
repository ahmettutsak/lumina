import FeaturedArtworks from "@/components/HomePage/FeaturedArtworks";
import HeroSection from "@/components/HomePage/HeroSection";

export default function Home() {
  return (
    <div className="w-full h-full">
      <HeroSection />
      <FeaturedArtworks />
      <div className="w-full h-[700px] flex flex-col items-center justify-center gap-12  border-t-2 border-gray-800">
        <h1 className="text-gray-400 text-3xl font-light">
          Begin Your Digital Art Journey
        </h1>
        <h2 className="text-2xl font-bold">Explore Gallery →</h2>
      </div>
    </div>
  );
}
