// components/AnimeCard.tsx
import Image from "next/image";
import Link from "next/link";
import { AnimeItem } from "@/types/anime";

export default function AnimeCard({ anime }: { anime: AnimeItem }) {
  return (
    <Link href={`/anime/${anime.slug}`} className="group block">
      <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-slate-800 shadow-lg">
        {/* Poster Image */}
        <Image
          src={anime.poster}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 20vw"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80" />

        {/* Title */}
        <div className="absolute bottom-0 p-3 w-full">
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-cyan-400">
            {anime.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
