// app/genre/page.tsx
import Link from "next/link";
import { getAllGenres } from "@/lib/api";

export default async function GenreListPage() {
  const response = await getAllGenres();
  const genres = response.data?.genreList || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white">Daftar Genre</h1>
        <p className="text-slate-400 mt-2">
          Pilih genre favoritmu dari daftar di bawah ini.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {genres.map((genre: any, index: number) => (
          <Link
            key={index}
            href={`/genre/${genre.genreId}`} // Link ke halaman detail genre
            className="block bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white p-4 rounded-lg text-center font-medium transition-colors border border-slate-700 hover:border-cyan-500"
          >
            {genre.title}
          </Link>
        ))}
      </div>

      {/* --- FLOATING MASCOT (Wajib Ada) --- */}
      <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
        <img
          src="/nempel.png"
          alt="Mascot HanimeStream"
          // PERUBAHAN DISINI:
          // 1. 'h-24' (96px) di mobile: Cukup kecil biar gak ganggu, tapi tetep kelihatan "ngintip".
          // 2. 'md:h-[40vh]': Di desktop balik lagi jadi gede biar puas lihat waifu-nya.
          className="h-24 md:h-[40vh] w-auto object-contain object-bottom opacity-100 transition-all hover:scale-105"
        />
      </div>
    </div>
  );
}
