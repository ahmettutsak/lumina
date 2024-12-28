import Image from "next/image";
import type { ArtworkType } from "../../types/type";

export default function Artwork({ artwork }: { artwork: ArtworkType }) {
  return (
    <div
      key={artwork.id}
      className="w-96 h-[680px] hover:scale-105 transition-transform duration-500 ease-in-out"
    >
      <Image
        width={400}
        height={400}
        className="w-full h-[500px] object-cover rounded-lg"
        src={artwork.image_url}
        alt={artwork.title}
      />
      <div className="mt-4 flex flex-col gap-2">
        <h2 className="text-white text-2xl font-bold">{artwork.title}</h2>
        <p className="text-gray-500 text-sm">{artwork.artist}</p>
        <div className="flex flex-row justify-between">
          <p className="text-white text-2xl font-bold">${artwork.price}</p>
          <button className="text-white text-sm">View Details</button>
        </div>
      </div>
    </div>
  );
}
