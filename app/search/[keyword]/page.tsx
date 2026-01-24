// app/search/[keyword]/page.tsx
import AnimeCard from "@/components/AnimeCard";
import Link from "next/link";
import { searchAnime, getOngoingAnime } from "@/lib/api";

type Props = {
  params: Promise<{ keyword: string }>;
};

export default async function SearchPage({ params }: Props) {
  const { keyword } = await params;
  const decodedKeyword = decodeURIComponent(keyword);

  // --- INISIALISASI VARIABEL ---
  let searchResults = [];
  let recommendations = [];

  // --- FETCHING DATA (SAFE MODE) ---
  try {
    // Kita jalankan request parallel dengan pengaman (.catch) di masing-masing request
    // Jadi kalau 'searchAnime' error, 'getOngoingAnime' TETAP JALAN.
    const [searchRes, ongoingRes] = await Promise.all([
      searchAnime(decodedKeyword).catch(() => null), // Jika error, return null
      getOngoingAnime(1).catch(() => null), // Jika error, return null
    ]);

    // Cek apakah hasil search ada datanya
    if (searchRes?.data?.animeList) {
      searchResults = searchRes.data.animeList;
    }

    // Cek apakah rekomendasi ada datanya
    if (ongoingRes?.data?.animeList) {
      recommendations = ongoingRes.data.animeList;
    }
  } catch (error) {
    console.error("Terjadi kesalahan fatal di halaman search:", error);
    // Halaman tidak akan crash, tapi variabel tetap kosong []
  }

  // Logic untuk UI
  const hasResults = Array.isArray(searchResults) && searchResults.length > 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen space-y-12 pt-24">
      {/* Note: Saya tambah 'pt-24' biar gak ketutupan navbar fixed */}

      {/* --- BAGIAN 1: HASIL PENCARIAN --- */}
      <div>
        <div className="mb-6 border-b border-slate-800 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Hasil Pencarian:{" "}
            <span className="text-cyan-400">"{decodedKeyword}"</span>
          </h1>
          <p className="text-slate-400">
            {hasResults
              ? `Ditemukan ${searchResults.length} anime.`
              : "Tidak ditemukan, coba cek rekomendasi di bawah."}
          </p>
        </div>

        {!hasResults ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
            <p className="text-4xl mb-4">😕</p>
            <p className="text-lg font-semibold mb-1">Anime tidak ditemukan</p>
            <p className="text-sm">
              Mungkin salah ketik atau anime tersebut belum tersedia di
              database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map((anime: any) => (
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
      </div>

      {/* --- BAGIAN 2: REKOMENDASI (ONGOING) --- */}
      {/* Kita kasih kondisi: kalau rekomendasi kosong (misal API error), section ini sembunyi */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🔥 Sedang Hangat{" "}
              <span className="text-slate-500 font-normal text-sm">
                (Ongoing)
              </span>
            </h2>
            <Link
              href="/jadwal"
              className="text-xs text-cyan-400 hover:underline"
            >
              Lihat Jadwal →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendations.slice(0, 12).map((anime: any) => (
              <AnimeCard
                key={anime.animeId}
                anime={{
                  title: anime.title,
                  poster: anime.poster,
                  url: anime.href,
                  slug: anime.animeId, // Mapping ID
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
