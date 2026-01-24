// app/completed/page.tsx
import AnimeCard from "@/components/AnimeCard";
import Link from "next/link";
import { getCompletedAnime } from "@/lib/api";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function CompletedPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  // Fetch API
  const response = await getCompletedAnime(currentPage);
  const animeList = response.data?.animeList || [];
  const hasData = Array.isArray(animeList) && animeList.length > 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen relative pb-20">
      {/* Header */}
      <div className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white">
          Daftar Anime <span className="text-cyan-400">Tamat</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Maraton anime sampai puas tanpa nunggu episode minggu depan.
        </p>
      </div>

      {/* Grid Anime */}
      {!hasData ? (
        <div className="text-center py-20 text-slate-500">
          <p>Data tidak ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animeList.map((anime: any) => (
            <AnimeCard
              key={anime.animeId}
              anime={{
                title: anime.title,
                poster: anime.poster,
                url: anime.href,
                slug: anime.animeId,
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination (Simple Next/Prev) */}
      <div className="flex justify-center gap-4 mt-12">
        {currentPage > 1 && (
          <Link
            href={`/completed?page=${currentPage - 1}`}
            className="px-6 py-2 bg-slate-800 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            ← Sebelumnya
          </Link>
        )}

        {hasData && (
          <Link
            href={`/completed?page=${currentPage + 1}`}
            className="px-6 py-2 bg-slate-800 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Selanjutnya →
          </Link>
        )}
      </div>

      <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
        <img
          src="/nempel.png"
          alt="Mascot HanimeStream"
          className="h-24 md:h-[40vh] w-auto object-contain object-bottom opacity-100 transition-all hover:scale-105"
        />
      </div>
    </div>
  );
}
