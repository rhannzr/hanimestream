// app/genre/[slug]/page.tsx
import AnimeCard from "@/components/AnimeCard";
import Link from "next/link";
import { getAnimeByGenre } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>; // Untuk menangkap ?page=1
};

export default async function GenreDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  // Default halaman 1 jika tidak ada parameter page
  const currentPage = Number(page) || 1;

  // Fetch API
  const response = await getAnimeByGenre(slug, currentPage);
  const animeList = response.data?.animeList || [];
  const genreTitle = response.data?.genreTitle || slug; // Judul genre (opsional fallback ke slug)

  // Cek apakah ada data
  const hasData = Array.isArray(animeList) && animeList.length > 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white capitalize">
            Genre:{" "}
            <span className="text-cyan-400">
              {genreTitle.replace(/-/g, " ")}
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Halaman {currentPage}</p>
        </div>

        {/* Tombol Balik ke Daftar Genre */}
        <Link
          href="/genre"
          className="text-sm text-slate-400 hover:text-white border border-slate-700 px-4 py-2 rounded-full transition-colors"
        >
          ← Semua Genre
        </Link>
      </div>

      {/* Grid Anime */}
      {!hasData ? (
        <div className="text-center py-20 text-slate-500">
          <p>Belum ada anime di halaman ini.</p>
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
                slug: anime.animeId, // Mapping ID karena struktur beda tipis
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination Simple (Next/Prev) */}
      <div className="flex justify-center gap-4 mt-12">
        {currentPage > 1 && (
          <Link
            href={`/genre/${slug}?page=${currentPage - 1}`}
            className="px-6 py-2 bg-slate-800 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            ← Sebelumnya
          </Link>
        )}

        {/* Kita asumsikan kalau ada data, berarti mungkin masih ada halaman berikutnya */}
        {hasData && (
          <Link
            href={`/genre/${slug}?page=${currentPage + 1}`}
            className="px-6 py-2 bg-slate-800 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Selanjutnya →
          </Link>
        )}
      </div>
    </div>
  );
}
